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
    result = {
        'state': 0,
        'status': "error",
        'type': "account",
        'currentAuthority': "None"
    }
    for i in data:
        if username == i.name and i.status == True:
            name_boolen = True
            if password == i.password:
                password_boolen = True
                result['status'] = "ok"
                result['currentAuthority'] = i.role
    if name_boolen and password_boolen:
        result['state'] = 1
    elif name_boolen or password_boolen:
        result['state'] = 0
    else:
        result['state'] = -1
    return result  # both name and password are error


def getUserWithoutPasswd(user):
    return {
        'id': user.id,
        'name': user.name,
        'role': user.role,
        'phone': user.phone,
        'email': user.email,
        'status': user.status,
        'add_time': user.add_time,
    }

# get user data and update user status


def get_user_data(__status__):
    if __status__ == None:
        data = postgresql_handle(vls_back_url).list(User_data)
        result = []
        for i in data:
            result.append(getUserWithoutPasswd(i))
    elif __status__ == '0':
        postgresql_handle(vls_back_url).update(
            User_data, (User_data.id == 5), {User_data.status: False})
        result = [{'message': 'status change to False'}]
    elif __status__ == '1':
        postgresql_handle(vls_back_url).update(
            User_data, (User_data.id == 5), {User_data.status: True})
        result = [{'message': 'status change to True'}]
    return result

# add new user and update user date


def add_user_data(username, role, email, password, add_time):
    add_data = User_data(
        name=username,
        role=role,
        email=email,
        password=password,
        status=True,
        add_time=add_time,
    )
    postgresql_handle(vls_back_url).add(add_data)
    return 1


def login_log_addone(name, ip, time, address, browser):
    add_data = Login(name=name,
                     ip=ip,
                     time=time,
                     location=address,
                     browser=browser)
    postgresql_handle(vls_back_url).add(add_data)
    return 1


def login_log_list(page, per_page, name=None, date_start=None, date_end=None):
    data_raw = postgresql_handle(vls_back_url).paginate(
        Login, page, per_page, name, date_start, date_end)
    result = {
        'page': data_raw.page,
        'pages': data_raw.pages,
        'pageSize': per_page,
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


def operation_log_list(page, per_page, name=None, date_start=None, date_end=None):
    data_raw = postgresql_handle(vls_back_url).paginate(
        Operation, page, per_page, name, date_start, date_end)
    result = {
        'page': data_raw.page,
        'pages': data_raw.pages,
        'pageSize': per_page,
        'total': data_raw.total,
        'has_prev': data_raw.has_prev,
        'has_next': data_raw.has_next,
        'items': alchemy2json_many(data_raw.items)
    }
    return result
# login_function('xingezhe', 'gezhexinlian')
