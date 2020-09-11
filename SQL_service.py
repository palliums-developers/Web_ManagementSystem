from SQL_table import Login, User_data, Operation
from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker, Query
from sqlalchemy.exc import OperationalError
import datetime
from util import paginate


class postgresql_handle:
    def __init__(self, dbUrl):
        self.engine = create_engine(dbUrl)
        self.DBSession = sessionmaker(bind=self.engine)
        self.session = self.DBSession

    def add(self, object):
        temp = self.session()
        temp.add(object)
        temp.commit()
        temp.close()

    def addmany(self, objectlist):
        temp = self.session()
        temp.add_all(objectlist)
        temp.commit()

    def filterone(self, object, filter):
        temp = self.session()
        return temp.query(object).filter(filter).first()

    def filterall(self, object, filter):
        temp = self.session()
        return temp.query(object).filter(filter).all()

    def update(self, object, filter, updic):
        temp = self.session()
        temp.query(object).filter(filter).update(updic)
        temp.commit()

    def list(self, object):
        temp = self.session().query(object).all()
        self.session().close()
        return temp

    def paginate(self, object, limit, offset, name=None):
        Query.paginate = paginate
        if name:
            temp = self.session().query(object).filter(
                object.name == name).paginate(limit, offset)
        else:
            temp = self.session().query(object).paginate(limit, offset)
        # temp.close()
        return temp
