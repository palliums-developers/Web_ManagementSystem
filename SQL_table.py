from sqlalchemy import Column, Integer, String, BigInteger, Text, Numeric, Boolean
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
    status = Column(Boolean)
    add_time = Column(BigInteger)


class Login(Base):
    __tablename__ = "login"
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    ip = Column(String(20))
    time = Column(String(20))
    location = Column(String(50))
    browser = Column(String(50))


class Operation(Base):
    __tablename__ = "operation"
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    role = Column(String(20))
    operation = Column(String(50))
    time = Column(String(20))


class ViolasBankBorrowProduct(Base):
    __tablename__ = "borrow_product"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(String(32), primary_key=True, nullable=False)
    product_name = Column(String(32), nullable=False)
    logo = Column(String(32), nullable=False)
    minimum_amount = Column(Integer, nullable=False)
    max_limit = Column(Integer, nullable=False)
    pledge_rate = Column(Numeric, nullable=False)
    description = Column(Text, nullable=False)
    intor = Column(Text, nullable=False)
    question = Column(Text, nullable=False)
    currency = Column(String(16), nullable=False)
    rate = Column(Numeric, nullable=True)
    rate_desc = Column(Text, nullable=True)


class ViolasBankDepositProduct(Base):
    __tablename__ = "deposit_product"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    product_id = Column(String(32), primary_key=True, nullable=False)
    product_name = Column(String(32), nullable=False)
    logo = Column(String(32), nullable=False)
    minimum_amount = Column(Integer, nullable=False)
    max_limit = Column(Integer, nullable=False)
    pledge_rate = Column(Numeric, nullable=False)
    description = Column(Text, nullable=False)
    intor = Column(Text, nullable=False)
    question = Column(Text, nullable=False)
    currency = Column(String(16), nullable=False)
    rate = Column(Numeric, nullable=True)
    rate_desc = Column(Text, nullable=True)
