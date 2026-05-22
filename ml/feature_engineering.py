import pandas as pd
import numpy as np

def main():
    input_path = r"C:\Users\MyBook Army\Downloads\Data_Sampah.csv"
    output_path = r"C:\Users\MyBook Army\Downloads\Data_Sampah_Engineered.csv"
    
    print(f"Membaca dataset dari {input_path}...")
    df = pd.read_csv(input_path)
    
    # Pastikan string dan lowercase
    gn = df['generalname'].astype(str).str.lower()
    cat = df['category'].astype(str).str.lower()
    
    # 1. Inisialisasi fitur baru
    features = ['is_multilayer', 'is_dry', 'is_clean', 'is_container', 'is_fragment', 'is_hazardous', 'is_foam', 'is_small_item']
    for f in features:
        df[f] = 'Unknown'
        
    print("Mengekstrak fitur...")
        
    # 2. Rule: is_fragment
    fragment_kws = ['pieces', 'remains', 'fragment', 'broken']
    df.loc[gn.str.contains('|'.join(fragment_kws), na=False), 'is_fragment'] = 'Yes'
    df.loc[(df['is_fragment'] == 'Unknown') & (cat == 'plastic'), 'is_fragment'] = 'No'
    
    # 3. Rule: is_hazardous
    hazardous_kws = ['oil', 'cleaner', 'chemical', 'cosmetic', 'fertiliser', 'medical', 'injection', 'syringe', 'sunblock']
    df.loc[gn.str.contains('|'.join(hazardous_kws), na=False), 'is_hazardous'] = 'Yes'
    df.loc[(df['is_hazardous'] == 'Unknown'), 'is_hazardous'] = 'No'

    # 4. Rule: is_foam
    foam_kws = ['polystyrene', 'foam', 'sponge']
    df.loc[gn.str.contains('|'.join(foam_kws), na=False), 'is_foam'] = 'Yes'
    df.loc[(df['is_foam'] == 'Unknown'), 'is_foam'] = 'No'

    # 5. Rule: is_small_item
    small_kws = ['butt', 'filter', 'straw', 'stick', 'cap', 'lid', 'ring', 'pen', 'yokes', 'cutlery', 'stirrer']
    df.loc[gn.str.contains('|'.join(small_kws), na=False), 'is_small_item'] = 'Yes'
    df.loc[(df['is_small_item'] == 'Unknown'), 'is_small_item'] = 'No'

    # 6. Rule: is_multilayer
    multilayer_kws = ['wrapper', 'packet', 'pouch', 'film', 'sachet', 'bag']
    df.loc[gn.str.contains('|'.join(multilayer_kws), na=False), 'is_multilayer'] = 'Yes'
    df.loc[(df['is_multilayer'] == 'Unknown') & (cat == 'plastic'), 'is_multilayer'] = 'No'

    # 7. Rule: is_container
    container_kws = ['bottle', 'jar', 'container', 'can', 'drum', 'box', 'pot']
    df.loc[gn.str.contains('|'.join(container_kws), na=False), 'is_container'] = 'Yes'
    df.loc[(df['is_container'] == 'Unknown') & (cat.isin(['glass', 'metal', 'plastic'])), 'is_container'] = 'No'

    # 8. Rule: is_clean & is_dry
    # Paper
    paper_dry_kws = ['cardboard', 'paper', 'newspaper', 'magazine']
    paper_wet_kws = ['tissue', 'napkin', 'food']
    mask_paper = cat == 'paper'
    
    df.loc[mask_paper & gn.str.contains('|'.join(paper_dry_kws), na=False), 'is_dry'] = 'Yes'
    df.loc[mask_paper & gn.str.contains('|'.join(paper_dry_kws), na=False), 'is_clean'] = 'Yes'
    df.loc[mask_paper & gn.str.contains('|'.join(paper_wet_kws), na=False), 'is_clean'] = 'No'
    
    # Marine gear
    marine_kws = ['net', 'rope', 'pot', 'cord', 'fishing', 'mussel', 'oyster']
    df.loc[gn.str.contains('|'.join(marine_kws), na=False), 'is_clean'] = 'No' 

    # Simpan
    df.to_csv(output_path, index=False)
    print(f"Selesai! Dataset baru disimpan di:\n{output_path}\n")
    
    print("Ringkasan Ekstraksi Fitur:")
    summary = df[features].apply(pd.Series.value_counts).fillna(0).astype(int)
    print(summary)

if __name__ == "__main__":
    main()
