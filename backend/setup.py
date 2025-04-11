import os
import sys
import subprocess
import logging

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_command(command):
    """Run a command and log the output"""
    logger.info(f"Running command: {command}")
    try:
        result = subprocess.run(command, shell=True, check=True, 
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                               text=True)
        logger.info(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Command failed: {e}")
        logger.error(f"Error output: {e.stderr}")
        return False

def setup_database():
    """Set up the database and run migrations"""
    # Run migrations
    if not run_command("python run_migrations.py"):
        logger.error("Migrations failed")
        return False
    
    # Initialize database
    if not run_command("python init_db.py"):
        logger.error("Database initialization failed")
        return False
    
    logger.info("Database setup completed successfully")
    return True

if __name__ == "__main__":
    setup_database() 