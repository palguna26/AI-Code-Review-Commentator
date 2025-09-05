const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

export async function processCode({ code, language, mode = "commenter" }) {
  try {
    const response = await fetch(`${API_BASE}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, language, mode }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || "Failed to fetch from backend");
    }

    return data;
  } catch (error) {
    console.error("API error:", error);
    return { error: error.message };
  }
}
