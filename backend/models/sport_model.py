from sqlalchemy import Column, Integer, String

try:
    from backend.database.database import Base
except ImportError:
    from database.database import Base

class Sport(Base):
    __tablename__ = "sports"

    id = Column(Integer, primary_key=True, index=True)
    sport_name = Column(String(100), nullable=False)
