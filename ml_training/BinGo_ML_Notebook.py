# =============================================================================
# BinGo: Your AI Lens for a Cleaner Beach
# Machine Learning Notebook - Klasifikasi Sampah Pantai
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
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, roc_curve, auc, roc_auc_score
from sklearn.preprocessing import label_binarize
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization, Embedding, Flatten, Concatenate, Input
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.utils import to_categorical
import warnings
warnings.filterwarnings('ignore')

print("TensorFlow Version:", tf.__version__)
print("GPU Available:", len(tf.config.list_physical_devices('GPU')) > 0)

# %% [2] LOAD DATASET
DATA_PATH = r"C:\Users\MyBook Army\Downloads\Data_Sampah.csv"
df_raw = pd.read_csv(DATA_PATH)
print(f"Dataset shape: {df_raw.shape}")
print(f"\nKolom dataset:\n{df_raw.columns.tolist()}")
df_raw.head()

# %% [3] EXPLORASI DATA AWAL
print("="*60)
print("INFO DATASET")
print("="*60)
print(df_raw.info())
print(f"\nJumlah missing values:\n{df_raw.isnull().sum()}")
print(f"\nStatistik deskriptif:\n{df_raw.describe()}")

# %% [4] ANALISIS KOLOM RELEVAN
# INPUT:  generalname (Jenis Barang), Hardness
# OUTPUT: category (Material), Recyclability (Pengolahan), RecycleMethod (Treatment)

cols_input = ['generalname', 'Hardness']
cols_output = ['category', 'Recyclability', 'RecycleMethod']

print("="*60)
print("DISTRIBUSI FITUR INPUT")
print("="*60)
print(f"\nJumlah Jenis Barang unik: {df_raw['generalname'].nunique()}")
print(f"\nDistribusi Hardness:\n{df_raw['Hardness'].value_counts()}")

print("\n" + "="*60)
print("DISTRIBUSI FITUR OUTPUT")
print("="*60)
print(f"\nDistribusi Material (category):\n{df_raw['category'].value_counts()}")
print(f"\nDistribusi Pengolahan (Recyclability):\n{df_raw['Recyclability'].value_counts()}")
print(f"\nDistribusi Treatment Method:\n{df_raw['RecycleMethod'].value_counts()}")

# %% [5] VISUALISASI DISTRIBUSI OUTPUT
fig, axes = plt.subplots(1, 3, figsize=(20, 6))
fig.suptitle('Distribusi Output Variables', fontsize=16, fontweight='bold')

# Material
colors_mat = sns.color_palette("viridis", df_raw['category'].nunique())
df_raw['category'].value_counts().plot(kind='bar', ax=axes[0], color=colors_mat)
axes[0].set_title('Material (Category)', fontsize=13)
axes[0].set_xlabel('Jenis Material')
axes[0].set_ylabel('Jumlah')
axes[0].tick_params(axis='x', rotation=45)

# Recyclability
colors_rec = ['#2ecc71', '#e74c3c']
df_raw['Recyclability'].value_counts().plot(kind='bar', ax=axes[1], color=colors_rec)
axes[1].set_title('Pengolahan (Recyclability)', fontsize=13)
axes[1].set_xlabel('Dapat Didaur Ulang?')
axes[1].set_ylabel('Jumlah')

# RecycleMethod
colors_treat = sns.color_palette("magma", df_raw['RecycleMethod'].nunique())
df_raw['RecycleMethod'].value_counts().plot(kind='bar', ax=axes[2], color=colors_treat)
axes[2].set_title('Treatment Method', fontsize=13)
axes[2].set_xlabel('Metode Pengolahan')
axes[2].set_ylabel('Jumlah')
axes[2].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\output_distribution.png', dpi=150, bbox_inches='tight')
# plt.show()
print("Saved: output_distribution.png")

# %% [6] VISUALISASI HARDNESS vs MATERIAL
fig, ax = plt.subplots(figsize=(12, 6))
ct = pd.crosstab(df_raw['category'], df_raw['Hardness'])
ct.plot(kind='bar', stacked=True, ax=ax, colormap='Set2')
ax.set_title('Hubungan Hardness dengan Material', fontsize=14, fontweight='bold')
ax.set_xlabel('Material')
ax.set_ylabel('Jumlah')
ax.legend(title='Hardness')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\hardness_vs_material.png', dpi=150, bbox_inches='tight')
# plt.show()

