# backend/ml_model.py

import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

RISK_MAP = {"low": 1, "medium": 2, "high": 3}

def load_data(csv_path):
    # Loads CSV data from the specified path and returns as DataFrame.
    df = pd.read_csv(csv_path)
    return df

def preprocess_and_predict(df):
    # Preprocesses the data, imputes missing values, standardizes, clusters, and predicts risk.
    non_hazard_cols = [
        "NCR", "place", "cluster", "predicted_risk",
        "lat", "lon", "recommendation"
    ]
    hazard_cols = [c for c in df.columns if c not in non_hazard_cols]
    
    # Map risk levels to numbers for clustering
    df_num = df.copy()
    for col in hazard_cols:
        df_num[col] = df[col].map(RISK_MAP)
    df_num = df_num.drop(columns=non_hazard_cols, errors='ignore')
    
    # Impute missing values with most frequent
    imputer = SimpleImputer(strategy="most_frequent")
    df_num[hazard_cols] = imputer.fit_transform(df_num[hazard_cols])
    
    # Standardize features
    scaler = StandardScaler()
    X = scaler.fit_transform(df_num[hazard_cols])
    
    # Cluster into 3 risk groups
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X)
    df["cluster"] = clusters
    
    # Assign readable risk labels to clusters
    cluster_means = df_num.groupby(clusters)[hazard_cols].mean().mean(axis=1).sort_values()
    risk_levels = {c: label for c, label in zip(cluster_means.index, ["low", "medium", "high"])}
    df["predicted_risk"] = df["cluster"].map(risk_levels)
    
    # Generate recommendations based on risk
    df["recommendation"] = df["predicted_risk"].apply(get_recommendation)
    return df

def get_recommendation(risk):
    # Returns recommendation string based on risk level.
    if risk == "low":
        return "Stay alert, monitor weather updates."
    elif risk == "medium":
        return "Prepare emergency kit and evacuation plan."
    else:
        return "Follow LGU evacuation orders immediately."

def get_high_risk_places(df):
    # Returns list of NCR locations that are at high risk.
    return df[df["predicted_risk"] == "high"]["NCR"].tolist()

def get_summary_table(df):
    # Returns a summary DataFrame showing risk levels and corresponding locations.
    return df.groupby("predicted_risk")["NCR"].apply(lambda x: ", ".join(x)).reset_index()

def filter_by_city(df, city_name):
    # Filters DataFrame by city name (case-insensitive).
    # Assumes 'NCR' column holds the city/municipality name.
    return df[df['NCR'].str.lower() == city_name.lower()]

def filter_by_hazard(df, hazard):
    # Returns only 'NCR' and the specified hazard column if present.
    hazard = hazard.strip()
    columns = [col for col in df.columns]
    if hazard not in columns:
        # Return empty DataFrame if hazard not found
        return df.iloc[0:0]
    return df[['NCR', hazard]]

def export_to_excel(df, filename='risk_report.xlsx'):
    # Exports DataFrame to Excel file.
    # If only 'NCR' and one hazard column, exports those; else exports summary columns.
    cols = list(df.columns)
    if len(cols) == 2 and cols[0] == 'NCR':
        export_df = df.copy()
        export_df.columns = ["NCR Location", "Hazard Risk Level"]
    else:
        export_df = df[["NCR", "predicted_risk", "recommendation"]]
        export_df.columns = ["NCR Location", "Predicted Future Risk", "Recommendation"]
    export_df.to_excel(filename, index=False)
    return filename

def export_to_pdf(df, filename='risk_report.pdf'):
    # Exports DataFrame to PDF file using fpdf.
    # Formats output based on columns present.
    from fpdf import FPDF
    cols = list(df.columns)
    if len(cols) == 2 and cols[0] == 'NCR':
        export_df = df.copy()
        export_df.columns = ["NCR Location", "Hazard Risk Level"]
    else:
        export_df = df[["NCR", "predicted_risk", "recommendation"]]
        export_df.columns = ["NCR Location", "Predicted Future Risk", "Recommendation"]
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Disaster Risk Report in National Capital Region", ln=True, align='C')
    pdf.ln(10)
    # Add table headers
    headers = list(export_df.columns)
    for header in headers:
        pdf.cell(60, 10, header, border=1)
    pdf.ln()
    # Add row data
    for _, row in export_df.iterrows():
        for item in row:
            pdf.cell(60, 10, str(item), border=1)
        pdf.ln()
    pdf.output(filename)
    return filename
