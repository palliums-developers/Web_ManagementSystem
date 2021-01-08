from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_help_group, set_help_group
from redis_check_token import check_token2
import time

parser = reqparse.RequestParser()
parser.add_argument('token', required=True,
                    location='headers', help='token cannot be blank')
parser.add_argument('operation', required=False,
                    help='Operation type cannot be blank')
parser.add_argument('data', required=False, help='Data cannot be blank')

# post: change sort
#           sort[]
#       edit/add group
#           group data
# get: group
#           language


class Group(Resource):
    def post(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'

        # if __temp__['message'] == 'ok':
        #     now = int(time.time())
        #     operation_log_addone(res['inf']['name'], res['inf']['role'],
        #                          __args__.type+'_'+__args__.database, str(__args__.data), now)
        #     return {'status': 'ok', 'message': __temp__['message']}, 201
        # else:
        #     return {'status': 'error', 'message': __temp__['message']}, 501

        result['data'] = set_help_group(
            __args__.operation, eval(__args__.data))

        if result['data'] == 'operation group database successfully':
            return {'status': 'ok', 'message': result['data']}, 201
        else:
            return {'status': 'ok', 'message': result['data']}, 501

    def get(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'
        type = request.args.get('type')
        id = request.args.get('id')
        result['data'] = get_help_group(type, id)
        return result, 200
