from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User_data(Base):
    __tablename__ = 'user_data'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    role = Column(String(20))
    phone = Column(String(20))
    email = Column(String(50))
    password = Column(String(50))

class Login(Base):
    __tablename__="login"
    id=Column(Integer, primary_key=True)
    name=Column(String(50))
    ip=Column(String(20))
    time=Column(String(20))
    address=Column(String(50))
    browser=Column(String(50))

class Operation(Base):
    __tablename__="operation"
    id=Column(Integer, primary_key=True)
    name=Column(String(50))
    role=Column(String(20))
    operation=Column(String(50))
    time=Column(String(20))