from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_user_information, get_all_role_page
import time
from util_redis_jwt import redis_operation, jwt_operation
from util_google_authentication import verify_auth
from util import getLocation, getMd5
from redis_check_token import check_token
from util_role import number2role, role2page

parser = reqparse.RequestParser()
parser.add_argument('token', required=False, location='headers')


class CurrentUser(Resource):
    def get(self):
        __args__ = parser.parse_args()
        if __args__.token == 'token' or not __args__.token:
            return {
                'status': 'error',
                'message': 'Please Log in'
            }, 401
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        if not __args__.token == redis_token:
            return {
                'status': 'error',
                'message': 'Unauthenticated'
            }, 401
        result = get_user_information(web_token['name'])
        result['role_name'] = (number2role(
            int(result['role']), get_all_role_page()))
        result['access'] = role2page(
            result['role_name'], get_all_role_page())
        if result['name']:
            return result, 201
        else:
            return {'status': 'error'}
#   1 | huangw   | admin  |       |       | qweqwe
#   2 | violas   | admin  |       |       | palliums
#   4 | xingezhe | editor |       |       | qweqwe
#   3 | admin    | editor |       |       | gezhexinlian
#   5 | user     | admin  |       |       | iamuserthanks
