import os
import shutil

# Cek apakah modul sudah diinstall
try:
    from bing_image_downloader import downloader
except ImportError:
    print("="*60)
    print("ERROR: Modul 'bing-image-downloader' belum terinstall.")
    print("Silakan buka terminal/CMD dan jalankan perintah berikut:")
    print("pip install bing-image-downloader")
    print("="*60)
    exit()

print("="*60)
print("BinGo - Computer Vision Auto-Scraper Dataset")
print("Mendownload foto sampah otomatis dari internet...")
print("="*60)

# Kumpulan keyword spesifik (Fokus ke sampah pesisir/pantai)
search_queries = {
    "Plastic": [
        "crushed plastic water bottle on beach",
        "plastic snack wrapper trash on sand",
        "torn plastic bag litter ocean",
        "plastic straw waste sand",
        "styrofoam food container beach litter"
    ],
    "Metal": [
        "crushed aluminum soda can on beach",
        "rusted tin can sand",
        "rusted metal bottle cap litter",
        "metal scrap beach waste"
    ],
    "Glass": [
        "broken glass bottle on sand",
        "sea glass shards on beach",
        "discarded glass jar beach"
    ],
    "Paper": [
        "wet cardboard litter beach",
        "crumpled paper waste on sand",
        "paper coffee cup beach trash",
        "soiled tissue paper litter ground"
    ],
    "Textile": [
        "discarded old clothes on beach",
        "broken rubber flip flop sand",
        "torn cloth tote bag beach litter",
        "fabric rags trash ground"
    ]
}

# Konfigurasi Output
base_dir = "CV_Dataset_BinGo"
limit_per_query = 30  # Jumlah gambar per keyword (Bisa diubah jadi 100 atau lebih!)

# Buat folder utama jika belum ada
if not os.path.exists(base_dir):
    os.makedirs(base_dir)

# Mulai proses download
for category, queries in search_queries.items():
    print(f"\n>>> Memproses Kategori: {category.upper()} <<<")
    
    # Folder untuk tiap kategori (Plastic, Metal, dll)
    category_dir = os.path.join(base_dir, category)
    if not os.path.exists(category_dir):
        os.makedirs(category_dir)
        
    for query in queries:
        print(f" -> Mencari gambar untuk: '{query}'")
        try:
            # Download pakai bing-image-downloader
            downloader.download(
                query, 
                limit=limit_per_query,  
                output_dir=category_dir, 
                adult_filter_off=False, 
                force_replace=False, 
                timeout=60, 
                verbose=False
            )
        except Exception as e:
            print(f"    [!] Gagal mendownload '{query}': {e}")
            
print("\n" + "="*60)
print(f"SELESAI! Seluruh gambar telah tersimpan di:")
print(os.path.abspath(base_dir))
print("="*60)
print("Catatan untuk teman CV Anda:")
print("1. Cek folder tersebut, hapus gambar yang tidak relevan secara manual (Cleaning).")
print("2. Gambar sudah otomatis dipisah ke sub-folder berdasarkan kelasnya.")
