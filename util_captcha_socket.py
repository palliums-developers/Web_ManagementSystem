import struct
import socket
import sys
import string
import random
# 'emailVer','smsVer'
# +86xxx


def sendsms(type, target):
    verify = generateVerify(6)
    data = {
        'command': type,
        'seq': 5,
        'paras': {
            'code': verify,
            # 'mode': 'bind',
            'mode': 'violasBind',
            'addr': target
        }
    }
    temp = str(data)+"\0"
    # print(temp)
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    host = '52.27.228.84'
    port = 48332
    s.connect((host, port))

    s.send(struct.pack('<H', int(len(temp)+2))+bytes(temp, encoding='utf8'))
    msg = s.recv(1024)
    s.close()

    # print(msg.decode('utf-8'))
    return verify


def generateVerify(num):
    temp = random.sample(string.digits, num)
    result = ''
    for i in temp:
        result += i
    return int(result)


# sendsms("smsVer", '+8618091601382')
# sendsms("emailVer", 'hch@palliums.org')
