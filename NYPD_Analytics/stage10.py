import pandas as pd
import numpy as np
import pickle

def run_stage_10():
    print("Running Fairness Audit...")
    df = pd.read_csv('nypd_transformed.csv', low_memory=False)
    
    with open('feature_list.txt', 'r') as f:
        features = f.read().splitlines()
        
    df['CMPLNT_FR_DT'] = pd.to_datetime(df['CMPLNT_FR_DT'])
    test_df = df[df['CMPLNT_FR_DT'].dt.month > 9].copy()
    
    X_test = test_df[features].fillna(-1)
    y_test = test_df['IS_FELONY']
    
    with open('model_taskA.pkl', 'rb') as f:
        modelA = pickle.load(f)
        
    preds = modelA.predict(X_test)
    test_df['PRED_FELONY'] = preds
    
    def calculate_fpr(group_col):
        results = []
        for name, group in test_df.groupby(group_col):
            # True Negatives are cases where actual IS_FELONY is 0
            condition_negatives = group[group['IS_FELONY'] == 0]
            if len(condition_negatives) == 0:
                continue
            # False Positives are cases where PRED is 1 but IS_FELONY is 0
            fp = sum(int(p == 1) for p in condition_negatives['PRED_FELONY'])
            fpr = fp / len(condition_negatives)
            results.append({'Group': name, 'Total_Negatives': len(condition_negatives), 'False_Positives': fp, 'FPR': fpr})
            
        return pd.DataFrame(results).sort_values(by='FPR', ascending=False)
        
    fpr_susp = calculate_fpr('SUSP_RACE')
    fpr_vic = calculate_fpr('VIC_RACE')
    
    audit_text = f"""# Fairness Audit Report

## Background
This report evaluates the False Positive Rate (FPR) of the Task A Binary Classifier. 
A False Positive occurs when the model predicts a complaint as a FELONY, but it is actually a MISDEMEANOR or VIOLATION.

## False Positive Rate by Suspect Race (SUSP_RACE)
```text
{fpr_susp.to_string(index=False)}
```

## False Positive Rate by Victim Race (VIC_RACE)
```text
{fpr_vic.to_string(index=False)}
```

## Conclusion
Evaluating these metrics is a critical first step towards identifying disparate impacts. 
Subsequent steps outlined in the Future Work Roadmap (Priority 3) include leveraging Microsoft's `fairlearn` package for strict demographic parity enforcement.
"""
    with open('fairness_audit_report.md', 'w') as f:
        f.write(audit_text.strip() + "\n")
        
    with open('pipeline_log.txt', 'a') as f:
        f.write("STAGE 10: FUTURE WORK & FAIRNESS AUDIT\n")
        f.write("- Generated future_work_roadmap.md detailing advanced modeling, deployment, and data integrations.\n")
        f.write("- Executed basic Fairness Audit on False Positive Rates by race.\n")
        f.write("- Exported fairness_audit_report.md.\n")
        f.write("PIPELINE COMPLETE.\n")

if __name__ == '__main__':
    run_stage_10()
    print("Stage 10 complete.")
