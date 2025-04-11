import os
import sys
from pathlib import Path

# Get the absolute path of the current file
current_path = Path(__file__).resolve().parent

# Add the backend directory to Python path
sys.path.insert(0, str(current_path))

# Import the FastAPI app
from app.main import app

# This is for WSGI servers
application = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "wsgi:application",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_dirs=["app"]
    ) 