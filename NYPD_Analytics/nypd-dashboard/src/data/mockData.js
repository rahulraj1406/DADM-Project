// Mock data derived from real pipeline outputs

export const datasetStats = {
    totalRecords: 438556,
    cleanedRecords: 435650,
    columns: 36,
    engineeredFeatures: 20,
    boroughs: 5,
    pipelineStages: 10,
    memoryUsageMB: 772.96,
    offenseTypes: 57,
    precincts: 78,
};

export const boroughCrimeCounts = [
    { name: 'Brooklyn', count: 121534, felonyRate: 0.31 },
    { name: 'Manhattan', count: 98723, felonyRate: 0.34 },
    { name: 'Bronx', count: 89456, felonyRate: 0.33 },
    { name: 'Queens', count: 87234, felonyRate: 0.28 },
    { name: 'Staten Island', count: 18703, felonyRate: 0.26 },
];

export const hourlyDistribution = [
    { hour: '12 AM', count: 14230 }, { hour: '1 AM', count: 11890 },
    { hour: '2 AM', count: 9450 }, { hour: '3 AM', count: 7230 },
    { hour: '4 AM', count: 5890 }, { hour: '5 AM', count: 5120 },
    { hour: '6 AM', count: 7340 }, { hour: '7 AM', count: 10560 },
    { hour: '8 AM', count: 15670 }, { hour: '9 AM', count: 18920 },
    { hour: '10 AM', count: 20340 }, { hour: '11 AM', count: 21890 },
    { hour: '12 PM', count: 24560 }, { hour: '1 PM', count: 23780 },
    { hour: '2 PM', count: 24120 }, { hour: '3 PM', count: 25340 },
    { hour: '4 PM', count: 26780 }, { hour: '5 PM', count: 27890 },
    { hour: '6 PM', count: 28340 }, { hour: '7 PM', count: 26780 },
    { hour: '8 PM', count: 24560 }, { hour: '9 PM', count: 22340 },
    { hour: '10 PM', count: 19870 }, { hour: '11 PM', count: 17230 },
];

export const monthlyTrends = [
    { month: 'Jan', count: 32450 }, { month: 'Feb', count: 29870 },
    { month: 'Mar', count: 34560 }, { month: 'Apr', count: 36780 },
    { month: 'May', count: 39450 }, { month: 'Jun', count: 42340 },
    { month: 'Jul', count: 45670 }, { month: 'Aug', count: 44890 },
    { month: 'Sep', count: 41230 }, { month: 'Oct', count: 38560 },
    { month: 'Nov', count: 33450 }, { month: 'Dec', count: 30890 },
];

export const topOffenses = [
    { name: 'PETIT LARCENY', count: 62340 },
    { name: 'HARASSMENT 2', count: 48920 },
    { name: 'ASSAULT 3 & REL.', count: 42560 },
    { name: 'CRIMINAL MISCHIEF', count: 28340 },
    { name: 'GRAND LARCENY', count: 27890 },
    { name: 'FELONY ASSAULT', count: 21340 },
    { name: 'DANGEROUS DRUGS', count: 18920 },
    { name: 'ROBBERY', count: 15670 },
    { name: 'BURGLARY', count: 14230 },
    { name: 'OFF. AGNST PUB ORD', count: 12890 },
    { name: 'FRAUD', count: 11560 },
    { name: 'FORGERY', count: 9870 },
    { name: 'SEX CRIMES', count: 8340 },
    { name: 'INTOXICATED/IMPAIRED', count: 7890 },
    { name: 'THEFT-FRAUD', count: 7230 },
];

export const severityByBorough = [
    { borough: 'Brooklyn', FELONY: 37675, MISDEMEANOR: 60767, VIOLATION: 23092 },
    { borough: 'Manhattan', FELONY: 33566, MISDEMEANOR: 44426, VIOLATION: 20731 },
    { borough: 'Bronx', FELONY: 29520, MISDEMEANOR: 40426, VIOLATION: 19510 },
    { borough: 'Queens', FELONY: 24425, MISDEMEANOR: 43617, VIOLATION: 19192 },
    { borough: 'Staten Island', FELONY: 4863, MISDEMEANOR: 9351, VIOLATION: 4489 },
];

export const dayOfWeekData = [
    { day: 'Monday', count: 64230 },
    { day: 'Tuesday', count: 63890 },
    { day: 'Wednesday', count: 64120 },
    { day: 'Thursday', count: 63450 },
    { day: 'Friday', count: 65780 },
    { day: 'Saturday', count: 59450 },
    { day: 'Sunday', count: 57630 },
];

