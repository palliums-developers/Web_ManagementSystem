import configparser
from sqlalchemy import create_engine
from SQL_service import postgresql_handle
from SQL_table import Login, User_data, Operation, ViolasBankBorrowProduct, ViolasBankDepositProduct, Coin_management, RolePageDatabase, HelpCenterArticle, HelpCenterCategory, HelpCenterGroup
from util import alchemy2json_many, get_temp_filter
from util_role import add_auth, del_auth, verify_auth, number2role, onlyPage, role2page
from util_filter_language import filter_language_list, filter_language_one

config_path = './config.ini'
config = configparser.ConfigParser()
config.read(config_path)

vls_back = config['violas_backend_management']
vls_back_url = f"{vls_back['dbtype']}+{vls_back['driver']}://{vls_back['user']}:{vls_back['password']}@{vls_back['host']}:{vls_back['port']}/{vls_back['database']}"
# postgres+psycopg2://postgres:qazokm@localhost:5432/violas_data

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


def get_user_information(username):
    data = postgresql_handle(vls_back_url).filterone(
        User_data,
        User_data.name == username
    )
    return getUserWithoutPasswd(data)


def getUserWithoutPasswd(user):
    return {
        'id': user.id,
        'name': user.name,
        'role': user.role,
        'phone': user.phone,
        'email': user.email,
        'status': user.status,
        'add_time': user.add_time,
        'google': user.google_authenticator
    }


def user_data_get(__status__):
    if __status__ == None:
        data = postgresql_handle(vls_back_url).list(User_data)
        result = []
        for i in data:
            result.append(getUserWithoutPasswd(i))
    elif __status__ == '0':
        postgresql_handle(vls_back_url).update(
            User_data,
            (User_data.id == 5),
            {User_data.status: False})
        result = [{'message': 'status change to False'}]
    elif __status__ == '1':
        postgresql_handle(vls_back_url).update(
            User_data,
            (User_data.id == 5),
            {User_data.status: True})
        result = [{'message': 'status change to True'}]
    return result


def user_data_phone(username, phone):
    postgresql_handle(vls_back_url).update(
        User_data, (User_data.name == username), {User_data.phone: phone})
    return 1


def user_data_google_authenticator(username, google_authenticator):
    postgresql_handle(vls_back_url).update(
        User_data, (User_data.name == username), {User_data.google_authenticator: google_authenticator})
    return 1


def user_data_google_authenticator_get(username):
    data = postgresql_handle(vls_back_url).filterone(
        User_data, User_data.name == username)
    return data.google_authenticator


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
        User_data,
        (User_data.id == id),
        {User_data.name: name, User_data.email: email, User_data.role: role})
    return 1


def user_data_password(name, old_password, new_password):
    temp_password = postgresql_handle(vls_back_url).filterone(
        User_data, User_data.name == name)
    if temp_password.password == old_password:
        postgresql_handle(vls_back_url).update(
            User_data,
            (User_data.name == name),
            {User_data.password: new_password})
        return 1
    else:
        return 0


def user_data_status(name, status):
    postgresql_handle(vls_back_url).update(
        User_data,
        (User_data.name == name),
        {User_data.status: status})
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
        Login,
        page,
        per_page,
        name,
        date_start,
        date_end)
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

# add_user
# edit_user
# password_user
# status_user
# add_deposit
# status_deposit
# edit_deposit
# add_borrow
# status_borrow
# edit_borrow
# add_coin_management
# edit_coin_management
# status_coin_management


def operation_log_addone(name, role, operation_type, operation, time):
    add_data = Operation(
        name=name,
        role=role,
        operation_type=operation_type,
        operation=operation,
        time=time)
    postgresql_handle(vls_back_url).add(add_data)
    return 1


def operation_log_list(type, page, per_page, name=None, date_start=None, date_end=None):
    data_raw = postgresql_handle(vls_back_url).paginate(
        Operation,
        page,
        per_page,
        name,
        date_start,
        date_end)
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


