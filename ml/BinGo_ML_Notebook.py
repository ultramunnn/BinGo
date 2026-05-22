# =============================================================================
# BinGo: Your AI Lens for a Cleaner Beach
# Machine Learning Notebook - Hybrid Intelligent Decision System
# =============================================================================

# %% [1] IMPORT LIBRARIES
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_curve, auc
from sklearn.preprocessing import label_binarize
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, Embedding, Flatten, Concatenate, Input
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.utils import to_categorical
import warnings
import pickle
warnings.filterwarnings('ignore')

print("TensorFlow Version:", tf.__version__)

# %% [2] LOAD DATASET
DATA_PATH = r"C:\Users\MyBook Army\Downloads\Data_Sampah.csv"
df_raw = pd.read_csv(DATA_PATH)
print(f"Dataset shape: {df_raw.shape}")

# %% [2.5] FEATURE ENGINEERING (RULE-BASED)
print("\n" + "="*60)
print("FEATURE ENGINEERING")
print("="*60)

gn = df_raw['generalname'].astype(str).str.lower()
cat = df_raw['category'].astype(str).str.lower()

features = ['is_multilayer', 'is_dry', 'is_clean', 'is_container', 'is_fragment', 'is_hazardous', 'is_foam', 'is_small_item']
for f in features:
    df_raw[f] = 'Unknown'

# Rule: is_fragment
fragment_kws = ['pieces', 'remains', 'fragment', 'broken']
df_raw.loc[gn.str.contains('|'.join(fragment_kws), na=False), 'is_fragment'] = 'Yes'
df_raw.loc[(df_raw['is_fragment'] == 'Unknown') & (cat == 'plastic'), 'is_fragment'] = 'No'

# Rule: is_hazardous
hazardous_kws = ['oil', 'cleaner', 'chemical', 'cosmetic', 'fertiliser', 'medical', 'injection', 'syringe', 'sunblock']
df_raw.loc[gn.str.contains('|'.join(hazardous_kws), na=False), 'is_hazardous'] = 'Yes'
df_raw.loc[(df_raw['is_hazardous'] == 'Unknown'), 'is_hazardous'] = 'No'

# Rule: is_foam
foam_kws = ['polystyrene', 'foam', 'sponge']
df_raw.loc[gn.str.contains('|'.join(foam_kws), na=False), 'is_foam'] = 'Yes'
df_raw.loc[(df_raw['is_foam'] == 'Unknown'), 'is_foam'] = 'No'

# Rule: is_small_item
small_kws = ['butt', 'filter', 'straw', 'stick', 'cap', 'lid', 'ring', 'pen', 'yokes', 'cutlery', 'stirrer']
df_raw.loc[gn.str.contains('|'.join(small_kws), na=False), 'is_small_item'] = 'Yes'
df_raw.loc[(df_raw['is_small_item'] == 'Unknown'), 'is_small_item'] = 'No'

# Rule: is_multilayer
multilayer_kws = ['wrapper', 'packet', 'pouch', 'film', 'sachet', 'bag']
df_raw.loc[gn.str.contains('|'.join(multilayer_kws), na=False), 'is_multilayer'] = 'Yes'
df_raw.loc[(df_raw['is_multilayer'] == 'Unknown') & (cat == 'plastic'), 'is_multilayer'] = 'No'

# Rule: is_container
container_kws = ['bottle', 'jar', 'container', 'can', 'drum', 'box', 'pot']
df_raw.loc[gn.str.contains('|'.join(container_kws), na=False), 'is_container'] = 'Yes'
df_raw.loc[(df_raw['is_container'] == 'Unknown') & (cat.isin(['glass', 'metal', 'plastic'])), 'is_container'] = 'No'

# Rule: is_clean & is_dry
paper_dry_kws = ['cardboard', 'paper', 'newspaper', 'magazine']
paper_wet_kws = ['tissue', 'napkin', 'food']
mask_paper = cat == 'paper'

