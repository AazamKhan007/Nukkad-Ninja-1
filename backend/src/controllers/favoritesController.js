import { supabase } from "../config/supabase.js";
export const addFavorite = async (req, res) => {
  const { user } = req;
  const { vendor_id } = req.body;
  if (!vendor_id) return res.status(400).json({ error: "vendor_id required" });
  const { data: exists } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("vendor_id", vendor_id)
    .limit(1);
  if (exists && exists.length > 0)
    return res.status(400).json({ error: "Already favorited" });
  const { error } = await supabase
    .from("favorites")
    .insert([{ user_id: user.id, vendor_id }]);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Favorited" });
};
export const removeFavorite = async (req, res) => {
  const { user } = req;
  const { vendor_id } = req.params;
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("vendor_id", vendor_id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Unfavorited" });
};
export const listFavorites = async (req, res) => {
  const { user } = req;
  const { data, error } = await supabase
    .from("favorites")
    .select("vendor_id")
    .eq("user_id", user.id);
  if (error) return res.status(500).json({ error: error.message });
  const vendorIds = data.map((d) => d.vendor_id);
  const { data: vendors, error: ve } = await supabase
    .from("vendors")
    .select("*")
    .in("id", vendorIds);
  if (ve) return res.status(500).json({ error: ve.message });
  return res.json(vendors);
};
