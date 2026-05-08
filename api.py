from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
import numpy as np
import pickle
import uvicorn
import os

app = FastAPI(
    title="BinGo ML API",
    description="API untuk prediksi Material, Recyclability, dan Treatment dari Sampah Pantai",
    version="1.0.0"
)

# Global variables untuk model dan encoders
model = None
encoders = None

class PredictionRequest(BaseModel):
    jenis_barang: str
    hardness: str

class ConfidenceResponse(BaseModel):
    material: float
    recyclable: float
    treatment: float

class PredictionResponse(BaseModel):
    material: str
    recyclable: str
    treatment: str
    confidence: ConfidenceResponse

@app.on_event("startup")
async def load_model_and_encoders():
    global model, encoders
    
    model_path = r'c:\ML_BinGo\bingo_model.keras'
    encoders_path = r'c:\ML_BinGo\label_encoders.pkl'
    
    if not os.path.exists(model_path):
        print(f"Warning: Model tidak ditemukan di {model_path}")
    else:
        model = tf.keras.models.load_model(model_path)
        print("Model berhasil diload.")
        
    if not os.path.exists(encoders_path):
        print(f"Warning: Encoders tidak ditemukan di {encoders_path}")
    else:
        with open(encoders_path, 'rb') as f:
            encoders = pickle.load(f)
        print("Encoders berhasil diload.")

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    if model is None or encoders is None:
        raise HTTPException(status_code=500, detail="Model atau encoder belum siap.")
    
    try:
        # Load encoders
        le_generalname = encoders['le_generalname']
        le_hardness = encoders['le_hardness']
        le_category = encoders['le_category']
        le_recyclability = encoders['le_recyclability']
        le_recyclemethod = encoders['le_recyclemethod']
        
        # Transform input
        try:
            item_enc = le_generalname.transform([request.jenis_barang])[0]
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Jenis barang '{request.jenis_barang}' tidak dikenali dalam dataset.")
            
        try:
            hard_enc = le_hardness.transform([request.hardness])[0]
        except ValueError:
             raise HTTPException(status_code=400, detail=f"Tingkat kekerasan '{request.hardness}' tidak dikenali. Coba: 'Hard', 'Flexible', atau 'unknown'")
        
        # Prediksi
        pred_mat, pred_rec, pred_met = model.predict(
            [np.array([item_enc]), np.array([hard_enc])], verbose=0
        )
        
        # Decode output
        material = le_category.classes_[np.argmax(pred_mat)]
        recyclable = "Yes" if pred_rec[0][0] > 0.5 else "No"
        treatment = le_recyclemethod.classes_[np.argmax(pred_met)]
        
        # Calculate confidence
        conf_mat = float(np.max(pred_mat))
        conf_rec = float(max(pred_rec[0][0], 1 - pred_rec[0][0]))
        conf_met = float(np.max(pred_met))
        
        return PredictionResponse(
            material=material,
            recyclable=recyclable,
            treatment=treatment,
            confidence=ConfidenceResponse(
                material=conf_mat,
                recyclable=conf_rec,
                treatment=conf_met
            )
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat prediksi: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Selamat datang di BinGo ML API. Gunakan endpoint POST /predict untuk prediksi."}

if __name__ == "__main__":
    # Jalankan server
    print("Menjalankan server FastAPI di http://127.0.0.0:8000")
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
