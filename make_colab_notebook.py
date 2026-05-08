import json
import re

with open(r'c:\ML_BinGo\BinGo_ML_Notebook.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Revert matplotlib Agg to interactive
content = content.replace("import matplotlib\nmatplotlib.use('Agg')\nimport matplotlib.pyplot as plt", "import matplotlib.pyplot as plt")

# 2. Uncomment plt.show()
content = content.replace("# plt.show()", "plt.show()")

# 3. Fix paths for Colab (uploading to current directory)
content = content.replace(r'r"C:\Users\MyBook Army\Downloads\Data_Sampah.csv"', '"Data_Sampah.csv"  # Upload file ini ke Colab')
content = content.replace(r"r'c:\ML_BinGo\output_distribution.png'", "'output_distribution.png'")
content = content.replace(r"r'c:\ML_BinGo\hardness_vs_material.png'", "'hardness_vs_material.png'")
content = content.replace(r"r'c:\ML_BinGo\hardness_vs_recyclability.png'", "'hardness_vs_recyclability.png'")
content = content.replace(r"r'c:\ML_BinGo\training_history.png'", "'training_history.png'")
content = content.replace(r"r'c:\ML_BinGo\confusion_matrices.png'", "'confusion_matrices.png'")
content = content.replace(r"r'c:\ML_BinGo\roc_curves.png'", "'roc_curves.png'")
content = content.replace(r"r'c:\ML_BinGo\bingo_model.keras'", "'bingo_model.keras'")
content = content.replace(r"r'c:\ML_BinGo\label_encoders.pkl'", "'label_encoders.pkl'")

# 4. Add markdown cell at the very beginning to explain instructions
markdown_cell = {
    "cell_type": "markdown",
    "metadata": {},
    "source": [
        "# BinGo: Your AI Lens for a Cleaner Beach\n",
        "## Machine Learning Notebook - Klasifikasi Sampah Pantai\n",
        "\n",
        "**Instruksi untuk Google Colab:**\n",
        "1. Pastikan Anda sudah mengunggah file dataset `Data_Sampah.csv` ke dalam *Files* (panel kiri Colab).\n",
        "2. Jalankan semua sel (*Run All*)."
    ]
}

# 5. Split by '# %%' to create cells
cells = [markdown_cell]
blocks = content.split('# %%')

for block in blocks:
    if not block.strip():
        continue
    
    # Keep the `# %% [x] TITLE` part as a comment inside the cell
    cell_source_text = '# %%' + block
    
    # Split text into lines but keep newline characters
    lines = [line + '\n' for line in cell_source_text.strip().split('\n')]
    
    # Remove the very last newline from the last string to keep JSON clean
    if lines:
        lines[-1] = lines[-1].rstrip('\n')
        
    cells.append({
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": lines
    })

notebook = {
    "cells": cells,
    "metadata": {
        "colab": {
            "name": "BinGo_ML_Notebook_Colab.ipynb",
            "provenance": []
        },
        "kernelspec": {
            "display_name": "Python 3",
            "name": "python3"
        },
        "language_info": {
            "name": "python"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 0
}

with open(r'c:\ML_BinGo\BinGo_ML_Notebook_Colab.ipynb', 'w', encoding='utf-8') as f:
    json.dump(notebook, f, indent=2)

print("Berhasil membuat BinGo_ML_Notebook_Colab.ipynb!")
