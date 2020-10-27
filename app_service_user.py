from flask_restful import reqparse, abort, Resource, request
from SQL_operation import user_data_get, user_data_new, user_data_edit, user_data_password, user_data_status, operation_log_addone
import time
from util import str2bool, redis_operation, jwt_operation
# from SQL_table import Login as Login_table, User_data, Operation

parser = reqparse.RequestParser()
parser.add_argument('token', required=True,
                    location='headers', help='token cannot be blank')
parser.add_argument('type', required=False, help='Type cannot be blank')
parser.add_argument('name', required=False, help='Username cannot be blank')
parser.add_argument('role')
parser.add_argument('id')
parser.add_argument('email')
parser.add_argument('status')
parser.add_argument('password')


class User(Resource):
    # first check the token,
    # then post data to edit user data, change password, change user status and add new user
    def post(self):
        __args__ = parser.parse_args()
        __temp__ = 0
        result = {
            'status': 'error',
            'message': 'something was wrong'
        }
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        now = int(time.time())
        if not __args__.token == redis_token:
            result['message'] = 'Unauthenticated'
            return result, 501

        if __args__.type == 'edit':
            __temp__ = user_data_edit(
                __args__.id, __args__.name, __args__.email, __args__.role)
            if(__temp__ > 0):
                result['message'] = 'edit data successfully'
                operation_log_addone(web_token['name'], web_token['role'], 'edit_user', (
                    'id: '+__args__.id+', name: '+__args__.name+', email: '+__args__.email+', role: '+__args__.role), now)
            else:
                result['message'] = 'edit data failed'
        elif __args__.type == 'password':
            __temp__ = user_data_password(__args__.name, __args__.password)
            if(__temp__ > 0):
                result['message'] = 'change password successfully'
                operation_log_addone(web_token['name'], web_token['role'],
                                     'password_user', 'Change '+__args__.name+' password', now)
            else:
                result['message'] = 'change password failed'
        elif __args__.type == "status":
            __temp__ = user_data_status(
                __args__.name, str2bool(__args__.status))
            if(__temp__ > 0):
                result['message'] = 'change status successfully'
                operation_log_addone(web_token['name'], web_token['role'], 'status_user',
                                     'Change '+__args__.name+' status to '+__args__.status, now)
            else:
                result['message'] = 'change status failed'
        elif __args__.type == 'add':
            # default password palliums
            __temp__ = user_data_new(
                __args__.name, __args__.role, __args__.email, '6e8168918225cd7efd3ea6e26e9a0ba8', now)
            if(__temp__ > 0):
                result['message'] = 'add user successfully'
                operation_log_addone(web_token['name'], web_token['role'], 'add_user',
                                     'name: '+__args__.name+', role: '+__args__.role+', email: '+__args__.email, now)
            else:
                result['message'] = 'add user failed'

        if __temp__ > 0:
            redis_operation('set', web_token['name'], __args__.token)
            result['status'] = 'ok'
            return result, 201
        else:
            return result, 501

    # get user list with parameter status
    def get(self):
        __args__ = parser.parse_args()
        web_token = jwt_operation('decode', __args__.token)
        redis_token = redis_operation('get', web_token['name'])
        if not __args__.token == redis_token:
            return {
                'status': 'error',
                'message': 'Unauthenticated'
            }, 501
        status = request.args.get('status')
        __temp__ = user_data_get(status)
        redis_operation('set', web_token['name'], __args__.token)
        return __temp__
