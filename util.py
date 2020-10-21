from sqlalchemy.orm import Query
import math
# from flask import request, abort
from flask_restful import request, abort
import redis
import configparser
import jwt


def alchemy2json_one(model):
    """ Returns a JSON representation of an SQLAlchemy-backed object. """
    json = {}
    # json['fields'] = {}
    # json['pk'] = getattr(model, 'id')
    for col in model._sa_class_manager.mapper.mapped_table.columns:
        # json['fields'][col.name] = getattr(model, col.name)
        json[col.name] = getattr(model, col.name)
    # return dumps([json])
    return json


def alchemy2json_many(model_list):
    json_list = []
    for model in model_list:
        json_list.append(alchemy2json_one(model))
    return json_list


def str2bool(v):
    return v.lower() in ("yes", "true", "t", "1")


class Pagination(object):
    """
    分页对象
    """

    def __init__(self, query, page, per_page, total, items):
        self.query = query
        self.page = page
        self.per_page = per_page
        self.total = total
        self.items = items

    @property
    def pages(self):
        if self.per_page == 0:
            pages = 0
        else:
            pages = int(math.ceil(self.total / float(self.per_page)))
        return pages

    def prev(self, error_out=False):
        assert self.query is not None, 'a query object is required ' \
                                       'for this method to work'
        return self.query.paginate(self.page - 1, self.per_page, error_out)

    @property
    def prev_num(self):
        if not self.has_prev:
            return None
        return self.page - 1

    @property
    def has_prev(self):
        return self.page > 1

    def next(self, error_out=False):
        assert self.query is not None, 'a query object is required ' \
                                       'for this method to work'
        return self.query.paginate(self.page + 1, self.per_page, error_out)

    @property
    def has_next(self):
        return self.page < self.pages

    @property
    def next_num(self):
        if not self.has_next:
            return None
        return self.page + 1

    def iter_pages(self, left_edge=2, left_current=2,
                   right_current=5, right_edge=2):
        last = 0
        for num in xrange(1, self.pages + 1):
            if num <= left_edge or \
               (num > self.page - left_current - 1 and
                num < self.page + right_current) or \
               num > self.pages - right_edge:
                if last + 1 != num:
                    yield None
                yield num
                last = num


def paginate(self, page=None, per_page=None, error_out=True):
    """
    分页函数
    :param self:
    :param page:
    :param per_page:
    :param error_out:
    :return:
    """
    print(request)
    if request:
        if page is None:
            try:
                page = int(request.args.get('page', 1))
            except (TypeError, ValueError):
                if error_out:
                    abort(404)

                page = 1

        if per_page is None:
            try:
                per_page = int(request.args.get('per_page', 20))
            except (TypeError, ValueError):
                if error_out:
                    abort(404)

                per_page = 20
    else:
        if page is None:
            page = 1

        if per_page is None:
            per_page = 20

    if error_out and page < 1:
        abort(404)

    items = self.limit(per_page).offset((page - 1) * per_page).all()

    if not items and page != 1 and error_out:
        abort(404)

    if page == 1 and len(items) < per_page:
        total = len(items)
    else:
        total = self.order_by(None).count()

    return Pagination(self, page, per_page, total, items)


config_path = './config.ini'
config = configparser.ConfigParser()
config.read(config_path)
vls_back_redis = config['vls_back_redis']

# set(name, value, ex=None, px=None, nx=False, xx=False)
#     ex：过期时间（秒），时间到了后redis会自动删除
#     px：过期时间（毫秒），时间到了后redis会自动删除。ex、px二选一即可
#     nx：如果设置为True，则只有name不存在时，当前set操作才执行
#     xx：如果设置为True，则只有name存在时，当前set操作才执行


def redis_operation(operation, key, value=''):
    r = redis.Redis(
        host=vls_back_redis['host'],
        port=vls_back_redis['port'],
        password=vls_back_redis['password'],
        db=vls_back_redis['db'],
        decode_responses=True)
    if operation == 'get':
        return r.get(key)
    elif operation == 'set':
        return r.set(key, value, ex=vls_back_redis['expire'])
    elif operation == 'del':
        return r.set()
    elif operation == 'update':
        return r.getset(key, value)


def jwt_operation(operation, payload):
    if operation == 'encode':
        return jwt.encode(payload, vls_back_redis['secret'], algorithm='HS256').decode('UTF-8')
    elif operation == 'decode':
        return jwt.decode(payload, vls_back_redis['secret'])

# class Redis(object):
#     """
#     redis数据库操作
#     """

#     @staticmethod
#     def _get_r():
#         host = vls_back_redis['host']
#         port = vls_back_redis['port']
#         db = vls_back_redis['db']
#         expire=vls_back_redis['expire']
#         password=vls_back_redis['password']
#         r = redis.StrictRedis(host, port, db,password)
#         return r

#     @classmethod
#     def write(cls, key, value, expire=None):
#         """
#         写入键值对
#         """
#         # 判断是否有过期时间，没有就设置默认值
#         if expire:
#             expire_in_seconds = expire
#         else:
#             expire_in_seconds = current_app.config['REDIS_EXPIRE']
#         r = cls._get_r()
#         r.set(key, value, ex=expire_in_seconds)

#     @classmethod
#     def read(cls, key):
#         """
#         读取键值对内容
#         """
#         r = cls._get_r()
#         value = r.get(key)
#         return value.decode('utf-8') if value else value

#     @classmethod
#     def hset(cls, name, key, value):
#         """
#         写入hash表
#         """
#         r = cls._get_r()
#         r.hset(name, key, value)

#     @classmethod
#     def hmset(cls, key, *value):
#         """
#         读取指定hash表的所有给定字段的值
#         """
#         r = cls._get_r()
#         value = r.hmset(key, *value)
#         return value

#     @classmethod
#     def hget(cls, name, key):
#         """
#         读取指定hash表的键值
#         """
#         r = cls._get_r()
#         value = r.hget(name, key)
#         return value.decode('utf-8') if value else value

#     @classmethod
#     def hgetall(cls, name):
#         """
#         获取指定hash表所有的值
#         """
#         r = cls._get_r()
#         return r.hgetall(name)

#     @classmethod
#     def delete(cls, *names):
#         """
#         删除一个或者多个
#         """
#         r = cls._get_r()
#         r.delete(*names)

#     @classmethod
#     def hdel(cls, name, key):
#         """
#         删除指定hash表的键值
#         """
#         r = cls._get_r()
#         r.hdel(name, key)

#     @classmethod
#     def expire(cls, name, expire=None):
#         """
#         设置过期时间
#         """
#         if expire:
#             expire_in_seconds = expire
#         else:
#             expire_in_seconds = current_app.config['REDIS_EXPIRE']
#         r = cls._get_r()
#         r.expire(name, expire_in_seconds)
