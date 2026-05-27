"""
BinGo: Keras -> ONNX Converter

CARA PAKAI (Google Colab):
    1. Jalankan cell ini dulu:
        !pip install tensorflow tf2onnx onnxruntime

    2. Upload 3 file ke Colab:
        - waste_classifier.keras  (model CV)
        - bingo_model.keras       (model tabular)
        - label_encoders.pkl      (encoder)

       dari google.colab import files
       uploaded = files.upload()

    3. Jalankan script:
        !python convert.py

    4. Hasil ONNX akan muncul di folder onnx/ dan label/

CARA PAKAI (Lokal):
    pip install tensorflow tf2onnx onnxruntime
    cd models
    python convert_onnx/convert.py

PASTIKAN struktur folder:
    models/
    ├── waste_classifier.keras
    ├── bingo_model.keras
    ├── label_encoders.pkl
    ├── convert_onnx/
    │   └── convert.py
    ├── onnx/          <- output ONNX
    └── label/         <- output label_encoders.json
"""
import os
import json
import pickle
import numpy as np
import tensorflow as tf

# ── Paths (relative to models/ folder) ──
# Works both locally and in Colab as long as the folder structure is correct.
# If files are not found, falls back to current working directory (Colab friendly).
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Fallback: if models/ doesn't contain the files, use current working directory
# (useful when running in Colab with files uploaded to /content/)
if not os.path.exists(os.path.join(BASE_DIR, "waste_classifier.keras")):
    BASE_DIR = os.getcwd()

CV_MODEL_PATH = os.path.join(BASE_DIR, "waste_classifier.keras")
TABULAR_MODEL_PATH = os.path.join(BASE_DIR, "bingo_model.keras")
ENCODERS_PKL_PATH = os.path.join(BASE_DIR, "label_encoders.pkl")

OUTPUT_DIR = os.path.join(BASE_DIR, "onnx")
ENCODERS_JSON_PATH = os.path.join(BASE_DIR, "label", "label_encoders.json")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(ENCODERS_JSON_PATH), exist_ok=True)


# ── Custom Objects ──
@tf.keras.utils.register_keras_serializable(package="Custom", name="custom_loss")
def custom_loss(y_true, y_pred):
    y_pred = tf.clip_by_value(y_pred, tf.keras.backend.epsilon(), 1.0 - tf.keras.backend.epsilon())
    return tf.reduce_mean(-tf.reduce_sum(y_true * tf.math.log(y_pred), axis=-1))


@tf.keras.utils.register_keras_serializable(package="Custom", name="CustomNormalization")
class CustomNormalization(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def call(self, inputs):
        return inputs / tf.constant(1.0, dtype=tf.float32)

    def get_config(self):
        return super().get_config()


@tf.keras.utils.register_keras_serializable(package="Custom", name="BingoHybridModel")
class BingoHybridModel(tf.keras.Model):
    pass


CUSTOM_OBJECTS = {
    "custom_loss": custom_loss,
    "CustomNormalization": CustomNormalization,
    "BingoHybridModel": BingoHybridModel,
    "Custom>custom_loss": custom_loss,
    "Custom>CustomNormalization": CustomNormalization,
    "Custom>BingoHybridModel": BingoHybridModel,
}


def convert_to_onnx(model_path, output_name, input_spec):
    """Load Keras model and convert to ONNX."""
    import tf2onnx

    print(f"\n{'='*50}")
    print(f"Converting: {model_path}")
    print(f"{'='*50}")

    if not os.path.exists(model_path):
        print(f"[ERROR] Model not found: {model_path}")
        return None

    model = tf.keras.models.load_model(model_path, custom_objects=CUSTOM_OBJECTS)
    print(f"Input shape:  {model.input_shape}")
    print(f"Output shape: {model.output_shape}")

    output_path = os.path.join(OUTPUT_DIR, output_name)
    model_proto, _ = tf2onnx.convert.from_keras(
        model,
        input_signature=input_spec,
        output_path=output_path,
    )
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Saved: {output_path} ({size_mb:.2f} MB)")
    return output_path


def export_encoders():
    """Convert label_encoders.pkl to label_encoders.json."""
    print(f"\n{'='*50}")
    print(f"Exporting label encoders")
    print(f"{'='*50}")

    if not os.path.exists(ENCODERS_PKL_PATH):
        print(f"[ERROR] Not found: {ENCODERS_PKL_PATH}")
        return

    with open(ENCODERS_PKL_PATH, "rb") as f:
        encoders = pickle.load(f)

    result = {}
    for key, le in encoders.items():
        result[key] = list(le.classes_)
        print(f"  {key}: {list(le.classes_)}")

    with open(ENCODERS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Saved: {ENCODERS_JSON_PATH}")


def verify_onnx(onnx_path, feed_dict):
    """Quick verification: run ONNX inference and print output."""
    import onnxruntime as ort

    print(f"\n{'='*50}")
    print(f"Verifying: {onnx_path}")
    print(f"{'='*50}")

    sess = ort.InferenceSession(onnx_path)
    output_names = [o.name for o in sess.get_outputs()]

    print(f"  Inputs:  {[i.name for i in sess.get_inputs()]}")
    print(f"  Outputs: {output_names}")

    results = sess.run(output_names, feed_dict)

    for name, arr in zip(output_names, results):
        print(f"  {name}: shape={arr.shape}, values={arr}")

    return results


if __name__ == "__main__":
    print("=" * 50)
    print("BinGo: Keras -> ONNX Converter")
    print("=" * 50)

    # 1. Export label encoders
    export_encoders()

    # 2. Convert CV model
    cv_spec = (tf.TensorSpec((1, 224, 224, 3), tf.float32, name="input"),)
    cv_onnx = convert_to_onnx(CV_MODEL_PATH, "waste_classifier.onnx", cv_spec)

    # 3. Convert Tabular model
    # Tabular model has 10 separate inputs (one per feature)
    tabular_input_names = [
        "category", "Hardness", "is_multilayer", "is_dry", "is_clean",
        "is_container", "is_fragment", "is_hazardous", "is_foam", "is_small_item",
    ]
    tabular_spec = tuple(
        tf.TensorSpec((1, 1), tf.float32, name=f"input_{n}")
        for n in tabular_input_names
    )
    tab_onnx = convert_to_onnx(TABULAR_MODEL_PATH, "bingo_model.onnx", tabular_spec)

    # 4. Quick verify CV model with dummy data
    if cv_onnx:
        dummy_img = np.random.rand(1, 224, 224, 3).astype(np.float32) * 255.0
        verify_onnx(cv_onnx, {"input": dummy_img})

    # 5. Quick verify Tabular model with dummy data
    if tab_onnx:
        with open(ENCODERS_JSON_PATH, "r") as f:
            encoders = json.load(f)

        feeds = {}
        for col in tabular_input_names:
            key = f"le_{col}"
            n_classes = len(encoders.get(key, [0]))
            feeds[f"input_{col}"] = np.array([[0]], dtype=np.float32)

        verify_onnx(tab_onnx, feeds)

    print(f"\n{'='*50}")
    print("Done! ONNX models saved to:", OUTPUT_DIR)
    print("=" * 50)
