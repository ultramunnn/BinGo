from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
import gradio as gr
from fastapi.middleware.cors import CORSMiddleware
from model_utils import load_waste_model, predict_image
from frontend import create_gradio_app
import os

# Create FastAPI app
app = FastAPI(
    title="Waste Classification API",
    description="API untuk klasifikasi sampah dengan model TensorFlow Keras",
    version="1.0.0"
)

# CORS middleware for API access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model at startup
model = None

@app.on_event("startup")
async def startup_event():
    global model
    print("Memuat model...")
    model = load_waste_model()
    if model is None:
        print("Peringatan: Model gagal dimuat. Harap pastikan model ada di direktori yang benar.")

@app.get("/")
def read_root():
    return {"message": "Selamat datang di API Klasifikasi Sampah. Akses UI Gradio di /gradio atau cek /docs untuk API."}

@app.get("/health")
def health_check():
    """Endpoint untuk mengecek status kesehatan server."""
    if model is not None:
        return {"status": "healthy", "model_loaded": True}
    return JSONResponse(status_code=503, content={"status": "unhealthy", "model_loaded": False})

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    """
    Endpoint untuk memprediksi kelas dari gambar yang diunggah.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Model belum dimuat. Tidak dapat memproses prediksi.")
        
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File yang diunggah harus berupa gambar.")
        
    try:
        image_bytes = await file.read()
        predicted_class, confidence = predict_image(model, image_bytes)
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memproses gambar: {str(e)}")

# Mount Gradio app to FastAPI
# We need to initialize the gradio app and then mount it.
# We will do this by wrapping the mount function because gradio expects the fastapi app instance.
# Wait, Gradio's `gr.mount_gradio_app` does this nicely.
print("Menginisialisasi UI Gradio...")
# We pass model to create_gradio_app. Since it might be None right now, we need a wrapper or 
# load it globally first. We already loaded it in startup_event but Gradio needs it at import time.
# Let's just load it synchronously here for Gradio, or pass a lambda/global ref.
global_model = load_waste_model()
gradio_app = create_gradio_app(global_model)
app = gr.mount_gradio_app(app, gradio_app, path="/gradio")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=7860, reload=True)
