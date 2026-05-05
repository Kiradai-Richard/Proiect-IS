const API = "http://localhost:5000/api";

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem("pcg_token");
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("pcg_token");
    localStorage.removeItem("pcg_user");
    window.location.reload();
    throw new Error("Sesiune expirata");
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Eroare de server");
  return data;
}
