import configparser
import redis
import jwt


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