# %% [7] VISUALISASI HARDNESS vs RECYCLABILITY
fig, ax = plt.subplots(figsize=(8, 5))
ct2 = pd.crosstab(df_raw['Hardness'], df_raw['Recyclability'])
ct2.plot(kind='bar', ax=ax, color=['#e74c3c', '#2ecc71'])
ax.set_title('Hubungan Hardness dengan Potensi Daur Ulang', fontsize=14, fontweight='bold')
ax.set_xlabel('Hardness')
ax.set_ylabel('Jumlah')
ax.legend(title='Recyclability')
plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\hardness_vs_recyclability.png', dpi=150, bbox_inches='tight')
# plt.show()

# %% [8] DATA PREPROCESSING
print("="*60)
print("DATA PREPROCESSING")
print("="*60)

# Pilih kolom relevan
df = df_raw[cols_input + cols_output].copy()

# Hapus data dengan category 'unidentified'
df = df[df['category'] != 'unidentified'].reset_index(drop=True)
print(f"Shape setelah hapus 'unidentified': {df.shape}")

# Bersihkan spasi
for col in df.columns:
    if df[col].dtype == 'object':
        df[col] = df[col].str.strip()

print(f"\nFinal category classes: {df['category'].nunique()}")
print(f"Final RecycleMethod classes: {df['RecycleMethod'].nunique()}")

# %% [9] ENCODING INPUT - GENERALNAME (TEXT -> INDEX)
# Buat vocabulary dari generalname
le_generalname = LabelEncoder()
df['generalname_encoded'] = le_generalname.fit_transform(df['generalname'])
VOCAB_SIZE_ITEMS = df['generalname_encoded'].nunique()
print(f"Vocabulary size (Jenis Barang): {VOCAB_SIZE_ITEMS}")

# Encoding Hardness
le_hardness = LabelEncoder()
df['hardness_encoded'] = le_hardness.fit_transform(df['Hardness'])
VOCAB_SIZE_HARDNESS = df['hardness_encoded'].nunique()
print(f"Vocabulary size (Hardness): {VOCAB_SIZE_HARDNESS}")
print(f"Hardness mapping: {dict(zip(le_hardness.classes_, le_hardness.transform(le_hardness.classes_)))}")

# %% [10] ENCODING OUTPUT
# Output 1: Material (category) - Kategorikal
le_category = LabelEncoder()
df['category_encoded'] = le_category.fit_transform(df['category'])
NUM_MATERIALS = df['category_encoded'].nunique()
print(f"\nMaterial classes ({NUM_MATERIALS}):")
for i, c in enumerate(le_category.classes_):
    print(f"  {i}: {c}")

# Output 2: Recyclability - Biner
le_recyclability = LabelEncoder()
df['recyclability_encoded'] = le_recyclability.fit_transform(df['Recyclability'])
print(f"\nRecyclability mapping: {dict(zip(le_recyclability.classes_, le_recyclability.transform(le_recyclability.classes_)))}")

# Output 3: RecycleMethod - Kategorikal
le_recyclemethod = LabelEncoder()
df['recyclemethod_encoded'] = le_recyclemethod.fit_transform(df['RecycleMethod'])
NUM_METHODS = df['recyclemethod_encoded'].nunique()
print(f"\nTreatment Method classes ({NUM_METHODS}):")
for i, c in enumerate(le_recyclemethod.classes_):
    print(f"  {i}: {c}")

# %% [11] SPLIT DATA
X_item = df['generalname_encoded'].values
X_hardness = df['hardness_encoded'].values

y_material = to_categorical(df['category_encoded'].values, num_classes=NUM_MATERIALS)
y_recycle = df['recyclability_encoded'].values
y_method = to_categorical(df['recyclemethod_encoded'].values, num_classes=NUM_METHODS)

# Split 80:20
(X_item_train, X_item_test, X_hard_train, X_hard_test,
 y_mat_train, y_mat_test, y_rec_train, y_rec_test,
 y_met_train, y_met_test) = train_test_split(
    X_item, X_hardness, y_material, y_recycle, y_method,
    test_size=0.2, random_state=42, stratify=df['category_encoded']
)

