import pandas as pd
import numpy as np

def run_stage_3():
    print("Loading data for Data Cleaning...")
    dataset_path = '../NYPD_Complaint_Data_Current_(Year_To_Date)_20260126.csv'
    df = pd.read_csv(dataset_path, low_memory=False)
    
    if 'LAW_CAT_CD' in df.columns:
        df.rename(columns={'LAW_CAT_CD': 'LAW_CAT_VIO'}, inplace=True)
    
    initial_rows = len(df)
    cleaning_log = []
    
    print("Handling Duplicates...")
    df = df.drop_duplicates('CMPLNT_NUM', keep='first')
    cleaning_log.append(f"Dropped {initial_rows - len(df)} duplicate rows based on CMPLNT_NUM.")
    current_rows = len(df)
    
    print("Handling Critical Nulls...")
    df = df.dropna(subset=['OFNS_DESC', 'CMPLNT_NUM'])
    cleaning_log.append(f"Dropped {current_rows - len(df)} rows with critical nulls (OFNS_DESC, CMPLNT_NUM).")
    current_rows = len(df)
    
    print("Filling Non-Critical Nulls...")
    df['SUSP_AGE_GROUP'] = df['SUSP_AGE_GROUP'].fillna('UNKNOWN')
    df['SUSP_RACE'] = df['SUSP_RACE'].fillna('UNKNOWN')
    df['SUSP_SEX'] = df['SUSP_SEX'].fillna('UNKNOWN')
    df['VIC_AGE_GROUP'] = df['VIC_AGE_GROUP'].fillna('UNKNOWN')
    df['VIC_RACE'] = df['VIC_RACE'].fillna('UNKNOWN')
    df['VIC_SEX'] = df['VIC_SEX'].fillna('UNKNOWN')
    df['PREM_TYP_DESC'] = df['PREM_TYP_DESC'].fillna('OTHER')
    df['CMPLNT_TO_DT'] = df['CMPLNT_TO_DT'].fillna(pd.NaT)
    
    print("Type Corrections...")
    df['CMPLNT_FR_DT'] = pd.to_datetime(df['CMPLNT_FR_DT'], errors='coerce')
    df['CMPLNT_TO_DT'] = pd.to_datetime(df['CMPLNT_TO_DT'], errors='coerce')
    df['RPT_DT'] = pd.to_datetime(df['RPT_DT'], errors='coerce')
    
    df['ADDR_PCT_CD'] = pd.to_numeric(df['ADDR_PCT_CD'], errors='coerce').astype(pd.Int64Dtype())
    df['KY_CD'] = pd.to_numeric(df['KY_CD'], errors='coerce').astype(pd.Int64Dtype())
    df['PD_CD'] = pd.to_numeric(df['PD_CD'], errors='coerce').astype(pd.Int64Dtype())
    
    df['Latitude'] = pd.to_numeric(df['Latitude'], errors='coerce').astype('float64')
    df['Longitude'] = pd.to_numeric(df['Longitude'], errors='coerce').astype('float64')
    
    print("Outlier Removal...")
    # Lat/Lon out of bounds
    valid_coords = df['Longitude'].between(-74.3, -73.7, inclusive='both') & df['Latitude'].between(40.4, 40.95, inclusive='both')
    # Or keep those where coordinates are null? Prompt: Remove rows with Lat/Long outside NYC bounding box.
    # Doesn't explicitly say drop all null coordinates, but typically coordinate analysis drops them if outside box.
    # "Remove rows with Lat/Long outside NYC bounding box" means keep if null OR keep if inside.
    # Let's drop only if it is actually outside.
    invalid_coords = (~df['Longitude'].isna() & ~df['Longitude'].between(-74.3, -73.7, inclusive='both')) | \
                     (~df['Latitude'].isna() & ~df['Latitude'].between(40.4, 40.95, inclusive='both'))
    df = df[~invalid_coords]
    cleaning_log.append(f"Dropped {current_rows - len(df)} rows with out-of-bounds Lat/Long.")
    current_rows = len(df)
    
    # Logical date error
    invalid_dates = df['CMPLNT_FR_DT'] > df['RPT_DT']
    df = df[~invalid_dates]
    cleaning_log.append(f"Dropped {current_rows - len(df)} rows where CMPLNT_FR_DT > RPT_DT.")
    current_rows = len(df)
    
    print("Validation Assertions...")
    assert df['CMPLNT_NUM'].nunique() == len(df), "Failed: CMPLNT_NUM is not unique."
    assert df['OFNS_DESC'].isnull().sum() == 0, "Failed: OFNS_DESC has nulls."
    assert df['CMPLNT_FR_DT'].dtype == 'datetime64[ns]', "Failed: CMPLNT_FR_DT is not datetime64[ns]."
    
    print("Saving Clean Dataset...")
    df.to_csv('nypd_clean.csv', index=False)
    
    cleaning_log.append(f"Final dataset dimensions: {df.shape[0]} rows, {df.shape[1]} columns.")
    
    with open('cleaning_report.txt', 'w') as f:
        f.write("Data Cleaning Report\n")
        f.write("====================\n")
        f.write("\n".join(cleaning_log) + "\n")
        
    with open('pipeline_log.txt', 'a') as f:
        f.write("STAGE 3: DATA CLEANING\n")
        f.write("- Deduplicated rows against CMPLNT_NUM.\n")
        f.write("- Dropped critical nulls and out-of-bounds coordinates/dates.\n")
        f.write("- Filled non-critical nulls mapping unknown values.\n")
        f.write("- Enforced datatypes for dates, integer codes, and coordinates.\n")
        f.write("- Saved nypd_clean.csv and cleaning_report.txt.\n\n")

if __name__ == '__main__':
    run_stage_3()
    print("Stage 3 complete.")
