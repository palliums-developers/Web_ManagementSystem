from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_bank_data,edit_bank_data
import json

parser = reqparse.RequestParser()
parser.add_argument('type', required=True, help='Operation type cannot be blank')
parser.add_argument('database', required=True, help='Database cannot be blank')
parser.add_argument('data', required=True, help='Data cannot be blank')


class Bank(Resource):
    def post(self):
        __args__ = parser.parse_args()
        __temp__=edit_bank_data(__args__.type,__args__.database,eval(__args__.data))
        __temp__=1
        if __temp__ > 0:
            return {'status': 'ok'}, 201
        else:
            return {'status': 'error'}, 501

    def get(self):
        type=request.args.get('type')
        __temp__=get_bank_data(type)
        return __temp__
