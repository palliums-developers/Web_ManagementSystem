from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_user_data, add_user_data
import time
# from SQL_table import Login as Login_table, User_data, Operation

parser = reqparse.RequestParser()
parser.add_argument('name', required=True, help='Username cannot be blank')
parser.add_argument('role', required=True, help='Role cannot be blank')
# parser.add_argument('phone')
parser.add_argument('email', required=True, help='Email cannot be blank')
# parser.add_argument('status')
# parser.add_argument('password')


class User(Resource):
    def post(self):
        now = int(time.time())
        __args__ = parser.parse_args()
        __temp__ = add_user_data(
            __args__.name, __args__.role, __args__.email, '6e8168918225cd7efd3ea6e26e9a0ba8', now)
        if __temp__ > 0:
            return {'status': 'ok'}, 201
        else:
            return {'status': 'error'}, 501

    def get(self):
        # change status: 0 false 1 true
        # get status: None
        status = request.args.get('status')
        __temp__ = get_user_data(status)
        return __temp__