df_raw.loc[mask_paper & gn.str.contains('|'.join(paper_dry_kws), na=False), 'is_dry'] = 'Yes'
df_raw.loc[mask_paper & gn.str.contains('|'.join(paper_dry_kws), na=False), 'is_clean'] = 'Yes'
df_raw.loc[mask_paper & gn.str.contains('|'.join(paper_wet_kws), na=False), 'is_clean'] = 'No'

marine_kws = ['net', 'rope', 'pot', 'cord', 'fishing', 'mussel', 'oyster']
df_raw.loc[gn.str.contains('|'.join(marine_kws), na=False), 'is_clean'] = 'No'

print("Ekstraksi fitur selesai.")

# %% [3] ANALISIS KOLOM RELEVAN
# INPUT: category (from CV), Hardness, and Contextual Features
cols_input = ['category', 'Hardness', 'is_multilayer', 'is_dry', 'is_clean', 
              'is_container', 'is_fragment', 'is_hazardous', 'is_foam', 'is_small_item']
# OUTPUT: Recyclability, RecycleMethod
cols_output = ['Recyclability', 'RecycleMethod']

print("="*60)
print("DISTRIBUSI FITUR INPUT BARU")
print("="*60)
for col in cols_input:
    print(f"\nDistribusi {col}:\n{df_raw[col].value_counts()}")

# %% [4] DATA PREPROCESSING
print("\n" + "="*60)
print("DATA PREPROCESSING")
print("="*60)

# Pilih kolom relevan
df = df_raw[cols_input + cols_output].copy()

# Bersihkan spasi
for col in df.columns:
    if df[col].dtype == 'object':
        df[col] = df[col].astype(str).str.strip()

# FILTER & MAPPING 5 KELAS MATERIAL UTAMA (Sesuai output CV)
category_map = {
    'plastic': 'Plastic',
    'metal': 'Metal',
    'glass/ceramics': 'Glass',
    'paper/cardboard': 'Paper',
    'cloth/textile': 'Textile'
}
df['category'] = df['category'].str.lower().map(category_map)
df = df.dropna(subset=['category']).reset_index(drop=True)

print(f"Shape setelah filter 5 kelas utama: {df.shape}")
print(f"Kategori tersisa: {df['category'].unique()}")

# %% [5] ENCODING INPUT & OUTPUT
encoders = {}

# Encode Inputs
for col in cols_input:
    le = LabelEncoder()
    df[f'{col}_encoded'] = le.fit_transform(df[col])
    encoders[f'le_{col}'] = le
    print(f"Vocabulary size ({col}): {len(le.classes_)}")

# Encode Outputs
# 1. Recyclability - Biner
le_recyclability = LabelEncoder()
df['recyclability_encoded'] = le_recyclability.fit_transform(df['Recyclability'])
encoders['le_recyclability'] = le_recyclability

# 2. RecycleMethod - Kategorikal
le_recyclemethod = LabelEncoder()
df['recyclemethod_encoded'] = le_recyclemethod.fit_transform(df['RecycleMethod'])
encoders['le_recyclemethod'] = le_recyclemethod
NUM_METHODS = len(le_recyclemethod.classes_)

# %% [6] SPLIT DATA
# Kumpulkan semua input
X_list = [df[f'{col}_encoded'].values for col in cols_input]

y_recycle = df['recyclability_encoded'].values
y_method = to_categorical(df['recyclemethod_encoded'].values, num_classes=NUM_METHODS)

# Split 80:20 (Kita pakai index split lalu subset list)
indices = np.arange(len(df))
train_idx, test_idx = train_test_split(indices, test_size=0.2, random_state=42, stratify=df['recyclemethod_encoded'])

X_train = [x[train_idx] for x in X_list]
X_test = [x[test_idx] for x in X_list]

y_rec_train, y_rec_test = y_recycle[train_idx], y_recycle[test_idx]
y_met_train, y_met_test = y_method[train_idx], y_method[test_idx]

print(f"Training set: {len(train_idx)} samples")
print(f"Test set: {len(test_idx)} samples")

