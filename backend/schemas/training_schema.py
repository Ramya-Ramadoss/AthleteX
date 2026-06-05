from pydantic import BaseModel
from datetime import date

class TrainingBase(BaseModel):
    sport_id: int
    training_date: date
    hours: int

class TrainingCreate(TrainingBase):
    pass

class TrainingUpdate(TrainingBase):
    pass

class Training(TrainingBase):
    id: int

    class Config:
        orm_mode = True