export const dataDictionary = [
    { field: 'CMPLNT_NUM', dtype: 'Categorical', nullPct: 0.0, unique: 438556, sample: "['303250435', '309137838']" },
    { field: 'ADDR_PCT_CD', dtype: 'Numeric', nullPct: 0.0, unique: 78, sample: '[13, 14, 81]' },
    { field: 'BORO_NM', dtype: 'Categorical', nullPct: 0.0, unique: 6, sample: "['MANHATTAN', 'BROOKLYN', 'BRONX']" },
    { field: 'CMPLNT_FR_DT', dtype: 'Date', nullPct: 0.0, unique: 1804, sample: "['03/20/2025', '07/05/2025']" },
    { field: 'CMPLNT_FR_TM', dtype: 'Time', nullPct: 0.0, unique: 1440, sample: "['00:30:00', '18:00:00']" },
    { field: 'CMPLNT_TO_DT', dtype: 'Date', nullPct: 4.64, unique: 1279, sample: "['07/05/2025', '01/02/2025']" },
    { field: 'CRM_ATPT_CPTD_CD', dtype: 'Binary', nullPct: 0.0, unique: 2, sample: "['COMPLETED', 'ATTEMPTED']" },
    { field: 'HOUSING_PSA', dtype: 'Numeric', nullPct: 93.8, unique: 347, sample: '[1287, 1293]' },
    { field: 'KY_CD', dtype: 'Numeric', nullPct: 0.0, unique: 68, sample: '[104, 344, 109]' },
    { field: 'LAW_CAT_CD', dtype: 'Categorical', nullPct: 0.0, unique: 3, sample: "['FELONY', 'MISDEMEANOR', 'VIOLATION']" },
    { field: 'OFNS_DESC', dtype: 'Categorical', nullPct: 0.0, unique: 57, sample: "['RAPE', 'ASSAULT 3', 'GRAND LARCENY']" },
    { field: 'PREM_TYP_DESC', dtype: 'Categorical', nullPct: 0.0, unique: 83, sample: "['HOSPITAL', 'STREET', 'RESIDENCE-HOUSE']" },
    { field: 'RPT_DT', dtype: 'Date', nullPct: 0.0, unique: 273, sample: "['03/20/2025', '07/05/2025']" },
    { field: 'SUSP_AGE_GROUP', dtype: 'Categorical', nullPct: 0.0, unique: 29, sample: "['UNKNOWN', '18-24', '<18']" },
    { field: 'SUSP_RACE', dtype: 'Categorical', nullPct: 0.0, unique: 8, sample: "['BLACK', 'WHITE', 'UNKNOWN']" },
    { field: 'VIC_AGE_GROUP', dtype: 'Categorical', nullPct: 0.0, unique: 21, sample: "['25-44', '18-24', 'UNKNOWN']" },
    { field: 'VIC_RACE', dtype: 'Categorical', nullPct: 0.0, unique: 8, sample: "['WHITE', 'BLACK', 'UNKNOWN']" },
    { field: 'Latitude', dtype: 'Geospatial', nullPct: 0.0, unique: 68236, sample: '[40.737, 40.689]' },
    { field: 'Longitude', dtype: 'Geospatial', nullPct: 0.0, unique: 68701, sample: '[-73.983, -73.924]' },
    { field: 'TRANSIT_DISTRICT', dtype: 'Numeric', nullPct: 94.01, unique: 12, sample: '[34, 2, 1]' },
];

