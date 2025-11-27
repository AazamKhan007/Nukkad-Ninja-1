import { supabase } from "../config/supabase.js";
import { haversineDistanceKm, boundingBox } from "../utils/geo.js";

export const findVendorsNearby = async (req, res) => {
  const q = req.query;
  const lat = parseFloat(q.lat);
  const lng = parseFloat(q.lng);
  const radius = parseFloat(q.radius) || 2;
  const page = parseInt(q.page) || 1;
  const limit = parseInt(q.limit) || 20;
  const veg_type = q.veg_type || null;
  const category = q.category || null;
  const sort = q.sort || "nearest";

  if (isNaN(lat) || isNaN(lng))
    return res.status(400).json({ error: "lat and lng required" });

  const box = boundingBox(lat, lng, radius);
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .gte("latitude", box.minLat)
    .lte("latitude", box.maxLat)
    .gte("longitude", box.minLon)
    .lte("longitude", box.maxLon);

  if (error) return res.status(500).json({ error: error.message });

  const filtered = data
    .filter((v) => v.latitude !== null && v.longitude !== null)
    .map((v) => {
      const dist = haversineDistanceKm(lat, lng, v.latitude, v.longitude);
      return { ...v, distance_km: dist };
    })
    .filter((v) => v.distance_km <= radius)
    .filter((v) => (veg_type ? v.veg_type === veg_type : true))
    .filter((v) => (category ? v.category === category : true));

  const withSort = (() => {
    if (sort === "nearest")
      return filtered.sort((a, b) => a.distance_km - b.distance_km);
    if (sort === "highest_rated")
      return filtered.sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0));
    if (sort === "hygiene_first")
      return filtered.sort((a, b) => {
        const pa = (a.hygiene_rating || 0) >= 4 ? 0 : 1;
        const pb = (b.hygiene_rating || 0) >= 4 ? 0 : 1;
        if (pa !== pb) return pa - pb;
        return (b.avg_rating || 0) - (a.avg_rating || 0);
      });
    return filtered;
  })();

  const start = (page - 1) * limit;
  const paged = withSort.slice(start, start + limit);
  return res.json({ total: withSort.length, page, limit, vendors: paged });
};
