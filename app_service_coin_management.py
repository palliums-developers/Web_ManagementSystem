from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_coin_data, get_coin_log, add_coin_data, edit_coin_data, status_coin_data, operation_log_addone
from util_redis_jwt import jwt_operation, redis_operation
import time

parser = reqparse.RequestParser()
parser.add_argument('token', required=True,
                    location='headers', help='token cannot be blank')
parser.add_argument('type', required=False,
                    help='Operation type cannot be blank')
parser.add_argument('data', required=False, help='Data cannot be blank')


class CoinManagement(Resource):
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
            return result, 401

# type:status,edit,add
        data = eval(__args__.data)
        __temp__ = {'status': 'error'}
        if __args__.type == 'status':
            __temp__ = status_coin_data(
                data['id'],
                data['status_name'],
                data['status'])
        elif __args__.type == 'add':
            __temp__ = add_coin_data(data)
        elif __args__.type == 'edit':
            print(data)
            __temp__ = edit_coin_data(data)

        if __temp__['status'] == 'ok':
            now = int(time.time())
            operation_log_addone(
                web_token['name'],
                web_token['role'],
                __args__.type+'_coin_management',
                str(__args__.data),
                now)
            return __temp__, 201
        else:
            return __temp__, 501

    def get(self):
        result = {
            'status': 'error',
            'message': 'Unauthenticated'
        }
        __args__ = parser.parse_args()
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        if not __args__.token == redis_token:
            return result, 401

        result['status'] = 'ok'

# operation data
        type = request.args.get('type')
        if type == 'operation':
            result['message'] = 'get coin management operation log'
            result['data'] = get_coin_log()

        elif type == 'data':
            result['message'] = 'get coin management list data'
            # result['coin_name']
            result['data'] = get_coin_data()

        return result
