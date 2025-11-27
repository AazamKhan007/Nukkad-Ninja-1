import { supabase } from "../config/supabase.js";

const MIN_REVIEWS = 5;
const HYGIENE_THRESHOLD = 4.0;

export const recalcHygieneForVendor = async (req, res) => {
  const { vendorId } = req.params;
  const { data: reviews, error: rErr } = await supabase
    .from("reviews")
    .select("rating_hygiene")
    .eq("vendor_id", vendorId);
  if (rErr) return res.status(500).json({ error: rErr.message });
  const count = reviews.length;
  const avg =
    count === 0
      ? 0
      : reviews.reduce((s, r) => s + (r.rating_hygiene || 0), 0) / count;
  const badge = count >= MIN_REVIEWS && avg >= HYGIENE_THRESHOLD;
  const { error: upErr } = await supabase
    .from("hygiene_badge")
    .upsert([{ vendor_id: vendorId, badge_status: badge }], {
      onConflict: "vendor_id",
    });
  if (upErr) return res.status(500).json({ error: upErr.message });
  await supabase
    .from("vendors")
    .update({ hygiene_rating: avg, avg_rating: null })
    .eq("id", vendorId);
  return res.json({ vendorId, badge, avg, count });
};

export const recalcAllVendorsHygiene = async (req, res) => {
  const { data: vendors, error: vErr } = await supabase
    .from("vendors")
    .select("id");
  if (vErr) return res.status(500).json({ error: vErr.message });
  for (const v of vendors) {
    const { data: reviews } = await supabase
      .from("reviews")
      .select("rating_hygiene")
      .eq("vendor_id", v.id);
    const count = reviews.length;
    const avg =
      count === 0
        ? 0
        : reviews.reduce((s, r) => s + (r.rating_hygiene || 0), 0) / count;
    const badge = count >= MIN_REVIEWS && avg >= HYGIENE_THRESHOLD;
    await supabase
      .from("hygiene_badge")
      .upsert([{ vendor_id: v.id, badge_status: badge }], {
        onConflict: "vendor_id",
      });
    await supabase
      .from("vendors")
      .update({ hygiene_rating: avg })
      .eq("id", v.id);
  }
  return res.json({ message: "Recalculated hygiene for all vendors" });
};
