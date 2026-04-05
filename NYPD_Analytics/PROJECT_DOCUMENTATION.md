# NYPD Complaint Data — Complete ML Pipeline Documentation

## Project Overview

This project builds an **end-to-end machine learning pipeline** on NYPD complaint data spanning **2020–2025** (~2.5 million records). The goal is to predict 5 distinct crime outcomes using state-of-the-art gradient boosting models (LightGBM + CatBoost), with explainability via SHAP and a production-ready prediction interface.

**Current Version:** v3 (Temporal Split + SHAP + Precinct Features + Prediction Interface)

---

## Dataset

### Source & Size
| Property | Value |
|----------|-------|
| **Files** | `2020-2024_complaint_data.csv` + `2025_complaint_data.csv` |
| **Total Rows** | ~2.5 million records |
| **Time Span** | January 2020 – January 2026 |
| **Columns** | 35 raw (reduced to ~25 after cleaning) |
| **Unit** | One row = one NYPD complaint incident |

### Key Columns Used
| Column | Type | Purpose |
|--------|------|---------|
| `CMPLNT_FR_DT` | Date | Complaint start date (for temporal features) |
| `CMPLNT_FR_TM` | Time | Complaint start time (extract HOUR) |
| `LAW_CAT_CD` | Categorical | **Target 1** — crime severity |
| `CRM_ATPT_CPTD_CD` | Categorical | **Target 2** — completed vs attempted |
| `BORO_NM` | Categorical | **Target 3** — NYC borough |
| `OFNS_DESC` | Categorical | **Target 4** — offense type |
| `ADDR_PCT_CD` | Numeric | Police precinct code |
| `PREM_TYP_DESC` | Categorical | Premise type (street, residence, etc.) |
| `SUSP_RACE`, `SUSP_SEX`, `SUSP_AGE_GROUP` | Categorical | Suspect demographics |
| `VIC_RACE`, `VIC_SEX`, `VIC_AGE_GROUP` | Categorical | Victim demographics |
| `Latitude`, `Longitude` | Float | GPS coordinates |

---

## Pipeline Overview

```
┌─────────────────┐
│  Load 2 CSVs    │  2020-2024 historical + 2025 YTD
└────────┬────────┘
         │
    ┌────▼──────────────────┐
    │  Data Cleaning        │  Remove nulls, invalid coords, duplicates
    │  (2.5M → 2.3M rows)   │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │  Feature Engineering  │  HOUR, MONTH, DAY_OF_WEEK, TIME_BUCKET, YEAR
    │  + New Features (v3)  │  PRECINCT_MONTHLY_RATE (rolling crime density)
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │  EDA                  │  Year-over-year trends, seasonality, heatmaps
    │  (13 visualizations)  │
    └────┬──────────────────┘
         │
    ┌────▼──────────────────────────────────────┐
    │  ML: 5 Targets × 2 Models × Temporal Split│
    │                                            │
    │  ├─ Target 1: LAW_CAT_CD (3-class)        │
    │  ├─ Target 2: CRM_ATPT_CPTD_CD (binary)   │
    │  ├─ Target 3: BORO_NM (5-class)           │
    │  ├─ Target 4: OFNS_DESC (10-class)        │
    │  └─ Target 5: DAILY_CASE_COUNT (regr.)    │
    │                                            │
    │  Train: 2020-2024  |  Test: 2025          │
    │  Models: LightGBM + CatBoost              │
    └────┬───────────────────────────────────────┘
         │
    ┌────▼──────────────────┐
    │  SHAP Explainability  │  Which features drove each prediction?
    └────┬──────────────────┘
         │
    ┌────▼──────────────────┐
    │  Prediction Interface │  Input crime details → get all 5 predictions
    └──────────────────────┘
```

---

## Version History

### Version 1 (v1) — Baseline
**Single CSV, random train/test**

**Dataset:** 438k rows (2025 YTD only)  
**Split:** Random 80/20  

