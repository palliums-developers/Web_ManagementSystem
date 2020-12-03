import pyotp


def get_auth(username):

    gtoken = pyotp.random_base32(64)

    data = pyotp.totp.TOTP(gtoken).provisioning_uri(
        username, issuer_name="IAM MFA Code")
    return {
        'name': username,
        'secret_key': gtoken,
        'img': data
    }


def verify_auth(secret_key, verifyCode):
    t = pyotp.TOTP(secret_key)
    result = t.verify(verifyCode)  # 对输入验证码进行校验，正确返回True
    msg = result if result is True else False
    return msg
