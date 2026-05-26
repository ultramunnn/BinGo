from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import tensorflow as tf
import numpy as np
import pickle
import uvicorn
import os
import io
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv
import gradio as gr

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "DUMMY_KEY"))

# Initialize FastAPI App
app = FastAPI(
    title="BinGo ML API - Hybrid Decision System",
    description="Unified API combining Computer Vision (CV) and Tabular ML for precise waste sorting.",
    version="2.1.0"
)

# Enable CORS Middleware for Frontend integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for models
model = None  # Tabular model
cv_model = None  # CV model
encoders = None  # Label encoders

# Input column list for the Tabular Model
cols_input = ['category', 'Hardness', 'is_multilayer', 'is_dry', 'is_clean', 
              'is_container', 'is_fragment', 'is_hazardous', 'is_foam', 'is_small_item']

# Class names for the CV model
class_names = ["glass", "metal", "paper", "plastic", "textile"]

# ==========================================
# 1. CUSTOM LAYERS & FUNCTIONS FOR MODELS
# ==========================================

@tf.keras.utils.register_keras_serializable(package="Custom", name="custom_loss")
def custom_loss(y_true, y_pred):
    y_pred = tf.clip_by_value(y_pred, tf.keras.backend.epsilon(), 1.0 - tf.keras.backend.epsilon())
    loss = -tf.reduce_sum(y_true * tf.math.log(y_pred), axis=-1)
    return tf.reduce_mean(loss)

