import tensorflow as tf
import datetime
import os
import numpy as np

# Impor objek custom
from model_utils import CustomNormalization, custom_loss

# 1. Setup Direktori TensorBoard
log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
os.makedirs(log_dir, exist_ok=True)
summary_writer = tf.summary.create_file_writer(log_dir)

# 2. Contoh Model Sederhana Menggunakan Custom Layer
def build_model():
    inputs = tf.keras.Input(shape=(224, 224, 3))
    # Gunakan custom layer
    x = CustomNormalization()(inputs)
    x = tf.keras.layers.Conv2D(32, 3, activation='relu')(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    x = tf.keras.layers.Flatten()(x)
    x = tf.keras.layers.Dense(64, activation='relu')(x)
    outputs = tf.keras.layers.Dense(5, activation='softmax')(x) # 5 Kelas
    return tf.keras.Model(inputs, outputs)

model = build_model()
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)

# 3. Custom Callback untuk TensorBoard
class CustomTensorBoardCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        if logs is None:
            logs = {}
        with summary_writer.as_default():
            tf.summary.scalar('custom_loss', logs.get('loss'), step=epoch)
            tf.summary.scalar('custom_accuracy', logs.get('accuracy'), step=epoch)

# 4. Custom Training Loop dengan tf.GradientTape
@tf.function
def train_step(images, labels):
    with tf.GradientTape() as tape:
        predictions = model(images, training=True)
        # Gunakan custom loss
        loss = custom_loss(labels, predictions)
    
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))
    
    # Menghitung metrik (contoh sederhana)
    correct_predictions = tf.equal(tf.argmax(predictions, 1), tf.argmax(labels, 1))
    accuracy = tf.reduce_mean(tf.cast(correct_predictions, tf.float32))
    
    return loss, accuracy

def train():
    print("Memulai Custom Training Loop...")
    
    # Dataset dummy untuk contoh (ganti dengan tf.data.Dataset sungguhan)
    dummy_images = np.random.rand(32, 224, 224, 3).astype(np.float32)
    # One-hot labels untuk 5 kelas
    dummy_labels = np.zeros((32, 5), dtype=np.float32)
    dummy_labels[:, 0] = 1.0 
    
    epochs = 5
    
    for epoch in range(epochs):
        print(f"Epoch {epoch+1}/{epochs}")
        loss, accuracy = train_step(dummy_images, dummy_labels)
        
        print(f"Loss: {loss.numpy():.4f}, Accuracy: {accuracy.numpy():.4f}")
        
        # Log ke TensorBoard
        with summary_writer.as_default():
            tf.summary.scalar('loss', loss, step=epoch)
            tf.summary.scalar('accuracy', accuracy, step=epoch)
            
    print(f"Training selesai. Cek log dengan: tensorboard --logdir logs/fit")

if __name__ == "__main__":
    train()
