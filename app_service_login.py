from flask_restful import reqparse, abort, Resource
from SQL_operation import login_function
# from SQL_table import Login as Login_table, User_data, Operation

parser = reqparse.RequestParser()
parser.add_argument('username', required=True, help='Username cannot be blank')
parser.add_argument('password', required=True, help='Password cannot be blank')
parser.add_argument('CAPTCHA', required=True, help='CAPTCHA cannot be blank')


class Login(Resource):
    def post(self):
        __args__ = parser.parse_args()
        __temp__ = login_function(__args__.username, __args__.password)
        if __temp__ > 0:
            # return {'message': 'welcome '+__args__.username}, 201
            return {'status': 'ok'}, 201
        # elif __temp__ < 0:
        #     return {'message':'Wrong Username or Password'},202
        else:
            return {'status': 'error'}, 501


# class List(Resource):
#     def get(self):
#         result = operateSQL().filterall(Login_table, Login_table.name == 'violas')
#         print(result)
#         # return result
