# backend/app.py

from flask import Flask, jsonify, request, send_file, abort, make_response
from flask_cors import CORS
import os
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import tempfile

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'risk.csv')
RISK_MAP = {"low": 1, "medium": 2, "high": 3}

def load_data(csv_path):
    # Loads the CSV data from the given path. Aborts with 404 if not found.
    if not os.path.exists(csv_path):
        abort(404, description="Data file not found")
    df = pd.read_csv(csv_path)
    return df 

def preprocess_and_predict(df):
    # Preprocesses the dataframe and predicts risk clusters using KMeans.
    # Also assigns recommendations based on predicted risk.
    non_hazard_cols = [
        "NCR", "place", "cluster", "predicted_risk",
        "lat", "lon", "recommendation"
    ]
    hazard_cols = [c for c in df.columns if c not in non_hazard_cols]
    df_num = df.copy()
    for col in hazard_cols:
        df_num[col] = df[col].map(RISK_MAP)
    df_num = df_num.drop(columns=non_hazard_cols, errors='ignore')
    imputer = SimpleImputer(strategy="most_frequent")
    df_num[hazard_cols] = imputer.fit_transform(df_num[hazard_cols])
    scaler = StandardScaler()
    X = scaler.fit_transform(df_num[hazard_cols])
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X)
    df["cluster"] = clusters
    cluster_means = df_num.groupby(clusters)[hazard_cols].mean().mean(axis=1).sort_values()
    risk_levels = {c: label for c, label in zip(cluster_means.index, ["low", "medium", "high"])}
    df["predicted_risk"] = df["cluster"].map(risk_levels)
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

def robust_city_filter(df, city):
    # Filters the dataframe by city or cities (comma-separated, case/space insensitive).
    # Returns all data if city is None or empty.
    if not city:
        return df
    cities = [c.strip().lower().replace(" ", "") for c in city.split(",")]
    filtered = df[df['NCR'].str.lower().str.replace(" ", "").isin(cities)]
    return filtered

@app.route('/api/export_excel', methods=['GET', 'OPTIONS'])
def export_excel():
    # Exports filtered risk data as an Excel file.
    # Handles CORS preflight OPTIONS.
    if request.method == 'OPTIONS':
        return '', 200
    city = request.args.get('city')
    df = load_data(DATA_PATH)
    df = preprocess_and_predict(df)
    df = robust_city_filter(df, city)
    if df.empty:
        return make_response(jsonify({"error": "No data to export for selected cities"}), 400)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx')
    df.to_excel(temp_file.name, index=False, engine='openpyxl')
    temp_file.close()
    return send_file(
        temp_file.name,
        as_attachment=True,
        download_name='Risk_Report.xlsx',
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

@app.route('/api/export_pdf', methods=['GET', 'OPTIONS'])
def export_pdf():
    # Exports filtered risk data as a PDF file.
    # Handles CORS preflight OPTIONS.
    city = request.args.get('city')
    df = load_data(DATA_PATH)
    df = preprocess_and_predict(df)
    df = robust_city_filter(df, city)
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    export_to_pdf(df, temp_file.name, no_data=df.empty)
    temp_file.close()
    return send_file(
        temp_file.name,
        as_attachment=True,
        download_name='Risk_Report.pdf',
        mimetype="application/pdf"
    )

def export_to_pdf(df, filename, no_data=False):
    # Helper to export the dataframe to a PDF file using fpdf.
    # If no_data is True, writes a message instead of table rows.
    from fpdf import FPDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 12, "Disaster Risk Report in National Capital Region", ln=True, align='C')
    pdf.ln(10)
    pdf.set_font("Arial", "B", 12)
    headers = ["NCR Location", "Predicted Future Risk", "Recommendation"]
    col_widths = [45, 60, 85]
    for i, header in enumerate(headers):
        pdf.cell(col_widths[i], 10, header, border=1, align='C')
    pdf.ln()
    pdf.set_font("Arial", size=12)
    if no_data or df.empty:
        pdf.cell(sum(col_widths), 10, "No data available for selected cities.", border=1, align='C')
    else:
        for _, row in df.iterrows():
            pdf.cell(col_widths[0], 10, str(row["NCR"]), border=1)
            pdf.cell(col_widths[1], 10, str(row["predicted_risk"]), border=1)
            pdf.cell(col_widths[2], 10, str(row["recommendation"]), border=1)
            pdf.ln()
    pdf.output(filename)

@app.route('/api/risk-data', methods=['GET'])
def get_risk_data():
    # Returns filtered risk data as JSON.
    # Can filter by city and/or hazard type.
    city = request.args.get('city')
    hazard = request.args.get('hazard')
    df = load_data(DATA_PATH)
    df = preprocess_and_predict(df)
    df = robust_city_filter(df, city)
    non_hazard_cols = [
        "NCR", "place", "cluster", "predicted_risk",
        "lat", "lon", "recommendation"
    ]
    hazard_cols = [c for c in df.columns if c not in non_hazard_cols]
    hazard_col = None
    if hazard:
        hazard_col = [col for col in hazard_cols if col.lower().replace(" ", "") == hazard.lower().replace(" ", "")]
        hazard_col = hazard_col[0] if hazard_col else None
    if hazard_col:
        cols = ["NCR", "lat", "lon", hazard_col, "predicted_risk", "recommendation"]
    else:
        cols = ["NCR", "lat", "lon", "predicted_risk", "recommendation"] + hazard_cols
    cols = [col for col in cols if col in df.columns]
    df = df[cols]
    if df.empty:
        return jsonify([]), 200
    return jsonify(df.to_dict(orient="records"))

if __name__ == '__main__':
    # Runs the Flask app in debug mode.
    app.run(debug=True)
