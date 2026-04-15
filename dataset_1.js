// -----------------------------
// -----------------------------

// 1. Study Area
var uttarakhand = ee.FeatureCollection('FAO/GAUL/2015/level1')
  .filter(ee.Filter.eq('ADM1_NAME', 'Uttarakhand'));
var highwayBuffer = uttarakhand.geometry().buffer(5000);

// 2. Generate ALL Data Layers with Monsoon 2025 date filter only

// DEM (Static - no date filter needed)
var dem = ee.Image('USGS/SRTMGL1_003').clip(highwayBuffer).rename('elevation');
var slope = ee.Terrain.slope(dem).rename('slope');

// RAINFALL - Monsoon 2025 only (June-Sept)
var rainfall_2025 = ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY')
  .filterDate('2025-06-01', '2025-09-30')
  .filterBounds(highwayBuffer)
  .sum()
  .rename('rainfall_2025_monsoon')
  .clip(highwayBuffer);

// NDVI - Monsoon season 2025 only
var ndvi_2025 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(highwayBuffer)
  .filterDate('2025-06-01', '2025-09-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
  .select(['B8', 'B4'])
  .median()
  .normalizedDifference(['B8', 'B4'])
  .rename('ndvi_2025_monsoon')
  .clip(highwayBuffer);

// Geology (Terrain Roughness) - Static
var geology_std = dem.reduceNeighborhood({
  reducer: ee.Reducer.stdDev(),
  kernel: ee.Kernel.circle(500, 'meters')
}).rename('geology_std');

// Drainage Density - Static
var drainage = slope.multiply(2).rename('drainage');

// 3. Calculate LSI (Landslide Susceptibility Index) - WITHOUT ROADS
function normalizeSafe(image, minVal, maxVal) {
  return image.unitScale(minVal, maxVal).clamp(0, 1);
}

var slopeNorm = normalizeSafe(slope, 0, 60);
var rainfallNorm = normalizeSafe(rainfall_2025, 500, 2500);
var ndviNorm = normalizeSafe(ndvi_2025, -0.2, 0.8).multiply(-1).add(1);
var geologyNorm = normalizeSafe(geology_std, 0, 200);
var drainageNorm = normalizeSafe(drainage, 0, 120);

// LSI without road distance factor
var LSI_score = slopeNorm.multiply(0.40)
  .add(rainfallNorm.multiply(0.25))
  .add(ndviNorm.multiply(0.15))
  .add(geologyNorm.multiply(0.15))
  .add(drainageNorm.multiply(0.05))
  .rename('LSI_score');

// 4. Risk Classification
var stats = LSI_score.reduceRegion({
  reducer: ee.Reducer.percentile([10, 40, 70]),
  geometry: highwayBuffer,
  scale: 100,
  maxPixels: 1e9
});

var p10 = ee.Number(stats.get('LSI_score_p10'));
var p40 = ee.Number(stats.get('LSI_score_p40')); 
var p70 = ee.Number(stats.get('LSI_score_p70'));

var risk_class = LSI_score.lt(p10).multiply(1)
  .add(LSI_score.gte(p10).and(LSI_score.lt(p70)).multiply(2))
  .add(LSI_score.gte(p70).multiply(3))
  .rename('risk_class');

// 5. Combine ALL Layers into Single Image (NO ROAD DISTANCE)
var allData = ee.Image.cat([
  dem,                    // elevation
  slope,                  // slope  
  rainfall_2025,          // rainfall_2025_monsoon
  ndvi_2025,              // ndvi_2025_monsoon
  geology_std,            // geology_std
  drainage,               // drainage
  LSI_score,              // LSI_score
  risk_class              // risk_class
]);

// 6. Generate 7,900 Sample Points
var samplePoints = allData.sample({
  region: highwayBuffer,
  scale: 100,
  numPixels: 7900,  // Reduced from 9000 to 7900
  seed: 42,
  geometries: true
});

// 7. Add longitude and latitude as separate columns
var finalDataset = samplePoints.map(function(feature) {
  var coords = feature.geometry().coordinates();
  return feature.set({
    'longitude': coords.get(0),
    'latitude': coords.get(1),
    'point_id': ee.Number(coords.get(0)).multiply(10000).add(coords.get(1)).format('%.0f')
  });
});

// 8. EXPORT SINGLE CSV WITH ALL COLUMNS
Export.table.toDrive({
  collection: finalDataset,
  description: 'UTTARAKHAND_7900_POINTS_MONSOON_2025_NO_ROADS',
  folder: 'CEC201_Project',
  fileFormat: 'CSV',
  selectors: [
    'point_id', 'longitude', 'latitude', 
    'elevation', 'slope', 
    'rainfall_2025_monsoon',
    'ndvi_2025_monsoon',
    'geology_std', 'drainage',
    'LSI_score', 'risk_class'
  ]
});

// 9. Quick Map Preview
Map.centerObject(highwayBuffer, 8);
Map.addLayer(dem, {min: 300, max: 4000, palette: ['brown', 'yellow', 'green']}, 'Elevation');
Map.addLayer(LSI_score, {min: 0, max: 1, palette: ['green', 'yellow', 'red']}, 'LSI Score');
Map.addLayer(finalDataset, {color: 'red', pointSize: 1}, '7,900 Sample Points');

// 10. Print Success Message
print('=== 7,900 POINTS DATASET EXPORT INITIATED ===');
print('Date Range: Monsoon 2025 only (June 01 - Sept 30, 2025)');
print('Total Points: 7,900');
print('Coverage: 1 point per ~7.5 sq km');
print('Road Distance: EXCLUDED');
print('📊 COLUMNS IN CSV: point_id, longitude, latitude, elevation, slope, rainfall_2025_monsoon, ndvi_2025_monsoon, geology_std, drainage, LSI_score, risk_class');
