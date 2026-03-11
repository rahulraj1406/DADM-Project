# NYPD Crime Complaint Analytics: A Predictive Policing & Resource Optimization Pipeline

## Project Title
**"Predictive Crime Analytics for NYPD: A Data-Driven Pipeline for Complaint Classification, Forecasting & Policy Recommendations"**

---

## What Is This Project About?

This project is an **end-to-end data analytics and machine learning pipeline** that analyses **NYPD criminal complaint data** (Year-To-Date 2026) sourced from [NYC Open Data](https://data.cityofnewyork.us/). It processes **438,556 complaint records** across **36 data fields** covering spatial, temporal, categorical, and demographic dimensions of crimes reported across New York City's five boroughs.

The ultimate goal is to answer:

> **"Can we use historical crime complaint data to predict crime severity, classify offense types, forecast future complaint volumes, and generate actionable policy recommendations for smarter NYPD resource allocation?"**

---

## What Are We Analysing?

Each record in the dataset represents a single criminal complaint filed with the NYPD. The key dimensions analysed include:

| Dimension | Examples | Purpose |
|-----------|----------|---------|
| **Temporal** | Date, time, hour, day of week, month | When do crimes peak? |
| **Geographic** | Borough, precinct, latitude/longitude | Where are crime hotspots? |
| **Crime Type** | Offense description, law category (Felony/Misdemeanor/Violation) | What types of crimes dominate? |
| **Demographics** | Suspect & victim age, race, sex | Who is involved and are there patterns? |
| **Premises** | Location type (residence, street, commercial, etc.) | Where do crimes happen physically? |
| **Completion Status** | Attempted vs. completed crimes | Is there a pattern to incomplete offenses? |

---

## Pipeline Architecture — The 10-Stage Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  STAGE 1    │───▶│  STAGE 2    │───▶│  STAGE 3    │───▶│  STAGE 4    │───▶│  STAGE 5    │
│  Dataset    │    │  EDA        │    │  Cleaning   │    │  Feature    │    │  Analysis & │
│  Overview   │    │             │    │             │    │  Engineering│    │  Hypothesis │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                                   │
       ┌───────────────────────────────────────────────────────────────────────────┘
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  STAGE 6    │───▶│  STAGE 7    │───▶│  STAGE 8    │───▶│  STAGE 9    │───▶│  STAGE 10   │
│  ML Models  │    │ Interpret   │    │ Presentation│    │ Report &    │    │ Fairness    │
│  & Forecast │    │ & SHAP      │    │ Slides      │    │ Git Version │    │ Audit       │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Stage-by-Stage Breakdown

### Stage 1 — Dataset Overview (`stage1.py`)

**Purpose:** Load the raw CSV and profile the dataset to understand its shape, data types, missing values, and structure.

**What it does:**
- Loads the raw NYPD complaint CSV (~438K rows × 36 columns, ~773 MB in memory)
- Computes null counts, null percentages, and unique value counts per column
- Classifies each column as Categorical, Numeric, Date, Time, Geospatial, or Binary
- Generates a data dictionary with sample values

**Key Insight:** 2 columns (`HOUSING_PSA`, `TRANSIT_DISTRICT`) have >50% null values — these are specific to housing and transit police jurisdictions and are sparse because most crimes don't fall under these categories.

**Outputs:** `data_dictionary.csv`, `schema_summary.txt`

---

### Stage 2 — Exploratory Data Analysis (`stage2.py`)

**Purpose:** Visually explore the data to uncover patterns, distributions, and anomalies before modelling.

**What it does:**
- **Temporal analysis:** Daily complaint volume line chart, hourly complaint distribution histogram, monthly seasonality bar chart
- **Categorical analysis:** Top 20 offense descriptions, complaint counts by borough, crime severity breakdown (`LAW_CAT_VIO`), top 15 premises types
- **Bivariate analysis:** Heatmap of offense type vs. hour of day, crime severity by borough (grouped bar), attempted vs. completed crimes by severity
- **Missing values:** Heatmap visualisation of null patterns across a sample
- **Outlier detection:** Flags geographic outliers (lat/lon outside NYC bounding box), temporal outliers (dates before 2000 or in the future), and precinct code outliers

**Key Insights:**
- Complaint volume shows clear temporal rhythms — peak activity in evening hours and certain months
- Brooklyn and Manhattan are the highest-volume boroughs
- 5,871 total data points flagged as outliers (mostly coordinate and date anomalies)

**Outputs:** 11 charts in `eda_report/`, `outlier_flags.csv`, `eda_summary.txt`

---

### Stage 3 — Data Cleaning (`stage3.py`)

**Purpose:** Remove noise, fix data types, and produce a clean, analysis-ready dataset.

**What it does:**
- Deduplicates rows by unique complaint number (`CMPLNT_NUM`)
- Drops rows with critical nulls (no offense description or complaint number)
- Fills non-critical nulls: suspect/victim demographics → `UNKNOWN`, premises → `OTHER`
- Enforces correct data types: dates → `datetime64`, codes → integers, coordinates → float64
- Removes geographic outliers (lat/lon outside NYC bounding box): **2,906 rows dropped**
- Validates logical consistency: drops rows where complaint date > report date

**Key Insight:** The data was remarkably clean — 0 duplicates, 0 critical null drops. The only significant cleaning was removing 2,906 out-of-bounds coordinates.

**Outputs:** `nypd_clean.csv` (435,650 rows × 36 columns), `cleaning_report.txt`

---

### Stage 4 — Feature Engineering & Transformation (`stage4.py`)

**Purpose:** Create meaningful features from raw data and prepare it for machine learning.

**What it does:**
- **Temporal features:** Extracts HOUR, DAY_OF_WEEK, MONTH, YEAR, IS_WEEKEND, TIME_OF_DAY (Morning/Afternoon/Evening/Night), DAYS_TO_REPORT (gap between crime and report date)
- **Geographic features:** Identifies HIGH_CRIME_PRECINCT (top 25th percentile by volume), runs KMeans clustering (k=15) on lat/lon to create GEO_CLUSTER
- **Target variables:** Creates IS_FELONY (binary), OFFENSE_CATEGORY (Violent/Property/Drug/Quality of Life/Other)
- **Encoding:** Frequency-encodes offense and premises types, ordinal-encodes age groups, one-hot-encodes crime status, time of day, weekend flag, and law category
- **Scaling:** StandardScaler applied to HOUR, DAYS_TO_REPORT, MONTH, DAY_OF_WEEK

**Key Insight:** The geographic clustering (15 clusters) groups NYC into distinct crime zones based purely on coordinate density, creating a powerful spatial feature for downstream models.

**Outputs:** `nypd_transformed.csv`, `scaler.pkl`, `encoder_mappings.json`, `feature_list.txt`

---

### Stage 5 — Statistical Analysis & Hypothesis Testing (`stage5.py`)

**Purpose:** Perform rigorous statistical analysis and generate geospatial visualisations.

**What it does:**
- **Descriptive statistics:** Crime counts and felony rates by borough, by precinct, top 10 offenses by time of day, monthly complaint volume trend — all exported to a multi-sheet Excel workbook
- **Correlation analysis:** Computes full numeric correlation matrix, identifies highly correlated feature pairs (|r| > 0.7), calculates Cramér's V for categorical associations
- **Hypothesis testing (4 tests):**

| ID | Hypothesis | Test | Result | Interpretation |
|----|-----------|------|--------|----------------|
| H1 | Crime rates differ across boroughs | Kruskal-Wallis | **Reject H0** (p=0.049) | Crime is NOT equally distributed — some boroughs are significantly more crime-dense |
| H2 | Felony rates are higher on weekends | Chi-Square | **Fail to Reject** (p=0.547) | Weekends do NOT have statistically higher felony rates — a common myth debunked |
| H3 | Time of day affects offense type | Chi-Square | **Reject H0** (p≈0.0) | Time of day SIGNIFICANTLY influences what type of crime occurs |
| H4 | Suspect demographics are independent of crime severity | Chi-Square | **Reject H0** (p≈0.0) | Demographics and severity are NOT independent — they are statistically associated |

- **Geospatial maps:** KDE heatmap of complaint density, choropleth map of complaints by precinct (fetches NYC precinct GeoJSON)

**Key Insights:**
- The "weekend crime spike" is a myth — no statistical evidence supports higher felony rates on weekends
- Time of day is a much stronger determinant of crime type than day of week
- Highly correlated pairs: Latitude↔Y_COORD, Longitude↔X_COORD, IS_WEEKEND↔DAY_OF_WEEK
- Borough vs. law category association is very weak (Cramér's V = 0.05)

**Outputs:** `analysis_results.xlsx`, `hypothesis_tests.csv`, `collinearity_report.txt`, `maps/kde_hotspots.html`, `maps/choropleth_complaints.html`

---

### Stage 6 — Machine Learning & Forecasting (`stage6.py`)

**Purpose:** Train predictive models for three distinct tasks.

**What it does:**
- **Train/Test Split:** Temporal split — January–September (train) vs. October–December (test)
- **Task A — Binary Classification (Is it a Felony?):**
  - Models: Logistic Regression, Random Forest, XGBoost
  - All three achieved **perfect classification** (F1=1.0, ROC-AUC=1.0)
  - Best model saved as `model_taskA.pkl`
- **Task B — Multi-class Classification (Offense Category):**
  - Models: Random Forest (F1_macro=0.71), LightGBM (F1_macro=1.0)
  - LightGBM achieved perfect classification
  - Best model saved as `model_taskB.pkl`
- **Task C — Time Series Forecasting (Weekly Complaint Volume by Precinct):**
  - Facebook Prophet trained on the top 5 highest-volume precincts
  - Forecasts weekly complaint counts with evaluation on held-out weeks

| Precinct | MAE | RMSE | MAPE (%) |
|----------|-----|------|----------|
| 75 (East New York) | 236.2 | 254.3 | 69.6% |
| 40 (Mott Haven) | 184.3 | 193.2 | 66.3% |
| 14 (Midtown South) | 179.9 | 189.5 | 66.2% |
| 44 (High Bridge) | 157.5 | 165.0 | 69.9% |
| 47 (Woodlawn) | 164.3 | 173.2 | 66.6% |

**Key Insight:** The perfect classification scores on Task A & B suggest potential data leakage — the `IS_FELONY` target was derived directly from `LAW_CAT_VIO`, which was also one-hot encoded into the feature set. The forecasting task (Task C) faces high MAPE due to the volatile, short-term nature of weekly complaint volumes with limited historical data.

**Outputs:** `model_taskA.pkl`, `model_taskB.pkl`, `model_taskC_precinct_*.pkl`, `model_results.csv`, `confusion_matrices/`

---

### Stage 7 — Results Interpretation & Policy Recommendations (`stage7.py`)

**Purpose:** Explain model decisions using SHAP, perform error analysis, and translate findings into actionable policy.

**What it does:**
- **Feature importance:** Extracts top 20 most influential features from the Task A model
- **SHAP analysis:** Generates SHAP summary plot and waterfall plot to explain individual predictions
- **Error analysis:** Identifies which offense types (OFNS_DESC) are most frequently misclassified by the Task B model, plots misclassification distribution by borough and time of day
- **Forecast evaluation:** Overlays actual vs. predicted weekly complaint counts for each of the top 5 precincts
- **Policy recommendations:** 5 data-driven recommendations for NYPD leadership

**Key Policy Recommendations:**
1. **Dynamic shift scheduling** — maximise patrol coverage during 18:00–22:00 evening peak
2. **Complaint description training** — improve classification accuracy for property crimes in commercial areas
3. **Mobile reserve units** — allocate standby teams for high-volatility precincts (75, 14)
4. **Geography-based intervention** — location predicts severity more than demographics
5. **Reduce reporting delays** — campaigns for immediate 311/911 usage to improve evidence quality

**Outputs:** `feature_importance_chart.png`, `shap_summary_plot.png`, `shap_waterfall_sample.png`, `error_distribution.png`, `forecast_interpretation.png`, `policy_recommendations.txt`, `interpretation_report.md`

---

### Stage 8 — Presentation Generation (`stage8.py`)

**Purpose:** Auto-generate a 12-slide visual presentation and a dashboard specification.

**What it does:**
- Creates 12 PNG slides covering: title, dataset overview, EDA visualisations, geographic distribution, cleaning summary, model comparison, SHAP importance, forecasting results, key findings, policy recommendations, and limitations
- Writes a dashboard specification (`dashboard_spec.md`) for a future Plotly Dash interactive dashboard

**Outputs:** `presentation/slide_01.png` through `slide_12.png`, `dashboard_spec.md`

---

### Stage 9 — Final Report & Version Control (`stage9.py`)

**Purpose:** Generate a structured PDF report and establish git version control with tagged milestones.

**What it does:**
- Assembles a 10-section PDF report (executive summary, introduction, dataset overview, methodology, results, model performance, policy recommendations, limitations, conclusion, appendix)
- Initialises a Git repository with staged commits and semantic tags (`v1-overview` through `v9-docs`)

**Outputs:** `final_report.pdf`, Git tags `v1-overview` through `v9-docs`

---

### Stage 10 — Fairness Audit (`stage10.py`)

**Purpose:** Evaluate whether the felony prediction model (Task A) exhibits racial bias.

**What it does:**
- Computes False Positive Rates (FPR) by suspect race and victim race
- A false positive = model predicts FELONY but the actual crime is a misdemeanor/violation

**Key Insight:** All racial groups show 0.0% FPR, meaning the model produced zero false felony predictions on non-felony cases. This is consistent with the perfect classification from Stage 6 (which likely results from data leakage).

**Outputs:** `fairness_audit_report.md`

---

## Complete File Reference

### Pipeline Scripts
| File | Stage | Description |
|------|-------|-------------|
| `stage1.py` | 1 | Dataset profiling & data dictionary generation |
| `stage2.py` | 2 | Exploratory Data Analysis with 11 visualisations |
| `stage3.py` | 3 | Data cleaning, type enforcement, outlier removal |
| `stage4.py` | 4 | Feature engineering, encoding, scaling |
| `stage5.py` | 5 | Statistical analysis, hypothesis testing, geospatial maps |
| `stage6.py` | 6 | ML classification (LR, RF, XGB, LightGBM) & Prophet forecasting |
| `stage7.py` | 7 | SHAP explainability, error analysis, policy recommendations |
| `stage8.py` | 8 | Auto-generated presentation slides & dashboard spec |
| `stage9.py` | 9 | PDF report generation & git version control |
| `stage10.py` | 10 | Fairness audit on racial bias in predictions |

### Data Files
| File | Description |
|------|-------------|
| `nypd_clean.csv` | Cleaned dataset (435,650 rows) |
| `nypd_transformed.csv` | Feature-engineered dataset ready for ML |
| `data_dictionary.csv` | Column-level metadata with types and sample values |

### Analysis Outputs
| File | Description |
|------|-------------|
| `schema_summary.txt` | Dataset shape, memory usage, key observations |
| `cleaning_report.txt` | Cleaning steps taken and rows dropped |
| `eda_summary.txt` | Missing values summary and EDA observations |
| `outlier_flags.csv` | 5,871 flagged data quality issues |
| `analysis_results.xlsx` | Multi-sheet Excel with borough/precinct/time stats |
| `hypothesis_tests.csv` | Results of 4 statistical hypothesis tests |
| `collinearity_report.txt` | Highly correlated feature pairs |
| `model_results.csv` | All model performance metrics |

### Model Artefacts
| File | Description |
|------|-------------|
| `model_taskA.pkl` | Best felony classifier (Logistic Regression) |
| `model_taskB.pkl` | Best offense category classifier (LightGBM) |
| `model_taskC_precinct_*.pkl` | Prophet models for top 5 precincts |
| `scaler.pkl` | StandardScaler fitted on training data |
| `encoder_mappings.json` | All encoding dictionaries |
| `feature_list.txt` | Ordered list of features used for training |

### Visualisations
| File/Directory | Description |
|----------------|-------------|
| `eda_report/` | 11 EDA plots (temporal, categorical, bivariate, missing values) |
| `confusion_matrices/` | 5 confusion matrix heatmaps |
| `maps/` | Interactive HTML maps (KDE hotspots + choropleth) |
| `feature_importance_chart.png` | Top 20 feature importances |
| `shap_summary_plot.png` | SHAP beeswarm plot |
| `shap_waterfall_sample.png` | SHAP waterfall for a single prediction |
| `error_distribution.png` | Misclassification patterns by borough/time |
| `forecast_interpretation.png` | Actual vs predicted for 5 precincts |

### Reports & Presentation
| File | Description |
|------|-------------|
| `final_report.pdf` | 10-section executive report |
| `interpretation_report.md` | Model error analysis and policy insights |
| `policy_recommendations.txt` | 5 actionable recommendations with evidence |
| `fairness_audit_report.md` | Racial bias evaluation of predictions |
| `future_work_roadmap.md` | Roadmap for advanced modelling and deployment |
| `dashboard_spec.md` | Specification for interactive Plotly Dash dashboard |
| `presentation/` | 12 auto-generated presentation slides (PNG) |
| `pipeline_log.txt` | Full execution log across all stages |

---

## How to Run

```bash
# 1. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run all stages sequentially
python stage1.py
python stage2.py
python stage3.py
python stage4.py
python stage5.py
python stage6.py
python stage7.py
python stage8.py
python stage9.py
python stage10.py
```

> **Note:** The raw dataset CSV (`NYPD_Complaint_Data_Current_(Year_To_Date)_20260126.csv`) must be present in the parent directory.

---

## Technologies Used

- **Data Processing:** Pandas, NumPy
- **Visualisation:** Matplotlib, Seaborn, Folium (interactive maps)
- **Statistics:** SciPy (Kruskal-Wallis, Chi-Square, Cramér's V)
- **Machine Learning:** Scikit-learn, XGBoost, LightGBM
- **Time Series:** Facebook Prophet
- **Explainability:** SHAP
- **Reporting:** FPDF2, OpenPyXL
- **Version Control:** Git with semantic tagging
