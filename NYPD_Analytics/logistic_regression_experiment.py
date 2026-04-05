import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import warnings

warnings.filterwarnings('ignore')

def run_experiment():
    print("Loading data...")
    dataset_path = '/Users/rahulraj1406/DADM/NYPD_Complaint_Data_Current_(Year_To_Date)_20260126.csv'
    df = pd.read_csv(dataset_path, low_memory=False)

    features = ['BORO_NM', 'PREM_TYP_DESC', 'CMPLNT_FR_TM', 'VIC_AGE_GROUP', 'VIC_SEX']
    targets = ['LAW_CAT_CD', 'CRM_ATPT_CPTD_CD', 'JURIS_DESC']
    date_col = 'RPT_DT'

    # Filter columns to minimize memory
    cols_to_keep = features + targets + [date_col]
    # Check if columns exist
    missing_cols = [c for c in cols_to_keep if c not in df.columns]
    if missing_cols:
        print(f"Warning: {missing_cols} missing from dataframe.")
        
    data = df.dropna(subset=cols_to_keep).copy()

    # Process Time to hour
    data['CMPLNT_FR_TM'] = pd.to_datetime(data['CMPLNT_FR_TM'], errors='coerce').dt.hour
    
    # Process Date to get month
    data[date_col] = pd.to_datetime(data[date_col], format='%m/%d/%Y', errors='coerce')
    data = data.dropna()
    data['Month'] = data[date_col].dt.to_period('M')

    # Identify the last month to use as test data
    unique_months = data['Month'].dropna().sort_values().unique()
    test_month = unique_months[-1]
    print(f"Holding out data for month: {test_month} for testing...")

    train_data = data[data['Month'] != test_month].copy()
    test_data = data[data['Month'] == test_month].copy()

    # Encode categorical variables
    for col in features + targets:
        if col != 'CMPLNT_FR_TM':
            le = LabelEncoder()
            # Fit on entire valid data string representation to avoid unobserved label errors
            full_series = pd.concat([train_data[col], test_data[col]]).astype(str)
            le.fit(full_series)
            train_data[col] = le.transform(train_data[col].astype(str))
            test_data[col] = le.transform(test_data[col].astype(str))

    results = []
    X_train = train_data[features]
    X_test = test_data[features]

    for target in targets:
        print(f"Training Logistic Regression for {target}...")
        y_train = train_data[target]
        y_test = test_data[target]
        
        # Model
        model = LogisticRegression(max_iter=500, n_jobs=-1)
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        
        # Accuracy
        acc = accuracy_score(y_test, y_pred)
        results.append({'Target Feature': target, 'Test Accuracy': f"{acc*100:.2f}%"})

    results_df = pd.DataFrame(results)
    print("\n--- RESULTS TABLE ---")
    print(results_df.to_markdown(index=False))

if __name__ == '__main__':
    run_experiment()
