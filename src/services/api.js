const API = 'http://localhost:5001/api';

export async function api(endpoint, options = {}) {
  const token = localStorage.getItem('pcg_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error('Serverul nu este disponibil. Verifica ca backend-ul ruleaza pe portul 5001.');
  }

  const data = await res.json();

  if (res.status === 401) {
    const hadToken = !!localStorage.getItem('pcg_token');
    localStorage.removeItem('pcg_token');
    localStorage.removeItem('pcg_user');
    if (hadToken) {
      window.location.reload();
      throw new Error('Sesiune expirata');
    }
    throw new Error(data.error || 'Eroare de autentificare');
  }

  if (!res.ok) throw new Error(data.error || 'Eroare de server');
  return data;
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem('pcg_user')); } catch { return null; }
}

export function logout() {
  localStorage.removeItem('pcg_token');
  localStorage.removeItem('pcg_user');
  localStorage.removeItem('pcg_cart');
}