print(f"Training set: {X_item_train.shape[0]} samples")
print(f"Test set: {X_item_test.shape[0]} samples")

# %% [12] BUILD MULTI-OUTPUT MODEL
EMBEDDING_DIM = 32

# Input layers
input_item = Input(shape=(1,), name='input_jenis_barang')
input_hardness = Input(shape=(1,), name='input_hardness')

# Embedding untuk Jenis Barang
emb_item = Embedding(VOCAB_SIZE_ITEMS, EMBEDDING_DIM, name='embedding_item')(input_item)
emb_item = Flatten()(emb_item)

# Embedding untuk Hardness
emb_hardness = Embedding(VOCAB_SIZE_HARDNESS, 8, name='embedding_hardness')(input_hardness)
emb_hardness = Flatten()(emb_hardness)

# Concatenate
merged = Concatenate()([emb_item, emb_hardness])

# Shared layers
x = Dense(128, activation='relu')(merged)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)
x = Dense(64, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.3)(x)

# Output 1: Material (Multi-class)
out_material = Dense(32, activation='relu')(x)
out_material = Dense(NUM_MATERIALS, activation='softmax', name='output_material')(out_material)

# Output 2: Recyclability (Binary)
out_recycle = Dense(16, activation='relu')(x)
out_recycle = Dense(1, activation='sigmoid', name='output_recyclability')(out_recycle)

# Output 3: Treatment Method (Multi-class)
out_method = Dense(32, activation='relu')(x)
out_method = Dense(NUM_METHODS, activation='softmax', name='output_treatment')(out_method)

# Compile model
model = Model(
    inputs=[input_item, input_hardness],
    outputs=[out_material, out_recycle, out_method]
)

model.compile(
    optimizer='adam',
    loss={
        'output_material': 'categorical_crossentropy',
        'output_recyclability': 'binary_crossentropy',
        'output_treatment': 'categorical_crossentropy'
    },
    loss_weights={
        'output_material': 1.0,
        'output_recyclability': 0.5,
        'output_treatment': 1.0
    },
    metrics={
        'output_material': 'accuracy',
        'output_recyclability': 'accuracy',
        'output_treatment': 'accuracy'
    }
)

model.summary()

# %% [13] TRAINING
# CUSTOM COMPONENT: Custom Callback
class BingoTrainingCallback(tf.keras.callbacks.Callback):
    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        # Cek akurasi dari 3 output
        mat_acc = logs.get('output_material_accuracy', 0)
        rec_acc = logs.get('output_recyclability_accuracy', 0)
        met_acc = logs.get('output_treatment_accuracy', 0)
        
        # Hentikan training jika ketiga metrik sudah mencapai > 99%
        if mat_acc > 0.99 and rec_acc > 0.99 and met_acc > 0.99:
            print(f"\n[Custom Callback] Target akurasi >99% tercapai pada epoch {epoch+1}. Menghentikan training!")
            self.model.stop_training = True

callbacks = [
    BingoTrainingCallback(), # Implementasi Custom Callback
    EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True, verbose=1),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, verbose=1)
]

history = model.fit(
    [X_item_train, X_hard_train],
    [y_mat_train, y_rec_train, y_met_train],
    validation_split=0.2,
    epochs=100,
    batch_size=64,
    callbacks=callbacks,
    verbose=1
)

# %% [14] VISUALISASI TRAINING HISTORY
fig, axes = plt.subplots(2, 3, figsize=(18, 10))
fig.suptitle('Training History', fontsize=16, fontweight='bold')

# Material Accuracy
axes[0, 0].plot(history.history['output_material_accuracy'], label='Train')
axes[0, 0].plot(history.history['val_output_material_accuracy'], label='Val')
axes[0, 0].set_title('Material Accuracy')
axes[0, 0].legend()

# Recyclability Accuracy
axes[0, 1].plot(history.history['output_recyclability_accuracy'], label='Train')
axes[0, 1].plot(history.history['val_output_recyclability_accuracy'], label='Val')
axes[0, 1].set_title('Recyclability Accuracy')
axes[0, 1].legend()

# Treatment Accuracy
axes[0, 2].plot(history.history['output_treatment_accuracy'], label='Train')
axes[0, 2].plot(history.history['val_output_treatment_accuracy'], label='Val')
axes[0, 2].set_title('Treatment Accuracy')
axes[0, 2].legend()

