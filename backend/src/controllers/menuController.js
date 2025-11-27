import { supabase } from "../config/supabase.js";
export const addMenuItem = async (req, res) => {
  const { user } = req;
  const { dish_name, price, category, veg_type } = req.body;
  if (!dish_name) return res.status(400).json({ error: "dish_name required" });
  const { error } = await supabase
    .from("vendor_menu_items")
    .insert([
      {
        vendor_id: user.id,
        dish_name,
        price: price || null,
        category: category || null,
        veg_type: veg_type || null,
      },
    ]);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Menu item added" });
};
export const updateMenuItem = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const updates = req.body;
  const { data: row } = await supabase
    .from("vendor_menu_items")
    .select("vendor_id")
    .eq("id", id)
    .limit(1);
  if (!row || row.length === 0)
    return res.status(404).json({ error: "Item not found" });
  if (row[0].vendor_id !== user.id)
    return res.status(403).json({ error: "Forbidden" });
  const { error } = await supabase
    .from("vendor_menu_items")
    .update(updates)
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Menu item updated" });
};
export const deleteMenuItem = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { data: row } = await supabase
    .from("vendor_menu_items")
    .select("vendor_id")
    .eq("id", id)
    .limit(1);
  if (!row || row.length === 0)
    return res.status(404).json({ error: "Item not found" });
  if (row[0].vendor_id !== user.id)
    return res.status(403).json({ error: "Forbidden" });
  const { error } = await supabase
    .from("vendor_menu_items")
    .delete()
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Menu item deleted" });
};
export const listVendorMenu = async (req, res) => {
  const vendorId = req.params.vendorId;
  const { data, error } = await supabase
    .from("vendor_menu_items")
    .select("*")
    .eq("vendor_id", vendorId);
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};
