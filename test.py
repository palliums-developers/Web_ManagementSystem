import configparser
config_path = './config.ini'
config = configparser.ConfigParser()
config.read(config_path)
databaseConf=config['violas_backend_management']

postgre_conf = 'postgresql://%s:%s@%s:%s/%s' % (
    databaseConf['user'], databaseConf['password'], databaseConf['host'],
    databaseConf['port'], databaseConf['database'])
print(postgre_conf)