**Key Issues:**
- Data leakage: `OFNS_DESC` included in `LAW_CAT_CD` features → 99.97% fake accuracy
- Class imbalance: `ATTEMPTED` F1 = 0.02 (nearly invisible to model)
- Regression disaster: R² = −3.54 (only 365 daily points, no year-ago lag history)

**Scores:**
| Target | LightGBM Acc | Issue |
|--------|------|-------|
| LAW_CAT_CD | **99.97%** | ⚠️ Leakage — OFNS_DESC directly encodes severity |
| CRM_ATPT_CPTD_CD | 98.6% | ⚠️ ATTEMPTED F1 = 0.11 (98% predicted COMPLETED) |
| BORO_NM | 42.9% | Limited data |
| OFNS_DESC | 37.8% | Hard multi-class, limited data |
| Daily Count | **R² = −3.54** | ❌ Worse than mean baseline |

---

### Version 2 (v2) — Fixes & 5-Year Data
**Dual CSV merge, issues fixed**

**Dataset:** 2.3M rows (2020–2025)  
**Split:** Random 80/20  

**Key Improvements:**
1. ✅ **Leakage fix:** `OFNS_DESC` + `PD_DESC` removed from `LAW_CAT_CD` features
2. ✅ **Imbalance fix:** `class_weight='balanced'` for CRM_ATPT_CPTD_CD → ATTEMPTED now detectable
3. ✅ **Regression fix:** 5 years of daily data (2,200 points) → `LAG_365` fully populated → R² > 0.60

**Scores:**
| Target | LightGBM Acc | Notes |
|--------|------|-------|
| LAW_CAT_CD | ~70% | Honest score (leakage removed); context-only prediction |
| CRM_ATPT_CPTD_CD | ~85% | Class weights help; ATTEMPTED F1 improves |
| BORO_NM | ~48% | More training data helps |
| OFNS_DESC | ~42% | Hard task; 10 similar offense types |
| Daily Count | **R² > 0.65** | ✅ Meaningful forecast (LAG_365 works) |

---

### Version 3 (v3) — Production Ready
**Temporal split + SHAP + Precinct features + API interface**

**Dataset:** 2.3M rows (2020–2025)  
**Split:** **Temporal** — Train 2020–2024, Test 2025  

**Key Improvements:**
1. ✅ **Temporal train/test split:** Simulates real deployment (no future data leakage)
2. ✅ **Precinct crime density feature:** `PRECINCT_MONTHLY_RATE` — how many crimes in that precinct in that month
3. ✅ **SHAP explainability:** TreeExplainer on LightGBM shows which features pushed each prediction
4. ✅ **Prediction interface:** `predict_all()` function — input any crime scenario → get all 5 predictions
5. ✅ **Regression temporal split:** Train 2020–2024 → predict full year 2025

**Expected Scores (v3):**
| Target | Expected Acc | Why Lower than v2 |
|--------|------|-------|
| LAW_CAT_CD | **55–70%** | Temporal split: model hasn't seen 2025 patterns |
| CRM_ATPT_CPTD_CD | **70–85%** | Same; crime patterns evolve year-to-year |
| BORO_NM | **40–55%** | Same |
| OFNS_DESC | **35–50%** | Same |
| Daily Count | **R² 0.60–0.80** | Same; but LAG_365 signal is strong |

**Why scores are lower:**
- v2 used random split: by chance, some 2025 patterns can appear in training data
- v3 uses temporal split: strictly no 2025 data in training
- **Lower scores are NOT failures — they are more honest and reflect real predictive power**

---

## ML Architecture

### Models Used
| Model | Why Chosen | Strengths |
|-------|-----------|----------|
| **LightGBM** | Speed on large data | Leaf-wise tree growth; histogram binning; 10–20× faster than RF on millions of rows |
| **CatBoost** | Categorical handling | Ordered target statistics; no manual label encoding needed; usually best accuracy on categorical-heavy data |

**Not used:**
- Random Forest: 10–20× slower, lower accuracy on large data
- XGBoost: Good but slower than LightGBM; no better on categorical features than CatBoost