@tf.keras.utils.register_keras_serializable(package="Custom", name="CustomNormalization")
class CustomNormalization(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(CustomNormalization, self).__init__(**kwargs)

    def call(self, inputs):
        return inputs / tf.constant(1.0, dtype=tf.float32)

    def get_config(self):
        config = super(CustomNormalization, self).get_config()
        return config

@tf.keras.utils.register_keras_serializable(package="Custom", name="BingoHybridModel")
class BingoHybridModel(tf.keras.Model):
    def train_step(self, data):
        x, y = data
        with tf.GradientTape() as tape:
            y_pred = self(x, training=True)
            loss = self.compiled_loss(y, y_pred, regularization_losses=self.losses)
            
        gradients = tape.gradient(loss, self.trainable_variables)
        self.optimizer.apply_gradients(zip(gradients, self.trainable_variables))
        self.compute_metrics(x, y, y_pred, sample_weight=None)
        return {m.name: m.result() for m in self.metrics}

    def test_step(self, data):
        x, y = data
        y_pred = self(x, training=False)
        loss = self.compiled_loss(y, y_pred, regularization_losses=self.losses)
        self.compute_metrics(x, y, y_pred, sample_weight=None)
        return {m.name: m.result() for m in self.metrics}

# ==========================================
# 2. SCHEMAS FOR API INPUTS & OUTPUTS
# ==========================================

class PredictionRequest(BaseModel):
    category: str = Field(..., description="Hasil deteksi Computer Vision (Plastic, Paper, Glass, Metal, Textile)")
    Hardness: str = Field(default="Unknown", description="'Hard', 'Flexible', atau 'Unknown'")
    is_multilayer: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    is_dry: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    is_clean: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    is_container: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    is_fragment: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    is_hazardous: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    is_foam: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    is_small_item: str = Field(default="Unknown", description="'Yes', 'No', atau 'Unknown'")
    generate_tips: bool = Field(default=False, description="Set True untuk mendapatkan tips daur ulang dari Generative AI")

class ConfidenceResponse(BaseModel):
    recyclable: float
    treatment: float

class PredictionResponse(BaseModel):
    category: str
    recyclable: str
    treatment: str
    confidence: ConfidenceResponse
    ai_recommendation: str = Field(None, description="Rekomendasi dari Generative AI (Gemini) jika diminta")

class HybridPredictionResponse(BaseModel):
    predicted_material: str
    cv_confidence: float
    recyclable: str
    treatment_method: str
    ml_confidence: ConfidenceResponse
    ai_recommendation: str

# ==========================================
# 3. BACKEND STARTUP - LOAD BOTH MODELS
# ==========================================

@app.on_event("startup")
async def load_model_and_encoders():
    global model, cv_model, encoders
    
    # 1. Load Tabular Decision Model
    model_path = r'bingo_model.keras'
    encoders_path = r'label_encoders.pkl'
    
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(
            model_path,
            custom_objects={
                "BingoHybridModel": BingoHybridModel,
                "Custom>BingoHybridModel": BingoHybridModel
            }
        )
        print("[Startup] Tabular Model loaded successfully.")
    else:
        print(f"[Startup] ERROR: Tabular Model not found at {model_path}")
        
    if os.path.exists(encoders_path):
        with open(encoders_path, 'rb') as f:
            encoders = pickle.load(f)
        print("[Startup] Label Encoders loaded successfully.")
    else:
        print(f"[Startup] ERROR: Encoders not found at {encoders_path}")
        
    cv_paths = [
        'waste_classifier.keras',
        'waste_classifier_final.h5',
        '../cv/waste_classifier_final.h5',
        '../cv/model/waste_classifier.h5'
    ]
    for path in cv_paths:
        if os.path.exists(path):
            try:
                cv_model = tf.keras.models.load_model(
                    path,
                    custom_objects={
                        "custom_loss": custom_loss,
                        "CustomNormalization": CustomNormalization,
                        "Custom>custom_loss": custom_loss,
                        "Custom>CustomNormalization": CustomNormalization
                    }
                )
                print(f"[Startup] CV Model successfully loaded from: {path}")
                break
            except Exception as e:
                print(f"[Startup] Warning: Failed to load CV model from {path}. Error: {e}")
    
    if cv_model is None:
        print("[Startup] ERROR: CV Model could not be loaded from any expected path.")

# ==========================================
# 4. INFERENCE ENGINE (CORE FUNCTIONS)
# ==========================================

def run_cv_prediction(pil_image: Image.Image):
    """Resizes and normalizes the uploaded image to run CV prediction."""
    if cv_model is None:
        return "Unknown", 0.0
    
    try:
        # Preprocess PIL image
        img = pil_image.convert("RGB").resize((224, 224))
        img_array = np.array(img, dtype=np.float32)
        img_array = img_array / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        predictions = cv_model.predict(img_array, verbose=0)
        predicted_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_idx])
        return class_names[predicted_idx], confidence
    except Exception as e:
        print(f"[Inference Error] CV failed: {e}")
        return "Unknown", 0.0

def run_tabular_prediction(category: str, features_dict: dict):
    """Processes features through label encoders and performs Tabular ML prediction."""
    if model is None or encoders is None:
        raise ValueError("Model or encoders are not loaded.")
    
    inputs = []
    
    for col in cols_input:
        if col == 'category':
            val = category
        else:
            val = features_dict.get(col, 'Unknown')
            
        # Normalize boolean values
        if isinstance(val, bool):
            val = 'Yes' if val else 'No'
        elif str(val).strip().lower() == 'true':
            val = 'Yes'
        elif str(val).strip().lower() == 'false':
            val = 'No'
            
        le = encoders.get(f'le_{col}')
        if not le:
            raise ValueError(f"Label encoder for '{col}' was not found.")
            
        val_lower = str(val).strip().lower()
        classes_lower = [str(c).lower() for c in le.classes_]
        
        if val_lower in classes_lower:
            real_class = le.classes_[classes_lower.index(val_lower)]
            enc = le.transform([real_class])[0]
        elif 'unknown' in classes_lower:
            real_class = le.classes_[classes_lower.index('unknown')]
            enc = le.transform([real_class])[0]
        else:
            enc = 0
            
        inputs.append(np.array([enc]))
        
    pred_rec, pred_met = model.predict(inputs, verbose=0)
    
    recyclable = "Yes" if pred_rec[0][0] > 0.5 else "No"
    treatment = encoders['le_recyclemethod'].classes_[np.argmax(pred_met)]
    
    conf_rec = float(max(pred_rec[0][0], 1 - pred_rec[0][0]))
    conf_met = float(np.max(pred_met))
    
    return recyclable, treatment, conf_rec, conf_met

