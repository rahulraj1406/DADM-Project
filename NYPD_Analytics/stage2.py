import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from datetime import datetime

def run_stage_2():
    print("Loading data for EDA...")
    dataset_path = '../NYPD_Complaint_Data_Current_(Year_To_Date)_20260126.csv'
    df = pd.read_csv(dataset_path, low_memory=False)
    if 'LAW_CAT_CD' in df.columns:
        df.rename(columns={'LAW_CAT_CD': 'LAW_CAT_VIO'}, inplace=True)
    
    # Create output dir
    os.makedirs('eda_report', exist_ok=True)
    sns.set_theme(style="whitegrid")
    
    print("Temporal Analysis...")
    df['CMPLNT_FR_DT_parsed'] = pd.to_datetime(df['CMPLNT_FR_DT'], errors='coerce')
    # Filter to only reasonable dates for the plots to make sense
    df_temp = df.dropna(subset=['CMPLNT_FR_DT_parsed']).copy()
    df_temp = df_temp[(df_temp['CMPLNT_FR_DT_parsed'].dt.year >= 2000) & (df_temp['CMPLNT_FR_DT_parsed'].dt.year <= datetime.now().year)]
    
    # Needs HOUR, DAY_OF_WEEK, MONTH, YEAR. Hour from CMPLNT_FR_TM
    df_temp['HOUR'] = pd.to_datetime(df_temp['CMPLNT_FR_TM'], format='%H:%M:%S', errors='coerce').dt.hour
    df_temp['DAY_OF_WEEK'] = df_temp['CMPLNT_FR_DT_parsed'].dt.day_name()
    df_temp['MONTH'] = df_temp['CMPLNT_FR_DT_parsed'].dt.month
    df_temp['YEAR'] = df_temp['CMPLNT_FR_DT_parsed'].dt.year
    
    # daily complaint volume
    daily_vol = df_temp.groupby(df_temp['CMPLNT_FR_DT_parsed'].dt.date).size()
    plt.figure(figsize=(12, 6))
    daily_vol.plot()
    plt.title('Daily Complaint Volume')
    plt.xlabel('Date')
    plt.ylabel('Complaints')
    plt.tight_layout()
    plt.savefig('eda_report/daily_complaints_line.png', dpi=300)
    plt.close()
    
    # hourly distribution
    plt.figure(figsize=(10, 5))
    sns.histplot(df_temp['HOUR'].dropna(), bins=24, kde=False)
    plt.title('Hourly Distribution of Complaints')
    plt.xlabel('Hour of Day')
    plt.tight_layout()
    plt.savefig('eda_report/hourly_distribution_hist.png', dpi=300)
    plt.close()
    
    # monthly seasonality
    monthly_vol = df_temp['MONTH'].value_counts().sort_index()
    plt.figure(figsize=(10, 5))
    sns.barplot(x=monthly_vol.index, y=monthly_vol.values, color='b')
    plt.title('Monthly Seasonality')
    plt.xlabel('Month')
    plt.ylabel('Complaints')
    plt.tight_layout()
    plt.savefig('eda_report/monthly_seasonality_bar.png', dpi=300)
    plt.close()
    
    print("Categorical Analysis...")
    # Top 20 OFNS_DESC
    plt.figure(figsize=(12, 8))
    top20_ofns = df['OFNS_DESC'].value_counts().nlargest(20)
    sns.barplot(x=top20_ofns.values, y=top20_ofns.index)
    plt.title('Top 20 Offense Descriptions')
    plt.tight_layout()
    plt.savefig('eda_report/top_20_ofns_desc_bar.png', dpi=300)
    plt.close()
    
    # BORO_NM
    plt.figure(figsize=(10, 5))
    boro_counts = df['BORO_NM'].value_counts()
    sns.barplot(x=boro_counts.index, y=boro_counts.values)
    plt.title('Complaint Count by Borough')
    plt.tight_layout()
    plt.savefig('eda_report/complaints_by_boro_bar.png', dpi=300)
    plt.close()
    
    # Stacked bar LAW_CAT_VIO
    law_cat = df['LAW_CAT_VIO'].value_counts()
    plt.figure(figsize=(8, 5))
    law_cat.plot(kind='bar', stacked=True)
    plt.title('LAW_CAT_VIO Breakdown')
    plt.tight_layout()
    plt.savefig('eda_report/law_cat_vio_stacked_bar.png', dpi=300)
    plt.close()
    
    # Top 15 PREM_TYP_DESC
    plt.figure(figsize=(10, 8))
    top15_prem = df['PREM_TYP_DESC'].value_counts().nlargest(15)
    sns.barplot(x=top15_prem.values, y=top15_prem.index)
    plt.title('Top 15 Premises Types')
    plt.tight_layout()
    plt.savefig('eda_report/top_15_prem_typ_bar.png', dpi=300)
    plt.close()
    
    print("Bivariate Analysis...")
    # Heatmap: Offense type vs. Hour of day (top 10 only)
    top10_ofns = df['OFNS_DESC'].value_counts().nlargest(10).index
    df_top10 = df_temp[df_temp['OFNS_DESC'].isin(top10_ofns)]
    pt = pd.crosstab(df_top10['OFNS_DESC'], df_top10['HOUR'])
    plt.figure(figsize=(14, 8))
    sns.heatmap(pt, cmap="YlGnBu", annot=False)
    plt.title('Offense Type vs Hour of Day')
    plt.tight_layout()
    plt.savefig('eda_report/ofns_vs_hour_heatmap.png', dpi=300)
    plt.close()
    
    # Grouped bar Crime severity by borough
    plt.figure(figsize=(12, 6))
    sns.countplot(data=df, x='BORO_NM', hue='LAW_CAT_VIO')
    plt.title('Crime Severity by Borough')
    plt.tight_layout()
    plt.savefig('eda_report/severity_by_boro_grouped_bar.png', dpi=300)
    plt.close()
    
    # Cross tab CRM_ATPT_CPTD_CD vs LAW_CAT_VIO
    plt.figure(figsize=(8, 6))
    ct = pd.crosstab(df['CRM_ATPT_CPTD_CD'], df['LAW_CAT_VIO'])
    sns.heatmap(ct, annot=True, fmt='d', cmap='Blues')
    plt.title('CRM_ATPT_CPTD_CD vs LAW_CAT_VIO')
    plt.tight_layout()
    plt.savefig('eda_report/crm_atpt_vs_law_cat_heatmap.png', dpi=300)
    plt.close()
    
    print("Missing Values...")
    missing = df.isnull().sum().sort_values(ascending=False)
    with open('eda_summary.txt', 'w') as f:
        f.write("Missing Values:\n")
        f.write(missing.to_string())
        f.write("\n\n")
        
    plt.figure(figsize=(12, 8))
    # use sample to avoid memory crash
    sns.heatmap(df.sample(min(10000, len(df))).isnull(), cbar=False, cmap='viridis')
    plt.title('Missing Values Heatmap (Sample)')
    plt.tight_layout()
    plt.savefig('eda_report/missing_values_heatmap.png', dpi=300)
    plt.close()
    
    print("Outlier Detection...")
    outliers = []
    
    # Lat/Lon out of bounds
    lon_out = df[~df['Longitude'].between(-74.3, -73.7, inclusive='both') & df['Longitude'].notnull()]
    if not lon_out.empty:
        for idx in lon_out.index:
            outliers.append({'row_index': idx, 'CMPLNT_NUM': df.loc[idx, 'CMPLNT_NUM'], 'reason': 'Longitude out of bounds'})
            
    lat_out = df[~df['Latitude'].between(40.4, 40.95, inclusive='both') & df['Latitude'].notnull()]
    if not lat_out.empty:
        for idx in lat_out.index:
            outliers.append({'row_index': idx, 'CMPLNT_NUM': df.loc[idx, 'CMPLNT_NUM'], 'reason': 'Latitude out of bounds'})
            
    # Date out of bounds
    df['parsed_date'] = pd.to_datetime(df['CMPLNT_FR_DT'], errors='coerce')
    date_out = df[(df['parsed_date'].dt.year < 2000) | (df['parsed_date'] > pd.Timestamp.now())]
    if not date_out.empty:
        for idx in date_out.index:
            outliers.append({'row_index': idx, 'CMPLNT_NUM': df.loc[idx, 'CMPLNT_NUM'], 'reason': 'CMPLNT_FR_DT out of reasonable bounds (2000-now)'})
            
    # Pct_CD out of range
    df['ADDR_PCT_CD_num'] = pd.to_numeric(df['ADDR_PCT_CD'], errors='coerce')
    pct_out = df[~df['ADDR_PCT_CD_num'].between(1, 123, inclusive='both') & df['ADDR_PCT_CD_num'].notnull()]
    if not pct_out.empty:
        for idx in pct_out.index:
            outliers.append({'row_index': idx, 'CMPLNT_NUM': df.loc[idx, 'CMPLNT_NUM'], 'reason': 'ADDR_PCT_CD outside 1-123'})
            
    outliers_df = pd.DataFrame(outliers)
    outliers_df.to_csv('outlier_flags.csv', index=False)
    
    with open('eda_summary.txt', 'a') as f:
        f.write("EDA Summary & Key Observations:\n")
        f.write("1. Temporal Patterns: Higher complaint volume likely occurs during specific times of day or months, as shown in plots.\n")
        f.write("2. Categorical: Top offenses and boroughs identified.\n")
        f.write(f"3. Outliers Identified: {len(outliers_df)} outlier points flagged based on thresholds.\n")
        
    with open('pipeline_log.txt', 'a') as f:
        f.write("STAGE 2: EXPLORATORY DATA ANALYSIS (EDA)\n")
        f.write("- Generated temporal, categorical, and bivariate plots in eda_report/.\n")
        f.write("- Checked missing values and created a sample heatmap.\n")
        f.write(f"- Encountered {len(outliers_df)} total outlier flags.\n")
        f.write("- Wrote outlier_flags.csv and eda_summary.txt.\n\n")

if __name__ == '__main__':
    run_stage_2()
    print("Stage 2 complete.")