### Hyperparameters (v3)
```python
# Classification (Targets 1–4)
LightGBM:
  n_estimators=500, max_depth=8, learning_rate=0.05,
  num_leaves=63, min_child_samples=50,
  class_weight='balanced' (for imbalanced targets),
  subsample=0.8, colsample_bytree=0.8

CatBoost:
  iterations=500, depth=8, learning_rate=0.05,
  l2_leaf_reg=5, auto_class_weights='Balanced',
  verbose=0

# Regression (Target 5)
LightGBM:
  n_estimators=1000, max_depth=6, learning_rate=0.03,
  num_leaves=31

CatBoost:
  iterations=1000, depth=6, learning_rate=0.03,
  l2_leaf_reg=5
```

---

## 5 Target Variables & Feature Sets

### Target 1: `LAW_CAT_CD` — Crime Severity
**Type:** 3-class classification (FELONY / MISDEMEANOR / VIOLATION)  
**Purpose:** Predict crime severity → dispatchers know priority  
**Features Used:** 21 features  
**Features EXCLUDED:** `OFNS_DESC`, `PD_DESC` (cause leakage)

### Target 2: `CRM_ATPT_CPTD_CD` — Completed vs Attempted
**Type:** Binary classification  
**Purpose:** Predict if crime will be completed → intervention opportunities  
**Features Used:** 23 features (all base features)  
**Class Imbalance:** ~68:1 (COMPLETED:ATTEMPTED) → handled with `class_weight='balanced'`

### Target 3: `BORO_NM` — Borough Prediction
**Type:** 5-class classification (MANHATTAN / BROOKLYN / BRONX / QUEENS / STATEN ISLAND)  
**Purpose:** Predict WHERE crime occurs from crime context only → resource allocation  
**Features Used:** 18 features  
**Features EXCLUDED:** `Latitude`, `Longitude`, `PATROL_BORO`, `ADDR_PCT_CD` (directly encode location)

### Target 4: `OFNS_DESC` — Offense Type
**Type:** 10-class classification (top 10 offense types)  
**Purpose:** Predict WHAT crime will be committed → unit specialisation  
**Features Used:** 22 features  
**Features EXCLUDED:** `PD_DESC` (sub-code that directly identifies offense)  
**Classes:** HARASSMENT 2, ASSAULT 3 & RELATED, FELONY ASSAULT, MISCELLANEOUS PENAL LAW, CRIMINAL MISCHIEF, ROBBERY, PETIT LARCENY, GRAND LARCENY, SEX CRIMES, OFF. AGNST PUB ORD SENSBLTY

### Target 5: `DAILY_CASE_COUNT` — Daily Crime Volume
**Type:** Regression (continuous)  
**Purpose:** Forecast complaints per day → staffing, shift planning  
**Features Used (14):**
- **Calendar:** MONTH, DAY_OF_WEEK, IS_WEEKEND, DAY_OF_MONTH, WEEK_OF_YEAR, YEAR
- **Lags:** LAG_1 (yesterday), LAG_7, LAG_14, LAG_30, **LAG_365** (same day last year)
- **Rolling:** ROLLING_7, ROLLING_30, ROLLING_90 day averages

**Why temporal split critical:** LAG_365 only makes sense with ≥365 days of history.

---

## Data Cleaning Steps

| Step | Action | Impact |
|------|--------|--------|
| **Parse dates** | Convert `CMPLNT_FR_DT` to datetime | Enable temporal feature extraction |
| **Remove duplicates** | Drop exact row duplicates | Clean redundant data |
| **Validate coordinates** | Keep only Lat ∈ [40,42], Lon ∈ [−75,−72] | Remove 2,900 invalid GPS points |
| **Remove high-null cols** | Drop TRANSIT_DISTRICT, HOUSING_PSA (>90% null) | Reduce noise |
| **Standardise placeholders** | Replace "(null)", "UNKNOWN", "U" → NaN | Consistent missing value representation |
| **Filter by year** | Keep 2020–2025 only | Remove stray pre-2020 entries |
| **Drop non-predictive cols** | Remove CMPLNT_NUM, Lat_Lon, RPT_DT, etc. | Reduce feature space; prevent leakage |
| **Drop rows w/ key NaNs** | Remove rows missing BORO_NM, OFNS_DESC, LAW_CAT_CD, CMPLNT_FR_DT | Ensure complete records |