def operation_log_list2(type, page, per_page, name=None, date_start=None, date_end=None):
    if date_end and date_start:
        time1 = int(date_start)-1
        time2 = int(date_end)+1
        if not type == 'all':
            if name:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation,
                    page,
                    per_page,
                    (Operation.name == name,
                     Operation.operation_type == type,
                     Operation.time > time1,
                     Operation.time < time2))
            else:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation,
                    page,
                    per_page,
                    (Operation.operation_type == type,
                     Operation.time > time1,
                     Operation.time < time2))
        else:
            if name:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation,
                    page,
                    per_page,
                    (Operation.name == name,
                     Operation.time > time1,
                     Operation.time < time2))
            else:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation,
                    page,
                    per_page,
                    (Operation.time > time1,
                     Operation.time < time2))
    else:
        if not type == 'all':
            if name:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation,
                    page,
                    per_page,
                    (Operation.name == name,
                     Operation.operation_type == type))
            else:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation,
                    page,
                    per_page,
                    (Operation.operation_type == type))
        else:
            if name:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation,
                    page,
                    per_page,
                    (Operation.name == name))
            else:
                data_raw = postgresql_handle(vls_back_url).paginate2(
                    Operation, page, per_page, None)
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


def operationData2Dict(data):
    return{
        'id': data.id,
        'name': data.name,
        'role': data.role,
        'operation': data.operation,
        'time': data.time,
        'operation_type': data.operation_type
    }


def dict2Table_add(table, data):
    return table(
        currency=data['currency'],
        description=data['description'],
        # id=data[id],
        intor=data['intor'],
        logo=data['logo'],
        max_limit=data['max_limit'],
        minimum_amount=data['minimum_amount'],
        pledge_rate=data['pledge_rate'],
        product_id=data['product_id'],
        product_name=data['product_name'],
        question=data['question'],
        rate=data['rate'],
        rate_desc=data['rate_desc'],
        status=data['status'],
    )


def dict2Table_edit(table, data):
    return {
        table.currency: data['currency'],
        table.description: data['description'],
        table.intor: data['intor'],
        table.logo: data['logo'],
        table.max_limit: data['max_limit'],
        table.minimum_amount: data['minimum_amount'],
        table.pledge_rate: data['pledge_rate'],
        table.product_id: data['product_id'],
        table.product_name: data['product_name'],
        table.question: data['question'],
        table.rate: data['rate'],
        table.rate_desc: data['rate_desc'],
        table.status: data['status'],
    }


def get_bank_data(database):
    bank_table = ViolasBankBorrowProduct
    if database == 'deposit':
        bank_table = ViolasBankDepositProduct
    data = postgresql_handle(vls_back_url).list(bank_table)
    result = []
    for i in data:
        result.append(depositOrBorrowData2Dict(i))
    # result=alchemy2json_many(data)
    return result

# User.name.like('%{0}%'.format("a"))


def get_bank_operation(database):
    if database == 'deposit':
        # data = postgresql_handle(vls_back_url).filterall(Operation, Operation.operation_type.like('%{0}%'.format('deposit')))
        data = postgresql_handle(vls_back_url).filterall(
            Operation,
            (Operation.operation_type == 'add_deposit') |
            (Operation.operation_type == 'status_deposit') |
            (Operation.operation_type == 'edit_deposit'))
    elif database == 'borrow':
        data = postgresql_handle(vls_back_url).filterall(
            Operation,
            (Operation.operation_type == 'add_borrow') |
            (Operation.operation_type == 'status_borrow') |
            (Operation.operation_type == 'edit_borrow'))
    result = []
    for i in data:
        result.append(operationData2Dict(i))
    return result


def bank_data_exit(database_type, product_name, product_id=None):
    bank_table = ViolasBankBorrowProduct
    if database_type == 'deposit':
        bank_table = ViolasBankDepositProduct
    data = postgresql_handle(vls_back_url).list(bank_table)
    result = 0
    for i in data:
        if i.product_name == product_name:
            result += 1
        if i.product_id == product_id:
            result += 1
    return result


