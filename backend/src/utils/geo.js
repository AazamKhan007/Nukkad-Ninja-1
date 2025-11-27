export const toRad = (deg) => (deg * Math.PI) / 180;
export const haversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
export const boundingBox = (lat, lon, radiusKm) => {
  const R = 6371;
  const maxLat = lat + (radiusKm / R) * (180 / Math.PI);
  const minLat = lat - (radiusKm / R) * (180 / Math.PI);
  const maxLon =
    lon + ((radiusKm / R) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
  const minLon =
    lon - ((radiusKm / R) * (180 / Math.PI)) / Math.cos((lat * Math.PI) / 180);
  return { minLat, maxLat, minLon, maxLon };
};
