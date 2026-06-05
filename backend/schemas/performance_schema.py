from pydantic import BaseModel

class PerformanceBase(BaseModel):
    speed: int
    accuracy: int
    stamina: int

class PerformanceCreate(PerformanceBase):
    pass

class PerformanceUpdate(PerformanceBase):
    pass

class Performance(PerformanceBase):
    id: int
    overall_score: float

    class Config:
        orm_mode = True
