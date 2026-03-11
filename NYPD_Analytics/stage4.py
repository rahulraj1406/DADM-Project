import pandas as pd
import numpy as np
import json
import pickle
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def run_stage_4():
    print("Loading clean data...")
    df = pd.read_csv('nypd_clean.csv', low_memory=False)
    
    # Ensure datetimes are parsed
    df['CMPLNT_FR_DT'] = pd.to_datetime(df['CMPLNT_FR_DT'], errors='coerce')
    df['RPT_DT'] = pd.to_datetime(df['RPT_DT'], errors='coerce')
    
    # TEMPORAL FEATURES
    print("Temporal Features...")
    time_series = pd.to_datetime(df['CMPLNT_FR_TM'], format='%H:%M:%S', errors='coerce')
    df['HOUR'] = time_series.dt.hour
    df['HOUR'] = df['HOUR'].fillna(-1) # Handle missing
    
    df['DAY_OF_WEEK'] = df['CMPLNT_FR_DT'].dt.dayofweek # 0=Monday, 6=Sunday
    df['MONTH'] = df['CMPLNT_FR_DT'].dt.month
    df['YEAR'] = df['CMPLNT_FR_DT'].dt.year
    df['IS_WEEKEND'] = (df['DAY_OF_WEEK'] >= 5).astype(int)
    
    def get_time_of_day(h):
        if pd.isna(h) or h == -1: return 'UNKNOWN'
        if 6 <= h < 12: return 'MORNING'
        elif 12 <= h < 18: return 'AFTERNOON'
        elif 18 <= h < 22: return 'EVENING'
        else: return 'NIGHT'
        
    df['TIME_OF_DAY'] = df['HOUR'].apply(get_time_of_day)
    df['DAYS_TO_REPORT'] = (df['RPT_DT'] - df['CMPLNT_FR_DT']).dt.days.clip(lower=0)
    
    # GEOGRAPHIC FEATURES
    print("Geographic Features...")
    pct_counts = df['ADDR_PCT_CD'].value_counts()
    top_quartile_threshold = pct_counts.quantile(0.75)
    high_crime_pcts = pct_counts[pct_counts >= top_quartile_threshold].index
    df['HIGH_CRIME_PRECINCT'] = df['ADDR_PCT_CD'].isin(high_crime_pcts).astype(int)
    
    # KMeans
    print("Clustering coordinates...")
    # Safe clustering: temporarily fill NaNs with median for clustering only
    lat_median = df['Latitude'].median()
    lon_median = df['Longitude'].median()
    coords = df[['Latitude', 'Longitude']].fillna({'Latitude': lat_median, 'Longitude': lon_median})
    kmeans = KMeans(n_clusters=15, random_state=42, n_init=10)
    df['GEO_CLUSTER'] = kmeans.fit_predict(coords)
    
    # TARGET VARIABLES
    print("Target Variables...")
    df['IS_FELONY'] = (df['LAW_CAT_VIO'] == 'FELONY').astype(int)
    
    def categorize_offense(desc):
        if pd.isna(desc): return 'OTHER'
        desc = desc.upper()
        if any(w in desc for w in ['ASSAULT', 'RAPE', 'MURDER', 'ROBBERY', 'KIDNAPPING', 'HOMICIDE', 'WEAPON']):
            return 'VIOLENT'
        elif any(w in desc for w in ['LARCENY', 'BURGLARY', 'THEFT', 'PROPERTY', 'MISCHIEF', 'TRESPASS', 'STOLEN']):
            return 'PROPERTY'
        elif any(w in desc for w in ['DRUG', 'MARIJUANA', 'CONTROLLED', 'INTOXICATED']):
            return 'DRUG'
        elif any(w in desc for w in ['PROSTITUTION', 'GAMBLING', 'DISORDERLY', 'ALCOHOL', 'LOITERING', 'NOISE']):
            return 'QUALITY_OF_LIFE'
        return 'OTHER'
        
    df['OFFENSE_CATEGORY'] = df['OFNS_DESC'].apply(categorize_offense)
    
    # ENCODINGS
    print("Encoding...")
    encoder_mappings = {}
    
    # Frequency encode
    for col in ['OFNS_DESC', 'PREM_TYP_DESC']:
        freq = df[col].value_counts(normalize=True).to_dict()
        df[col + '_FREQ'] = df[col].map(freq)
        encoder_mappings[col + '_FREQ'] = freq
        
    # Ordinal encode age
    age_map = {'<18': 0, '18-24': 1, '25-44': 2, '45-64': 3, '65+': 4, 'UNKNOWN': -1}
    # Some older datasets use UNDER 18 instead of <18, cover both
    age_map['UNDER 18'] = 0
    df['SUSP_AGE_GROUP_ORD'] = df['SUSP_AGE_GROUP'].map(age_map).fillna(-1).astype(int)
    df['VIC_AGE_GROUP_ORD'] = df['VIC_AGE_GROUP'].map(age_map).fillna(-1).astype(int)
    encoder_mappings['AGE_GROUP'] = age_map
    
    # One-Hot encode (keeping original columns for analysis if needed)
    cols_to_ohe = ['LAW_CAT_VIO', 'IS_WEEKEND', 'CRM_ATPT_CPTD_CD', 'TIME_OF_DAY']
    df_ohe = pd.get_dummies(df[cols_to_ohe], drop_first=False)
    df = pd.concat([df, df_ohe], axis=1)
    encoder_mappings['OHE_COLUMNS'] = list(df_ohe.columns)
    
    # SCALING
    print("Scaling...")
    scaler = StandardScaler()
    scale_cols = ['HOUR', 'DAYS_TO_REPORT', 'MONTH', 'DAY_OF_WEEK']
    # fillna with median for scaling to avoid NaNs
    for c in scale_cols:
        df[c] = df[c].fillna(df[c].median())
    
    df[scale_cols] = scaler.fit_transform(df[scale_cols])
    
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
        
    with open('encoder_mappings.json', 'w') as f:
        json.dump(encoder_mappings, f, indent=4)
        
    # Final cleanup of features
    print("Saving Transformed Data...")
    df.to_csv('nypd_transformed.csv', index=False)
    
    features = scale_cols + ['HIGH_CRIME_PRECINCT', 'GEO_CLUSTER', 'OFNS_DESC_FREQ', 'PREM_TYP_DESC_FREQ', 
                             'SUSP_AGE_GROUP_ORD', 'VIC_AGE_GROUP_ORD'] + list(df_ohe.columns)
                             
    with open('feature_list.txt', 'w') as f:
        f.write("\n".join(features))
        
    with open('pipeline_log.txt', 'a') as f:
        f.write("STAGE 4: DATA TRANSFORMATION & FEATURE ENGINEERING\n")
        f.write("- Extracted temporal features (HOUR, DAY_OF_WEEK, MONTH, IS_WEEKEND, TIME_OF_DAY).\n")
        f.write("- Computed Geographic Features: HIGH_CRIME_PRECINCT and GEO_CLUSTER (KMeans=15).\n")
        f.write("- Encoded categoricals (OHE, Frequency, Ordinal).\n")
        f.write("- Standard-scaled continuous temporal features.\n")
        f.write("- Saved nypd_transformed.csv, scaler.pkl, encoder_mappings.json, feature_list.txt.\n\n")

if __name__ == '__main__':
    run_stage_4()
    print("Stage 4 complete.")