# ==========================================
# 5. FASTAPI ROUTING (REST ENDPOINTS)
# ==========================================

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """Tabular-only API endpoint for backward compatibility."""
    if model is None or encoders is None:
        raise HTTPException(status_code=500, detail="Tabular Model or Encoders are not ready.")
    
    try:
        req_dict = request.dict()
        recyclable, treatment, conf_rec, conf_met = run_tabular_prediction(request.category, req_dict)
        
        # Generative AI tips
        ai_recommendation = None
        if request.generate_tips:
            prompt = f"Benda terdeteksi sebagai {request.category}. Status bisa didaur ulang: {recyclable}. Metode treatment pabrik: {treatment}. Berikan maksimal 2 kalimat tips singkat dan ramah untuk pengguna awam tentang bagaimana sebaiknya menangani sampah ini di rumah sebelum dibuang."
            try:
                model_genai = genai.GenerativeModel('gemini-1.5-flash')
                response = model_genai.generate_content(prompt)
                ai_recommendation = response.text.strip()
            except Exception:
                ai_recommendation = "[Sistem AI Sedang Sibuk / API Key belum diset] - Pastikan Anda membuangnya di tempat sampah yang tepat."
                
        return PredictionResponse(
            category=request.category,
            recyclable=recyclable,
            treatment=treatment,
            confidence=ConfidenceResponse(
                recyclable=conf_rec,
                treatment=conf_met
            ),
            ai_recommendation=ai_recommendation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.post("/predict_hybrid", response_model=HybridPredictionResponse)
async def predict_hybrid(
    file: UploadFile = File(...),
    Hardness: str = Form("Unknown"),
    is_multilayer: str = Form("Unknown"),
    is_dry: str = Form("Unknown"),
    is_clean: str = Form("Unknown"),
    is_container: str = Form("Unknown"),
    is_fragment: str = Form("Unknown"),
    is_hazardous: str = Form("Unknown"),
    is_foam: str = Form("Unknown"),
    is_small_item: str = Form("Unknown"),
    generate_tips: bool = Form(True)
):
    """Unified endpoint accepting an image file and physical parameters for dual-stage predictions."""
    if cv_model is None or model is None or encoders is None:
        raise HTTPException(status_code=500, detail="Models or Encoders are not fully loaded.")
        
    try:
        # Load and run CV model
        image_bytes = await file.read()
        pil_image = Image.open(io.BytesIO(image_bytes))
        cv_category, cv_confidence = run_cv_prediction(pil_image)
        
        # Format context parameters
        context = {
            "Hardness": Hardness,
            "is_multilayer": is_multilayer,
            "is_dry": is_dry,
            "is_clean": is_clean,
            "is_container": is_container,
            "is_fragment": is_fragment,
            "is_hazardous": is_hazardous,
            "is_foam": is_foam,
            "is_small_item": is_small_item
        }
        
        # Run Tabular ML Model
        recyclable, treatment, conf_rec, conf_met = run_tabular_prediction(cv_category, context)
        
        # Call Gemini for tips
        ai_recommendation = ""
        if generate_tips:
            prompt = f"Benda terdeteksi sebagai {cv_category}. Status bisa didaur ulang: {recyclable}. Metode treatment pabrik: {treatment}. Berikan maksimal 2 kalimat tips singkat dan ramah untuk pengguna awam tentang bagaimana sebaiknya menangani sampah ini di rumah sebelum dibuang."
            try:
                model_genai = genai.GenerativeModel('gemini-1.5-flash')
                response = model_genai.generate_content(prompt)
                ai_recommendation = response.text.strip()
            except Exception:
                ai_recommendation = "[Sistem AI Sedang Sibuk / API Key belum diset] - Pastikan Anda membuangnya di tempat sampah yang tepat."
                
        return HybridPredictionResponse(
            predicted_material=cv_category,
            cv_confidence=cv_confidence,
            recyclable=recyclable,
            treatment_method=treatment,
            ml_confidence=ConfidenceResponse(
                recyclable=conf_rec,
                treatment=conf_met
            ),
            ai_recommendation=ai_recommendation
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hybrid inference failed: {str(e)}")

@app.get("/")
async def root():
    """Redirect root endpoint to the beautiful Gradio Web UI."""
    return RedirectResponse(url="/gradio")

# ==========================================
# 6. PREMIUM GRADIO WEB USER INTERFACE
# ==========================================

def gradio_predict_wrapper(
    image, hardness, is_multilayer, is_dry, is_clean, is_container, is_fragment, is_hazardous, is_foam, is_small_item
):
    """Wrapper function to perform dual-stage hybrid inference for the Gradio interface."""
    if image is None:
        return "Tolong unggah gambar!", "0.0%", "N/A", "N/A", "Silakan unggah gambar sampah terlebih dahulu."
        
    if cv_model is None or model is None or encoders is None:
        return "Model Belum Siap", "0.0%", "N/A", "N/A", "Sistem sedang inisialisasi, mohon tunggu sebentar..."
        
    try:
        # Stage 1: Computer Vision Model
        category, cv_conf = run_cv_prediction(image)
        
        # Format form input values
        features_dict = {
            "Hardness": hardness,
            "is_multilayer": is_multilayer,
            "is_dry": is_dry,
            "is_clean": is_clean,
            "is_container": is_container,
            "is_fragment": is_fragment,
            "is_hazardous": is_hazardous,
            "is_foam": is_foam,
            "is_small_item": is_small_item
        }
        
        # Stage 2: Tabular ML Model
        recyclable, treatment, conf_rec, conf_met = run_tabular_prediction(category, features_dict)
        
        # Stage 3: Generative AI Tips (Gemini)
        prompt = f"Benda terdeteksi sebagai {category}. Status bisa didaur ulang: {recyclable}. Metode treatment pabrik: {treatment}. Berikan maksimal 2 kalimat tips singkat dan ramah untuk pengguna awam tentang bagaimana sebaiknya menangani sampah ini di rumah sebelum dibuang."
        try:
            model_genai = genai.GenerativeModel('gemini-1.5-flash')
            response = model_genai.generate_content(prompt)
            ai_recommendation = response.text.strip()
        except Exception:
            ai_recommendation = "💡 **Tips Daur Ulang**: Bilas sisa kotoran dari sampah Anda, pisahkan label jika ada, dan remas kemasan untuk menghemat ruang tempat pembuangan."
            
        # Format outputs nicely for presentation
        recyclable_badge = "✅ BISA DIDAUR ULANG (Recyclable)" if recyclable == "Yes" else "❌ TIDAK DAPAT DIDAUR ULANG"
        
        return (
            category.upper(),
            f"{cv_conf * 100:.2f}%",
            recyclable_badge,
            f"{treatment.upper()} (ML Conf: {conf_met * 100:.1f}%)",
            ai_recommendation
        )
    except Exception as e:
        return "Error", "0.0%", "N/A", "N/A", f"Terjadi kesalahan saat memproses data: {str(e)}"

# Custom premium styling theme
theme = gr.themes.Soft(
    primary_hue="green",
    secondary_hue="emerald",
    neutral_hue="slate"
).set(
    body_background_fill="*neutral_950",
    block_background_fill="*neutral_900",
    block_border_width="1px",
    block_label_text_color="*neutral_400",
    button_primary_background_fill="linear-gradient(90deg, *primary_600, *secondary_600)",
    button_primary_text_color="white",
    block_title_text_size="*text_lg",
    block_title_text_weight="700"
)

# Build Gradio Block Interface
with gr.Blocks(theme=theme, title="BinGo Hybrid Intelligent Waste Sorter") as demo:
    gr.HTML(
        """
        <div style="text-align: center; margin-bottom: 24px; padding: 10px 0;">
            <h1 style="color: #4ade80; font-size: 32px; font-weight: 800; margin-bottom: 8px;">♻️ BinGo Waste Classification</h1>
            <p style="color: #94a3b8; font-size: 16px; max-width: 700px; margin: 0 auto;">
                Sistem Intelligent Hybrid pertama di pantai untuk klasifikasi sampah. Menggabungkan akurasi <strong>Computer Vision (CV)</strong> dengan <strong>Model Tabular ML Kontekstual</strong> serta <strong>Generative AI (Gemini)</strong> untuk tips daur ulang yang presisi.
            </p>
        </div>
        """
    )
    
    with gr.Row():
        # Left Panel - Input Panel
        with gr.Column(scale=1):
            gr.Markdown("### 📸 1. Input Gambar Sampah")
            input_image = gr.Image(type="pil", label="Unggah atau Ambil Foto Sampah Anda")
            
            # Collapsible Advanced Panel
            with gr.Accordion("⚙️ 2. Informasi Kondisi Fisik Tambahan (Menentukan Hasil ML)", open=True):
                hardness_inp = gr.Radio(choices=["Unknown", "Hard", "Flexible"], value="Unknown", label="Kekerasan Bahan (Hardness)")
                
                with gr.Row():
                    multilayer_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Bahan Berlapis (Multilayer)")
                    dry_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Kondisi Kering (Dry)")
                    
                with gr.Row():
                    clean_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Kondisi Bersih (Clean)")
                    container_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Berupa Wadah/Container")
                    
                with gr.Accordion("Opsi Lanjutan Lainnya (Opsional)", open=False):
                    with gr.Row():
                        fragment_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Serpihan/Pecahan (Fragment)")
                        hazardous_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Berbahaya/Medis/Kimia (Hazardous)")
                    with gr.Row():
                        foam_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Berbusa/Styrofoam (Foam)")
                        small_inp = gr.Radio(choices=["Unknown", "Yes", "No"], value="Unknown", label="Benda Berukuran Kecil (Small)")
            
            btn_predict = gr.Button("♻️ MULAI DETEKSI SEKARANG", variant="primary")
            
        # Right Panel - Output Results
        with gr.Column(scale=1):
            gr.Markdown("### 📊 3. Hasil Analisis Hybrid System")
            
            with gr.Group():
                with gr.Row():
                    out_category = gr.Textbox(label="Kategori Material Dasar (CV)", interactive=False)
                    out_cv_confidence = gr.Textbox(label="Keyakinan Deteksi Gambar (CV)", interactive=False)
                
                out_recyclable = gr.Textbox(label="Kelayakan Daur Ulang (Tabular ML)", interactive=False)
                out_treatment = gr.Textbox(label="Metode Pengolahan Industri (Tabular ML)", interactive=False)
                
            gr.Markdown("### 💡 4. Rekomendasi Penanganan Rumah Tangga (Generative AI)")
            out_tips = gr.Markdown(value="*Rekomendasi dari Gemini AI akan muncul di sini setelah Anda memulai deteksi.*")

    # Set Trigger Action
    btn_predict.click(
        fn=gradio_predict_wrapper,
        inputs=[
            input_image, hardness_inp, multilayer_inp, dry_inp, clean_inp, 
            container_inp, fragment_inp, hazardous_inp, foam_inp, small_inp
        ],
        outputs=[out_category, out_cv_confidence, out_recyclable, out_treatment, out_tips]
    )

# Mount Gradio interface under /gradio of FastAPI
app = gr.mount_gradio_app(app, demo, path="/gradio")

# ==========================================
# 7. SERVER RUNNER
# ==========================================

if __name__ == "__main__":
    # Start on Port 7860 to match Hugging Face Spaces standard
    uvicorn.run("api:app", host="127.0.0.1", port=7860, reload=True)
