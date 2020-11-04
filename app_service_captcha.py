from flask_restful import Resource, request, reqparse
from util_captcha import CaptchaTool

parser = reqparse.RequestParser()
parser.add_argument('captcha')
parser.add_argument('code')


class CAPTCHA(Resource):
    # def post(self):
    #     __args__ = parser.parse_args()
    #     # obj = request.get_json(force=True)
    #     captcha = __args__.captcha
    #     code = __args__.code
    #     print(code, captcha)
    #     if not all([code, captcha]):
    #         return {
    #             'message': 'err parm'
    #         }, 501
    #     if code != captcha:
    #         return {
    #             'message': 'error'
    #         }, 201
    #     return {'message':'ok'}

    def get(self):
        new_captcha = CaptchaTool()
        img, code = new_captcha.get_verify_code()
        # # 存入session
        # session["code"] = code
        return {'img': str(img, encoding='utf-8'), 'code': code}, 201
