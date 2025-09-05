import os
import google.generativeai as genai
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import json

# Load API key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# ✅ Allow frontend to connect (for dev; restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class CodeRequest(BaseModel):
    code: str
    language: str
    mode: str = "commenter"  # default mode

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/comment")
async def process_code(req: CodeRequest):
    """
    Multi-mode endpoint:
    - commenter: return inline commented code
    - reviewer: return structured review
    """

    model = genai.GenerativeModel("gemini-1.5-flash")

    if req.mode == "commenter":
        prompt = f"""
        Add concise inline comments for this {req.language} code:

        {req.code}
        """
        response = model.generate_content(prompt)

        return {
            "commented_code": response.text if response else "// No comments generated"
        }

    elif req.mode == "reviewer":
        prompt = f"""
        Review this {req.language} code and provide:
        - A short summary of what it does
        - Suggestions for improvements
        - Any bugs or issues
        - Security concerns if any

        Return output ONLY in valid JSON with keys:
        summary (string), suggestions (array of strings).

        Code:
        {req.code}
        """
        response = model.generate_content(prompt)

        # --- Extract text safely from Gemini response ---
        raw_text = ""
        if response and response.candidates:
            try:
                raw_text = response.candidates[0].content.parts[0].text
            except Exception:
                raw_text = response.text or ""

        # --- Try strict JSON parse first ---
        try:
            review = json.loads(raw_text)
            # Ensure keys exist
            review.setdefault("summary", "No summary")
            review.setdefault("suggestions", [])
        except Exception:
            # fallback: parse lines manually
            lines = [line.strip("-• \n") for line in raw_text.splitlines() if line.strip()]
            summary = lines[0] if lines else "No summary"
            suggestions = lines[1:] if len(lines) > 1 else []
            review = {"summary": summary, "suggestions": suggestions}

        return review

    else:
        return {"error": "Invalid mode. Use 'commenter' or 'reviewer'."}
