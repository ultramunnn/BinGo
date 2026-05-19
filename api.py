from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import tensorflow as tf
import numpy as np
import pickle
import uvicorn
import os

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

class ConfidenceResponse(BaseModel):
    recyclable: float
    treatment: float

class PredictionResponse(BaseModel):
    category: str
    recyclable: str
    treatment: str
    confidence: ConfidenceResponse

@app.on_event("startup")
async def load_model_and_encoders():
    global model, encoders
    
    model_path = r'c:\ML_BinGo\bingo_model.keras'
    encoders_path = r'c:\ML_BinGo\label_encoders.pkl'
    
    if os.path.exists(model_path):
        model = tf.keras.models.load_model(model_path)
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
            le = encoders.get(f'le_{col}')
            if not le:
                raise HTTPException(status_code=500, detail=f"Encoder untuk {col} tidak ditemukan.")
            
            # Aman dari unknown values (fall back ke 'Unknown' atau 0 jika error)
            if val in le.classes_:
                enc = le.transform([val])[0]
            elif 'Unknown' in le.classes_:
                enc = le.transform(['Unknown'])[0]
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
        
        return PredictionResponse(
            category=request.category,
            recyclable=recyclable,
            treatment=treatment,
            confidence=ConfidenceResponse(
                recyclable=conf_rec,
                treatment=conf_met
            )
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat prediksi: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Selamat datang di BinGo ML API - Hybrid Intelligent Decision System."}

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
