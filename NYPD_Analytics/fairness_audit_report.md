# Fairness Audit Report

## Background
This report evaluates the False Positive Rate (FPR) of the Task A Binary Classifier. 
A False Positive occurs when the model predicts a complaint as a FELONY, but it is actually a MISDEMEANOR or VIOLATION.

## False Positive Rate by Suspect Race (SUSP_RACE)
```text
                         Group  Total_Negatives  False_Positives  FPR
                        (null)              668                0  0.0
AMERICAN INDIAN/ALASKAN NATIVE               15                0  0.0
      ASIAN / PACIFIC ISLANDER              118                0  0.0
                         BLACK              596                0  0.0
                BLACK HISPANIC              113                0  0.0
                       UNKNOWN             1195                0  0.0
                         WHITE              308                0  0.0
                WHITE HISPANIC              341                0  0.0
```

## False Positive Rate by Victim Race (VIC_RACE)
```text
                         Group  Total_Negatives  False_Positives  FPR
                        (null)                3                0  0.0
AMERICAN INDIAN/ALASKAN NATIVE               16                0  0.0
      ASIAN / PACIFIC ISLANDER              300                0  0.0
                         BLACK              900                0  0.0
                BLACK HISPANIC              153                0  0.0
                       UNKNOWN              694                0  0.0
                         WHITE              678                0  0.0
                WHITE HISPANIC              610                0  0.0
```

## Conclusion
Evaluating these metrics is a critical first step towards identifying disparate impacts. 
Subsequent steps outlined in the Future Work Roadmap (Priority 3) include leveraging Microsoft's `fairlearn` package for strict demographic parity enforcement.
