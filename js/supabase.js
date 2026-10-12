// Shared Supabase client + helpers
const configured = !window.SUPABASE_URL.includes("YOUR-PROJECT-ID");
const sb = configured ? window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY) : null;

function needConfig() {
  alert("Supabase isn't configured yet.\nOpen js/config.js and paste your Project URL + anon key.");
}

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = d => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

async function fetchItems() {
  if (!sb) return [];
  const { data, error } = await sb.from("found_items").select("*").order("created_at", { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return sb.storage.from(window.IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function uploadImage(file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from(window.IMAGE_BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}