def edit_bank_data(type, database, data):
    bank_table = ViolasBankBorrowProduct
    if database == 'deposit':
        bank_table = ViolasBankDepositProduct
    result = {'message': ''}
    if type == 'add':
        if bank_data_exit(database, data['product_name']) > 0:
            result['message'] = 'please use different name or id'
            return result
        add_data = dict2Table_add(bank_table, data)
        postgresql_handle(vls_back_url).add(add_data)
    elif type == 'status':
        postgresql_handle(vls_back_url).update(
            bank_table,
            (bank_table.id == data['id']),
            {bank_table.status: data['status']})
        result['message'] = 'ok'
    elif type == 'edit':
        if bank_data_exit(database, data['product_name'], data['product_id']) == 0:
            result['message'] = 'this product not exist'
            return result
        postgresql_handle(vls_back_url).update(
            bank_table,
            (bank_table.id == data['id']),
            dict2Table_edit(bank_table, data))
        result['message'] = 'ok'
    return result


def get_coin_data():
    data = postgresql_handle(vls_back_url).list(Coin_management)
    # result = []
    # for i in data:
    #     temp = {
    #         'id': i.id,
    #         'coin_name': i.name,
    #         'min_num_precision': float(i.precision),
    #         'min_quantity': float(i.min_quantity),
    #         'max_quantity': float(i.max_quantity),
    #         'status': i.status
    #     }
    #     result.append(temp)
    result = alchemy2json_many(data)
    # print(str(type(result[0]['price_precision'])))
    return result


def get_coin_log():
    data = postgresql_handle(vls_back_url).filterall(
        Operation,
        (Operation.operation_type == 'add_coin_management') |
        (Operation.operation_type == 'edit_coin_management') |
        (Operation.operation_type == 'status_coin_management')
    )
    result = []
    for i in data:
        result.append(operationData2Dict(i))
    return result


def exist_coin_data(name):
    data = postgresql_handle(vls_back_url).list(Coin_management)
    for i in data:
        if i.name == name:
            return 1
    return 0


def add_coin_data(data):
    result = {
        'status': 'error',
        'message': 'This coin name already exist'
    }
    if exist_coin_data(data['name']):
        return result
    add_data = Coin_management(
        name=data['name'],
        precision=data['precision'],
        min_quantity=data['min_quantity'],
        max_quantity=data['max_quantity'],
        status=data['status']
    )
    postgresql_handle(vls_back_url).add(add_data)
    result = {
        'status': 'ok',
        'message': 'Add new coin'
    }
    return result


def edit_coin_data(data):
    result = {
        'status': 'error',
        'message': 'This coin name does not exist'
    }
    if exist_coin_data(data['coin_name']) == 0:
        return result
    edit_data = {
        # Coin_management.name: data['name'],
        # Coin_management.precision: data['precision'],
        # Coin_management.min_quantity: data['min_quantity'],
        # Coin_management.max_quantity: data['max_quantity'],
        # Coin_management.status: data['status']
        Coin_management.coin_name: data['coin_name'],
        Coin_management.min_num_precision: data['min_num_precision'],
        Coin_management.min_num_trade: data['min_num_trade'],
        Coin_management.max_num_trade: data['max_num_trade'],
        Coin_management.price_precision: data['price_precision'],
        Coin_management.withdraw_fee: data['withdraw_fee'],
        Coin_management.min_num_withdraw: data['min_num_withdraw'],
        Coin_management.status_withdraw: data['status_withdraw'],
        Coin_management.status_recharge: data['status_recharge'],
        Coin_management.status: data['status'],
    }
    postgresql_handle(vls_back_url).update(
        Coin_management, Coin_management.id == data['id'], edit_data)
    result = {
        'status': 'ok',
        'message': 'Edit coin'
    }
    return result


def status_coin_data(id, status_name, status):
    result = {
        'status': 'error',
        'message': 'Change Update'
    }
    print(id, status_name, status)
    temp_status_name = Coin_management.status
    if status_name == 'status_withdraw':
        temp_status_name = Coin_management.status_withdraw
    elif status_name == 'status_recharge':
        temp_status_name = Coin_management.status_recharge
    postgresql_handle(vls_back_url).update(
        Coin_management, (Coin_management.id == id), {temp_status_name: status})
    result['status'] = 'ok'
    return result


def get_all_role_page():
    return alchemy2json_many(postgresql_handle(vls_back_url).list(RolePageDatabase))


