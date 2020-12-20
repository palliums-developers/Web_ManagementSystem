from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_bank_data, edit_bank_data, operation_log_addone, get_bank_operation
from util import jwt_operation, redis_operation
from redis_check_token import check_token
import json
import time

parser = reqparse.RequestParser()
parser.add_argument('token', required=False,
                    location='headers', help='token cannot be blank')
parser.add_argument('type', required=False,
                    help='Operation type cannot be blank')
parser.add_argument('database', required=False,
                    help='Database cannot be blank')
parser.add_argument('data', required=False, help='Data cannot be blank')

# post: change sort
#           sort:[]
#       edit/add Group
#           group data
# get: Group
#           language category


class Group(Resource):
    def post(self):
        __args__ = parser.parse_args()
        res = check_token(__args__.token)
        if res['res']['message'] == 'Unauthenticated':
            return res[res], 501
        __temp__ = edit_bank_data(
            __args__.type, __args__.database, eval(__args__.data))

        if __temp__['message'] == 'ok':
            now = int(time.time())
            operation_log_addone(res['inf']['name'], res['inf']['role'],
                                 __args__.type+'_'+__args__.database, str(__args__.data), now)
            return {'status': 'ok', 'message': __temp__['message']}, 201
        else:
            return {'status': 'error', 'message': __temp__['message']}, 501

    def get(self):
        __args__ = parser.parse_args()
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        if not __args__.token == redis_token:
            result = {
                'status': 'error',
                'message': 'Unauthenticated'
            }
            return result, 501
        type = request.args.get('type')  # operation data
        database = request.args.get('database')  # deposit borrow
        if type == 'operation':
            __temp__ = get_bank_operation(database)
        elif type == 'data':
            __temp__ = get_bank_data(database)
        return __temp__

    def change_sort(self):
        now = int(time.time())

    def get_Group(self):
        now = int(time.time())