export const cleaningSteps = [
    {
        step: 'Duplicate Removal',
        icon: '🔄',
        description: 'Removed duplicate rows based on CMPLNT_NUM (unique complaint identifier)',
        before: '438,556 rows',
        after: '438,556 rows (0 duplicates found)',
        rowsAffected: 0,
    },
    {
        step: 'Critical Null Handling',
        icon: '🚫',
        description: 'Dropped rows missing critical fields: OFNS_DESC, CMPLNT_NUM',
        before: '438,556 rows',
        after: '438,556 rows (0 critical nulls)',
        rowsAffected: 0,
    },
    {
        step: 'Non-Critical Null Filling',
        icon: '📝',
        description: 'Filled SUSP_AGE_GROUP, SUSP_RACE, SUSP_SEX, VIC_AGE_GROUP, VIC_RACE, VIC_SEX with "UNKNOWN"; PREM_TYP_DESC with "OTHER"',
        before: 'Multiple null fields',
        after: 'All fields populated',
        rowsAffected: 0,
    },
    {
        step: 'Coordinate Outlier Removal',
        icon: '📍',
        description: 'Removed rows with Lat/Long outside NYC bounding box (Lat: 40.4–40.95, Lon: -74.3 to -73.7)',
        before: '438,556 rows',
        after: '435,650 rows',
        rowsAffected: 2906,
    },
    {
        step: 'Date Logic Check',
        icon: '📅',
        description: 'Removed rows where complaint date was after report date (CMPLNT_FR_DT > RPT_DT)',
        before: '435,650 rows',
        after: '435,650 rows (0 date logic errors)',
        rowsAffected: 0,
    },
    {
        step: 'Type Corrections',
        icon: '🔧',
        description: 'Converted CMPLNT_FR_DT, CMPLNT_TO_DT, RPT_DT to datetime. Ensured ADDR_PCT_CD, KY_CD, PD_CD as integer. Latitude/Longitude as float64.',
        before: 'Mixed dtypes',
        after: 'Proper datetime, int, float types',
        rowsAffected: 0,
    },
];

export const engineeredFeatures = [
    { category: 'Temporal', features: ['HOUR', 'DAY_OF_WEEK', 'MONTH', 'IS_WEEKEND', 'TIME_OF_DAY'], color: '#3b82f6', description: 'Extracted temporal dimensions from complaint timestamps' },
    { category: 'Derived', features: ['DAYS_TO_REPORT'], color: '#8b5cf6', description: 'Computed reporting delay as RPT_DT minus CMPLNT_FR_DT in days' },
    { category: 'Geographic', features: ['HIGH_CRIME_PRECINCT', 'GEO_CLUSTER'], color: '#06b6d4', description: 'Flagged top-quartile precincts; KMeans(k=15) geo-clustering' },
    { category: 'Encoded', features: ['OFNS_DESC_FREQ', 'PREM_TYP_DESC_FREQ', 'SUSP_AGE_GROUP_ORD', 'VIC_AGE_GROUP_ORD'], color: '#10b981', description: 'Frequency encoding for categorical; ordinal mapping for age groups' },
    { category: 'One-Hot', features: ['LAW_CAT_VIO_*', 'CRM_ATPT_CPTD_CD_*', 'TIME_OF_DAY_*'], color: '#f59e0b', description: 'Binary indicator columns for categorical variables via one-hot encoding' },
];

export const modelResults = [
    { task: 'Task A', model: 'Logistic Regression', accuracy: 1.0, precision: 1.0, recall: 1.0, f1: 1.0, rocAuc: 1.0, type: 'Binary Classification' },
    { task: 'Task A', model: 'Random Forest', accuracy: 1.0, precision: 1.0, recall: 1.0, f1: 1.0, rocAuc: 1.0, type: 'Binary Classification' },
    { task: 'Task A', model: 'XGBoost', accuracy: 1.0, precision: 1.0, recall: 1.0, f1: 1.0, rocAuc: 1.0, type: 'Binary Classification' },
    { task: 'Task B', model: 'Random Forest', accuracy: 0.95, precision: null, recall: null, f1: 0.708, rocAuc: null, type: 'Multi-class Classification' },
    { task: 'Task B', model: 'LightGBM', accuracy: 1.0, precision: null, recall: null, f1: 1.0, rocAuc: null, type: 'Multi-class Classification' },
];

export const forecastResults = [
    { precinct: 75, mae: 236.2, rmse: 254.3, mape: 69.6 },
    { precinct: 40, mae: 184.3, rmse: 193.2, mape: 66.3 },
    { precinct: 14, mae: 179.9, rmse: 189.5, mape: 66.2 },
    { precinct: 44, mae: 157.5, rmse: 165.0, mape: 69.9 },
    { precinct: 47, mae: 164.3, rmse: 173.2, mape: 66.6 },
];

export const confusionMatrixData = {
    taskA: { tp: 1289, fp: 0, fn: 0, tn: 3354 },
    taskB: {
        categories: ['VIOLENT', 'PROPERTY', 'DRUG', 'QOL', 'OTHER'],
        matrix: [
            [1200, 15, 5, 3, 12],
            [8, 980, 2, 10, 15],
            [3, 5, 450, 8, 4],
            [2, 12, 6, 320, 8],
            [10, 18, 3, 5, 550],
        ],
    },
};

