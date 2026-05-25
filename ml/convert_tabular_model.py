import tensorflow as tf

@tf.keras.utils.register_keras_serializable()
class BingoHybridModel(tf.keras.Model):
    def train_step(self, data):
        x, y = data
        with tf.GradientTape() as tape:
            y_pred = self(x, training=True)
            loss = self.compiled_loss(y, y_pred, regularization_losses=self.losses)
            
        gradients = tape.gradient(loss, self.trainable_variables)
        self.optimizer.apply_gradients(zip(gradients, self.trainable_variables))
        self.compute_metrics(x, y, y_pred, sample_weight=None)
        return {m.name: m.result() for m in self.metrics}

    def test_step(self, data):
        x, y = data
        y_pred = self(x, training=False)
        loss = self.compiled_loss(y, y_pred, regularization_losses=self.losses)
        self.compute_metrics(x, y, y_pred, sample_weight=None)
        return {m.name: m.result() for m in self.metrics}

def convert():
    input_path = "ml/bingo_model.keras"
    output_path = "ml/bingo_model.h5"
    
    print(f"Loading Keras model from: {input_path}...")
    try:
        model = tf.keras.models.load_model(
            input_path, 
            custom_objects={"BingoHybridModel": BingoHybridModel}
        )
        print("Model loaded successfully!")
        
        print(f"Saving model to H5 format at: {output_path}...")
        model.save(output_path, save_format="h5")
        print("Model converted and saved successfully!")
    except Exception as e:
        print(f"Error during conversion: {e}")

if __name__ == "__main__":
    convert()
