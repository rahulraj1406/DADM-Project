import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import warnings

warnings.filterwarnings('ignore')

def run_prediction():
    print("Loading dataset...")
    df = pd.read_csv('/Users/rahulraj1406/DADM/NYPD_Complaint_Data_Current_(Year_To_Date)_20260126.csv', low_memory=False)
    
    print(f"Total records in dataset: {len(df)}")
    
    # 1. PREDICT NUMBER OF CASES FOR JAN 2026
    print("\n--- FORECASTING VOLUME FOR JAN 2026 ---")
    
    # Convert dates to datetime
    df['CMPLNT_FR_DT'] = pd.to_datetime(df['CMPLNT_FR_DT'], errors='coerce')
    
    # Filter out bad dates and extremely old outliers to keep the trend relevant (e.g., from 2010 onwards)
    # Since it's a "Year_To_Date" file, it likely has predominantly recent data, but some old reports trickled in.
    valid_data = df.dropna(subset=['CMPLNT_FR_DT'])
    valid_data = valid_data[valid_data['CMPLNT_FR_DT'].dt.year >= 2015] 
    
    # Aggregate cases by Day
    daily_cases = valid_data.groupby('CMPLNT_FR_DT').size().reset_index(name='case_count')
    
    # Create time-series features for XGBoost
    daily_cases['Year'] = daily_cases['CMPLNT_FR_DT'].dt.year
    daily_cases['Month'] = daily_cases['CMPLNT_FR_DT'].dt.month
    daily_cases['DayOfWeek'] = daily_cases['CMPLNT_FR_DT'].dt.dayofweek
    daily_cases['DayOfYear'] = daily_cases['CMPLNT_FR_DT'].dt.dayofyear
    
    # Train / Test split on historical data (keep last 3 months as validation)
    train_end = daily_cases['CMPLNT_FR_DT'].max() - pd.DateOffset(months=3)
    train = daily_cases[daily_cases['CMPLNT_FR_DT'] <= train_end]
    val = daily_cases[daily_cases['CMPLNT_FR_DT'] > train_end]
    
    features = ['Year', 'Month', 'DayOfWeek', 'DayOfYear']
    X_train, y_train = train[features], train['case_count']
    X_val, y_val = val[features], val['case_count']
    
    # Train RandomForest Regressor (swapped from XGBoost due to native Mac OS libomp absence)
    model = RandomForestRegressor(n_estimators=100, max_depth=5, random_state=42)
    
    if len(train) > 0:
        model.fit(X_train, y_train)
        
        # Validation accuracy check
        if len(val) > 0:
            val_preds = model.predict(X_val)
            mae = mean_absolute_error(y_val, val_preds)
            print(f"Validation MAE (last 3 months of data): +/- {mae:.2f} cases per day")
        
        # Generate future dates for December 2025
        target_dates = pd.date_range(start='2025-12-01', end='2025-12-31')
        future_df = pd.DataFrame({'CMPLNT_FR_DT': target_dates})
        future_df['Year'] = future_df['CMPLNT_FR_DT'].dt.year
        future_df['Month'] = future_df['CMPLNT_FR_DT'].dt.month
        future_df['DayOfWeek'] = future_df['CMPLNT_FR_DT'].dt.dayofweek
        future_df['DayOfYear'] = future_df['CMPLNT_FR_DT'].dt.dayofyear
        
        # Predict
        future_preds = model.predict(future_df[features])
        total_future_cases = int(sum(future_preds))
        
        print(f"==> Projected Total Cases for Dec 2025: {total_future_cases:,} cases.")
        print(f"==> Average Projected Daily Cases: {future_preds.mean():.0f} cases/day.")
    else:
        print("Not enough training data found for time-series forecasting.")

    # 2. IDENTIFY RISKY TIMES AND TYPES
    print("\n--- RISKY PATTERNS (TIMES & CRIME TYPES) ---")
    df['HOUR'] = pd.to_datetime(df['CMPLNT_FR_TM'], errors='coerce').dt.hour
    
    # Most risky hours
    hourly_counts = df['HOUR'].value_counts().sort_index()
    top_3_hours = hourly_counts.nlargest(3)
    print(f"Most Risky Times (Top 3 Highest Volume Hours):")
    for hour, count in top_3_hours.items():
        print(f" - {int(hour):02d}:00 to {int(hour):02d}:59 with {count:,} incidents")
        
    # Most risky locations (Borough + Premises)
    print("\nMost Common Incident Types (LAW_CAT_CD):")
    law_cats = df['LAW_CAT_CD'].value_counts()
    for cat, count in law_cats.head(3).items():
        print(f" - {cat}: {count:,} incidents")

if __name__ == '__main__':
    run_prediction()