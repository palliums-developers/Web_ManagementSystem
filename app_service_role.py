from flask_restful import reqparse, Resource, request
from SQL_operation import get_all_role_page, update_role_page
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

        if __args__.type == 'edit_role':
            result['data'] = update_role_page(
                __args__.data.id, __args__.role_name_num)
            # result['data']=update_role_page(3,{'system_notifications':3})
        return result

    def get(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401

        result['data'] = get_all_role_page()

        return result