def update_role_page(id, role_name_num):
    rolePage = {
        'welcome': RolePageDatabase.welcome,
        'account': RolePageDatabase.account,
        'user_management': RolePageDatabase.user_management,
        'login_log': RolePageDatabase.login_log,
        'operation_log': RolePageDatabase.operation_log,
        'system_notification': RolePageDatabase.system_notification,
        'coin_management': RolePageDatabase.coin_management,
        'deposit': RolePageDatabase.deposit,
        'borrow': RolePageDatabase.borrow,
        'category': RolePageDatabase.category,
        'group': RolePageDatabase.group,
        'article': RolePageDatabase.article,
    }
    temp_filter = get_temp_filter(role_name_num, rolePage)
    if temp_filter == 'input error':
        return temp_filter
    return postgresql_handle(vls_back_url).update(RolePageDatabase, (RolePageDatabase.id == id), temp_filter)


def get_help_category_group():
    result = {}
    result = alchemy2json_many(postgresql_handle(
        vls_back_url).list_order(HelpCenterCategory))
    for i in result:
        temp_group = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterGroup, (HelpCenterGroup.category == i['id'])))
        i['group'] = temp_group
    return result


def get_help_category():
    return alchemy2json_many(postgresql_handle(vls_back_url).list_order(HelpCenterCategory))


def set_help_category(operation, json_name_data):
    if operation == 'edit':
        category = {
            'language': HelpCenterCategory.language,
            'name_en': HelpCenterCategory.name_en,
            'description_en': HelpCenterCategory.description_en,
            'name_cn': HelpCenterCategory.name_cn,
            'description_cn': HelpCenterCategory.description_cn,
            'name_ja': HelpCenterCategory.name_ja,
            'description_ja': HelpCenterCategory.description_ja,
            'name_ko': HelpCenterCategory.name_ko,
            'description_ko': HelpCenterCategory.description_ko,
            'order': HelpCenterCategory.order,
        }
        temp_filter = get_temp_filter(json_name_data, category)
        if temp_filter == 'input error':
            return temp_filter
        postgresql_handle(vls_back_url).update(
            HelpCenterCategory, (HelpCenterCategory.id == json_name_data['id']), temp_filter)
    elif operation == 'add':
        add_category = HelpCenterCategory(
            language=json_name_data['language'],
            name_en=json_name_data['name_en'],
            description_en=json_name_data['description_en'],
            name_cn=json_name_data['name_cn'],
            description_cn=json_name_data['description_cn'],
            name_ja=json_name_data['name_ja'],
            description_ja=json_name_data['description_ja'],
            name_ko=json_name_data['name_ko'],
            description_ko=json_name_data['description_ko'],
            order=json_name_data['order'],
        )
        postgresql_handle(vls_back_url).add(add_category)
    elif operation == 'sort':
        # print(json_name_data['order'])
        for i in json_name_data['order']:
            postgresql_handle(vls_back_url).update(
                HelpCenterCategory, HelpCenterCategory.id == i['id'], {HelpCenterCategory.order: i['order']})
    else:
        return 'wrong operation type'
    return 'operation category database successfully'


def get_help_group(type, id):
    if type == 'category':
        return alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(HelpCenterGroup, HelpCenterGroup.category == id))
    elif type == 'group':
        return alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(HelpCenterGroup, HelpCenterGroup.id == id))
    else:
        return 'wrong type'


