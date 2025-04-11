import os
import sys
import subprocess
import logging

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_migrations():
    """Run database migrations using the alembic command"""
    try:
        # Get the path to the alembic executable
        import site
        site_packages = site.getsitepackages()[0]
        alembic_path = os.path.join(site_packages, 'Scripts', 'alembic.exe')
        
        if not os.path.exists(alembic_path):
            logger.error(f"Alembic executable not found at {alembic_path}")
            return False
        
        # Run the alembic command
        result = subprocess.run([alembic_path, "upgrade", "head"], 
                               check=True, 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE,
                               text=True)
        
        logger.info(result.stdout)
        logger.info("Migrations completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"Migration failed: {e}")
        logger.error(f"Error output: {e.stderr}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return False

if __name__ == "__main__":
    run_migrations() 