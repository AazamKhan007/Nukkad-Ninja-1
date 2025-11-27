import sharp from "sharp";
import { supabase } from "../config/supabase.js";

export const uploadVendorPhoto = async (req, res) => {
  const { user } = req;
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No photo provided" });
  const compressedImage = await sharp(file.buffer)
    .resize(800)
    .webp({ quality: 70 })
    .toBuffer();
  const fileName = `vendor_${user.id}_${Date.now()}.webp`;
  const { data, error } = await supabase.storage
    .from("vendor-photos")
    .upload(fileName, compressedImage, {
      contentType: "image/webp",
      metadata: { vendor_id: user.id },
    });
  if (error) return res.status(400).json({ error: error.message });
  const publicUrl = supabase.storage
    .from("vendor-photos")
    .getPublicUrl(data.path).data.publicUrl;
  const { error: dbError } = await supabase
    .from("vendor_photos")
    .insert([{ vendor_id: user.id, photo_url: publicUrl, type: "dish" }]);
  if (dbError) return res.status(500).json({ error: dbError.message });
  return res.json({ url: publicUrl, path: data.path });
};

export const uploadVendorPhotosMultiple = async (req, res) => {
  const { user } = req;
  const files = req.files;
  if (!files || files.length === 0)
    return res.status(400).json({ error: "No photos provided" });
  const { data: existing, error: countError } = await supabase
    .from("vendor_photos")
    .select("id", { count: "exact" })
    .eq("vendor_id", user.id);
  if (countError) return res.status(500).json({ error: countError.message });
  const existingCount = Array.isArray(existing) ? existing.length : 0;
  if (existingCount + files.length > 5)
    return res
      .status(400)
      .json({ error: "Maximum 5 photos allowed per vendor" });
  const uploadPromises = files.map(async (file, idx) => {
    const compressed = await sharp(file.buffer)
      .resize(700)
      .webp({ quality: 65 })
      .toBuffer();
    const fileName = `vendor_${user.id}_${Date.now()}_${idx}.webp`;
    const { data, error } = await supabase.storage
      .from("vendor-photos")
      .upload(fileName, compressed, {
        contentType: "image/webp",
        metadata: { vendor_id: user.id },
      });
    if (error) throw new Error(error.message);
    const publicUrl = supabase.storage
      .from("vendor-photos")
      .getPublicUrl(data.path).data.publicUrl;
    return { path: data.path, url: publicUrl };
  });
  let results;
  try {
    results = await Promise.all(uploadPromises);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  const inserts = results.map((r) => ({
    vendor_id: user.id,
    photo_url: r.url,
    type: "dish",
  }));
  const { error: dbError2 } = await supabase
    .from("vendor_photos")
    .insert(inserts);
  if (dbError2) return res.status(500).json({ error: dbError2.message });
  return res.json({ uploaded: results });
};

export const uploadVendorMainPhoto = async (req, res) => {
  const { user } = req;
  const file = req.file;

  if (!file) return res.status(400).json({ error: "No photo provided" });

  const compressed = await sharp(file.buffer)
    .resize(900)
    .webp({ quality: 75 })
    .toBuffer();

  const fileName = `vendor_main_${user.id}.webp`;

  const { data, error } = await supabase.storage
    .from("vendor-stalls")
    .upload(fileName, compressed, {
      contentType: "image/webp",
      upsert: true,
      metadata: { vendor_id: user.id },
    });

  if (error) return res.status(400).json({ error: error.message });

  const publicUrl = supabase.storage
    .from("vendor-stalls")
    .getPublicUrl(data.path).data.publicUrl;

  await supabase
    .from("vendors")
    .update({ main_photo_url: publicUrl })
    .eq("auth_user_id", user.id);

  return res.json({ url: publicUrl });
};
