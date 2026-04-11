# NYPD Crime Prediction & Behavioral Analysis
## Final Project Documentation

### Project Overview
This project is an **end-to-end Machine Learning ecosystem** designed to analyze and predict crime volume, behavioral patterns, and hotspot risks using massive-scale NYPD complaint data.

The finalized pipeline securely trains on historical data (2020–2024) and tests purely on unseen future data (2025 YTD), guaranteeing zero **time-series data leakage**. It utilizes advanced tree-based ensembles (**LightGBM + XGBoost**), synthetic minority oversampling (**BorderlineSMOTE**), and sophisticated feature engineering methods like Fourier temporal harmonics. 

---

## The 5 Predictive Pillars
The project is structurally broken down into 5 independent predictive algorithms, each serving a distinct operational purpose:

### 1. Meta-Crime Behavioral Classification
* **Target:** `META_CRIME` (Violent / Property / Other)
* **Model:** LightGBM
* **Goal:** Given the location, time, and premise, can we classify the behavioral taxonomy of a crime?
* **Features Used:** 28 spatial and temporal features.

### 2. Suspect Demographic Profiling
* **Target:** `SUSP_SEX` (Male / Female)
* **Model:** XGBoost
* **Goal:** Predict suspect demographics natively from the context of the incident and victim demographics.
* **Architecture:** Uses a dynamically calculated `scale_pos_weight` to address underlying suspect proportion biases natively.

### 3. Crime Outcome Prediction
* **Target:** `CRM_ATPT_CPTD_CD` (Completed vs. Attempted)
* **Model:** XGBoost + LightGBM Soft-Voting Ensemble
* **Goal:** Predict intervention probabilities before a crime is "completed".
* **Architecture:** "Attempted" crimes represent only ~5% of raw data. The pipeline employs **BorderlineSMOTE** on the training data to synthetically balance this ratio so the ML model successfully learns the patterns.

### 4. Daily Crime Volume Forecasting
* **Target:** Total City-Wide Daily Crimes (Continuous)
* **Model:** XGBoost + LightGBM Regressor Ensemble
* **Goal:** Time-series regression predicting exactly how many complaints will occur tomorrow or next week.
* **Feature Engineering:** Extremely rich lag engineering, rolling averages (`shift(1)` safe), and advanced Fourier harmonics across the day-of-year to mathematically model absolute seasonality and trends. 

### 5. Precinct Hotspot Warning System
* **Target:** `Is_Hotspot` (Binary)
* **Model:** SMOTE + XGBoost + LightGBM Ensemble
* **Goal:** Warning engine declaring if a specific precinct is entering a statistically anomalous "hot" day.
* **Architecture:** Automatically determines the 65th percentile crime volume per precinct from training data, creating a dynamic threshold. Extremely sophisticated rolling features are utilized, strictly filtered by past-only windows to prevent target leakage.

---

## Advanced Architecture & Solutions

### Leakage Prevention 
The most critical achievement of this architecture is its absolute security against data leakage:
* **Temporal Validation:** The pipeline strictly isolates data chronologically. The models *never* train on 2025 data.
* **Train-Derived Features:** Any aggregated rates (like `PCT_MONTH_RATE` or historical precinct hotspot rates) are generated **strictly** using 2020-2024 rows, then intelligently patched onto the 2025 data. 
* **Shifted Rolling Horizons:** For the forecasting models, all `.ewm()` matrices and `.rolling()` averages are chained after a strict `shift(1)` instruction to ensure the model looks at *yesterday* to predict *today*.

### Interpretability (SHAP)
Because complex tree ensembles act as "Black Boxes", Pillar 3 integrates **SHAP (Shapley Additive exPlanations)**. 
Using `shap.TreeExplainer`, the pipeline generates Beeswarm maps and Summary Plots to actively prove exactly which local variables (like `HOUR` or `BOROUGH`) drove the algorithm to make its final decisions for Violent or Property classifications.

### Model Ensembles
Instead of relying on a single algorithm, the final version removed legacy CatBoost implementations and now utilizes **divergent ensembles**: 
1. **LightGBM:** Specifically configured for leaf-wise growth on highly imbalanced targets without destroying spatial features.
2. **XGBoost:** Configured for high-depth stability utilizing `BorderlineSMOTE`.
3. **Soft-Voting:** The two algorithms average their probability outputs (`0.5 * LightGBM + 0.5 * XGBoost`) providing significantly reduced error margins over single-model systems.

---

## Repository Structure 

```text
FDADM/
│
├── Final_Crime_Prediction.ipynb       # The primary interactive notebook pipeline 
├── Final_Crime_Prediction.py          # 1:1 exported script for CI/CD batch-job deployments
│
├── 2020-2024_complaint_data.csv       # Training Base Dataset (1GB+)
├── 2025_complaint_data.csv            # Test & Validation Dataset
│
├── PROJECT_DOCUMENTATION.md           # This architecture document
│
└── older versions/                    # Archive of legacy builds, Catboost logs, and older presentations
```

### Data Pipeline Configuration
All raw code requires:
* `pandas`, `numpy`, `matplotlib`, `seaborn`
* `scikit-learn`, `imbalanced-learn`
* `xgboost`, `lightgbm`
* `shap`

*Note: The script contains `if __name__ == '__main__':` guards ensuring it can be utilized both interactively in Jupyter and securely run via terminal without triggering automatic training loops upon import.*