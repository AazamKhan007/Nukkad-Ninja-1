import { supabase } from "../config/supabase.js";
export const userSignup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
  if (authError) return res.status(400).json({ error: authError.message });
  const { error: dbError } = await supabase.from("users").insert([
    {
      id: authUser.user.id,
      name: name || null,
      email: email,
    },
  ]);
  if (dbError) {
    await supabase.auth.admin.deleteUser(authUser.user.id).catch(() => {});
    return res.status(400).json({ error: dbError.message });
  }
  return res.json({ message: "User created", user_id: authUser.user.id });
};
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing credentials" });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
};
export const getMe = async (req, res) => {
  const { user } = req;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .limit(1);
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(404).json({ error: "User not found" });
  return res.json(data[0]);
};
