from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_bank_data

# parser = reqparse.RequestParser()
# parser.add_argument('name', required=True, help='Username cannot be blank')
# parser.add_argument('ip', required=True, help='ip cannot be blank')
# parser.add_argument('time', required=True, help='time cannot be blank')
# parser.add_argument('address', required=True, help='address cannot be blank')
# parser.add_argument('browser', required=True, help='browser cannot be blank')


class Bank(Resource):
    # def post(self):
    #     __args__ = parser.parse_args()
    #     __temp__ = login_log_addone(__args__.name, __args__.ip, __args__.time,
    #                                 __args__.address, __args__.browser)
    #     if __temp__ > 0:
    #         return {'status': 'ok'}, 201
    #     else:
    #         return {'status': 'error'}, 501

    def get(self):
        # page = int(request.args.get('page'))
        # per_page = int(request.args.get('per_page'))
        # name = request.args.get('name')
        # date_start = request.args.get('date_start')
        # date_end = request.args.get('date_end')
        # __temp__ = login_log_list(page, per_page, name, date_start, date_end)
        type=request.args.get('type')
        __temp__=get_bank_data(type)
        return __temp__
