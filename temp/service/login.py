from flask_restful import reqparse, abort, Resource
from postgresql.operateSQL import operateSQL
from postgresql.table import Login as  Login_table, User_data, Operation

parser = reqparse.RequestParser()
parser.add_argument('username', required=True, help='Username cannot be blank')
parser.add_argument('password', required=True, help='Password cannot be blank')
parser.add_argument('CAPTCHA', required=True, help='CAPTCHA cannot be blank')

TODOS = {
    'todo1': {
        'task': 'build an API'
    },
    'todo2': {
        'task': 'empty'
    },
    'todo3': {
        'task': 'profit!'
    },
    'CAPTCHA': {
        '_CAPTCHA_': '__CAPTCHA__'
    }
}


def abort_if_CAPTCHA_not_exist(__CAPTCHA__):
    if __CAPTCHA__ not in TODOS:
        abort(404, message="{} doesn't exist".format(__CAPTCHA__))


class Login(Resource):
    def post(self):
        args = parser.parse_args()
        print(args)
        return args, 201


class List(Resource):
    def get(self):
        result = operateSQL().filterall(Login_table, Login_table.name=='violas')
        print(result)
        # return result
