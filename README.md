# Safe Hills: Landslide Risk Forecasting Dashboard

Safe Hills is a geospatial dashboard developed to analyze and visualize landslide susceptibility across Uttarakhand. It combines terrain, environmental, and rainfall data with machine learning to generate both baseline risk maps and short-term risk forecasts.

**Live Dashboard:** https://modis-lst-469710.projects.earthengine.app/view/safe-hills

**Case Study (Chamoli 2021):** https://modis-lst-469710.projects.earthengine.app/view/casestudycad

---

## Overview

Uttarakhand is highly prone to landslides due to steep slopes, intense monsoon rainfall, and fragile geological conditions. Despite this, there is no widely accessible system that provides location-specific risk insights in an interactive format.

This project addresses that gap by building a web-based dashboard that enables users to explore landslide risk spatially and understand contributing factors.

---

## Key Features

- State-wide landslide susceptibility mapping (53,000+ km² coverage)
- Dual risk system:
  - Baseline risk (long-term conditions)
  - Recent risk (7-day forecast-based)
- Interactive map with layer controls (DEM, slope, rainfall, NDVI, risk maps)
- Location inspection tool for point-wise analysis
- Case study integration (Chamoli 2021)
- Real-time data handling with fallback mechanism

---

## Methodology

### Landslide Susceptibility Index (LSI)

A weighted overlay approach was used to compute a risk score (0–1):

| Factor | Weight |
|--------|--------|
| Slope | 30% |
| Rainfall | 22% |
| NDVI | 18% |
| Geology proxy | 15% |
| Drainage | 15% |

### Machine Learning Model

- Model: Random Forest Classifier
- Training/Test split: 70/30
- Dataset: 7,881 labeled points across Uttarakhand
- Output: Classification into Low, Medium, High risk zones
- Accuracy: ~90%

### Real-Time Forecasting

- Integrates 7-day precipitation forecast data
- Updates recent risk layers accordingly
- Includes fallback logic using monsoon-based approximation when forecast data is unavailable

---

## Data Sources

- SRTM (30m) for elevation and slope
- CHIRPS for rainfall data
- Sentinel-2 for NDVI
- Derived proxies for geology and drainage
- Landslide inventory dataset (GEE)

---

## Implementation

- Built using Google Earth Engine
- JavaScript-based application
- Cloud-based processing (no local setup required)

---

## Case Study: Chamoli (2021)

The model correctly classifies the Chamoli disaster location as high-risk using both LSI and Random Forest approaches, demonstrating the system's capability to identify vulnerable zones prior to major events.

Explore the case study here: https://modis-lst-469710.projects.earthengine.app/view/casestudycad

---

## Impact

- Provides an accessible decision-support tool for landslide risk awareness
- Enables preliminary planning for infrastructure and disaster preparedness
- Covers entire Uttarakhand with fast map generation and analysis

---

## Limitations

- Resolution limited to 30m (may miss micro-level failures)
- Model performance depends on quality of training data
- Forecast-based risk depends on external weather data accuracy
- Certain factors (soil data, seismic activity) not included

---

## Future Work

- Integration of higher-resolution datasets
- Inclusion of additional factors (soil, land use, seismic zones)
- Automated alert system for high-risk zones
- Mobile-friendly version of the dashboard
- Temporal analysis with time-slider