export const shapFeatureImportance = [
    { feature: 'HIGH_CRIME_PRECINCT', importance: 0.342 },
    { feature: 'OFNS_DESC_FREQ', importance: 0.287 },
    { feature: 'HOUR', importance: 0.198 },
    { feature: 'GEO_CLUSTER', importance: 0.176 },
    { feature: 'PREM_TYP_DESC_FREQ', importance: 0.154 },
    { feature: 'DAYS_TO_REPORT', importance: 0.132 },
    { feature: 'MONTH', importance: 0.098 },
    { feature: 'VIC_AGE_GROUP_ORD', importance: 0.087 },
    { feature: 'IS_WEEKEND', importance: 0.076 },
    { feature: 'SUSP_AGE_GROUP_ORD', importance: 0.065 },
    { feature: 'DAY_OF_WEEK', importance: 0.054 },
    { feature: 'TIME_OF_DAY_EVENING', importance: 0.043 },
];

export const hypothesisTests = [
    { id: 'H1', hypothesis: 'Crime rates differ across boroughs', test: 'Kruskal-Wallis', statistic: 11.09, pValue: 0.0496, conclusion: 'Reject H0', significant: true },
    { id: 'H2', hypothesis: 'Felony rates are higher on weekends', test: 'Chi-Square', statistic: 0.363, pValue: 0.547, conclusion: 'Fail to Reject', significant: false },
    { id: 'H3', hypothesis: 'Time of day affects offense type', test: 'Chi-Square', statistic: 6437.4, pValue: 0.0, conclusion: 'Reject H0', significant: true },
    { id: 'H4', hypothesis: 'Suspect demographics independent of severity', test: 'Chi-Square', statistic: 4098.6, pValue: 0.0, conclusion: 'Reject H0', significant: true },
];

export const policyRecommendations = [
    {
        finding: 'Crime volume significantly peaks during early evening and weekends.',
        implication: 'Standard uniform patrol distributions do not optimally align with temporal risk spikes.',
        recommendation: 'Shift to dynamic scheduling, staggering shifts to maximize patrol presence between 18:00 and 22:00.',
        icon: '⏰',
        color: '#3b82f6',
    },
    {
        finding: 'Property crimes constitute the majority of misclassifications in commercial areas.',
        implication: 'Subtle distinctions between trespassing, shoplifting, and minor larceny blur without contextual patrol knowledge.',
        recommendation: 'Train officers in commercial hubs to utilize more granular complaint descriptions.',
        icon: '🏪',
        color: '#8b5cf6',
    },
    {
        finding: 'Precincts 14 and 75 show high volatility (MAPE > 20%) in weekly complaints.',
        implication: 'Reactive resource planning in these precincts consistently lags behind actual spikes.',
        recommendation: 'Establish a mobile reserve unit allocated to handle spillover in anomalous precincts.',
        icon: '🚔',
        color: '#06b6d4',
    },
    {
        finding: 'High Crime Precinct features rank extremely high in felony prediction (SHAP).',
        implication: 'Location is a stronger predictor of crime severity than demographic or temporal attributes.',
        recommendation: 'Concentrate community-based intervention programs geographically rather than demographically.',
        icon: '📍',
        color: '#10b981',
    },
    {
        finding: 'Null suspect characteristics correlate strongly with reporting delay.',
        implication: 'Evidence quality and suspect identification diminish rapidly with delayed reporting.',
        recommendation: 'Implement community campaigns encouraging immediate 311/911 utilization and digital reporting.',
        icon: '📱',
        color: '#f59e0b',
    },
];

export const futureWorkItems = [
    {
        priority: 1,
        title: 'Data Integration',
        items: ['NYC 311 Service Requests', 'NOAA Weather Data', 'ACS Census Data'],
        color: '#3b82f6',
        description: 'Enhance analysis by integrating 311 complaints, weather patterns, and socioeconomic data per precinct.',
    },
    {
        priority: 2,
        title: 'Advanced Modeling',
        items: ['LSTM / GRU Networks', 'Isolation Forest Anomaly Detection', 'Causal Inference (DiD)'],
        color: '#8b5cf6',
        description: 'Transition to deep learning forecasting, anomaly detection, and policy impact evaluation.',
    },
    {
        priority: 3,
        title: 'Fairness Audit',
        items: ['Demographic Parity Check', 'False Positive Rate Analysis', 'Fairlearn Integration'],
        color: '#ec4899',
        description: 'Measure disparate impact and enforce demographic parity in felony prediction models.',
    },
    {
        priority: 4,
        title: 'Deployment',
        items: ['FastAPI Endpoint', 'Automated Data Refresh', 'Interactive Dashboard'],
        color: '#10b981',
        description: 'Serve ML pipeline via API, automate weekly data pulls, and deploy public dashboard.',
    },
];

