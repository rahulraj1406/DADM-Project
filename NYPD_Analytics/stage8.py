import matplotlib.pyplot as plt
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import matplotlib.image as mpimg
import os

def run_stage_8():
    print("Generating Presentation Slides...")
    os.makedirs('presentation', exist_ok=True)
    
    # helper for drawing text slides
    def create_text_slide(title, content_list, bg_color='white', filename='slide.png'):
        fig, ax = plt.subplots(figsize=(16, 9))
        fig.patch.set_facecolor(bg_color)
        ax.axis('off')
        
        ax.text(0.05, 0.9, title, fontsize=40, fontweight='bold', ha='left', va='top')
        
        y_pos = 0.75
        for item in content_list:
            ax.text(0.05, y_pos, f"• {item}", fontsize=24, ha='left', va='top', wrap=True)
            y_pos -= 0.1
            
        plt.tight_layout()
        plt.savefig(filename, dpi=150)
        plt.close()
        
    def create_image_slide(title, img_path, filename='slide.png'):
        fig, ax = plt.subplots(figsize=(16, 9))
        ax.axis('off')
        ax.text(0.05, 0.9, title, fontsize=40, fontweight='bold', ha='left', va='top')
        
        try:
            img = mpimg.imread(img_path)
            ax.imshow(img, extent=[0.1, 0.9, 0.1, 0.8], aspect='auto')
        except:
            ax.text(0.5, 0.5, f"[Image file {img_path} not found]", fontsize=30, ha='center', va='center', color='red')
            
        plt.tight_layout()
        plt.savefig(filename, dpi=150)
        plt.close()
        
    # Slide 1
    create_text_slide("NYPD Complaint Data Analytics", 
                      ["End-to-End Pipeline Execution", "Exploratory Data Analysis", "Machine Learning & Forecasting", "Policy Recommendations"], 
                      filename='presentation/slide_01.png')
                      
    # Slide 2
    create_text_slide("Dataset Description & Key Stats", 
                      ["Source: NYC Open Data (Current Year-To-Date)", "Domain: Criminal complaints filed with NYPD", "Approx. 400k records analyzed", "Includes spatial, temporal, and categorical dimensions", "Split: Train (Jan-Sep) / Test (Oct-Dec)"], 
                      filename='presentation/slide_02.png')
                      
    # Slide 3
    create_image_slide("EDA: Temporal Volume", 'eda_report/daily_complaints_line.png', filename='presentation/slide_03.png')
    
    # Slide 4
    # we don't have a png for map, but we have html. We will use a text slide or placeholder for map.
    create_text_slide("Geographic Distribution", ["Choropleth rendered as interactive HTML (maps/choropleth_complaints.html)", "KDE Hotspots mapped for complaint density", "Strong concentration of complaints in identified High Crime Precincts"], filename='presentation/slide_04.png')
    
    # Slide 5
    create_image_slide("Top Offenses by Borough", 'eda_report/severity_by_boro_grouped_bar.png', filename='presentation/slide_05.png')
    
    # Slide 6
    create_text_slide("Cleaning & Transformation Summary", 
                      ["Dropped exact CMPLNT_NUM duplicates and out-of-bounds coordinates", "Filled null demographics with 'UNKNOWN'", "OHE applied to CRM_ATPT_CPTD_CD, TIME_OF_DAY", "Frequency encoded OFNS_DESC and PREM_TYP", "Derived HOUR, MONTH, IS_WEEKEND, HIGH_CRIME_PRECINCT"], 
                      filename='presentation/slide_06.png')
                      
    # Slide 7
    create_text_slide("Model Comparison Summary", 
                      ["Task A (IS_FELONY): Logistic Regression vs RF vs XGBoost", "Highest F1_macro selected as best binary classifier", "Task B (OFFENSE_CAT): RF vs LightGBM", "Multi-class precision/recall evaluated with confusion matrices"], 
                      filename='presentation/slide_07.png')
                      
    # Slide 8
    create_image_slide("Task A Feature Importance (SHAP/Linear)", 'feature_importance_chart.png', filename='presentation/slide_08.png')
    
    # Slide 9
    create_image_slide("Task C: Forecasting Top Precincts", 'forecast_interpretation.png', filename='presentation/slide_09.png')
    
    # Slide 10
    create_text_slide("Key Findings", 
                      ["Significant early evening/weekend volume spikes", "Property crimes dominate commercial misclassification errors", "High forecasting volatility in specific precincts (14, 75)", "Geospatial markers strongly dictate felony probability", "Reporting delay correlated heavily with unknown suspect details"], 
                      filename='presentation/slide_10.png')
                      
    # Slide 11
    create_text_slide("Policy Recommendations", 
                      ["Dynamic shift scheduling to cover 18:00 - 22:00 activity", "Granular complaint training for commercial patrol units", "Mobile reserve allocation for volatile precincts", "Geographically focused community intervention rather than demographic", "Campaigns to minimize 311/911 reporting delays"], 
                      filename='presentation/slide_11.png')
                      
    # Slide 12
    create_text_slide("Limitations & Future Work", 
                      ["Limitations: Real-time latency, reliance on categorical accuracy", "Future Priority 1: Integrate 311 and NOAA weather data", "Future Priority 2: Use an LSTM for structural time-series", "Future Priority 3: Demographic fairness audit (Fairlearn)", "Future Priority 4: FastAPI Deployment"], 
                      filename='presentation/slide_12.png')

    print("Generating Dashboard Specification...")
    dashboard_md = """# NYPD Analytics Dashboard Specification (Plotly Dash)

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
"""
    with open('dashboard_spec.md', 'w') as f:
        f.write(dashboard_md)
        
    with open('pipeline_log.txt', 'a') as f:
        f.write("STAGE 8: PRESENTATION OF FINDINGS\n")
        f.write("- Generated 12 presentation slides as PNGs in presentation/.\n")
        f.write("- Drafted dashboard_spec.md for Plotly Dash UI design.\n\n")

if __name__ == '__main__':
    run_stage_8()
    print("Stage 8 complete.")
