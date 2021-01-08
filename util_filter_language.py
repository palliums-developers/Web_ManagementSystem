def filter_language_one1(data, language):
    temp_language = 'en'
    delete_items = []
    if data['language'].find(language.upper()) > -1:
        temp_language = language
    for i in data:
        temp_split = i.split('_')
        if len(temp_split) > 1 and temp_split[1] != temp_language:
            delete_items.append(i)
    for j in delete_items:
        data.pop(j)
    return (data)


def filter_language_list1(data, language):
    for data_i in data:
        temp_language = 'en'
        delete_items = []
        if data_i['language'].find(language.upper()) > -1:
            temp_language = language
        for i in data_i:
            temp_split = i.split('_')
            if len(temp_split) > 1 and temp_split[1] != temp_language:
                delete_items.append(i)
        for j in delete_items:
            data_i.pop(j)
    return (data)


def filter_language_one(data, language):
    select_language = 'en'
    delete_items = []
    add_item = []
    if data['language'].find(language.upper()) > -1:
        select_language = language
    for i in data:
        temp_split = i.split('_')
        if len(temp_split) == 2:
            if temp_split[1] == select_language:
                add_item.append({'key': temp_split[0], 'value': data[i]})
                delete_items.append(i)
            elif temp_split[1] != 'time':
                delete_items.append(i)
    for j in delete_items:
        data.pop(j)
    for k in add_item:
        data[k['key']] = k['value']
    return (data)


def filter_language_list(data, language):
    for data_i in data:
        filter_language_one(data_i, language)
    return data
