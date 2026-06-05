from pydantic import BaseModel

class SportBase(BaseModel):
    sport_name: str

class SportCreate(SportBase):
    pass

class SportUpdate(SportBase):
    pass

class Sport(SportBase):
    id: int

    class Config:
        orm_mode = True