# Material Loss
axes[1, 0].plot(history.history['output_material_loss'], label='Train')
axes[1, 0].plot(history.history['val_output_material_loss'], label='Val')
axes[1, 0].set_title('Material Loss')
axes[1, 0].legend()

# Recyclability Loss
axes[1, 1].plot(history.history['output_recyclability_loss'], label='Train')
axes[1, 1].plot(history.history['val_output_recyclability_loss'], label='Val')
axes[1, 1].set_title('Recyclability Loss')
axes[1, 1].legend()

# Treatment Loss
axes[1, 2].plot(history.history['output_treatment_loss'], label='Train')
axes[1, 2].plot(history.history['val_output_treatment_loss'], label='Val')
axes[1, 2].set_title('Treatment Loss')
axes[1, 2].legend()

plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\training_history.png', dpi=150, bbox_inches='tight')
# plt.show()

# %% [15] EVALUASI MODEL
print("="*60)
print("EVALUASI MODEL PADA TEST SET")
print("="*60)

results = model.evaluate(
    [X_item_test, X_hard_test],
    [y_mat_test, y_rec_test, y_met_test],
    verbose=0
)

print(f"\nTotal Loss: {results[0]:.4f}")
print(f"Material Accuracy: {results[4]:.4f} ({results[4]*100:.2f}%)")
print(f"Recyclability Accuracy: {results[5]:.4f} ({results[5]*100:.2f}%)")
print(f"Treatment Accuracy: {results[6]:.4f} ({results[6]*100:.2f}%)")

# %% [16] CLASSIFICATION REPORTS
pred_material, pred_recycle, pred_method = model.predict([X_item_test, X_hard_test])

# Material
y_mat_pred = np.argmax(pred_material, axis=1)
y_mat_true = np.argmax(y_mat_test, axis=1)
print("\n" + "="*60)
print("CLASSIFICATION REPORT - MATERIAL")
print("="*60)
print(classification_report(y_mat_true, y_mat_pred, target_names=le_category.classes_))

# Recyclability
y_rec_pred = (pred_recycle > 0.5).astype(int).flatten()
print("="*60)
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

# %% [17] CONFUSION MATRICES
fig, axes = plt.subplots(1, 3, figsize=(24, 7))
fig.suptitle('Confusion Matrices', fontsize=16, fontweight='bold')

# Material
cm1 = confusion_matrix(y_mat_true, y_mat_pred)
sns.heatmap(cm1, annot=True, fmt='d', cmap='Blues', ax=axes[0],
            xticklabels=le_category.classes_, yticklabels=le_category.classes_)
axes[0].set_title('Material')
axes[0].set_xlabel('Predicted')
axes[0].set_ylabel('Actual')
axes[0].tick_params(axis='x', rotation=45)
axes[0].tick_params(axis='y', rotation=0)

# Recyclability
cm2 = confusion_matrix(y_rec_test, y_rec_pred)
sns.heatmap(cm2, annot=True, fmt='d', cmap='Greens', ax=axes[1],
            xticklabels=le_recyclability.classes_, yticklabels=le_recyclability.classes_)
axes[1].set_title('Recyclability')
axes[1].set_xlabel('Predicted')
axes[1].set_ylabel('Actual')

# Treatment
cm3 = confusion_matrix(y_met_true, y_met_pred)
sns.heatmap(cm3, annot=True, fmt='d', cmap='Purples', ax=axes[2],
            xticklabels=le_recyclemethod.classes_, yticklabels=le_recyclemethod.classes_)
axes[2].set_title('Treatment Method')
axes[2].set_xlabel('Predicted')
axes[2].set_ylabel('Actual')
axes[2].tick_params(axis='x', rotation=45)
axes[2].tick_params(axis='y', rotation=0)

plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\confusion_matrices.png', dpi=150, bbox_inches='tight')
# plt.show()

# %% [17.5] VISUALISASI ROC CURVE
fig, axes = plt.subplots(1, 3, figsize=(24, 7))
fig.suptitle('ROC Curves', fontsize=16, fontweight='bold')

