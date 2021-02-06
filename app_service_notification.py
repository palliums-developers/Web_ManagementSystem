from flask_restful import reqparse, abort, Resource, request
from redis_check_token import check_token2
from SQL_operation import get_notification, set_notification
import time

parser = reqparse.RequestParser()
parser.add_argument('token', required=True,
                    location='headers', help='token cannot be blank')
parser.add_argument('operation', required=False,
                    help='Operation type cannot be blank')
parser.add_argument('data', required=False, help='Data cannot be blank')


class Notification(Resource):
    def post(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'

        result['data'] = set_notification(__args__.operation,eval(__args__.data)['id'],eval(__args__.data))
        # result['data'] = (eval(__args__.data))
        # print(result)
        if result['data'] == 'success':
            # todo add log
            # now = int(time.time())
            # operation_log_addone(res['inf']['name'], res['inf']['role'],
            #                      __args__.type+'_'+__args__.database, str(__args__.data), now)
            return {'status': 'ok', 'message': result}, 201
        else:
            return {'status': 'error', 'message': result}, 501


    def get(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'
        # result['data'] = get_help_category()
        return result, 200
