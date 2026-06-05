from sqlalchemy import Column, Integer, Float

try:
    from backend.database.database import Base
except ImportError:
    from database.database import Base

class Performance(Base):
    __tablename__ = "performance"

    id = Column(Integer, primary_key=True, index=True)
    speed = Column(Integer, nullable=False)
    accuracy = Column(Integer, nullable=False)
    stamina = Column(Integer, nullable=False)
    overall_score = Column(Float, nullable=False)
