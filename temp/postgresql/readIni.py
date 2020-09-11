import os
import configparser

iniName = 'database.ini'
currentDir = os.path.split(os.path.realpath(__file__))[0]
configPath = os.path.join(currentDir, iniName)

conf = configparser.ConfigParser()

# read(filename)：读取文件内容
# sections()：得到所有的section，并以列表的形式返回。
# options(section)：得到该section的所有option。
# items(section)：得到该section的所有键值对。
# get(section,option)：得到section中option的值，返回string类型。
# getint(section,option)：得到section中option的值，返回int类型。
# write(fp)：将config对象写入至某个ini格式的文件中。
# add_section(section)：添加一个新的section。
# set(section,option,value)：对section中的option进行设置，需要调用write将内容写入配置文件。
# remove_section(section)：删除某个section。
# remove_option(section,option)：删除某个section下的option

conf.read(configPath)

# host = conf.get('violas_backend_management', 'host')
# print(host)
# print(conf.sections())
# print(conf.options('violas_backend_management'))
# print(conf.items('violas_backend_management'))

def getDatebase(sectionName):
    return dict(conf.items(sectionName))