import gradio as gr
import tensorflow as tf
import numpy as np

# =========================
# CUSTOM LAYER
# =========================

class CustomNormalization(tf.keras.layers.Layer):

    def call(self, inputs):

        return inputs / 255.0


# =========================
# CUSTOM LOSS
# =========================

def custom_loss(y_true, y_pred):

    loss = tf.keras.losses.categorical_crossentropy(
        y_true,
        y_pred
    )

    return tf.reduce_mean(loss)


# =========================
# LOAD MODEL
# =========================

model = tf.keras.models.load_model(

    "waste_classifier_final.keras",

    custom_objects={

        "custom_loss": custom_loss,

        "CustomNormalization": CustomNormalization
    }
)

# =========================
# CLASS LABEL
# =========================

class_names = [
    "glass",
    "metal",
    "paper",
    "plastic",
    "textile"
]

# =========================
# PREDICTION FUNCTION
# =========================

def predict(image):

    image = image.resize((224,224))

    image_array = np.array(image)

    image_array = image_array / 255.0

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    prediction = model.predict(image_array)

    predicted_class = np.argmax(prediction)

    confidence = float(
        np.max(prediction) * 100
    )

    return {

        "prediction":
        class_names[predicted_class],

        "confidence":
        round(confidence, 2)
    }

# =========================
# GRADIO INTERFACE
# =========================

interface = gr.Interface(

    fn=predict,

    inputs=gr.Image(type="pil"),

    outputs="json",

    title="BinGo Waste Classification",

    description=
    "Upload waste image to classify waste category."
)

interface.launch()