def set_help_group(operation, json_name_data):
    if operation == 'edit':
        group = {
            'language': HelpCenterGroup.language,
            'name_en': HelpCenterGroup.name_en,
            'description_en': HelpCenterGroup.description_en,
            'name_cn': HelpCenterGroup.name_cn,
            'description_cn': HelpCenterGroup.description_cn,
            'name_ja': HelpCenterGroup.name_ja,
            'description_ja': HelpCenterGroup.description_ja,
            'name_ko': HelpCenterGroup.name_ko,
            'description_ko': HelpCenterGroup.description_ko,
            'order': HelpCenterGroup.order,
            'category': HelpCenterGroup.category,
        }
        temp_filter = get_temp_filter(json_name_data, group)
        if temp_filter == 'input error':
            return temp_filter
        postgresql_handle(vls_back_url).update(
            HelpCenterGroup, (HelpCenterGroup.id == json_name_data['id']), temp_filter)
    elif operation == 'add':
        add_group = HelpCenterGroup(
            language=json_name_data['language'],
            name_en=json_name_data['name_en'],
            description_en=json_name_data['description_en'],
            name_cn=json_name_data['name_cn'],
            description_cn=json_name_data['description_cn'],
            name_ja=json_name_data['name_ja'],
            description_ja=json_name_data['description_ja'],
            name_ko=json_name_data['name_ko'],
            description_ko=json_name_data['description_ko'],
            order=json_name_data['order'],
            category=json_name_data['category'],
        )
        postgresql_handle(vls_back_url).add(add_group)
    elif operation == 'sort':
        # print(json_name_data['order'])
        for i in json_name_data['order']:
            print(i)
            postgresql_handle(vls_back_url).update(HelpCenterGroup, HelpCenterGroup.id == i['id'], {HelpCenterGroup.order:i['order']})
    else:
        return 'wrong operation type'
    return 'operation group database successfully'


def get_help_article(type, id):
    if type == 'all':
        return alchemy2json_many(postgresql_handle(vls_back_url).list_order(HelpCenterArticle))
    elif type == 'group':
        return alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(HelpCenterArticle, HelpCenterArticle.group == id))
    elif type == 'article':
        return alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(HelpCenterArticle, HelpCenterArticle.id == id))[0]
    elif type == 'level':
        return get_help_category_group()


def set_help_article(operation, json_name_data):
    if operation == 'edit':
        article = {
            'author': HelpCenterArticle.author,
            'group': HelpCenterArticle.group,
            'published': HelpCenterArticle.published,
            'publish_time': HelpCenterArticle.publish_time,
            'last_edit_time': HelpCenterArticle.last_edit_time,
            'last_edit_author': HelpCenterArticle.last_edit_author,
            'language': HelpCenterArticle.language,
            'recommend': HelpCenterArticle.recommend,
            'title_en': HelpCenterArticle.title_en,
            'content_en': HelpCenterArticle.content_en,
            'title_cn': HelpCenterArticle.title_cn,
            'content_cn': HelpCenterArticle.content_cn,
            'title_ja': HelpCenterArticle.title_ja,
            'content_ja': HelpCenterArticle.content_ja,
            'title_ko': HelpCenterArticle.title_ko,
            'content_ko': HelpCenterArticle.content_ko,
            'order': HelpCenterArticle.order,
        }
        temp_filter = get_temp_filter(json_name_data, article)
        if temp_filter == 'input error':
            return temp_filter
        postgresql_handle(vls_back_url).update(
            HelpCenterArticle, (HelpCenterArticle.id == json_name_data['id']), temp_filter)
    elif operation == 'add':
        add_article = HelpCenterArticle(
            author=json_name_data['author'],
            group=json_name_data['group'],
            published=json_name_data['published'],
            publish_time=json_name_data['publish_time'],
            last_edit_time=json_name_data['last_edit_time'],
            last_edit_author=json_name_data['last_edit_author'],
            language=json_name_data['language'],
            recommend=json_name_data['recommend'],
            title_en=json_name_data['title_en'],
            content_en=json_name_data['content_en'],
            title_cn=json_name_data['title_cn'],
            content_cn=json_name_data['content_cn'],
            title_ja=json_name_data['title_ja'],
            content_ja=json_name_data['content_ja'],
            title_ko=json_name_data['title_ko'],
            content_ko=json_name_data['content_ko'],
            order=json_name_data['order'],
        )
        postgresql_handle(vls_back_url).add(add_article)
    elif operation == 'sort':
        # print(json_name_data['order'])
        for i in json_name_data['order']:
            postgresql_handle(vls_back_url).update(HelpCenterArticle, HelpCenterArticle.id == i['id'], {HelpCenterArticle.order:i['order']})
    elif operation=='move':
        # print(json_name_data)
        postgresql_handle(vls_back_url).update(HelpCenterArticle,HelpCenterArticle.id==json_name_data['article'],{HelpCenterArticle.group:json_name_data['group']})
    else:
        return 'wrong operation type'
    return 'operation article database successfully'


