from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
import os
import logging
import uuid
import json
from pathlib import Path
import aiofiles
import base64

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# FastAPI app setup
app = FastAPI(title="AJ STUDIOZ - Agentic AI Platform", version="1.0.0")
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str
    model_provider: Optional[str] = None
    model_name: Optional[str] = None

class ChatSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_message_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    message_count: int = 0
    model_provider: str = "anthropic"
    model_name: str = "claude-sonnet-4-20250514"

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    model_provider: Optional[str] = "anthropic"
    model_name: Optional[str] = "claude-sonnet-4-20250514"
    system_message: Optional[str] = "You are AJ STUDIOZ AI, a highly advanced agentic AI assistant specializing in web development, coding, analysis, and creative problem-solving. You provide comprehensive, accurate, and innovative solutions."

class DocumentAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    filename: str
    file_type: str
    analysis_result: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str

# Helper functions
def prepare_for_mongo(data: Dict) -> Dict:
    """Convert datetime objects to ISO strings for MongoDB storage"""
    for key, value in data.items():
        if isinstance(value, datetime):
            data[key] = value.isoformat()
    return data

def parse_from_mongo(item: Dict) -> Dict:
    """Parse datetime strings back to datetime objects"""
    for key, value in item.items():
        if key in ['timestamp', 'created_at', 'last_message_at'] and isinstance(value, str):
            try:
                item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
            except:
                pass
    return item

# API Routes

@api_router.get("/")
async def root():
    return {"message": "Welcome to AJ STUDIOZ - Advanced Agentic AI Platform"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "platform": "AJ STUDIOZ", "version": "1.0.0"}

