from flask_restful import reqparse, abort, Resource, request
from redis_check_token import check_token2
from SQL_operation import get_notification, set_notification, operation_log_addone
import time

parser = reqparse.RequestParser()
parser.add_argument('token', required=True,
                    location='headers', help='token cannot be blank')
parser.add_argument('operation', required=False,
                    help='Operation type cannot be blank')
parser.add_argument('data', required=False, help='Data cannot be blank')


class Notification(Resource):

    def add_author(self, data, author):
        data['content']['en']['author'] = author
        data['content']['cn']['author'] = author
        data['content']['ja']['author'] = author
        data['content']['ko']['author'] = author
        data['platform'] = ','.join(data['platform'])
        return data

    def decode_content(self, data):
        temp = eval(data['content'])
        data['content'] = temp

    def post(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'
        usedData = self.add_author(eval(__args__.data), result['username'])
        # print(usedData)
        result['data'] = set_notification(__args__.operation, usedData)
        if result['data'] == 'success':
            now = int(time.time())
            operation_log_addone(
                result['username'],
                result['role'],
                __args__.operation+'_notification',
                str(usedData['content']['en']['title']),
                now)
            return {'status': 'ok', 'message': result}, 201
        else:
            return {'status': 'error', 'message': result}, 501

    def get(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'
        result['data'] = get_notification('all', 0)
        for i in result['data']:
            self.decode_content(i)
        return result, 200
