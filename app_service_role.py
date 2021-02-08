from flask_restful import reqparse, Resource, request
from SQL_operation import get_all_role_page, update_role_page, add_role_page, operation_log_addone
from redis_check_token import check_token2
import time

parser = reqparse.RequestParser()
parser.add_argument('token', required=True, location='headers',
                    help='token cannot be blank')
parser.add_argument('type', required=False,
                    help='Operation type cannot be blank')
parser.add_argument('data', required=False, help='Data cannot be blank')


class Role(Resource):
    def post(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'

        temp_data=eval(__args__.data)

        if __args__.type == 'edit':
            result['data'] = update_role_page(
                temp_data['id'], temp_data)
        elif __args__.type == 'add':
            result['data'] = add_role_page(temp_data['name'],temp_data['role'])

        if result['data'] == 'success':
            now = int(time.time())
            operation_log_addone(
                result['username'],
                result['role'],
                __args__.type+'_role',
                str(eval(__args__.data)),
                now)
            return {'status': 'ok', 'message': result['data']}, 201
        else:
            return {'status': 'error', 'message': result['data']}, 501

    def get(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401

        result['data'] = get_all_role_page()

        return result
