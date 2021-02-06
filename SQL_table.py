from sqlalchemy import Column, Integer, String, BigInteger, Text, Numeric, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class User_data(Base):
    __tablename__ = 'user_data'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50))
    role = Column(String(20))
    phone = Column(String(20))
    email = Column(String(50))
    password = Column(String(50))
    status = Column(Boolean)
    add_time = Column(BigInteger)
    google_authenticator = Column(String(64))


class Login(Base):
    __tablename__ = "login"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50))
    ip = Column(String(20))
    time = Column(String(20))
    location = Column(String(50))
    browser = Column(String(50))


class Operation(Base):
    __tablename__ = "operation"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50))
    role = Column(String(20))
    operation = Column(Text)
    operation_type = Column(String(50))
    time = Column(String(20))

# create table coin_management (id serial primary key, name character(20), precision decimal, min_quantity decimal, max_quantity decimal, status boolean);


# class Coin_management(Base):
#     __tablename__ = "coin_management"
#     id = Column(Integer, primary_key=True)
#     name = Column(String(20))
#     precision = Column(Numeric)
#     min_quantity = Column(Numeric)
#     max_quantity = Column(Numeric)
#     status = Column(Boolean)

class Coin_management(Base):
    __tablename__ = "coin_management"
    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    coin_name = Column(String(20), nullable=False)
    min_num_precision = Column(Numeric, nullable=False)
    min_num_trade = Column(Numeric, nullable=False)
    max_num_trade = Column(Numeric, nullable=False)
    price_precision = Column(Numeric, nullable=False)
    withdraw_fee = Column(Numeric, nullable=False)
    min_num_withdraw = Column(Numeric, nullable=False)
    status_withdraw = Column(Boolean, nullable=False)
    status_recharge = Column(Boolean, nullable=False)
    status = Column(Boolean, nullable=False)


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
    status = Column(Boolean, nullable=False)


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
    status = Column(Boolean, nullable=False)

# 1 | 1000001    | USD存款01    | violas.png |        1000000 | 1000000000 |         0.5 | USD存款测试产品 | [{"title": "①", "text": "对利息的计算规则进行说"}, {"title": "②", "text": "平台保证用户资金的安全"}] | [{"title": "怎么买？", "text": "使用Violas Wallet钱包直接购买。"}, {"title": "安全么？", "text":"很安全"}] | USD      | 0.04 | 年化收益率 |      1000000
# 2 | 1000002    | EUR存款01    | violas.png |        1000000 | 1000000000 |         0.5 | EUR存款测试产品 | [{"title": "①", "text": "对利息的计算规则进行说"}, {"title": "②", "text": "平台保证用户资金的安全"}] | [{"title": "怎么买？", "text": "使用Violas Wallet钱包直接购买。"}, {"title": "安全么？", "text":"很安全"}] | EUR      | 0.02 | 年化收益率 |      1000000

# insert into deposit_product (product_id,product_name,logo,minimum_amount,max_limit,pledge_rate,description,intor,question,currency,rate,rate_desc,minimum_step,status) values ('1000001','USD存款01','violas.png',1000000,1000000000,0.5,'USD存款测试产品','[{"title": "①", "text": "对利息的计算规则进行说"}, {"title": "②", "text": "平台保证 户资金的安全"}]',' [{"title": "怎么买？", "text": "使用Violas Wallet钱包直接购买。"}, {"title": "安全么？", "text":"很安全"}]','USD',0.04,'年化收益率',1000000,true);
# CREATE TABLE table_name(column1 ,PRIMARY id);


class HelpCenterCategory(Base):
    __tablename__ = 'help_center_category'
    id = Column(Integer, primary_key=True, autoincrement=True)
    language = Column(String(64), nullable=False)
    name_en = Column(String(32), nullable=False)
    description_en = Column(Text, nullable=False)
    name_cn = Column(String(32), nullable=True)
    description_cn = Column(Text, nullable=True)
    name_ja = Column(String(32), nullable=True)
    description_ja = Column(Text, nullable=True)
    name_ko = Column(String(32), nullable=True)
    description_ko = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)


class HelpCenterGroup(Base):
    __tablename__ = 'help_center_group'
    id = Column(Integer, primary_key=True, autoincrement=True)
    language = Column(String(64), nullable=False)
    name_en = Column(String(32), nullable=False)
    description_en = Column(Text, nullable=False)
    name_cn = Column(String(32), nullable=True)
    description_cn = Column(Text, nullable=True)
    name_ja = Column(String(32), nullable=True)
    description_ja = Column(Text, nullable=True)
    name_ko = Column(String(32), nullable=True)
    description_ko = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)
    category = Column(Integer, nullable=False)


class HelpCenterArticle(Base):
    __tablename__ = 'help_center_article'
    id = Column(Integer, primary_key=True, autoincrement=True)
    author = Column(String(50), nullable=False)
    group = Column(Integer, nullable=False)
    published = Column(Boolean, nullable=False)
    publish_time = Column(String(20), nullable=False)
    last_edit_time = Column(String(20), nullable=False)
    last_edit_author = Column(String(20), nullable=False)
    language = Column(String(64), nullable=False)
    recommend = Column(Boolean, nullable=False)
    title_en = Column(Text, nullable=False)
    content_en = Column(Text, nullable=False)
    title_cn = Column(Text, nullable=True)
    content_cn = Column(Text, nullable=True)
    title_ja = Column(Text, nullable=True)
    content_ja = Column(Text, nullable=True)
    title_ko = Column(Text, nullable=True)
    content_ko = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)


class RolePageDatabase(Base):
    __tablename__ = 'role_page'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    role = Column(Integer, nullable=False)
    welcome = Column(Integer, nullable=True)
    account = Column(Integer, nullable=True)
    user_management = Column(Integer, nullable=True)
    login_log = Column(Integer, nullable=True)
    operation_log = Column(Integer, nullable=True)
    system_notification = Column(Integer, nullable=True)
    coin_management = Column(Integer, nullable=True)
    deposit = Column(Integer, nullable=True)
    borrow = Column(Integer, nullable=True)
    category = Column(Integer, nullable=True)
    group = Column(Integer, nullable=True)
    article = Column(Integer, nullable=True)


class ViolasNoticeRecord(Base):
    __tablename__ = "notice_record"
    # 排序用序号
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    # 格式a_+md5(标题+内容)，识别消息
    message_id = Column(Text, nullable=False)
    # {"cn":{"title":"titletitle", "summary":"summarysummary", "body":"bodybody","author":"xxxxxx"}}
    content = Column(Text, nullable=False)
    # ["apple","android"，“pc”, "web"]
    platform = Column(Text, nullable=False)
    # 日期
    date = Column(Integer, nullable=False)
    # 是否立即发布
    immediately = Column(Boolean, nullable=False)

# api post {"service":"violas_00", "content":"message_id"}