# ROC Curve untuk Material (Multiclass -> di-binarize untuk ROC per kelas, ambil rata-rata macro)
n_classes_mat = NUM_MATERIALS
y_mat_test_bin = label_binarize(y_mat_true, classes=[i for i in range(n_classes_mat)])
fpr_mat = dict()
tpr_mat = dict()
roc_auc_mat = dict()

# Validasi jika jumlah kelas unik di y_mat_test > 1 agar tidak error
if n_classes_mat > 1:
    for i in range(n_classes_mat):
        fpr_mat[i], tpr_mat[i], _ = roc_curve(y_mat_test_bin[:, i], pred_material[:, i])
        roc_auc_mat[i] = auc(fpr_mat[i], tpr_mat[i])
    
    fpr_mat["micro"], tpr_mat["micro"], _ = roc_curve(y_mat_test_bin.ravel(), pred_material.ravel())
    roc_auc_mat["micro"] = auc(fpr_mat["micro"], tpr_mat["micro"])
    
    axes[0].plot(fpr_mat["micro"], tpr_mat["micro"], color='deeppink', linestyle=':', linewidth=4,
             label=f'Micro-average ROC (area = {roc_auc_mat["micro"]:0.2f})')
    for i in range(n_classes_mat):
        axes[0].plot(fpr_mat[i], tpr_mat[i], lw=2, label=f'Class {le_category.classes_[i][:10]}.. (area = {roc_auc_mat[i]:0.2f})')

axes[0].plot([0, 1], [0, 1], 'k--', lw=2)
axes[0].set_xlim([0.0, 1.0])
axes[0].set_ylim([0.0, 1.05])
axes[0].set_xlabel('False Positive Rate')
axes[0].set_ylabel('True Positive Rate')
axes[0].set_title('ROC - Material')
axes[0].legend(loc="lower right", fontsize=8)

# ROC Curve untuk Recyclability (Binary)
fpr_rec, tpr_rec, _ = roc_curve(y_rec_test, pred_recycle)
roc_auc_rec = auc(fpr_rec, tpr_rec)
axes[1].plot(fpr_rec, tpr_rec, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc_rec:0.2f})')
axes[1].plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
axes[1].set_xlim([0.0, 1.0])
axes[1].set_ylim([0.0, 1.05])
axes[1].set_xlabel('False Positive Rate')
axes[1].set_ylabel('True Positive Rate')
axes[1].set_title('ROC - Recyclability')
axes[1].legend(loc="lower right")

# ROC Curve untuk Treatment (Multiclass)
n_classes_met = NUM_METHODS
y_met_test_bin = label_binarize(y_met_true, classes=[i for i in range(n_classes_met)])
fpr_met = dict()
tpr_met = dict()
roc_auc_met = dict()

if n_classes_met > 1:
    for i in range(n_classes_met):
        fpr_met[i], tpr_met[i], _ = roc_curve(y_met_test_bin[:, i], pred_method[:, i])
        roc_auc_met[i] = auc(fpr_met[i], tpr_met[i])
    
    fpr_met["micro"], tpr_met["micro"], _ = roc_curve(y_met_test_bin.ravel(), pred_method.ravel())
    roc_auc_met["micro"] = auc(fpr_met["micro"], tpr_met["micro"])
    
    axes[2].plot(fpr_met["micro"], tpr_met["micro"], color='deeppink', linestyle=':', linewidth=4,
             label=f'Micro-average ROC (area = {roc_auc_met["micro"]:0.2f})')
    for i in range(n_classes_met):
        axes[2].plot(fpr_met[i], tpr_met[i], lw=2, label=f'{le_recyclemethod.classes_[i][:10]}.. (area = {roc_auc_met[i]:0.2f})')

axes[2].plot([0, 1], [0, 1], 'k--', lw=2)
axes[2].set_xlim([0.0, 1.0])
axes[2].set_ylim([0.0, 1.05])
axes[2].set_xlabel('False Positive Rate')
axes[2].set_ylabel('True Positive Rate')
axes[2].set_title('ROC - Treatment')
axes[2].legend(loc="lower right", fontsize=8)

plt.tight_layout()
plt.savefig(r'c:\ML_BinGo\roc_curves.png', dpi=150, bbox_inches='tight')
# plt.show()

# %% [18] SAVE MODEL & ENCODERS
import pickle

