from flask_restful import reqparse, abort, Resource, request
from SQL_operation import get_help_center


class HelpCenter(Resource):

    def get(self):
        page = request.args.get('type')
        key = request.args.get('key')
        language = request.args.get('language')
        # if type!='search' and type(key)=='string':
        #     return {'status':'wrong', 'message':'error key type'}
        result = get_help_center(page, key, language)
        return result, 200
