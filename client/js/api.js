const BASE = "http://localhost:8000/api/v1";

const getToken = () => localStorage.getItem("token");

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Request failed");
  return data.data;
};

const api = {
  login:       (b)  => req("POST",  "/auth/login", b),
  register:    (b)  => req("POST",  "/auth/register", b),
  getEntries:  (q)  => req("GET",   `/entries?${new URLSearchParams(q)}`),
  createEntry: (b)  => req("POST",  "/entries", b),
  updateEntry: (id,b)=> req("PATCH",`/entries/${id}`, b),
  deleteEntry: (id) => req("DELETE",`/entries/${id}`),
  getSummary:  (q)  => req("GET",   `/analytics/summary?${new URLSearchParams(q||{})}`),
};