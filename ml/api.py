from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import tensorflow as tf
import numpy as np
import pickle
import uvicorn
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load variable dari .env
load_dotenv()

# Konfigurasi Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "DUMMY_KEY"))

app = FastAPI(
    title="BinGo ML API - Hybrid Decision System",
    description="API untuk klasifikasi daur ulang berdasarkan material CV dan fitur kontekstual.",
    version="2.0.0"
)

model = None
encoders = None

cols_input = ['category', 'Hardness', 'is_multilayer', 'is_dry', 'is_clean', 
              'is_container', 'is_fragment', 'is_hazardous', 'is_foam', 'is_small_item']

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

@tf.keras.utils.register_keras_serializable()
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

@app.on_event("startup")
async def load_model_and_encoders():
    global model, encoders
    
    model_path = r'bingo_model.h5'
    encoders_path = r'label_encoders.pkl'
    
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(
            model_path,
            custom_objects={"BingoHybridModel": BingoHybridModel}
        )
        print("Model berhasil diload.")
    else:
        print(f"ERROR: Model tidak ditemukan di {model_path}")
        
    if os.path.exists(encoders_path):
        with open(encoders_path, 'rb') as f:
            encoders = pickle.load(f)
        print("Encoders berhasil diload.")
    else:
        print(f"ERROR: Encoders tidak ditemukan di {encoders_path}")

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    if model is None or encoders is None:
        raise HTTPException(status_code=500, detail="Model atau encoder belum siap.")
    
    try:
        req_dict = request.dict()
        inputs = []
        
        # Transform setiap fitur menggunakan LabelEncoder masing-masing
        for col in cols_input:
            val = req_dict.get(col, 'Unknown')
            
            # Normalisasi tipe data (Frontend mungkin kirim boolean true/false)
            if isinstance(val, bool):
                val = 'Yes' if val else 'No'
            elif str(val).strip().lower() == 'true':
                val = 'Yes'
            elif str(val).strip().lower() == 'false':
                val = 'No'
                
            le = encoders.get(f'le_{col}')
            if not le:
                raise HTTPException(status_code=500, detail=f"Encoder untuk {col} tidak ditemukan.")
            
            # Case-insensitive matching untuk menghindari bug huruf besar/kecil
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
            
        # Prediksi (Model mengembalikan [out_recycle, out_method])
        pred_rec, pred_met = model.predict(inputs, verbose=0)
        
        # Decode output
        recyclable = "Yes" if pred_rec[0][0] > 0.5 else "No"
        treatment = encoders['le_recyclemethod'].classes_[np.argmax(pred_met)]
        
        # Confidence
        conf_rec = float(max(pred_rec[0][0], 1 - pred_rec[0][0]))
        conf_met = float(np.max(pred_met))
        
        # Generative AI RAG / Tips
        ai_recommendation = None
        if request.generate_tips:
            prompt = f"Benda terdeteksi sebagai {request.category}. Status bisa didaur ulang: {recyclable}. Metode treatment pabrik: {treatment}. Berikan maksimal 2 kalimat tips singkat dan ramah untuk pengguna awam tentang bagaimana sebaiknya menangani sampah ini di rumah sebelum dibuang."
            try:
                model_genai = genai.GenerativeModel('gemini-1.5-flash')
                response = model_genai.generate_content(prompt)
                ai_recommendation = response.text.strip()
            except Exception as e:
                ai_recommendation = f"[Sistem AI Sedang Sibuk / API Key belum diset] - Pastikan Anda membuangnya di tempat sampah yang tepat."

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
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat prediksi: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Selamat datang di BinGo ML API - Hybrid Intelligent Decision System."}

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
