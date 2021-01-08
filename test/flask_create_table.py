from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import time

# 创建数据库实例
app = Flask(__name__)
db_url = 'postgres+psycopg2://postgres:qazokm@localhost:5432/violas_data'
# url的格式为：数据库的协议：//用户名：密码@ip地址：端口号（默认可以不写）/数据库名
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
# 动态追踪数据库的修改. 性能不好. 且未来版本中会移除. 目前只是为了解决控制台的提示才写的
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
# 查询时会显示原始SQL语句
app.config['SQLALCHEMY_ECHO'] = True
# 数据库对象
db = SQLAlchemy(app)

now = int(time.time())

# 创建 b_data 表 实体类
# class b_data(db.Model):
#     __tablename__ = "b_data"
#     Id = db.Column(db.Integer, autoincrement=True,
#                    primary_key=True, nullable=False)
#     Position = db.Column(db.String(200), nullable=False, default='')
#     CorporateName = db.Column(db.String(500), nullable=False, default='')
#     WorkingPlace = db.Column(db.String(1000), nullable=False, default='')
#     Salary = db.Column(db.String(200), nullable=False, default='')
#     ReleaseTime = db.Column(db.String(300), nullable=False, default='')
#     DataTime = db.Column(db.DateTime, nullable=False, default=time.strftime(
#         "%Y-%m-%d %H:%M:%S", time.localtime()))

# class HelpCenterGroup(db.Model):
#     __tablename__ = 'help_center_group'
#     id = db.Column(db.Integer, primary_key=True,
#                    autoincrement=True, nullable=False)
#     language = db.Column(db.String(64), nullable=False)
#     name_en = db.Column(db.String(32), nullable=False)
#     description_en = db.Column(db.Text, nullable=False)
#     name_cn = db.Column(db.String(32), nullable=True)
#     description_cn = db.Column(db.Text, nullable=True)
#     name_ja = db.Column(db.String(32), nullable=True)
#     description_ja = db.Column(db.Text, nullable=True)
#     name_ko = db.Column(db.String(32), nullable=True)
#     description_ko = db.Column(db.Text, nullable=True)
#     order = db.Column(db.Integer, nullable=False)
#     category = db.Column(db.Integer, nullable=False)


class HelpCenterArticle(db.Model):
    __tablename__ = 'help_center_article'
    id = db.Column(db.Integer, primary_key=True,
                   autoincrement=True, nullable=False)
    author = db.Column(db.String(50), nullable=False)
    group = db.Column(db.Integer, nullable=False)
    published = db.Column(db.Boolean, nullable=False)
    publish_time = db.Column(db.String(20), nullable=False)
    last_edit_time = db.Column(db.String(20), nullable=False)
    last_edit_author = db.Column(db.String(20), nullable=False)
    language = db.Column(db.String(64), nullable=False)
    recommend = db.Column(db.Boolean, nullable=False)
    title_en = db.Column(db.Text, nullable=False)
    content_en = db.Column(db.Text, nullable=False)
    title_cn = db.Column(db.Text, nullable=True)
    content_cn = db.Column(db.Text, nullable=True)
    title_ja = db.Column(db.Text, nullable=True)
    content_ja = db.Column(db.Text, nullable=True)
    title_ko = db.Column(db.Text, nullable=True)
    content_ko = db.Column(db.Text, nullable=True)


# class RolePageDatabase(db.Model):
#     __tablename__ = 'role_page'
#     id = db.Column(db.Integer,autoincrement=True, primary_key=True, nullable=False)
#     name = db.Column(db.String(50), nullable=False)
#     role = db.Column(db.Integer, nullable=False)
#     welcome = db.Column(db.Integer, nullable=True)
#     account = db.Column(db.Integer, nullable=True)
#     user_management = db.Column(db.Integer, nullable=True)
#     login_log = db.Column(db.Integer, nullable=True)
#     operation_log = db.Column(db.Integer, nullable=True)
#     system_notification = db.Column(db.Integer, nullable=True)
#     coin_management = db.Column(db.Integer, nullable=True)
#     deposit = db.Column(db.Integer, nullable=True)
#     borrow = db.Column(db.Integer, nullable=True)
#     category = db.Column(db.Integer, nullable=True)
#     group = db.Column(db.Integer, nullable=True)
#     article = db.Column(db.Integer, nullable=True)

# class Coin_management(db.Model):
#     __tablename__ = "coin_management"
#     id = db.Column(db.Integer,autoincrement=True, primary_key=True, nullable=False)
#     coin_name = db.Column(db.String(20), nullable=False)
#     min_num_precision = db.Column(db.Numeric, nullable=False)
#     min_num_trade = db.Column(db.Numeric, nullable=False)
#     max_num_trade = db.Column(db.Numeric, nullable=False)
#     price_precision = db.Column(db.Numeric, nullable=False)
#     withdraw_fee = db.Column(db.Numeric, nullable=False)
#     min_num_withdraw = db.Column(db.Numeric, nullable=False)
#     status_withdraw = db.Column(db.Boolean, nullable=False)
#     status_recharge = db.Column(db.Boolean, nullable=False)
#     status = db.Column(db.Boolean, nullable=False)


if __name__ == '__main__':
    # db.drop_all()

    # db.create_all()

    # d1 = b_data()
    # d1.Position = 'asdasdas'
    # d1.Salary = 'asdasdas'
    # db.session.add(d1)
    # db.session.commit()

    # dd=RolePageDatabase()
    # # dd.id=4
    # dd.name='operation'
    # dd.role=4
    # dd.welcome=1
    # dd.account=3
    # dd.user_management=1
    # dd.login_log=1
    # dd.operation_log=1
    # dd.system_notification=1
    # dd.coin_management=1
    # dd.deposit=1
    # dd.borrow=1
    # dd.category=1
    # dd.group=1
    # dd.article=1

    # dd = Coin_management()
    # dd.coin_name = 'LBR'
    # dd.min_num_precision = 0.01
    # dd.min_num_trade = 10
    # dd.max_num_trade = 1000
    # dd.price_precision = 10000
    # dd.withdraw_fee=1000
    # dd.min_num_withdraw=1000
    # dd.status_withdraw=True
    # dd.status_recharge=True
    # dd.status=True

    dd=HelpCenterArticle()
    # dd.id=4
    dd.author='huangw'
    dd.group=1
    dd.published=True
    dd.publish_time=now
    dd.last_edit_time=''
    dd.last_edit_author=''
    dd.language='EN'
    dd.recommend=True
    dd.title_en='eleven'
    dd.content_en='<a>link</a>'
    dd.title_cn=''
    dd.content_cn=''
    dd.title_ja=''
    dd.content_ja=''
    dd.title_ko=''
    dd.content_ko=''
    dd.order=2

    db.session.add(dd)
    db.session.commit()
