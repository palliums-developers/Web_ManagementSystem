import configparser
from sqlalchemy import create_engine
from SQL_service import postgresql_handle
from SQL_table import Login, User_data, Operation, ViolasBankBorrowProduct, ViolasBankDepositProduct
from util import alchemy2json_many

config_path = './config.ini'
config = configparser.ConfigParser()
config.read(config_path)

vls_back = config['violas_backend_management']
vls_back_url = f"{vls_back['dbtype']}+{vls_back['driver']}://{vls_back['user']}:{vls_back['password']}@{vls_back['host']}:{vls_back['port']}/{vls_back['database']}"

vls_bank = config['digital_bank']
vls_bank_url = f"{vls_bank['dbtype']}+{vls_bank['driver']}://{vls_bank['user']}:{vls_bank['PASSWORD']}@{vls_bank['host']}:{vls_bank['PORT']}/{vls_bank['DATABASE']}"

# vls_back_url = f"postgresql://{vls_back['user']}:{vls_back['password']}@{vls_back['host']}:{vls_back['port']}/{vls_back['database']}"


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


def user_data_get(__status__):
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


def user_data_exist(name):
    data = postgresql_handle(vls_back_url).list(User_data)
    user_exist = False
    for i in data:
        if name == i.name:
            user_exist = True
    return user_exist


def user_data_new(username, role, email, password, add_time):
    if user_data_exist(username):
        return 0
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


def user_data_edit(id, name, email, role):
    if not user_data_exist(name):
        return 0
    postgresql_handle(vls_back_url).update(
        User_data, (User_data.id == id), {User_data.name: name, User_data.email: email, User_data.role: role})
    return 1


def user_data_password(name, password):
    postgresql_handle(vls_back_url).update(
        User_data, (User_data.name == name), {User_data.password: password})
    return 1


def user_data_status(name, status):
    postgresql_handle(vls_back_url).update(
        User_data, (User_data.name == name), {User_data.status: status})
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

# use violas bank database


def depositOrBorrowData2Dict(data):
    # {
    # "id":data.id,
    # "product_id":data.product_id,
    # "product_name":data.product_name,
    # "logo":data.logo,
    # "minimum_amount":data.minimum_amount,
    # "max_limit":data.max_limit,
    # "pledge_rate":float(data.pledge_rate),
    # "description":data.description,
    # "intor":data.intor,
    # "question":data.question,
    # "currency":data.currency,
    # "rate":float(data.rate),
    # "rate_desc":data.rate_desc,
    # "status":data.status
    # }
    # {
    #     "product_id": 10004,
    #     "product_name": "data.product_name",
    #     "logo": "data.logo",
    #     "minimum_amount": "data.minimum_amount",
    #     "max_limit": "data.max_limit",
    #     "pledge_rate": 99,
    #     "description": "data.description",
    #     "intor": "data.intor",
    #     "question": "data.question",
    #     "currency": "data.currency",
    #     "rate": 11,
    #     "rate_desc": "data.rate_desc",
    #     "status": true
    # }
    return {
        'id': data.id,
        'product_id': data.product_id,
        'product_name': data.product_name,
        'logo': data.logo,
        'minimum_amount': data.minimum_amount,
        'max_limit': data.max_limit,
        'pledge_rate': float(data.pledge_rate),
        'description': data.description,
        'intor': data.intor,
        'question': data.question,
        'currency': data.currency,
        'rate': float(data.rate),
        'rate_desc': data.rate_desc,
        'status': data.status
    }


def dict2Table(table, data):
    for i in data:
        print(i, data[i])


def get_bank_data(type):
    bank_table = ViolasBankBorrowProduct
    if type == 'deposit':
        bank_table = ViolasBankDepositProduct
    data = postgresql_handle(vls_back_url).list(bank_table)
    result = []
    for i in data:
        result.append(depositOrBorrowData2Dict(i))
    # result=alchemy2json_many(data)
    return result


def bank_data_exit(type, product_name, product_id):
    bank_table = ViolasBankBorrowProduct
    if type == 'deposit':
        bank_table = ViolasBankDepositProduct
    data = postgresql_handle(vls_back_url).list(bank_table)
    result = 0
    for i in data:
        if i.product_name == product_name or i.product_id == product_id:
            result = 1
    return result


def edit_bank_data(type, database, data):
    bank_table = ViolasBankBorrowProduct
    if database == 'deposit':
        bank_table = ViolasBankDepositProduct
    result = 0
    if type == 'add':
        # todo
        dict2Table(bank_table, data)
        # add_data=ViolasBankDepositProduct()
        # result=postgresql_handle(bank_table).add()
    elif type == 'status':
        print(data)
        postgresql_handle(vls_back_url).update(
            bank_table, (bank_table.id == data['id']), {bank_table.status: data['status']})
        #     postgresql_handle(vls_back_url).update(
        # User_data, (User_data.name == name), {User_data.status: status})
        result = 1
    elif type=='edit':
        print(data)
    return result
