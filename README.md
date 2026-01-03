# Safe Hills: Landslide Risk Dashboard (Uttarakhand)

This project presents a landslide susceptibility and risk assessment dashboard for the state of Uttarakhand, developed as part of an academic course project. The dashboard integrates geospatial datasets with machine learning techniques on Google Earth Engine (GEE) to analyze both baseline (monsoon) and short-term forecast-based landslide risk.

---

## Project Overview

Landslides are a recurring natural hazard in the Himalayan region, especially during the monsoon season. This project aims to:

- Identify landslide-prone zones using terrain and environmental factors.
- Compare baseline (historical monsoon) risk with near-term (next 7 days) forecast risk.
- Provide an interactive dashboard for visualization and inspection.

The system uses a combination of a weighted Landslide Susceptibility Index (LSI) and a Random Forest classifier implemented on Google Earth Engine.

---

## Key Features

- Study area: Uttarakhand (India).
- Multi-factor analysis using elevation, slope, rainfall, NDVI, geology proxy, and drainage proxy.
- Machine Learning model: Random Forest.
- Baseline risk assessment using historical monsoon data.
- Forecast-based risk assessment using short-term precipitation estimates.
- Interactive dashboard with:
  - Layer toggles
  - Legends
  - Area-wise risk statistics
  - Point-based inspection tool
- Accuracy evaluation using confusion matrix and Kappa coefficient.

---

## Data and Tools Used

- Google Earth Engine (JavaScript API)
- SRTM DEM
- CHIRPS rainfall data
- Sentinel-2 surface reflectance data
- Random Forest classifier (GEE)
- QGIS (for preprocessing and validation)
- Google Earth Engine UI components

---

## Repository Structure
```text
safe-hills-landslide-risk-dashboard/
├── gee_code/
│   └── landslide_dashboard.js
├── demo/
│   └── README.md
├── Report_TEAM_CAD.pdf
├── Team_CAD_Charvi_Ayush_Disha.pptx
└── README.md
```

---

## How to Use the Code

1. Open Google Earth Engine Code Editor. 
2. Create a new script and paste the contents of  
   `gee_code/landslide_dashboard.js`
3. Ensure required training point assets are available in your GEE account (imported as private assets during development).
4. Run the script to launch the interactive dashboard.

---

## Academic Context

This project was developed as part of a course-based team assignment.  
The objective was to apply geospatial analysis and machine learning concepts to a real-world disaster risk problem.

---

## Team Members

- Charvi   
- Ayush  
- Disha  

---

## Demo and Documentation

- A full dashboard walkthrough is available in the demo video (see `demo/` folder).
- Detailed methodology, results, and analysis are documented in the final project report.

---

## Disclaimer

This project is intended for academic and educational purposes only.  
The results should not be used directly for operational disaster management without further validation.
