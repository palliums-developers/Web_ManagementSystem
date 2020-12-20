from util import redis_operation, jwt_operation


def check_token(encode_token):
    result = {
        'res': {
            'status': 'error',
            'message': 'Unauthenticated'
        },
        'inf':{
            'name':'',
            'role':''
        }
    }
    web_token = jwt_operation('decode', encode_token)
    redis_token = redis_operation('get', web_token['name'])
    if encode_token == redis_token:
        result['res']['message'] = 'authenticated'
        result['inf']['name']=web_token['name']
        result['inf']['role']=web_token['role']
        return result
    else:
        return result
