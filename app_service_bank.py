from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_bank_data, edit_bank_data, operation_log_addone,get_bank_operation
from util import jwt_operation, redis_operation
import json
import time

parser = reqparse.RequestParser()
parser.add_argument('token', required=True,
                    location='headers', help='token cannot be blank')
parser.add_argument('type', required=False,
                    help='Operation type cannot be blank')
parser.add_argument('database', required=False, help='Database cannot be blank')
parser.add_argument('data', required=False, help='Data cannot be blank')


class Bank(Resource):
    def post(self):
        __args__ = parser.parse_args()
        result = {
            'status': 'error',
            'message': 'something was wrong'
        }
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        if not __args__.token == redis_token:
            result['message'] = 'Unauthenticated'
            return result, 501
        now = int(time.time())
        __temp__ = edit_bank_data(
            __args__.type, __args__.database, eval(__args__.data))
        if __temp__['message'] == 'ok':
            operation_log_addone(web_token['name'], web_token['role'],
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
        type = request.args.get('type') #operation data
        database=request.args.get('database') #deposit borrow
        if type=='operation':
            __temp__=get_bank_operation(database)
        elif type=='data':
            __temp__ = get_bank_data(database)
        return __temp__
