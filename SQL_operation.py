import configparser
from sqlalchemy import create_engine
from SQL_service import postgresql_handle
from SQL_table import Login, User_data, Operation
from util import alchemy2json_many

config_path = './config.ini'
config = configparser.ConfigParser()
config.read(config_path)

vls_back = config['violas_backend_management']
vls_back_url = f"{vls_back['dbtype']}+{vls_back['driver']}://{vls_back['user']}:{vls_back['password']}@{vls_back['host']}:{vls_back['port']}/{vls_back['database']}"
# vls_back_url = f"postgresql://{vls_back['user']}:{vls_back['password']}@{vls_back['host']}:{vls_back['port']}/{vls_back['database']}"

# print(vls_back_url)

# print(postgresql_handle(vls_back_url).filterall(Login, Login.name == 'violas'))
# print(postgresql_handle(vls_back_url).list(Login))
# list1=postgresql_handle(vls_back_url).list(Login)
# print(list1)
# for i in list1:
#     print(i.time)


def login_function(username, password):
    data = postgresql_handle(vls_back_url).list(User_data)
    name_boolen = False
    password_boolen = False
    for i in data:
        if username == i.name:
            name_boolen = True
            if password == i.password:
                password_boolen = True
    if name_boolen and password_boolen:
        return 1
    elif name_boolen or password_boolen:
        return -1
    else:
        return 0


def login_log_addone(name, ip, time, address, browser):
    add_data = Login(name=name,
                     ip=ip,
                     time=time,
                     address=address,
                     browser=browser)
    postgresql_handle(vls_back_url).add(add_data)
    return 1


def login_log_list(page, per_page, name=None):
    data_raw = postgresql_handle(vls_back_url).paginate(
        Login, page, per_page, name)
    result = {
        'page': data_raw.page,
        'pages': data_raw.pages,
        'total': data_raw.total,
        'has_prev': data_raw.has_prev,
        'has_next': data_raw.has_next,
        'items': alchemy2json_many(data_raw.items)
    }
    return result


def operation_log_addone(name, role, operation, time):
    add_data = Operation(name=name, role=role, operation=operation, time=time)
    postgresql_handle(vls_back_url).add(add_data)
    return 1

def operation_log_list(page, per_page, name=None):
    data_raw = postgresql_handle(vls_back_url).paginate(
        Operation, page, per_page, name)
    result = {
        'page': data_raw.page,
        'pages': data_raw.pages,
        'total': data_raw.total,
        'has_prev': data_raw.has_prev,
        'has_next': data_raw.has_next,
        'items': alchemy2json_many(data_raw.items)
    }
    return result
# login_function('xingezhe', 'gezhexinlian')
