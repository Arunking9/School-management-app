import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.main import app
    print("✅ Successfully imported app.main")
    from app.core.config import settings
    print("✅ Successfully imported app.core.config")
    from app.db.session import SessionLocal
    print("✅ Successfully imported app.db.session")
    print("\nAll imports successful! The application should work now.")
except Exception as e:
    print(f"❌ Error: {str(e)}")
    print(f"\nCurrent Python path:")
    for path in sys.path:
        print(f"  - {path}") 