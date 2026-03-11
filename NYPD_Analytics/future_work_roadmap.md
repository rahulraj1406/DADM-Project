# Future Work Roadmap

## Priority 1: Data Integration
*   **NYC 311 Service Requests:** Enhance the spatial and temporal analysis by integrating 311 noise and civil complaints. Merging on date and borough can act as a leading indicator for quality-of-life offenses.
*   **NOAA Weather Data:** Complaints often correlate significantly with weather patterns. Merging precipitation and temperature data by date and location will improve forecasting models.
*   **ACS Census Data:** Integrate demographic and socioeconomic data per precinct (e.g., median income, housing density) to build a more robust neighborhood profile.

## Priority 2: Advanced Modeling
*   **LSTM / GRU:** Transition from Prophet to structural, deep-learning based time-series forecasting (Long Short-Term Memory networks or Gated Recurrent Units) for modeling complex non-linear temporal dynamics in crime spikes.
*   **Isolation Forest:** Implement anomaly detection to flag highly unusual spikes or drops in complaints that do not align with seasonal or baseline trends.
*   **Causal Inference (DiD):** Use Difference-in-Differences estimations to evaluate the actual impact of policy interventions (like shifting patrol hours).

## Priority 3: Fairness Audit
*   **Demographic Parity Check:** Implement Fairlearn to measure the disparate impact and demographic parity of the Task A (Felony Prediction) model across racial and age demographics.
*   **False Positive Rates:** Scrutinize whether the model falsely identifies severe crimes at higher rates for specific `SUSP_RACE` or `VIC_RACE` cohorts.

## Priority 4: Deployment
*   **FastAPI Endpoint:** Serve the machine learning pipeline via a `POST /predict` endpoint, accepting JSON complaint features and returning risk scores.
*   **Data Pipeline Refresh:** Implement a chron job pulling weekly data via the NYC Open Data Socrata API to continuously fine-tune the models without manual re-running.
*   **Interactive Dashboard:** Deploy the specified Plotly Dash or Streamlit visualization dashboard to Render or Hugging Face Spaces for public/administrative consumption.
