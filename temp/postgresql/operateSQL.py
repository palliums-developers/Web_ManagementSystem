# import readIni
# from table import Login, User_data, Operation
from postgresql import readIni
from postgresql.table import Login, User_data, Operation
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime

databaseConf = readIni.getDatebase('violas_backend_management')

postgre_conf = 'postgresql://%s:%s@%s:%s/%s' % (
    databaseConf['user'], databaseConf['password'], databaseConf['host'],
    databaseConf['port'], databaseConf['database'])
engine = create_engine(postgre_conf)
# engine = create_engine(postgre_conf, echo=True)


class operateSQL:
    def __init__(self):
        self.DBSession = sessionmaker(bind=engine)
        self.session = self.DBSession()

    def add(self, object):
        self.session.add(object)
        self.session.commit()

    def addmany(self, objectlist):
        self.session.add_all(objectlist)
        self.session.commit()

    def filterone(self, object, filter):
        return self.session.query(object).filter(filter).first()

    def filterall(self, object, filter):
        return self.session.query(object).filter(filter).all()

    def update(self, object, filter, updic):
        self.session.query(object).filter(filter).update(updic)
        self.session.commit()


# print(operateSQL().filterall(Login, Login.name == 'violas'))
