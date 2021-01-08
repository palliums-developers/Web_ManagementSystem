from util import number2role, role2page
from flask_restful import reqparse, Resource, request
import os
import datetime
import random
from redis_check_token import check_token2

app.config['UPLOAD_FOLDER'] = 'upload/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB
basedir = os.path.abspath(os.path.dirname(__file__))


parser = reqparse.RequestParser()
parser.add_argument('token', required=True, location='headers',
                    help='token cannot be blank')


class Upload(Resource):
    def post(self):
        __args__ = parser.parse_args()
        result = check_token2(__args__.token)
        if result['message'] == 'Unauthenticated':
            return result, 401
        else:
            result['status'] = 'ok'

        _upload_file = request.files['upload_file']
        _upload_file_name_suffix = (_upload_file.filename).rsplit(".", 1)[1]
        nowTime = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        randomNum = random.randint(1000, 9999)
        _new_file_name = str(nowTime)+str(randomNum) + \
            "."+_upload_file_name_suffix
        _upload_file.save(os.path.join(
            app.config['UPLOAD_FOLDER'], _new_file_name))

        return {
            'errno': 0,
            'data': [app.config['UPLOAD_FOLDER'] + _new_file_name]}