# Chat API endpoints
@api_router.post("/chat", response_model=Dict)
async def chat_with_ai(request: ChatRequest):
    try:
        # Get or create session
        session_id = request.session_id or str(uuid.uuid4())
        
        # Check if session exists
        session = await db.chat_sessions.find_one({"id": session_id})
        if not session:
            # Create new session
            session_data = ChatSession(
                id=session_id,
                title=request.message[:50] + "..." if len(request.message) > 50 else request.message,
                model_provider=request.model_provider,
                model_name=request.model_name
            )
            await db.chat_sessions.insert_one(prepare_for_mongo(session_data.dict()))
        
        # Store user message
        user_message = ChatMessage(
            role="user",
            content=request.message,
            session_id=session_id,
            model_provider=request.model_provider,
            model_name=request.model_name
        )
        await db.chat_messages.insert_one(prepare_for_mongo(user_message.dict()))
        
        # Initialize AI chat with emergent LLM key
        emergent_key = os.environ.get('EMERGENT_LLM_KEY')
        if not emergent_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        chat = LlmChat(
            api_key=emergent_key,
            session_id=session_id,
            system_message=request.system_message or "You are AJ STUDIOZ AI, a highly advanced agentic AI assistant."
        ).with_model(request.model_provider, request.model_name)
        
        # Create user message for AI
        ai_user_message = UserMessage(text=request.message)
        
        # Get AI response
        ai_response = await chat.send_message(ai_user_message)
        
        # Store AI response
        ai_message = ChatMessage(
            role="assistant",
            content=str(ai_response),
            session_id=session_id,
            model_provider=request.model_provider,
            model_name=request.model_name
        )
        await db.chat_messages.insert_one(prepare_for_mongo(ai_message.dict()))
        
        # Update session
        await db.chat_sessions.update_one(
            {"id": session_id},
            {
                "$set": {
                    "last_message_at": datetime.now(timezone.utc).isoformat()
                },
                "$inc": {"message_count": 2}  # user + assistant message
            }
        )
        
        return {
            "response": str(ai_response),
            "session_id": session_id,
            "model_info": {
                "provider": request.model_provider,
                "model": request.model_name
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@api_router.get("/chat/sessions", response_model=List[Dict])
async def get_chat_sessions():
    try:
        sessions = await db.chat_sessions.find().sort("last_message_at", -1).to_list(length=50)
        return [parse_from_mongo(session) for session in sessions]
    except Exception as e:
        logger.error(f"Error fetching sessions: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch chat sessions")

@api_router.get("/chat/sessions/{session_id}/messages", response_model=List[Dict])
async def get_session_messages(session_id: str):
    try:
        messages = await db.chat_messages.find({"session_id": session_id}).sort("timestamp", 1).to_list(length=1000)
        return [parse_from_mongo(message) for message in messages]
    except Exception as e:
        logger.error(f"Error fetching messages: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages")

@api_router.delete("/chat/sessions/{session_id}")
async def delete_session(session_id: str):
    try:
        # Delete session and all its messages
        await db.chat_sessions.delete_one({"id": session_id})
        await db.chat_messages.delete_many({"session_id": session_id})
        return {"message": "Session deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete session")

# File upload and analysis
@api_router.post("/upload/analyze")
async def analyze_document(file: UploadFile = File(...), session_id: str = Form(...)):
    try:
        # Save uploaded file temporarily
        upload_dir = Path("/tmp/uploads")
        upload_dir.mkdir(exist_ok=True)
        
        file_path = upload_dir / f"{uuid.uuid4()}_{file.filename}"
        
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        # Initialize AI for document analysis
        emergent_key = os.environ.get('EMERGENT_LLM_KEY')
        if not emergent_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        chat = LlmChat(
            api_key=emergent_key,
            session_id=f"analysis_{session_id}",
            system_message="You are AJ STUDIOZ AI document analyzer. Analyze uploaded documents and provide comprehensive insights."
        ).with_model("anthropic", "claude-sonnet-4-20250514")
        
        # Read file content for analysis
        if file.content_type and file.content_type.startswith('text/'):
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
                file_content = await f.read()
            analysis_prompt = f"Analyze this document and provide key insights, summary, and recommendations:\n\n{file_content[:5000]}"  # Limit content
        else:
            analysis_prompt = f"I've uploaded a {file.content_type or 'unknown'} file named '{file.filename}'. Please provide analysis guidance for this type of document."
        
        # Get AI analysis
        ai_message = UserMessage(text=analysis_prompt)
        analysis_result = await chat.send_message(ai_message)
        
        # Store analysis result
        analysis = DocumentAnalysis(
            filename=file.filename,
            file_type=file.content_type or "unknown",
            analysis_result=str(analysis_result),
            session_id=session_id
        )
        await db.document_analyses.insert_one(prepare_for_mongo(analysis.dict()))
        
        # Clean up temp file
        file_path.unlink(missing_ok=True)
        
        return {
            "analysis": str(analysis_result),
            "filename": file.filename,
            "file_type": file.content_type,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Document analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Document analysis failed: {str(e)}")

# Model management
@api_router.get("/models")
async def get_available_models():
    return {
        "providers": {
            "openai": [
                "gpt-5", "gpt-5-mini", "gpt-5-nano", "gpt-4.1", "gpt-4.1-mini", 
                "gpt-4.1-nano", "o4-mini", "o3-mini", "o3", "o1-mini", "gpt-4o-mini", 
                "gpt-4.5-preview", "gpt-4o", "o1", "o1-pro"
            ],
            "anthropic": [
                "claude-sonnet-4-20250514", "claude-opus-4-20250514", "claude-3-7-sonnet-20250219",
                "claude-3-5-haiku-20241022", "claude-3-5-sonnet-20241022"
            ],
            "gemini": [
                "gemini-2.5-flash-preview-04-17", "gemini-2.5-pro-preview-05-06", "gemini-2.0-flash",
                "gemini-2.0-flash-preview-image-generation", "gemini-2.0-flash-lite", "gemini-1.5-flash",
                "gemini-1.5-flash-8b", "gemini-1.5-pro"
            ]
        },
        "default": {
            "provider": "anthropic",
            "model": "claude-sonnet-4-20250514"
        }
    }

# Analytics and usage stats
@api_router.get("/analytics/stats")
async def get_analytics():
    try:
        total_sessions = await db.chat_sessions.count_documents({})
        total_messages = await db.chat_messages.count_documents({})
        total_analyses = await db.document_analyses.count_documents({})
        
        # Recent activity (last 7 days)
        recent_date = datetime.now(timezone.utc) - timedelta(days=7)
        recent_sessions = await db.chat_sessions.count_documents({
            "created_at": {"$gte": recent_date.isoformat()}
        })
        
        return {
            "total_sessions": total_sessions,
            "total_messages": total_messages,
            "total_analyses": total_analyses,
            "recent_sessions": recent_sessions,
            "platform": "AJ STUDIOZ"
        }
    except Exception as e:
        logger.error(f"Analytics error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics")

# Include router in app
app.include_router(api_router)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
