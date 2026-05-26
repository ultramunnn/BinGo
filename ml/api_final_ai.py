import os
import io
import httpx
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

# Load Environment Variables
load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", "DUMMY_KEY"))

app = FastAPI(
    title="BinGo AI Orchestrator API",
    description="API Final yang menggabungkan model CV dan Tabular dari Hugging Face Spaces beserta AI Gemini.",
    version="3.0.0"
)

# CORS untuk Backend/Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# URL HUGGING FACE SPACES
# Format standard direct URL HF Space: https://{username}-{spacename}.hf.space
# ==============================================================================
CV_API_URL = "https://lenteraid-cv-model-bingo.hf.space/predict" 
TABULAR_API_URL = "https://lenteraid-bingo-ml-api.hf.space/predict"

# ==========================================
# SCHEMAS FOR API OUTPUT
# ==========================================
class QuestionField(BaseModel):
    field: str
    label: str
    type: str
    options: list[str]

class QuestionnaireResponse(BaseModel):
    category: str
    questions: list[QuestionField]

class ConfidenceResponse(BaseModel):
    recyclable: float
    treatment: float

class HybridPredictionResponse(BaseModel):
    predicted_material: str
    cv_confidence: float
    recyclable: str
    treatment_method: str
    ml_confidence: ConfidenceResponse
    ai_recommendation: str

# ==========================================
# ORCHESTRATOR ENDPOINT
# ==========================================
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
    """
    Endpoint ini akan:
    1. Mengirim file gambar ke Hugging Face CV Model.
    2. Mengirim fitur kondisi + hasil CV ke Hugging Face Tabular Model.
    3. Meminta tips daur ulang dari Gemini AI.
    4. Mengembalikan respons final ke Backend/Frontend.
    """
    try:
        image_bytes = await file.read()
        
        async with httpx.AsyncClient() as client:
            # ---------------------------------------------------------
            # 1. PANGGIL API COMPUTER VISION DI HUGGING FACE
            # ---------------------------------------------------------
            try:
                cv_response = await client.post(
                    CV_API_URL, 
                    files={"file": (file.filename, image_bytes, file.content_type)},
                    timeout=30.0
                )
                if cv_response.status_code != 200:
                    raise HTTPException(status_code=502, detail=f"HF CV Model Error: {cv_response.text}")
                    
                cv_data = cv_response.json()
                # Sesuaikan key dengan response asli dari API CV HF Anda
                category = cv_data.get("category", cv_data.get("predicted_class", "Unknown"))
                cv_confidence = cv_data.get("confidence", 0.0)
                
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Gagal menghubungi CV API: {str(exc)}")

            # ---------------------------------------------------------
            # 2. PANGGIL API TABULAR ML DI HUGGING FACE
            # ---------------------------------------------------------
            tabular_payload = {
                "category": category,
                "Hardness": Hardness,
                "is_multilayer": is_multilayer,
                "is_dry": is_dry,
                "is_clean": is_clean,
                "is_container": is_container,
                "is_fragment": is_fragment,
                "is_hazardous": is_hazardous,
                "is_foam": is_foam,
                "is_small_item": is_small_item,
                "generate_tips": False # Tips kita generate di Orchestrator ini
            }
            
            try:
                tabular_response = await client.post(
                    TABULAR_API_URL,
                    json=tabular_payload,
                    timeout=30.0
                )
                if tabular_response.status_code != 200:
                    raise HTTPException(status_code=502, detail=f"HF Tabular Model Error: {tabular_response.text}")
                    
                tabular_data = tabular_response.json()
                recyclable = tabular_data.get("recyclable", "Unknown")
                treatment = tabular_data.get("treatment", "Unknown")
                conf_data = tabular_data.get("confidence", {})
                conf_rec = conf_data.get("recyclable", 0.0)
                conf_met = conf_data.get("treatment", 0.0)
                
            except httpx.RequestError as exc:
                raise HTTPException(status_code=503, detail=f"Gagal menghubungi Tabular API: {str(exc)}")
            
            # ---------------------------------------------------------
            # 3. GENERATE TIPS MENGGUNAKAN GEMINI AI
            # ---------------------------------------------------------
            ai_recommendation = ""
            if generate_tips:
                prompt = (
                    f"Benda terdeteksi sebagai {category}. Status bisa didaur ulang: {recyclable}. "
                    f"Metode treatment pabrik: {treatment}. Berikan maksimal 2 kalimat tips singkat "
                    f"dan ramah untuk pengguna awam tentang bagaimana sebaiknya menangani sampah ini di rumah sebelum dibuang."
                )
                try:
                    model_genai = genai.GenerativeModel('gemini-1.5-flash')
                    response = model_genai.generate_content(prompt)
                    ai_recommendation = response.text.strip()
                except Exception as e:
                    print(f"Gemini error: {e}")
                    ai_recommendation = "[Sistem AI Sedang Sibuk / API Key belum diset] - Pastikan Anda membuangnya di tempat sampah yang tepat."
                    
            # ---------------------------------------------------------
            # 4. KEMBALIKAN RESPONS FINAL
            # ---------------------------------------------------------
            return HybridPredictionResponse(
                predicted_material=category,
                cv_confidence=cv_confidence,
                recyclable=recyclable,
                treatment_method=treatment,
                ml_confidence=ConfidenceResponse(
                    recyclable=conf_rec,
                    treatment=conf_met
                ),
                ai_recommendation=ai_recommendation
            )
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan internal: {str(e)}")