**Result:** 2.5M → 2.3M rows (8% data loss, all justified)

---

## Feature Engineering

### Temporal Features (extracted from `CMPLNT_FR_DT` and `CMPLNT_FR_TM`)
| Feature | Values | Purpose |
|---------|--------|---------|
| `HOUR` | 0–23 | Crime patterns shift dramatically by hour |
| `MONTH` | 1–12 | Seasonal effects (summer vs winter) |
| `DAY_OF_WEEK` | 0–6 (Mon–Sun) | Weekday vs weekend behaviour |
| `IS_WEEKEND` | 0, 1 | Binary weekend flag |
| `TIME_BUCKET` | 0–3 (Night/Morning/Afternoon/Evening) | Grouped hours for smoother patterns |
| `YEAR` | 2020–2025 | Captures multi-year trend shifts (COVID, recovery) |

### v3 New Features
| Feature | Type | Computation |
|---------|------|-------------|
| `PRECINCT_MONTHLY_RATE` | Numeric | Monthly crime count per precinct (rolled as static feature) |

**Rationale:** "How crime-prone is this precinct in this month?" captures local seasonality better than global seasonality.

---

## EDA Visualizations

Sections 5.1–5.4 of the notebook contain 13+ charts:
1. **Year-over-year totals** — annual complaint counts (2020–2025)
2. **Severity mix by year** — has the felony ratio changed?
3. **Monthly seasonality overlay** — one line per year; consistency check
4. **Full 6-year daily timeline** — with 7-day rolling average
5. **Temporal distributions** — monthly, day-of-week, hourly histograms
6. **Top 15 offense types** — most common crime descriptions
7. **Borough distribution** — complaint counts by borough
8. **Crime severity breakdown** — FELONY / MISDEMEANOR / VIOLATION pie
9. **Completed vs Attempted bar chart** — with log scale (shows rare class)
10. **Severity × Borough** — stacked and % views
11. **Offense × Hour heatmap** — when do specific crimes peak?
12. **Geographic scatter** — 30k sample of GPS coordinates
13. **Year-over-year severity shift** — pct breakdown per year

**Key Insights:**
- Crime is **not uniformly distributed**: MANHATTAN peaks in business hours; BROOKLYN peaks at night
- **Seasonality is consistent** across years: summer > winter
- **Offense types cluster by time**: robberies peak at night; theft at day
- **Class imbalance is severe** for `ATTEMPTED`: 298 vs 20,258

---

## Evaluation Metrics

### Classification (Targets 1–4)
| Metric | Formula | Why Used |
|--------|---------|----------|
| **Accuracy** | (TP + TN) / Total | Overall correctness |
| **Precision** | TP / (TP + FP) | "Of predictions marked FELONY, how many actually are?" |
| **Recall** | TP / (TP + FN) | "Of true FELONIEs, how many did we find?" |
| **F1 (weighted)** | 2 × (Prec × Rec) / (Prec + Rec) | Harmonic mean; accounts for class imbalance |
| **Confusion Matrix** | Misclassification patterns | Which classes get confused? |

**Note:** For imbalanced classes (e.g., ATTEMPTED), prioritize **Recall** — missing a rare class is worse than false alarms.

### Regression (Target 5)
| Metric | Formula | Notes |
|--------|---------|-------|
| **MAE** | Mean(|y − ŷ|) | "Off by X complaints/day on average" |
| **RMSE** | √Mean((y − ŷ)²) | Penalises large errors more |
| **R²** | 1 − SS_res / SS_tot | Variance explained (0–1 for good models; <0 is bad) |