# Save TF model (Format .keras siap produksi sesuai requirement)
model.save(r'c:\ML_BinGo\bingo_model.keras')
print("Model saved: bingo_model.keras")

# Save label encoders
encoders = {
    'le_generalname': le_generalname,
    'le_hardness': le_hardness,
    'le_category': le_category,
    'le_recyclability': le_recyclability,
    'le_recyclemethod': le_recyclemethod
}
with open(r'c:\ML_BinGo\label_encoders.pkl', 'wb') as f:
    pickle.dump(encoders, f)
print("Encoders saved: label_encoders.pkl")

# %% [19] FUNGSI PREDIKSI
def predict_waste(jenis_barang: str, hardness: str):
    """
    Prediksi material, recyclability, dan treatment method.
    
    Args:
        jenis_barang: Nama jenis barang (e.g., 'Shopping Bags  incl. pieces')
        hardness: Tingkat kekerasan ('Hard', 'Flexible', 'unknown')
    """
    try:
        item_enc = le_generalname.transform([jenis_barang])[0]
    except ValueError:
        print(f"[ERROR] Jenis barang '{jenis_barang}' tidak dikenali!")
        return None
    
    hard_enc = le_hardness.transform([hardness])[0]
    
    pred_mat, pred_rec, pred_met = model.predict(
        [np.array([item_enc]), np.array([hard_enc])], verbose=0
    )
    
    material = le_category.classes_[np.argmax(pred_mat)]
    recyclable = "Yes" if pred_rec[0][0] > 0.5 else "No"
    treatment = le_recyclemethod.classes_[np.argmax(pred_met)]
    
    print("="*50)
    print("HASIL PREDIKSI BINGO")
    print("="*50)
    print(f"Input  - Jenis Barang : {jenis_barang}")
    print(f"Input  - Hardness     : {hardness}")
    print(f"Output - Material     : {material}")
    print(f"Output - Daur Ulang   : {recyclable}")
    print(f"Output - Treatment    : {treatment}")
    print(f"\nConfidence:")
    print(f"  Material  : {np.max(pred_mat)*100:.1f}%")
    print(f"  Recycle   : {max(pred_rec[0][0], 1-pred_rec[0][0])*100:.1f}%")
    print(f"  Treatment : {np.max(pred_met)*100:.1f}%")
    return material, recyclable, treatment

# %% [20] TEST PREDIKSI
print("\n>>> Test 1: Botol plastik")
predict_waste("Drink bottles  <=0.5l", "Hard")

print("\n>>> Test 2: Kantong belanja")
predict_waste("Shopping Bags  incl. pieces", "Flexible")

print("\n>>> Test 3: Kaleng minuman")
predict_waste("Cans (food)", "Hard")

print("\n>>> Test 4: Koran")
predict_waste("Newspapers & magazines", "Flexible")

print("\n>>> Test 5: Botol kaca")
predict_waste("Bottles incl. pieces", "Hard")

# %% [21] RINGKASAN AKHIR
print("\n" + "="*60)
print("RINGKASAN PROYEK BINGO")
print("="*60)
print(f"""
Proyek    : BinGo - Your AI Lens for a Cleaner Beach
Dataset   : Data_Sampah.csv ({df.shape[0]} records, {df.shape[1]} columns)
Framework : TensorFlow {tf.__version__}

INPUT:
  1. Jenis Barang (generalname) - {VOCAB_SIZE_ITEMS} kategori unik
  2. Hardness (kekerasan)       - {VOCAB_SIZE_HARDNESS} level (Hard/Flexible/unknown)

OUTPUT:
  1. Material (category)        - {NUM_MATERIALS} kelas (Plastic, Metal, Glass, dll.)
  2. Pengolahan (Recyclability) - Binary (Yes/No)
  3. Treatment Method           - {NUM_METHODS} kelas

ARSITEKTUR:
  - Multi-Output Neural Network dengan Embedding layers
  - Shared hidden layers + task-specific output heads
  
HASIL EVALUASI:
  - Material Accuracy     : {results[4]*100:.2f}%
  - Recyclability Accuracy: {results[5]*100:.2f}%
  - Treatment Accuracy    : {results[6]*100:.2f}%
""")
print("="*60)
print("SELESAI!")
