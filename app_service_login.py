from flask_restful import reqparse, abort, Resource, request
from SQL_operation import login_function, login_log_addone, get_user_information
import requests
import time
import hashlib
from util import redis_operation, jwt_operation
# from SQL_table import Login as Login_table, User_data, Operation

parser = reqparse.RequestParser()
parser.add_argument('username', required=False,
                    help='Username cannot be blank')
parser.add_argument('password', required=False,
                    help='Password cannot be blank')
parser.add_argument('CAPTCHA', required=False, help='CAPTCHA cannot be blank')
parser.add_argument('browser')
parser.add_argument('token', required=False, location='headers')


class Login(Resource):
    def getLocation(self, ip):
        location_url = 'https://www.ip.cn/api/index?type=1&ip='+ip
        return (requests.get(location_url).json())['address']

    def getMd5(self, passwd):
        salt = 'shuipinggonglian'
        passwd += salt
        m = hashlib.md5()
        m.update(passwd.encode("utf8"))
        return (m.hexdigest())

    def post(self):
        __args__ = parser.parse_args()
        passwd = self.getMd5(__args__.password)
        __temp__ = login_function(__args__.username, passwd)
        ip = request.remote_addr
        now = int(time.time())
        location = self.getLocation(ip)
        # print(__args__.browser, ip, location_url, location, now)
        if __temp__['state'] > 0:
            login_log_addone(__args__.username, ip, now,
                             location, __args__.browser)
            token = jwt_operation('encode', {
                                  'name': __args__.username, 'time': now, 'ip': ip, 'role': __temp__['currentAuthority']})
            redis_operation('set', __args__.username, token)
            __temp__['token'] = token
            return __temp__, 201
        else:
            return __temp__, 501

    # get user information
    def get(self):
        __args__ = parser.parse_args()
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        if not __args__.token == redis_token:
            return {
                'status': 'error',
                'message': 'Unauthenticated'
            }, 501
        result=get_user_information(web_token['name'])
        if result['name']:
            return result,201
        else:
            return {'status':'error'}
#   1 | huangw   | admin  |       |       | qweqwe
#   2 | violas   | admin  |       |       | palliums
#   4 | xingezhe | editor |       |       | gezhexinlian
#   3 | admin    | editor |       |       | gezhexinlian
#   5 | user     | admin  |       |       | iamuserthanks


# class List(Resource):
#     def get(self):
#         result = operateSQL().filterall(Login_table, Login_table.name == 'violas')
#         print(result)
#         # return result
