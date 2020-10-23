from flask_restful import reqparse, abort, Resource, request
from SQL_operation import operation_log_addone, operation_log_list2, operation_log_list
from util import redis_operation, jwt_operation
# from SQL_table import Login as Login_table, User_data, Operation

parser = reqparse.RequestParser()
# parser.add_argument('name', required=True, help='Username cannot be blank')
# parser.add_argument('role', required=True, help='Role cannot be blank')
# parser.add_argument('operation', required=True,
#                     help='Operation cannot be blank')
# parser.add_argument('time', required=True, help='Time cannot be blank')
parser.add_argument('token', required=True,
                    location='headers', help='token cannot be blank')


class OperationLog(Resource):
    # def post(self):
    #     __args__ = parser.parse_args()
    #     __temp__ = operation_log_addone(
    #         __args__.name, __args__.role, __args__.operation, __args__.time)
    #     if __temp__ > 0:
    #         return {'status': 'ok'}, 201
    #     else:
    #         return {'status': 'error'}, 501

    def get(self):
        __args__ = parser.parse_args()
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        if not __args__.token == redis_token:
            return {
                'status': 'error',
                'message': 'Unauthenticated'
            }, 501
        page = int(request.args.get('page'))
        per_page = int(request.args.get('per_page'))
        type = request.args.get('type')
        name = request.args.get('name')
        date_start = request.args.get('date_start')
        date_end = request.args.get('date_end')
        __temp__ = operation_log_list2(type, page, per_page, name, date_start, date_end)
        # __temp__ = operation_log_list(
        #     type, page, per_page, name, date_start, date_end)
        return __temp__
