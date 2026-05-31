"""Verify existing ONNX models with dummy data."""
import os
import json
import numpy as np
import onnxruntime as ort

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ONNX_DIR = os.path.join(BASE_DIR, "onnx")
ENCODERS_PATH = os.path.join(BASE_DIR, "label", "label_encoders.json")

CLASS_NAMES = ["glass", "metal", "paper", "plastic", "textile"]


def verify_cv():
    path = os.path.join(ONNX_DIR, "waste_classifier_v1.onnx")
    print(f"\n{'='*50}")
    print(f"CV Model: {path}")
    print(f"{'='*50}")

    sess = ort.InferenceSession(path)
    inputs = sess.get_inputs()
    outputs = sess.get_outputs()

    print(f"  Inputs:  {[i.name + str(i.shape) for i in inputs]}")
    print(f"  Outputs: {[o.name + str(o.shape) for o in outputs]}")

    # Test with raw [0, 255] dummy image
    dummy = np.random.rand(1, 224, 224, 3).astype(np.float32) * 255.0
    result = sess.run(None, {inputs[0].name: dummy})

    probs = result[0][0]
    pred_idx = np.argmax(probs)
    print(f"  Prediction: {CLASS_NAMES[pred_idx]} ({probs[pred_idx]*100:.1f}%)")
    print(f"  All probs:  {dict(zip(CLASS_NAMES, [f'{p*100:.1f}%' for p in probs]))}")
    print("  [OK] CV model verified")


def verify_tabular():
    path = os.path.join(ONNX_DIR, "bingo_model.onnx")
    print(f"\n{'='*50}")
    print(f"Tabular Model: {path}")
    print(f"{'='*50}")

    sess = ort.InferenceSession(path)
    inputs = sess.get_inputs()
    outputs = sess.get_outputs()

    print(f"  Inputs:  {[i.name + str(i.shape) for i in inputs]}")
    print(f"  Outputs: {[o.name + str(o.shape) for o in outputs]}")

    # Test with dummy data (all zeros)
    feed = {i.name: np.array([[0]], dtype=np.float32) for i in inputs}
    result = sess.run(None, feed)

    for o, r in zip(outputs, result):
        print(f"  {o.name}: {r}")

    print("  [OK] Tabular model verified")


if __name__ == "__main__":
    print("Verifying ONNX models...")
    verify_cv()
    verify_tabular()
    print(f"\nAll models OK!")