# %% [7] BUILD HYBRID DECISION MODEL
# Input layers & Embeddings
input_layers = []
embedding_layers = []

for col in cols_input:
    vocab_size = len(encoders[f'le_{col}'].classes_)
    # Emb dim: min(50, vocab_size // 2) tapi minimal 2 karena fiturnya sedikit
    emb_dim = max(2, min(8, vocab_size)) 
    
    inp = Input(shape=(1,), name=f'input_{col}')
    emb = Embedding(vocab_size, emb_dim, name=f'embedding_{col}')(inp)
    flt = Flatten()(emb)
    
    input_layers.append(inp)
    embedding_layers.append(flt)

# Concatenate semua fitur
merged = Concatenate()(embedding_layers)

# Shared layers
x = Dense(128, activation='relu')(merged)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)
x = Dense(64, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)

# Output 1: Recyclability (Binary)
out_recycle = Dense(16, activation='relu')(x)
out_recycle = Dense(1, activation='sigmoid', name='output_recyclability')(out_recycle)

# Output 2: Treatment Method (Multi-class)
out_method = Dense(32, activation='relu')(x)
out_method = Dense(NUM_METHODS, activation='softmax', name='output_treatment')(out_method)

# Compile model
model = Model(
    inputs=input_layers,
    outputs=[out_recycle, out_method]
)

model.compile(
    optimizer='adam',
    loss={
        'output_recyclability': 'binary_crossentropy',
        'output_treatment': 'categorical_crossentropy'
    },
    loss_weights={
        'output_recyclability': 1.0,
        'output_treatment': 1.0
    },
    metrics={
        'output_recyclability': 'accuracy',
        'output_treatment': 'accuracy'
    }
)

model.summary()

# %% [8] TRAINING
class BingoTrainingCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        rec_acc = logs.get('output_recyclability_accuracy', 0)
        met_acc = logs.get('output_treatment_accuracy', 0)
        
        if rec_acc > 0.99 and met_acc > 0.99:
            print(f"\n[Custom Callback] Target akurasi >99% tercapai pada epoch {epoch+1}. Menghentikan training!")
            self.model.stop_training = True

callbacks = [
    BingoTrainingCallback(),
    EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=1),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, verbose=1)
]

history = model.fit(
    X_train,
    [y_rec_train, y_met_train],
    validation_split=0.2,
    epochs=100,
    batch_size=64,
    callbacks=callbacks,
    verbose=1
)

# %% [9] EVALUASI MODEL
print("\n" + "="*60)
print("EVALUASI MODEL PADA TEST SET")
print("="*60)

results = model.evaluate(X_test, [y_rec_test, y_met_test], verbose=0)
print(f"Total Loss: {results[0]:.4f}")
print(f"Recyclability Accuracy: {results[3]:.4f} ({results[3]*100:.2f}%)")
print(f"Treatment Accuracy: {results[4]:.4f} ({results[4]*100:.2f}%)")

# %% [10] CLASSIFICATION REPORTS
pred_recycle, pred_method = model.predict(X_test)

# Recyclability
y_rec_pred = (pred_recycle > 0.5).astype(int).flatten()
print("\n" + "="*60)
print("CLASSIFICATION REPORT - RECYCLABILITY")
print("="*60)
print(classification_report(y_rec_test, y_rec_pred, target_names=le_recyclability.classes_))

# Treatment
y_met_pred = np.argmax(pred_method, axis=1)
y_met_true = np.argmax(y_met_test, axis=1)
print("="*60)
print("CLASSIFICATION REPORT - TREATMENT METHOD")
print("="*60)
print(classification_report(y_met_true, y_met_pred, target_names=le_recyclemethod.classes_))

# %% [11] VISUALISASI TRAINING HISTORY
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
fig.suptitle('Training History (Hybrid Decision System)', fontsize=16, fontweight='bold')

