def add_auth(_origin, _auth):
    return _origin | _auth


def del_auth(_origin, _auth):
    return _origin ^ _auth


def verify_auth(_user, _auth):
    return((_user & _auth) == _auth)


def number2role(_auth_num, _roles):
    result = []
    for i in _roles:
        if verify_auth(_auth_num, i['role']):
            result.append(i['name'])
    return result


def onlyPage(page):
    result = {}
    for i in page:
        if i != 'name' and i != 'role' and i != 'id':
            result[i] = page[i]
    return result


def role2page(_role_name, _role_db):
    temp = []
    for i in _role_name:
        for j in _role_db:
            if i == j['name']:
                temp.append(onlyPage(j))
    result = temp[0]
    for i2 in temp:
        for j2 in i2:
            result[j2] = add_auth(i2[j2], result[j2])
    return result