# ==========================================
# QUESTIONNAIRE LOGIC ENDPOINT
# ==========================================
@app.get("/get_questionnaire", response_model=QuestionnaireResponse)
def get_questionnaire(category: str):
    """
    Mengembalikan daftar pertanyaan dinamis berdasarkan kategori material sampah yang terdeteksi.
    Backend dapat menggunakan endpoint ini untuk membangun UI dinamis di sisi Frontend.
    """
    category_lower = category.lower().strip()
    
    # 1. Base questions yang selalu ditanyakan ke semua kategori sampah
    base_questions = [
        QuestionField(
            field="is_clean", 
            label="Apakah sampah dalam kondisi bersih?", 
            type="radio", 
            options=["Unknown", "Yes", "No"]
        ),
        QuestionField(
            field="is_dry", 
            label="Apakah sampah dalam kondisi kering?", 
            type="radio", 
            options=["Unknown", "Yes", "No"]
        )
    ]
    
    specific_questions = []
    
    # 2. Logic percabangan (Branching logic) berdasarkan material CV
    if category_lower == "plastic":
        specific_questions = [
            QuestionField(field="Hardness", label="Bagaimana tekstur plastik ini?", type="radio", options=["Unknown", "Hard", "Flexible"]),
            QuestionField(field="is_multilayer", label="Apakah plastik ini berlapis (seperti bungkus makanan ringan)?", type="radio", options=["Unknown", "Yes", "No"]),
            QuestionField(field="is_container", label="Apakah plastik ini berupa botol/wadah?", type="radio", options=["Unknown", "Yes", "No"]),
            QuestionField(field="is_foam", label="Apakah ini berupa styrofoam (gabus)?", type="radio", options=["Unknown", "Yes", "No"])
        ]
    elif category_lower == "paper":
        specific_questions = [
            QuestionField(field="is_multilayer", label="Apakah kertas/karton ini berlapis plastik/aluminium (seperti kotak susu)?", type="radio", options=["Unknown", "Yes", "No"])
        ]
    elif category_lower == "glass":
        specific_questions = [
            QuestionField(field="is_fragment", label="Apakah kaca ini berupa pecahan/serpihan?", type="radio", options=["Unknown", "Yes", "No"]),
            QuestionField(field="is_container", label="Apakah ini berupa botol/toples utuh?", type="radio", options=["Unknown", "Yes", "No"]),
            QuestionField(field="is_hazardous", label="Apakah sebelumnya ini wadah bahan kimia/berbahaya?", type="radio", options=["Unknown", "Yes", "No"])
        ]
    elif category_lower == "metal":
        specific_questions = [
            QuestionField(field="is_container", label="Apakah ini berupa kaleng?", type="radio", options=["Unknown", "Yes", "No"]),
            QuestionField(field="is_hazardous", label="Apakah kaleng ini bekas cat/aerosol kimia?", type="radio", options=["Unknown", "Yes", "No"])
        ]
    elif category_lower == "textile":
        specific_questions = [
            QuestionField(field="is_small_item", label="Apakah ini kain perca/berukuran sangat kecil?", type="radio", options=["Unknown", "Yes", "No"])
        ]
        
    return QuestionnaireResponse(
        category=category,
        questions=base_questions + specific_questions
    )

@app.get("/")
def read_root():
    return {"message": "BinGo AI Orchestrator is running. Use POST /predict_hybrid for predictions."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_final_ai:app", host="0.0.0.0", port=8000, reload=True)
