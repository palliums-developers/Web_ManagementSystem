from flask_restful import reqparse, abort, Resource, request
from SQL_operation import login_function, login_log_addone, get_user_information, user_data_google_authenticator_get
import time
from util_redis_jwt import redis_operation, jwt_operation
from util_google_authentication import verify_auth
from util import getLocation, getMd5
from redis_check_token import check_token

parser = reqparse.RequestParser()
parser.add_argument('username', required=False,
                    help='Username cannot be blank')
parser.add_argument('password', required=False,
                    help='Password cannot be blank')
parser.add_argument('CAPTCHA', required=False, help='CAPTCHA cannot be blank')
parser.add_argument('browser')
parser.add_argument('token', required=False, location='headers')
parser.add_argument('google')


class Login(Resource):
    # def getLocation(self, ip):
    #     location_url = 'https://www.ip.cn/api/index?type=1&ip='+ip
    #     return (requests.get(location_url).json())['address']

    # def getMd5(self, passwd):
    #     salt = 'shuipinggonglian'
    #     passwd += salt
    #     m = hashlib.md5()
    #     m.update(passwd.encode("utf8"))
    #     return (m.hexdigest())

    # def post(self):
    #     __args__ = parser.parse_args()
    #     passwd = self.getMd5(__args__.password)
    #     __temp__ = login_function(__args__.username, passwd)
    #     ip = request.remote_addr
    #     now = int(time.time())
    #     location = self.getLocation(ip)
    #     # print(__args__.browser, ip, location_url, location, now)
    #     if __temp__['state'] > 0:
    #         __google__ = user_data_google_authenticator_get(__args__.username)
    #         if __google__:
    #             __temp__['google'] = __google__
    #         else:
    #             __temp__['google'] = 'none'
    #         login_log_addone(__args__.username, ip, now,
    #                          location, __args__.browser)
    #         token = jwt_operation('encode', {
    #                               'name': __args__.username, 'time': now, 'ip': ip, 'role': __temp__['currentAuthority']})
    #         redis_operation('set', __args__.username, token)
    #         __temp__['token'] = token
    #         return __temp__, 201
    #     else:
    #         return __temp__, 501

    def post(self):
        __args__ = parser.parse_args()
        encode_passwd = getMd5(__args__.password)
        logging = login_function(__args__.username, encode_passwd)
        if logging['state'] > 0:
            google = user_data_google_authenticator_get(__args__.username)
            if google:
                logging['google'] = google
            else:
                logging['google'] = 'none'
            ip = request.remote_addr
            location = getLocation(ip)
            now = int(time.time())
            login_log_addone(__args__.username, ip, now,
                             location, __args__.browser)
            token = jwt_operation('encode', {
                'name': __args__.username,
                'time': now,
                'ip': ip,
                'role': logging['currentAuthority']
            })
            redis_operation('set', __args__.username, token)
            logging['token'] = token
            return logging, 201
        else:
            return logging, 501

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
        result = get_user_information(web_token['name'])
        if result['name']:
            return result, 201
        else:
            return {'status': 'error'}
#   1 | huangw   | admin  |       |       | qweqwe
#   2 | violas   | admin  |       |       | palliums
#   4 | xingezhe | editor |       |       | qweqwe
#   3 | admin    | editor |       |       | gezhexinlian
#   5 | user     | admin  |       |       | iamuserthanks
