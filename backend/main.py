from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyze import router as analyze_router
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="SentinelAI API",
    description="AI-powered threat detection and analysis API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(analyze_router, prefix="/api", tags=["analysis"])

@app.get("/")
async def root():
    return {"message": "SentinelAI API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "ai_engine": "gemini", "model": os.getenv("GEMINI_MODEL", "gemini-2.0-flash")}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
