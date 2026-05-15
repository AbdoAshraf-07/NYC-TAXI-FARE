
# 🚖 NYC Taxi Trip Duration & Fare Prediction: End-to-End Spark ML Pipeline

![Apache Spark](https://img.shields.io/badge/Apache%20Spark-F16D99?style=for-the-badge&logo=apachespark&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-1798e3?style=for-the-badge&logo=xgboost&logoColor=white)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-FF6F00?style=for-the-badge&logo=scikitlearn&logoColor=white)

##  Project Overview
Handling millions of records requires more than just standard libraries; it demands a robust Big Data approach. This project implements a **Full Machine Learning Pipeline** using **Apache Spark** to analyze and predict metrics (specifically Fare Amount) from the massive NYC Taxi dataset. 

We built a scalable end-to-end pipeline that covers everything from data ingestion and distributed preprocessing to model training and evaluation using three powerful machine learning algorithms.

##  Pipeline Architecture
1. **Data Ingestion:** Loading large-scale NYC Taxi Data using PySpark DataFrames.
2. **Data Preprocessing & Cleaning:** Handling missing values, filtering outliers, and parsing timestamps.
3. **Feature Engineering:** Extracting temporal and spatial features.
4. **Model Training:** Distributed training for baseline and ensemble models.
5. **Evaluation:** Comparing models based on performance metrics.

##  Models Implemented &  Performance
We trained and evaluated three different models. Based on our evaluation, **Random Forest Regressor** achieved the best performance with the lowest RMSE and highest R² score.

| Model | RMSE | R² Score | MAE |
|-------|------|----------|-----|
| **Random Forest** | **2.3523** | **0.9491** | **0.8645** |
| **XGBoost Regressor** | 3.1251 | - | - |
| **Linear Regression** | 3.1509 | 0.9088 | - |

*(Note: The XGBoost model was exported and saved successfully as `nyc_taxi_model_victus.json` for future inference).*

##  Quick Look at Predictions

### 1. Random Forest Predictions
| Real Fare ($) | Predicted Fare ($) |
|---------------|--------------------|
| 2.5           | 6.01               |
| 3.0           | 5.81               |
| 52.0          | 40.84              |

### 2. XGBoost Predictions
| Real Fare ($) | Predicted Fare ($) |
|---------------|--------------------|
| 34.0          | 21.00              |
| 13.5          | 12.57              |
| 34.0          | 35.68              |
| 12.5          | 14.67              |
| 8.5           | 6.18               |

### 3. Linear Regression Predictions
| Trip Distance | Real Fare ($) | Predicted Fare ($) |
|---------------|---------------|--------------------|
| 3.7           | 14.0          | 14.59              |
| 4.9           | 19.0          | 17.88              |
| 15.4          | 41.5          | 46.83              |
| 1.2           | 6.5           | 7.70               |
| 8.7           | 25.0          | 28.35              |

##  How to Run the Pipeline
1. Clone the repository:
   ```bash
   git clone [https://github.com/YourUsername/nyc-taxi-spark-pipeline.git](https://github.com/YourUsername/nyc-taxi-spark-pipeline.git)
   cd nyc-taxi-spark-pipeline
