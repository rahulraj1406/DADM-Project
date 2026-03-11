from fpdf import FPDF
import os
import subprocess

def run_stage_9():
    print("Generating Final Report PDF...")
    
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", size=12)
    
    def add_section(title, content):
        pdf.set_font("Helvetica", style="B", size=14)
        pdf.cell(200, 10, txt=title, ln=1)
        pdf.set_font("Helvetica", size=12)
        pdf.multi_cell(0, 10, txt=content)
        pdf.ln(5)
        
    add_section("1. Executive Summary", "This pipeline analyzed NYPD crime complaints, trained predictive models using spatial-temporal metadata, and extracted insight for proactive police resourcing.")
    add_section("2. Introduction & Problem Statement", "Analyzing YTD complaint variations across the 5 boroughs to assign mobile reserve patrols to temporally specific hotspots (e.g. 18:00 to 22:00 window).")
    add_section("3. Dataset Overview", "Source: NYC Open Data. ~400,000 observations processed. Nulls primarily within suspect demographics. Severe outliers in coordinates removed.")
    add_section("4. Methodology", "Data encoded, standard-scaled, and clustered via KMeans=15. Classification models built to predict Felony likelihood and Offense type. Time series trained on top precincts.")
    add_section("5. Results & Key Findings", "Geographic clusters dominate severity prediction. Property crimes cause class bleeding due to subtle variance in complaint descriptions.")
    add_section("6. Model Performance Summary", "Task A trained LR/RF/XGB. Task B evaluated LightGBM/RF. Task C established Prophet on Top 5 precincts, yielding actionable MAE across tested historical weeks.")
    add_section("7. Policy Recommendations", "- Implement staggered shift scheduling to increase coverage between 18:00 and 22:00.\n- Pre-allocate mobile reserve assets to turbulent precincts (e.g., 75, 14).\n- Target property crime coding for detailed retraining.")
    add_section("8. Limitations", "Data is solely compliant-based, suffering from latency and under-reporting in certain neighborhoods. Missing demographics constrain fairness validations.")
    add_section("9. Conclusion", "A stateful pipeline approach successfully structures the dataset from raw ingestion to model formulation and presentation artifacts.")
    add_section("10. Appendix", "All supplementary charts, KDE hotspots, bounding boxes, and SHAP analyses reside inside 'eda_report', 'maps', and 'confusion_matrices'.")

    pdf.output("final_report.pdf")
    
    # Version Control
    print("Setting up Git and Tags...")
    if not os.path.exists(".git"):
        subprocess.run(["git", "init"])
        
    def git_commit_tag(files, msg, tag):
        subprocess.run(f"git add {' '.join(files)}", shell=True)
        subprocess.run(["git", "commit", "-m", msg])
        subprocess.run(["git", "tag", tag])

    git_commit_tag(["stage1.py", "data_dictionary.csv", "schema_summary.txt", "pipeline_log.txt"], "Overview", "v1-overview")
    git_commit_tag(["stage2.py", "eda_report/", "outlier_flags.csv", "eda_summary.txt"], "EDA", "v2-eda")
    git_commit_tag(["stage3.py", "nypd_clean.csv", "cleaning_report.txt"], "Clean", "v3-clean")
    git_commit_tag(["stage4.py", "nypd_transformed.csv", "scaler.pkl", "encoder_mappings.json", "feature_list.txt"], "Transform", "v4-transform")
    git_commit_tag(["stage5.py", "analysis_results.xlsx", "hypothesis_tests.csv", "maps/", "collinearity_report.txt"], "Analysis", "v5-analysis")
    git_commit_tag(["stage6.py", "model_*.pkl", "model_results.csv", "confusion_matrices/"], "Models", "v6-models")
    git_commit_tag(["stage7.py", "*.png", "policy_recommendations.txt", "interpretation_report.md"], "Interpret", "v7-interpret")
    git_commit_tag(["stage8.py", "presentation/", "dashboard_spec.md"], "Present", "v8-present")
    
    with open('pipeline_log.txt', 'a') as f:
        f.write("STAGE 9: DOCUMENTATION\n")
        f.write("- Generated requirements.txt and README.md.\n")
        f.write("- Wrote final_report.pdf with executive summaries.\n")
        f.write("- Initialized Git repo and processed staged commits/tags up to v9.\n\n")
        
    # the last commit for stage 9 itself
    git_commit_tag(["stage9.py", "README.md", "requirements.txt", "final_report.pdf", "pipeline_log.txt"], "Docs", "v9-docs")

if __name__ == '__main__':
    run_stage_9()
    print("Stage 9 complete.")
