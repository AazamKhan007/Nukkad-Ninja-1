import { supabase } from "../config/supabase.js";

export const listUsersAdmin = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const deleteUserAdmin = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  await supabase.auth.admin.deleteUser(id).catch(() => {});
  return res.json({ message: "User deleted" });
};

export const listVendorsAdmin = async (req, res) => {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const updateVendorAdmin = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { error } = await supabase.from("vendors").update(updates).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Vendor updated" });
};

export const deleteVendorAdmin = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("vendors").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "Vendor deleted" });
};

export const listReportsAdmin = async (req, res) => {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
};

export const resolveReportAdmin = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  if (!["dismiss", "delete_comment", "warn_user"].includes(action))
    return res.status(400).json({ error: "invalid action" });
  if (action === "delete_comment") {
    const { data: rpt } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id)
      .limit(1);
    if (rpt && rpt.length) {
      await supabase.from("reviews").delete().eq("id", rpt[0].comment_id);
    }
  }
  await supabase.from("reports").update({ status: "resolved" }).eq("id", id);
  return res.json({ message: "Report resolved" });
};