# Recyclability
axes[0].plot(history.history['output_recyclability_accuracy'], label='Train Acc')
axes[0].plot(history.history['val_output_recyclability_accuracy'], label='Val Acc')
axes[0].plot(history.history['output_recyclability_loss'], label='Train Loss', linestyle='--')
axes[0].plot(history.history['val_output_recyclability_loss'], label='Val Loss', linestyle='--')
axes[0].set_title('Recyclability')
axes[0].legend()

# Treatment
axes[1].plot(history.history['output_treatment_accuracy'], label='Train Acc')
axes[1].plot(history.history['val_output_treatment_accuracy'], label='Val Acc')
axes[1].plot(history.history['output_treatment_loss'], label='Train Loss', linestyle='--')
axes[1].plot(history.history['val_output_treatment_loss'], label='Val Loss', linestyle='--')
axes[1].set_title('Treatment Method')
axes[1].legend()

plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\training_history.png', dpi=150, bbox_inches='tight')
# plt.show()

# %% [12] CONFUSION MATRICES
fig, axes = plt.subplots(1, 2, figsize=(16, 6))
fig.suptitle('Confusion Matrices', fontsize=16, fontweight='bold')

cm1 = confusion_matrix(y_rec_test, y_rec_pred)
sns.heatmap(cm1, annot=True, fmt='d', cmap='Greens', ax=axes[0],
            xticklabels=le_recyclability.classes_, yticklabels=le_recyclability.classes_)
axes[0].set_title('Recyclability')
axes[0].set_xlabel('Predicted')
axes[0].set_ylabel('Actual')

cm2 = confusion_matrix(y_met_true, y_met_pred)
sns.heatmap(cm2, annot=True, fmt='d', cmap='Purples', ax=axes[1],
            xticklabels=le_recyclemethod.classes_, yticklabels=le_recyclemethod.classes_)
axes[1].set_title('Treatment Method')
axes[1].set_xlabel('Predicted')
axes[1].set_ylabel('Actual')
axes[1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\confusion_matrices.png', dpi=150, bbox_inches='tight')
# plt.show()

# %% [13] SAVE MODEL & ENCODERS
model.save(r'c:\ML_BinGo\bingo_model.keras')
print("\nModel saved: bingo_model.keras")

with open(r'c:\ML_BinGo\label_encoders.pkl', 'wb') as f:
    pickle.dump(encoders, f)
print("Encoders saved: label_encoders.pkl")

# %% [14] TEST PREDIKSI
def predict_waste(features_dict):
    # Prepare input
    inputs = []
    for col in cols_input:
        val = features_dict.get(col, 'Unknown')
        le = encoders[f'le_{col}']
        if val in le.classes_:
            enc = le.transform([val])[0]
        else:
            enc = le.transform(['Unknown'])[0] if 'Unknown' in le.classes_ else 0
        inputs.append(np.array([enc]))
        
    pred_rec, pred_met = model.predict(inputs, verbose=0)
    
    recyclable = "Yes" if pred_rec[0][0] > 0.5 else "No"
    treatment = encoders['le_recyclemethod'].classes_[np.argmax(pred_met)]
    
    print(f"\nInput: {features_dict}")
    print(f"Output -> Recyclable: {recyclable}, Treatment: {treatment}")

print("\n>>> Test: Plastic, Flexible, Multilayer, Hazardous")
predict_waste({
    'category': 'Plastic', 'Hardness': 'Flexible', 'is_multilayer': 'Yes', 
    'is_dry': 'Unknown', 'is_clean': 'Unknown', 'is_container': 'No', 
    'is_fragment': 'No', 'is_hazardous': 'Yes', 'is_foam': 'No', 'is_small_item': 'No'
})

print("\n>>> Test: Paper, Dry, Clean")
predict_waste({
    'category': 'Paper', 'Hardness': 'Unknown', 'is_multilayer': 'No', 
    'is_dry': 'Yes', 'is_clean': 'Yes', 'is_container': 'No', 
    'is_fragment': 'No', 'is_hazardous': 'No', 'is_foam': 'No', 'is_small_item': 'No'
})
