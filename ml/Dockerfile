# Gunakan base image Python yang ringan
FROM python:3.11-slim

# Set working directory di dalam container
WORKDIR /app

# Copy file requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua file ke dalam container (termasuk api.py, model, dan encoders)
COPY . .

# Expose port yang digunakan oleh Hugging Face Spaces (wajib 7860)
EXPOSE 7860

# Perintah untuk menjalankan aplikasi FastAPI
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "7860"]
