from flask_restful import reqparse, abort, Resource, request
from SQL_operation import operation_log_addone, operation_log_list
# from SQL_table import Login as Login_table, User_data, Operation

parser = reqparse.RequestParser()
parser.add_argument('name', required=True, help='Username cannot be blank')
parser.add_argument('role', required=True, help='Role cannot be blank')
parser.add_argument('operation', required=True,
                    help='Operation cannot be blank')
parser.add_argument('time', required=True, help='Time cannot be blank')


class OperationLog(Resource):
    def post(self):
        __args__ = parser.parse_args()
        __temp__ = operation_log_addone(
            __args__.name, __args__.role, __args__.operation, __args__.time)
        if __temp__ > 0:
            return {'status': 'ok'}, 201
        else:
            return {'status': 'error'}, 501

    def get(self):
        page = int(request.args.get('page'))
        per_page = int(request.args.get('per_page'))
        name = request.args.get('name')
        __temp__ = operation_log_list(page, per_page, name)
        return __temp__