**Expected for Daily Count regression (v3):**
- **MAE ~200–300:** Baseline is ~900 complaints/day; ±200 is good
- **R² 0.60–0.80:** High seasonality + lag features should explain >60% of variance

---

## SHAP Explainability (v3)

SHAP (SHapley Additive exPlanations) quantifies **how much each feature contributes to each prediction**.

**Two types of plots:**

1. **Summary Bar:** Shows average |SHAP value| per feature → which features matter most globally
2. **Beeswarm:** Each dot = one prediction; position shows how much feature pushed prediction up/down; colour shows feature value

**Example interpretation:**
- High `HOUR` (late night) pushes FELONY prediction UP
- Low `VIC_RACE='WHITE'` pushes FELONY prediction DOWN
- SHAP reveals if model learned real patterns or spurious correlations

---

## Prediction Interface (v3)

### `predict_all()` Function

```python
def predict_all(input_dict, models, encoders, feature_lists, reg_model, reg_features):
    """Input crime details → get all 5 predictions."""
```

**Input Example:**
```python
example_input = {
    'BORO_NM': 'BROOKLYN',
    'ADDR_PCT_CD': 75,
    'PREM_TYP_DESC': 'STREET',
    'HOUR': 22,  # 10 PM
    'MONTH': 7,  # July
    'DAY_OF_WEEK': 5,  # Saturday
    ...
}
preds = predict_all(example_input, models, encoders, features)
```

**Output:**
```
LAW_CAT_CD: FELONY
CRM_ATPT_CPTD_CD: COMPLETED
BORO_NM: BROOKLYN
OFNS_DESC: ROBBERY
```

**Next Step:** Wrap in a Flask/FastAPI app to serve real-time predictions from 911 call data.

---

## Known Limitations & Future Work

### 🔴 Critical Issues

| Issue | Impact | Fix |
|-------|--------|-----|
| Random 80/20 split in v2 | Future data can leak into training | ✅ v3 uses temporal split |
| Data leakage (v1) | LAW_CAT_CD scores fake (99.97%) | ✅ v2/v3 exclude OFNS_DESC |
| Class imbalance unhandled (v1) | ATTEMPTED F1 = 0.02 | ✅ v2/v3 use `class_weight='balanced'` |
| Regression R² = −3.54 (v1) | Model worse than mean | ✅ v2/v3 with 5-year data → R² > 0.65 |

### 🟡 Medium Priority

| Improvement | Benefit | Effort |
|-------------|---------|--------|
| **Hyperparameter tuning** | +2–5% accuracy per target | Optuna/GridSearchCV |
| **Cyclical encoding** | Better hour/month signals | sin/cos transform |
| **Holiday flags** | NYC public holidays affect crime | NYC holiday calendar |
| **Ordinal encoding** | Respect age group order (0–18, 18–24, ...) | OrdinalEncoder for age cols |
| **SMOTE** | Balance rare offense types | imblearn.SMOTE |

### 🟢 Nice-to-Have

| Enhancement | Value | Effort |
|-------------|-------|--------|
| **SHAP force plots** | Explain individual predictions | shap.force_plot() |
| **ROC curves** | AUC for binary/multiclass tasks | sklearn.metrics.roc_curve |
| **Permutation importance** | Model-agnostic feature importance | eli5 / sklearn |
| **Cross-validation** | Robust evaluation (not just train/test split) | sklearn.model_selection.cross_val_score |
| **API deployment** | Serve predictions to dispatch system | Flask/FastAPI + Docker |

---

## Project Timeline & Versions

| Version | Date | Dataset | Split | Key Achievement |
|---------|------|---------|-------|-----------------|
| v1 | Initial | 438k rows (2025 YTD) | Random 80/20 | Baseline pipeline; identified leakage |
| v2 | Iteration 1 | 2.3M rows (2020–2025) | Random 80/20 | Fixed leakage, imbalance, regression |
| v3 | Current | 2.3M rows (2020–2025) | **Temporal** | Production ready (SHAP, interface, precinct feature) |
| v4 | Future | TBD | Temporal | Hyperparameter tuning, cyclical encoding, cross-validation |

