from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship

try:
    from backend.database.database import Base
    from backend.models.sport_model import Sport
except ImportError:
    from database.database import Base
    from models.sport_model import Sport

class TrainingLog(Base):
    __tablename__ = "training_logs"

    id = Column(Integer, primary_key=True, index=True)
    sport_id = Column(Integer, ForeignKey("sports.id"), nullable=False)
    training_date = Column(Date, nullable=False)
    hours = Column(Integer, nullable=False)

    sport = relationship("Sport")
