const BACKEND_URL = "http://127.0.0.1:5001";

async function fetchJSON<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  return res.json();
}

export async function getFacts() {
  return fetchJSON<{ facts: { id: string; content: string }[] } | { id: string; content: string }[]>(
    `${BACKEND_URL}/api/memory`,
    {
      cache: "no-store"
    }
  );
}

export async function addFact(content: string) {
  return fetchJSON(`${BACKEND_URL}/api/memory/facts`, {
    method: "POST",
    body: JSON.stringify({ content })
  });
}

export async function deleteFact(id: string | number) {
  return fetchJSON(`${BACKEND_URL}/api/memory/facts`, {
    method: "DELETE",
    body: JSON.stringify({ id })
  });
}

export async function getTasks() {
  return fetchJSON<{ tasks: { id: string; title: string; status: string }[] } | { id: string; title: string; status: string }[]>(
    `${BACKEND_URL}/api/tasks`,
    {
      cache: "no-store"
    }
  );
}

export async function addTask(title: string) {
  return fetchJSON(`${BACKEND_URL}/api/tasks`, {
    method: "POST",
    body: JSON.stringify({ title })
  });
}

export async function completeTask(id: string | number) {
  return fetchJSON(`${BACKEND_URL}/api/tasks/complete`, {
    method: "PUT",
    body: JSON.stringify({ id })
  });
}

export async function deleteTask(id: string | number) {
  return fetchJSON(`${BACKEND_URL}/api/tasks`, {
    method: "DELETE",
    body: JSON.stringify({ id })
  });
}

export async function getPersonality() {
  return fetchJSON<{ tone: string; humor: string; focus: string }>(`${BACKEND_URL}/api/personality`, {
    cache: "no-store"
  });
}

export async function updatePersonality(payload: { tone: string; humor: string; focus: string }) {
  return fetchJSON(`${BACKEND_URL}/api/personality`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function getConfig() {
  return fetchJSON<{ speak_mode: boolean; voice: string; rate: number }>(`${BACKEND_URL}/api/config`, {
    cache: "no-store"
  });
}

export async function updateConfig(payload: { speak_mode: boolean; voice: string; rate: number }) {
  return fetchJSON(`${BACKEND_URL}/api/config`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function getTranscript() {
  return fetchJSON<
    { id?: string; timestamp?: string; time?: string; speaker: string; message: string }[]
  >(`${BACKEND_URL}/api/transcript`, {
    cache: "no-store"
  });
}

export { BACKEND_URL };
