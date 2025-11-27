import { supabase } from "../config/supabase.js";
export const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No authorization header" });
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user)
    return res.status(401).json({ error: "Invalid token" });
  req.user = data.user;
  next();
};
export const requireAdmin = async (req, res, next) => {
  const { user } = req;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { data, error } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .limit(1);
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0)
    return res.status(403).json({ error: "Admin only" });
  next();
};