export const pipelineStages = [
    { id: 1, title: 'Dataset Overview', description: 'Loaded 438,556 records with 36 columns from NYC Open Data. Generated data dictionary and schema summary. Identified 2 columns with >50% missing values.', icon: '📊', color: '#3b82f6' },
    { id: 2, title: 'Exploratory Data Analysis', description: 'Generated temporal, categorical, and bivariate plots. Created missing value heatmap and flagged 5,871 outlier points based on geographic and temporal thresholds.', icon: '🔍', color: '#06b6d4' },
    { id: 3, title: 'Data Cleaning', description: 'Removed duplicates, handled critical/non-critical nulls, corrected data types, removed 2,906 out-of-bounds coordinate rows. Final: 435,650 clean rows.', icon: '🧹', color: '#8b5cf6' },
    { id: 4, title: 'Feature Engineering', description: 'Extracted HOUR, DAY_OF_WEEK, IS_WEEKEND, TIME_OF_DAY. Created HIGH_CRIME_PRECINCT flag, GEO_CLUSTER (KMeans=15). Applied frequency, ordinal, and one-hot encoding.', icon: '⚙️', color: '#10b981' },
    { id: 5, title: 'Data Analysis', description: 'Computed descriptive stats by borough and precinct. Ran Kruskal-Wallis and Chi-Square hypothesis tests (H1–H4). Generated interactive geospatial heatmaps.', icon: '📈', color: '#f59e0b' },
    { id: 6, title: 'Data Modeling', description: 'Task A: Binary felony classification (LR, RF, XGBoost). Task B: Multi-class offense categorization (RF, LightGBM). Task C: Prophet weekly forecasting for top 5 precincts.', icon: '🤖', color: '#ef4444' },
    { id: 7, title: 'Results Interpretation', description: 'Generated SHAP explanations and feature importances. Conducted error analysis on multi-class model. Drafted data-driven policy recommendations.', icon: '💡', color: '#ec4899' },
    { id: 8, title: 'Presentation', description: 'Generated 12 presentation slides as PNGs. Created a dashboard specification for deployment (Plotly Dash / Streamlit).', icon: '🎯', color: '#a855f7' },
    { id: 9, title: 'Documentation', description: 'Wrote final_report.pdf, README.md, requirements.txt. Initialized Git repository with staged version commits and tags (v1–v9).', icon: '📄', color: '#14b8a6' },
    { id: 10, title: 'Future Work & Fairness', description: 'Generated future work roadmap. Ran fairness audit on False Positive Rates by suspect and victim race. All FPR = 0.0 across groups.', icon: '🔮', color: '#6366f1' },
];

export const keyInsights = [
    { title: 'Peak Crime Hours', value: '3 PM – 7 PM', description: 'Crime volume peaks between 3 PM and 7 PM, with the highest concentration at 6 PM (28,340 complaints).', icon: '🕕', color: '#3b82f6' },
    { title: 'Brooklyn Leads', value: '121,534', description: 'Brooklyn has the highest complaint volume across all boroughs, followed by Manhattan (98,723) and Bronx (89,456).', icon: '🏙️', color: '#8b5cf6' },
    { title: 'Summer Spike', value: 'Jul Peak', description: 'July shows the highest monthly crime volume (45,670 complaints), indicating strong summer seasonality.', icon: '☀️', color: '#f59e0b' },
    { title: 'Precinct Hotspots', value: 'Pct 75, 40, 14', description: 'Precincts 75 (East New York), 40 (South Bronx), and 14 (Midtown South) are the top complaint generators.', icon: '🔥', color: '#ef4444' },
    { title: 'Geography > Demographics', value: 'SHAP #1', description: 'HIGH_CRIME_PRECINCT is the #1 SHAP feature in felony prediction, confirming location is the strongest severity predictor.', icon: '📍', color: '#10b981' },
    { title: 'Reporting Delay', value: 'Correlated', description: 'Null suspect characteristics correlate with DAYS_TO_REPORT, suggesting delayed reporting leads to lower evidence quality.', icon: '⏳', color: '#06b6d4' },
];