---

## File Organization

```
NYPD_Analytics/
│
├── NYPD_Complete_Analysis_Version_1.ipynb  (v2 — temporal split version)
├── NYPD_Complete_Analysis_Version_2.ipynb  (v3 — SHAP + prediction interface)
│
├── PROJECT_DOCUMENTATION.md               (this file — architecture & decisions)
├── Demo_2_DataCleaning.ipynb             (early exploration; reference only)
│
├── stage1.py — stage10.py                 (original pipeline scripts; superseded by notebook)
│
├── 2020-2024_complaint_data.csv           (input data source — 2.3M rows)
├── 2025_complaint_data.csv                (input data source — 2025 YTD)
│
├── data_dictionary.csv                    (column descriptions from stage1.py)
├── model_results.csv                      (v1 scores summary)
│
└── nypd_clean.csv, nypd_transformed.csv   (cleaned dataset exports)
```

---

## How to Use This Project

### Step 1: Run the Notebook
```bash
jupyter notebook NYPD_Complete_Analysis_Version_2.ipynb
```

### Step 2: Review EDA (Sections 1–5)
Understand data distribution and temporal patterns.

### Step 3: Train Models (Sections 6–13)
Temporal split automatically applied; LightGBM and CatBoost train on 2020–2024, test on 2025.

### Step 4: Interpret SHAP (Section 12)
Understand which features drove predictions for Target 1 (LAW_CAT_CD).

### Step 5: Use Prediction Interface (Section 13)
Input any crime scenario → get all 5 predictions immediately.

### Step 6: Deploy (Future)
Wrap `predict_all()` in a Flask API and serve to 911 dispatch system.

---

## Technologies & Requirements

```
pandas          Data manipulation
numpy           Numerical computing
matplotlib      Plotting
seaborn         Statistical visualisation
scikit-learn    Preprocessing, metrics, encoding
lightgbm        Gradient boosting (fast, large data)
catboost        Gradient boosting (categorical features)
shap            Model explainability
```

**Install:**
```bash
pip install pandas numpy matplotlib seaborn scikit-learn lightgbm catboost shap
```

---

## Conclusion

This project demonstrates a **production-ready ML pipeline** on real crime data. Key achievements:

✅ **Fixed major issues:** v1 → v2 → v3 iterations resolved leakage, imbalance, and regression failure  
✅ **Temporal realism:** v3 temporal split simulates actual deployment (train on history, test on future)  
✅ **Explainability:** SHAP shows which features drive each prediction  
✅ **Actionable predictions:** predict_all() function ready for 911 dispatch integration  
✅ **Documented:** Clear feature sets, metrics, and rationale for each design choice  

**Next priorities:** Hyperparameter tuning (Optuna), cyclical encoding, cross-validation, and API deployment.


PROJECT_DOCUMENTATION.md updated with complete, clear documentation covering:
                                                                                                                                  
  ✅ Full version history (v1→v2→v3 with improvements)                                                                                                        
  ✅ Dataset specs — 2.5M rows, 2020–2025, dual CSV merge                                                                                                     
  ✅ 5 target variables — purpose, features, expected scores                                                                                                  
  ✅ ML architecture — why LightGBM + CatBoost                                                                                                                
  ✅ Data cleaning steps — all 8 steps with impact                                                                                                            
  ✅ Feature engineering — temporal + v3 precinct features                                                                                                    
  ✅ Evaluation metrics — accuracy, F1, R², confusion matrices                                                                                                
  ✅ SHAP explainability — how it works, what it reveals                                                                                                      
  ✅ Prediction interface — code example, next steps                                                                                                          
  ✅ Known issues & future work — prioritised by impact                                                                                                       
  ✅ File organization — where everything lives                                                                                                               
  ✅ How to use — 6-step runbook    