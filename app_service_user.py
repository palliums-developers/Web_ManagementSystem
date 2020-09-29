from flask_restful import reqparse, abort, Resource, request
from SQL_operation import user_data_get, user_data_new, user_data_edit, user_data_password, user_data_status
import time
from util import str2bool
# from SQL_table import Login as Login_table, User_data, Operation

parser = reqparse.RequestParser()
parser.add_argument('type', required=True, help='Type cannot be blank')
parser.add_argument('name', required=True, help='Username cannot be blank')
parser.add_argument('role')
parser.add_argument('id')
parser.add_argument('email')
parser.add_argument('status')
parser.add_argument('password')


class User(Resource):
    def post(self):
        __args__ = parser.parse_args()
        __temp__ = 0
        if __args__.type == 'edit':
            __temp__ = user_data_edit(
                __args__.id, __args__.name, __args__.email, __args__.role)
        elif __args__.type == 'password':
            __temp__ = user_data_password(__args__.name, __args__.password)
        elif __args__.type == "status":
            __temp__ = user_data_status(
                __args__.name, str2bool(__args__.status))
        elif __args__.type == 'add':
            # default password palliums
            now = int(time.time())
            __temp__ = user_data_new(
                __args__.name, __args__.role, __args__.email, '6e8168918225cd7efd3ea6e26e9a0ba8', now)
        if __temp__ > 0:
            return {'status': 'ok'}, 201
        else:
            return {'status': 'error'}, 501

    def get(self):
        # change status: 0 false 1 true
        # get status: None
        status = request.args.get('status')
        __temp__ = user_data_get(status)
        return __temp__