// Sample coordinates for the crime map
export const sampleCrimeLocations = [
    { lat: 40.6782, lng: -73.9442, borough: 'Brooklyn', type: 'FELONY', count: 45 },
    { lat: 40.6501, lng: -73.9496, borough: 'Brooklyn', type: 'MISDEMEANOR', count: 38 },
    { lat: 40.7128, lng: -74.006, borough: 'Manhattan', type: 'FELONY', count: 52 },
    { lat: 40.758, lng: -73.9855, borough: 'Manhattan', type: 'MISDEMEANOR', count: 67 },
    { lat: 40.7831, lng: -73.9712, borough: 'Manhattan', type: 'FELONY', count: 34 },
    { lat: 40.8448, lng: -73.8648, borough: 'Bronx', type: 'FELONY', count: 41 },
    { lat: 40.8176, lng: -73.9209, borough: 'Bronx', type: 'MISDEMEANOR', count: 55 },
    { lat: 40.7282, lng: -73.7949, borough: 'Queens', type: 'MISDEMEANOR', count: 29 },
    { lat: 40.6892, lng: -73.8186, borough: 'Queens', type: 'FELONY', count: 31 },
    { lat: 40.5795, lng: -74.1502, borough: 'Staten Island', type: 'VIOLATION', count: 12 },
    { lat: 40.6413, lng: -74.0766, borough: 'Staten Island', type: 'MISDEMEANOR', count: 8 },
    // More scattered points
    { lat: 40.6944, lng: -73.9213, borough: 'Brooklyn', type: 'VIOLATION', count: 22 },
    { lat: 40.6215, lng: -73.9605, borough: 'Brooklyn', type: 'FELONY', count: 33 },
    { lat: 40.7484, lng: -73.9856, borough: 'Manhattan', type: 'VIOLATION', count: 19 },
    { lat: 40.7199, lng: -73.9972, borough: 'Manhattan', type: 'FELONY', count: 44 },
    { lat: 40.8565, lng: -73.8717, borough: 'Bronx', type: 'VIOLATION', count: 17 },
    { lat: 40.8296, lng: -73.9262, borough: 'Bronx', type: 'FELONY', count: 49 },
    { lat: 40.7081, lng: -73.8573, borough: 'Queens', type: 'FELONY', count: 26 },
    { lat: 40.7505, lng: -73.7183, borough: 'Queens', type: 'VIOLATION', count: 14 },
    { lat: 40.6021, lng: -74.0676, borough: 'Brooklyn', type: 'FELONY', count: 30 },
    { lat: 40.7614, lng: -73.9776, borough: 'Manhattan', type: 'MISDEMEANOR', count: 58 },
    { lat: 40.7305, lng: -73.9091, borough: 'Brooklyn', type: 'MISDEMEANOR', count: 42 },
    { lat: 40.8116, lng: -73.9465, borough: 'Bronx', type: 'MISDEMEANOR', count: 37 },
    { lat: 40.6655, lng: -73.8918, borough: 'Brooklyn', type: 'FELONY', count: 51 },
    { lat: 40.7681, lng: -73.9636, borough: 'Manhattan', type: 'FELONY', count: 39 },
];

export const precinctData = [
    { id: 75, name: 'East New York', lat: 40.6655, lng: -73.8918, complaints: 12450, felonyRate: 0.38 },
    { id: 40, name: 'South Bronx (Mott Haven)', lat: 40.8116, lng: -73.9209, complaints: 11230, felonyRate: 0.36 },
    { id: 14, name: 'Midtown South', lat: 40.7484, lng: -73.9856, complaints: 10890, felonyRate: 0.34 },
    { id: 44, name: 'Highbridge / Concourse', lat: 40.8296, lng: -73.9262, complaints: 9870, felonyRate: 0.35 },
    { id: 47, name: 'Morrisania / Crotona', lat: 40.8448, lng: -73.8717, complaints: 9560, felonyRate: 0.37 },
    { id: 73, name: 'Brownsville', lat: 40.6621, lng: -73.9125, complaints: 8920, felonyRate: 0.35 },
    { id: 67, name: 'East Flatbush', lat: 40.6501, lng: -73.9496, complaints: 8450, felonyRate: 0.32 },
    { id: 46, name: 'University Heights', lat: 40.8565, lng: -73.9135, complaints: 7890, felonyRate: 0.33 },
    { id: 19, name: 'Upper East Side', lat: 40.7731, lng: -73.9563, complaints: 7230, felonyRate: 0.29 },
    { id: 1, name: 'Financial District', lat: 40.7081, lng: -74.0143, complaints: 6890, felonyRate: 0.31 },
];
