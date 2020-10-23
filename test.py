import configparser
import redis
import jwt
config_path = './config.ini'
config = configparser.ConfigParser()
config.read(config_path)
databaseConf = config['violas_backend_management']
vls_back_redis = config['vls_back_redis']

postgre_conf = 'postgresql://%s:%s@%s:%s/%s' % (
    databaseConf['user'], databaseConf['password'], databaseConf['host'],
    databaseConf['port'], databaseConf['database'])
print(postgre_conf)

if __name__ == '__main__':
    r = redis.Redis(
        host=vls_back_redis['host'], port=vls_back_redis['port'], password=vls_back_redis['password'], db=vls_back_redis['db'], decode_responses=True)
    # r.set('name', 'acc')
    print(r.set('name', 'bcc',nx=True))
    print(r.get('name'))

token=jwt.encode({'name':'violas','ip':'127.0.0.0'},vls_back_redis['secret'],algorithm='HS256')
print(token)
print(jwt.decode('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidmlvbGFzIiwidGltZSI6MTYwMzI3MjcyOSwiaXAiOiIxMjcuMC4wLjEifQ.MD_iewhaUCJYILpffROQyjepVtiEHb_Y7RlE1yqpc-o',vls_back_redis['secret']))
print(jwt.decode('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoidmlvbGFzIiwidGltZSI6MTYwMzI3Mjg2OCwiaXAiOiIxMjcuMC4wLjEifQ.XlmGoNfyOCUr-poFY65-WO5rzFnHUFzMoi3OQk6m9wo',vls_back_redis['secret']))
print(jwt.decode('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiaHVhbmd3IiwidGltZSI6MTYwMzQzOTkzMywiaXAiOiIxMjcuMC4wLjEiLCJyb2xlIjoiYWRtaW4ifQ.-oHFwx4Rhh-9UpNHaTRsR-g5xDHfJfmqGeo5faOhbDY',vls_back_redis['secret']))