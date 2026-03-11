# NYPD Analytics Dashboard Specification (Plotly Dash)

## 1. Global KPI Cards (Header)
- **Total Complaints**: Sum of records within active filters.
- **Felony Rate**: `%` of total complaints classified as FELONY.
- **Top Offense**: Most frequent `OFNS_DESC`.
- **Busiest Precinct**: Precinct ID with the highest volume.

## 2. Global Filters (Sidebar)
- **Borough (BORO_NM)**: Dropdown (Manhattan, Brooklyn, Bronx, Queens, Staten Island).
- **Year/Month**: Date range slider.
- **Offense Category**: Dropdown (Violent, Property, Drug, Quality of Life, Other).
- **Time of Day**: Checkboxes (Morning, Afternoon, Evening, Night).

## 3. Page Structure
### Page 1: Temporal Trends
- Line chart of daily volume.
- Heatmap of Day of Week vs. Hour of Day.
- YoY Monthly Bar Chart.

### Page 2: Geographic Map
- Interactive Folium/Plotly Map showing choropleth of complaint density by precinct.
- Point overlay toggle for specific `IS_FELONY=1` crimes.

### Page 3: Demographic Analysis
- Stacked bar charts for SUSP_AGE_GROUP and VIC_AGE_GROUP.
- Crime severity pie chart broken down by victim demographics.

### Page 4: Model Predictions vs Actuals
- Plotly Prophet Forecast line charts for Top 5 precincts.
- SHAP Waterfall plot component allowing input of a single complaint ID to see the model explanation.