def get_help_center(page, key, language):
    result = {}
    if page == 'homepage':
        homepage_category = alchemy2json_many(postgresql_handle(
            vls_back_url).list_order(HelpCenterCategory))
        homepage_category = filter_language_list(homepage_category, language)
        homepage_recommend = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterArticle, (HelpCenterArticle.recommend == True) & (HelpCenterArticle.published == True)))
        homepage_recommend = filter_language_list(homepage_recommend, language)
        result['category'] = homepage_category
        result['recommend'] = homepage_recommend
    elif page == 'category':
        category_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterCategory, HelpCenterCategory.id == key))[0]
        category_data = filter_language_one(category_data, language)
        group_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterGroup, HelpCenterGroup.category == category_data['id']))
        group_data = filter_language_list(group_data, language)
        article_data = {}
        for i in group_data:
            article_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
                HelpCenterArticle, (HelpCenterArticle.group == i['id']) & (HelpCenterArticle.published == True)))
            article_data = filter_language_list(article_data, language)
            i['article'] = article_data
        result['category'] = category_data
        result['group'] = group_data
    elif page == 'group':
        group_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterGroup, HelpCenterGroup.id == key))[0]
        group_data = filter_language_one(group_data, language)
        category_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall(
            HelpCenterCategory, HelpCenterCategory.id == group_data['category']))[0]
        category_data = filter_language_one(category_data, language)
        article_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterArticle, (HelpCenterArticle.group == key) & (HelpCenterArticle.published == True)))
        article_data = filter_language_list(article_data, language)
        group_data['category'] = category_data
        result['group'] = group_data
        result['article'] = article_data
    elif page == 'article':
        article_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterArticle, (HelpCenterArticle.id == key) & (HelpCenterArticle.published == True)))
        if len(article_data) > 0:
            article_data = filter_language_one(article_data[0], language)
            group_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall(
                HelpCenterGroup, HelpCenterGroup.id == article_data['id']))[0]
            group_data = filter_language_one(group_data, language)
            category_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall(
                HelpCenterCategory, HelpCenterCategory.id == group_data['category']))[0]
            category_data = filter_language_one(category_data, language)
            article_data['groupName'] = group_data['name']
            article_data['groupId'] = group_data['id']
            article_data['categoryName'] = category_data['name']
            article_data['categoryId'] = category_data['id']
            other_article = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
                HelpCenterArticle, (HelpCenterArticle.group == article_data['group']) & (HelpCenterArticle.id != article_data['id']) & (HelpCenterArticle.published == True)))
            other_article = filter_language_list(other_article, language)
            result['other'] = other_article
        result['article'] = article_data
    elif page == 'search':
        article_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall_order(
            HelpCenterArticle, (HelpCenterArticle.published == True) & (
                (HelpCenterArticle.author.like("%"+key+"%")) |
                (HelpCenterArticle.title_en.like("%"+key+"%")) |
                (HelpCenterArticle.title_cn.like("%"+key+"%")) |
                (HelpCenterArticle.title_ja.like("%"+key+"%")) |
                (HelpCenterArticle.title_ko.like("%"+key+"%"))
            )
            # (HelpCenterArticle.content_en.like("%"+key+"%")) |
            # (HelpCenterArticle.content_cn.like("%"+key+"%")) |
            # (HelpCenterArticle.content_ja.like("%"+key+"%")) |
            # (HelpCenterArticle.content_ko.like("%"+key+"%"))
        ))
        article_data = filter_language_list(article_data, language)
        for i in article_data:
            group_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall(
                HelpCenterGroup, HelpCenterGroup.id == i['group']))[0]
            category_data = alchemy2json_many(postgresql_handle(vls_back_url).filterall(
                HelpCenterCategory, HelpCenterCategory.id == group_data['category']))[0]
            i['groupName'] = filter_language_one(group_data, language)['name']
            i['categoryId'] = category_data['id']
            i['categoryName'] = filter_language_one(
                category_data, language)['name']
        result['article'] = article_data
    else:
        result['message'] = 'wrong page'
    return result
