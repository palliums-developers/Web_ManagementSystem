from flask_restful import Resource, request, reqparse
from util_captcha import CaptchaTool
from util import redis_operation, jwt_operation
from util_captcha_socket import sendsms
from util_google_authentication import get_auth, verify_auth
import time
from SQL_operation import user_data_phone, operation_log_addone, user_data_google_authenticator, user_data_google_authenticator_get

parser = reqparse.RequestParser()
parser.add_argument('token', location='headers')
parser.add_argument('type')
parser.add_argument('phone')
parser.add_argument('captcha')
parser.add_argument('code')


class CAPTCHA(Resource):
    def post(self):
        __args__ = parser.parse_args()
        __temp__ = 0
        result = {
            'status': 'error',
            'message': 'something was wrong'
        }
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        now = int(time.time())
        if not __args__.token == redis_token:
            result['message'] = 'Unauthenticated'
            return result, 501

        if __args__.type == 'phone':
            redis_phone = redis_operation('get', web_token['name']+'_phone')
            redis_captcha = redis_operation(
                'get', web_token['name']+'_captcha')
            if redis_captcha == __args__.captcha and redis_phone == __args__.phone:
                __temp__ = user_data_phone(web_token['name'], __args__.phone)
                if __temp__ > 0:
                    operation_log_addone(
                        web_token['name'], web_token['role'], 'edit_phone', __args__.phone, now)
                    redis_operation('set', web_token['name']+'_phone', '')
                    redis_operation('set', web_token['name']+'_captcha', '')
                    result['status'] = 'ok'
                    result['message'] = 'phone bind success'

        elif __args__.type == 'get_auth':
            key = get_auth(web_token['name'])
            __temp__ = user_data_google_authenticator(
                web_token['name'], key['secret_key'])
            if __temp__ > 0:
                result = {
                    'status': 'ok',
                    'message': 'change your secret key'
                }
                operation_log_addone(
                    web_token['name'], web_token['role'], 'edit_google_authenticator', key['secret_key'], now)

        elif __args__.type == 'verify_auth':
            secret_key = user_data_google_authenticator_get(web_token['name'])
            data = verify_auth(secret_key, (__args__.code))
            print('#'+secret_key+'#', __args__.code, type(
                __args__.code), data, type(data))
            if data:
                result = {
                    'status': 'ok',
                    'message': 'match captcha'
                }
            else:
                result['message'] = 'maybe the google authenticator not check time'
        return result

    def get(self):
        type = request.args.get('type')

        if(type == 'captcha'):
            new_captcha = CaptchaTool()
            img, code = new_captcha.get_verify_code()
            # # 存入session
            # session["code"] = code
            return {'img': str(img, encoding='utf-8'), 'code': code}, 201
        else:
            __args__ = parser.parse_args()
            web_token = jwt_operation('decode', __args__.token)
            redis_token = redis_operation('get', web_token['name'])
            if not __args__.token == redis_token:
                return {
                    'status': 'error',
                    'message': 'Unauthenticated'
                }, 501
            if(type == 'phone'):
                phone_captcha = sendsms(
                    'smsVer', '+86'+request.args.get('target'))
                redis_operation(
                    'set', web_token['name']+'_phone', request.args.get('target'))
                redis_operation(
                    'set', web_token['name']+'_captcha', phone_captcha)
                return {
                    'status': 'ok',
                    'message': 'check your phone'
                }
