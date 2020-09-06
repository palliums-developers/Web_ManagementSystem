import readIni
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import table
import datetime

databaseConf = readIni.getDatebase('violas_backend_management')

postgre_conf = 'postgresql://%s:%s@%s:%s/%s' % (
    databaseConf['user'], databaseConf['password'], databaseConf['host'],
    databaseConf['port'], databaseConf['database'])
engine = create_engine(postgre_conf, echo=True)

DBsession = sessionmaker(bind=engine)
session = DBsession()

# Base = declarative_base()


# class User_data(Base):
#     __tablename__ = 'user_data'
#     id = Column(Integer, primary_key=True)
#     name = Column(String(50))
#     role = Column(String(20))
#     phone = Column(String(20))
#     email = Column(String(50))
#     password = Column(String(50))


# class Login(Base):
#     __tablename__ = "login"
#     id = Column(Integer, primary_key=True)
#     name = Column(String(50))
#     ip = Column(String(20))
#     time = Column(String(20))
#     address = Column(String(50))
#     browser = Column(String(50))


# class Operation(Base):
#     __tablename__ = "operation"
#     id = Column(Integer, primary_key=True)
#     name = Column(String(50))
#     role = Column(String(20))
#     operation = Column(String(50))
#     time = Column(String(20))


temp = table.Login(name="violas", time='123123', browser="firefox")
# temp = User_data(name="xingezhe", role="editor", password="gezhexinlian")
# print((table.Login()))

session.add_all([temp])
session.commit()
session.close()
