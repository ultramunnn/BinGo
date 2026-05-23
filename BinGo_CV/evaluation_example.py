import tensorflow as tf
import numpy as np
from model_utils import load_waste_model, custom_loss

def evaluate_model():
    print("Memuat model...")
    model = load_waste_model()
    
    if model is None:
        print("Model gagal dimuat. Pastikan 'model/waste_classifier.keras' tersedia.")
        return
        
    print("Model berhasil dimuat. Memulai evaluasi kustom...")
    
    # 1. Siapkan dataset dummy untuk evaluasi
    # Dalam praktiknya, ganti ini dengan dataset validasi/pengujian Anda (tf.data.Dataset)
    num_samples = 100
    dummy_val_images = np.random.rand(num_samples, 224, 224, 3).astype(np.float32)
    
    # Label dummy one-hot (5 kelas)
    dummy_val_labels = np.zeros((num_samples, 5), dtype=np.float32)
    for i in range(num_samples):
        random_class = np.random.randint(0, 5)
        dummy_val_labels[i, random_class] = 1.0

    # 2. Setup metrik
    metric_accuracy = tf.keras.metrics.CategoricalAccuracy()
    metric_mae = tf.keras.metrics.MeanAbsoluteError()
    total_loss = 0.0

    # 3. Custom Evaluation Loop
    batch_size = 32
    num_batches = int(np.ceil(num_samples / batch_size))
    
    for i in range(num_batches):
        start_idx = i * batch_size
        end_idx = min((i + 1) * batch_size, num_samples)
        
        batch_images = dummy_val_images[start_idx:end_idx]
        batch_labels = dummy_val_labels[start_idx:end_idx]
        
        # Inference (training=False agar Dropout/BatchNorm behave normally)
        predictions = model(batch_images, training=False)
        
        # Hitung loss
        loss = custom_loss(batch_labels, predictions)
        total_loss += loss.numpy()
        
        # Update metrik
        metric_accuracy.update_state(batch_labels, predictions)
        metric_mae.update_state(batch_labels, predictions)
        
    # 4. Tampilkan hasil
    avg_loss = total_loss / num_batches
    accuracy_result = metric_accuracy.result().numpy()
    mae_result = metric_mae.result().numpy()
    
    print("\n--- Hasil Evaluasi Kustom ---")
    print(f"Loss Rata-rata: {avg_loss:.4f}")
    print(f"Accuracy: {accuracy_result:.4f} (Target: 0.9500)")
    print(f"MAE: {mae_result:.4f} (Target: 0.0300)")

if __name__ == "__main__":
    evaluate_model()
