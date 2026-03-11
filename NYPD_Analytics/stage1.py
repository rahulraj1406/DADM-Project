import pandas as pd
import numpy as np

def run_stage_1():
    print("Loading data...")
    dataset_path = '/Users/saisrikardevasani/Downloads/DA & DM/NYPD_Complaint_Data_Current_(Year_To_Date)_20260126.csv'
    df = pd.read_csv(dataset_path, low_memory=False)
    
    # Basic info
    shape = df.shape
    memory_usage = df.memory_usage(deep=True).sum() / (1024 ** 2)
    
    # Identify nulls and unique counts
    null_counts = df.isnull().sum()
    null_pct = (null_counts / len(df)) * 100
    unique_counts = df.nunique(dropna=True)
    
    # High null columns
    high_null_cols = null_pct[null_pct > 50].index.tolist()
    
    # Data dictionary
    dict_rows = []
    
    # Simple datatype classification heuristic
    time_cols = ['CMPLNT_FR_TM', 'CMPLNT_TO_TM']
    date_cols = ['CMPLNT_FR_DT', 'CMPLNT_TO_DT', 'RPT_DT']
    geo_cols = ['Latitude', 'Longitude', 'X_COORD_CD', 'Y_COORD_CD', 'Lat_Lon']
    binary_cols = []
    
    for col in df.columns:
        dt = 'Categorical' # Default
        if col in time_cols: dt = 'Time'
        elif col in date_cols: dt = 'Date'
        elif col in geo_cols: dt = 'Geospatial'
        elif pd.api.types.is_numeric_dtype(df[col]):
            if unique_counts[col] == 2:
                dt = 'Binary'
            else:
                dt = 'Numeric'
        elif unique_counts[col] == 2:
            dt = 'Binary'
            
        sample_vals = str(list(df[col].dropna().unique()[:3]))
        
        dict_rows.append({
            'field_name': col,
            'dtype': dt,
            'null_count': null_counts[col],
            'null_pct': round(null_pct[col], 2),
            'unique_count': unique_counts[col],
            'sample_values': sample_vals
        })
        
    data_dict = pd.DataFrame(dict_rows)
    data_dict.to_csv('data_dictionary.csv', index=False)
    
    # Schema summary
    with open('schema_summary.txt', 'w') as f:
        f.write("Schema Summary\n")
        f.write("==============\n")
        f.write(f"Row count: {shape[0]}\n")
        f.write(f"Column count: {shape[1]}\n")
        f.write(f"Memory usage: {memory_usage:.2f} MB\n\n")
        f.write("Key Observations:\n")
        f.write(f"- {len(high_null_cols)} columns have >50% missing values: {', '.join(high_null_cols)}\n")
        f.write("- Dataset loaded successfully.\n")
        
    # Log to pipeline log
    with open('pipeline_log.txt', 'a') as f:
        f.write("STAGE 1: DATASET OVERVIEW\n")
        f.write("- Loaded dataset successfully.\n")
        f.write(f"- Dataset has {shape[0]} rows and {shape[1]} columns.\n")
        f.write(f"- Identified {len(high_null_cols)} columns with >50% nulls.\n")
        f.write("- Generated data_dictionary.csv and schema_summary.txt.\n\n")

if __name__ == '__main__':
    run_stage_1()
    print("Stage 1 complete.")
