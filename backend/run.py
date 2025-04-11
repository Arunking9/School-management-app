import os
import sys
import logging
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    try:
        logger.info("Starting School Management System API...")
        uvicorn.run(
            "app.main:app",
            host="127.0.0.1",
            port=8001,
            reload=False,  # Disable reload to avoid multiprocessing issues
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start the application: {str(e)}")
        sys.exit(1) 