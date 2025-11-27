import { supabase } from "../config/supabase.js";
export const addReview = async (req, res) => {
  const { user } = req;
  const {
    vendor_id,
    comment_text,
    rating_taste,
    rating_hygiene,
    rating_price,
    rating_behavior,
  } = req.body;
  if (!vendor_id) return res.status(400).json({ error: "vendor_id required" });
  const { error } = await supabase.from("reviews").insert([
    {
      user_id: user.id,
      vendor_id,
      comment_text: comment_text || null,
      rating_taste: rating_taste || null,
      rating_hygiene: rating_hygiene || null,
      rating_price: rating_price || null,
      rating_behavior: rating_behavior || null,
    },
  ]);
  if (error) return res.status(400).json({ error: error.message });
  return res.json({ message: "Review added" });
};
export const getVendorReviews = async (req, res) => {
  const { vendorId } = req.params;
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};
