import { supabase } from "../config/supabase.js";

export const vendorSignup = async (req, res) => {
  const { owner_name, email, password, stall_name, phone, category, veg_type } =
    req.body;
  if (!owner_name || !email || !password)
    return res.status(400).json({ error: "Missing required fields" });

  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) return res.status(400).json({ error: authError.message });

  const { error: dbError } = await supabase.from("vendors").insert([
    {
      auth_user_id: authUser.user.id,
      owner_name: owner_name,
      email: email,
      stall_name: stall_name || null,
      phone: phone || null,
      category: category || null,
      veg_type: veg_type || null,
    },
  ]);

  if (dbError) {
    await supabase.auth.admin.deleteUser(authUser.user.id).catch(() => {});
    return res.status(400).json({ error: dbError.message });
  }

  return res.json({
    message: "Vendor registered successfully",
    vendor_id: authUser.user.id,
  });
};

export const vendorLogin = async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({
    access_token: data.session.access_token,
    user: data.user,
  });
};

export const getMyVendorProfile = async (req, res) => {
  const { user } = req;
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("auth_user_id", user.id)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Vendor not found" });

  return res.json(data[0]);
};

export const updateMyVendorProfile = async (req, res) => {
  const { user } = req;
  const updates = req.body;

  const allowedFields = [
    "stall_name",
    "owner_name",
    "phone",
    "address_text",
    "category",
    "veg_type",
    "timings_open",
    "timings_close",
    "latitude",
    "longitude",
    "main_photo_url",
    "description",
  ];

  const filtered = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }

  const { error } = await supabase
    .from("vendors")
    .update(filtered)
    .eq("auth_user_id", user.id);

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ message: "Vendor profile updated" });
};

export const getVendorById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", id)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "Vendor not found" });

  return res.json(data[0]);
};
