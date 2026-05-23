import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os
import logging

logger = logging.getLogger(__name__)

# Constants
IMG_SIZE = (224, 224)
CLASSES = ["glass", "metal", "paper", "plastic", "textile"]

# 1. Custom Layer
@tf.keras.utils.register_keras_serializable()
class CustomNormalization(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super(CustomNormalization, self).__init__(**kwargs)

    def call(self, inputs):
        # Example custom normalization (scaling by 1/255 is already done in preprocessing, 
        # but this represents a custom logic layer)
        return inputs / tf.constant(1.0, dtype=tf.float32)

    def get_config(self):
        config = super(CustomNormalization, self).get_config()
        return config

# 2. Custom Loss
@tf.keras.utils.register_keras_serializable()
def custom_loss(y_true, y_pred):
    """
    Example custom categorical crossentropy loss.
    """
    y_pred = tf.clip_by_value(y_pred, tf.keras.backend.epsilon(), 1. - tf.keras.backend.epsilon())
    loss = -tf.reduce_sum(y_true * tf.math.log(y_pred), axis=-1)
    return tf.reduce_mean(loss)


# Model Loading Utility
def load_waste_model(model_path="model/waste_classifier.keras"):
    """
    Loads the Keras model with custom objects.
    """
    custom_objects = {
        'CustomNormalization': CustomNormalization,
        'custom_loss': custom_loss
    }
    
    if not os.path.exists(model_path):
        logger.warning(f"Model not found at {model_path}. Please place your model there.")
        return None

    try:
        model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)
        logger.info(f"Successfully loaded model from {model_path}")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        return None

# Preprocessing Utility
def preprocess_image(image_bytes):
    """
    Preprocess image: resize to 224x224 and normalize to [0, 1].
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    
    # Convert to numpy array and normalize
    img_array = np.array(image, dtype=np.float32)
    img_array = img_array / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array

def predict_image(model, image_bytes):
    """
    Runs prediction and returns class and confidence.
    """
    if model is None:
        return "Model not loaded", 0.0
        
    processed_img = preprocess_image(image_bytes)
    
    # Inference
    predictions = model.predict(processed_img)
    predicted_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_idx])
    
    return CLASSES[predicted_idx], confidence
