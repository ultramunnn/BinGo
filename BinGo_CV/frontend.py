import gradio as gr
import google.generativeai as genai
import os
from dotenv import load_dotenv
from model_utils import CLASSES, preprocess_image
import numpy as np

# Load env variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
else:
    gemini_model = None

def get_recycling_tips(waste_class: str) -> str:
    """
    Uses Gemini API to get educational info and recycling tips for the predicted waste class.
    """
    if not gemini_model:
        return "API Key Gemini belum dikonfigurasi. Atur GEMINI_API_KEY di file .env untuk mendapatkan tips AI."
        
    prompt = f"Pengguna mengunggah gambar sampah jenis '{waste_class}'. Berikan penjelasan singkat dan informatif tentang jenis sampah ini serta 2-3 tips praktis tentang cara mendaur ulang atau membuangnya dengan benar. Gunakan Bahasa Indonesia dan buatlah ringkas."
    
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Tidak dapat mengambil penjelasan AI saat ini: {str(e)}"

def create_gradio_app(keras_model):
    """
    Creates and returns the Gradio interface.
    """
    def predict_interface(image):
        if image is None:
            return "Tidak ada gambar", 0.0, "Silakan unggah gambar terlebih dahulu."
        
        img = image.convert("RGB").resize((224, 224))
        img_array = np.array(img, dtype=np.float32) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        if keras_model is None:
            return "Error", 0.0, "Model belum dimuat di server."
            
        predictions = keras_model.predict(img_array)
        predicted_idx = np.argmax(predictions[0])
        pred_class = CLASSES[predicted_idx]
        confidence = float(predictions[0][predicted_idx])
        
        # Get GenAI explanation
        ai_explanation = get_recycling_tips(pred_class)
        
        return pred_class, confidence, ai_explanation

    with gr.Blocks(title="AI Klasifikasi Sampah", theme=gr.themes.Soft()) as demo:
        gr.Markdown("# ♻️ AI Klasifikasi Sampah")
        gr.Markdown("Unggah gambar sampah untuk diklasifikasikan ke dalam kategori: Kaca (glass), Logam (metal), Kertas (paper), Plastik (plastic), atau Kain (textile). AI Generatif (Gemini) akan memberikan tips daur ulangnya!")
        
        with gr.Row():
            with gr.Column():
                image_input = gr.Image(type="pil", label="Unggah Gambar Sampah")
                submit_btn = gr.Button("Klasifikasi", variant="primary")
                
            with gr.Column():
                label_output = gr.Textbox(label="Prediksi Kelas")
                conf_output = gr.Number(label="Skor Kepercayaan (Confidence)")
                ai_output = gr.Markdown(label="Tips Daur Ulang dari AI")
                
        submit_btn.click(
            fn=predict_interface,
            inputs=image_input,
            outputs=[label_output, conf_output, ai_output]
        )
        
    return demo
