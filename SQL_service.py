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
        temp = self.session().query(object).order_by(object.id).all()
        self.session().close()
        return temp

    def paginate(self, object, limit, offset, name=None, more_than=None, less_than=None):
        Query.paginate = paginate
        temp = {}
        if name:
            if more_than and less_than:
                # temp = self.session().query(object).filter(object.name == name, int(chr(object.time)) > int(more_than), int(chr(object.time)) < int(less_than)).paginate(limit, offset)
                temp = self.session().query(object).filter(object.name == name,
                                                           object.time > int(more_than)-1, object.time < int(less_than)+1).order_by(object.id.desc()).paginate(limit, offset)
            else:
                temp = self.session().query(object).filter(
                    object.name == name).order_by(object.id.desc()).paginate(limit, offset)
        else:
            if more_than and less_than:
                # temp = self.session().query(object).filter(int(object.time) > int(more_than), int(object.time) < int(less_than)).paginate(limit, offset)
                temp = self.session().query(object).filter(object.time > int(more_than)-1, object.time <
                                                           int(less_than)+1).order_by(object.id.desc()).paginate(limit, offset)
            else:
                temp = self.session().query(object).order_by(
                    object.id.desc()).paginate(limit, offset)
        # if more_than and less_than:
        #     temp = self.session().query(object).filter((object.time) > (more_than)
        #                                                ).order_by(object.id.desc()).paginate(limit, offset)
        # temp.close()
        return temp

    def paginate2(self, object, limit, offset, filter):
        Query.paginate = paginate
        if filter:
            return self.session().query(object).order_by(object.id.desc()).filter(filter).paginate(limit, offset)
        else:
            return self.session().query(object).order_by(object.id.desc()).paginate(limit, offset)
