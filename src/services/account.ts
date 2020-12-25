import { request } from 'umi';

export async function changePhone(captcha: string, phone: string) {
    let url = '/api/captcha';
    let token: string = 'token';
    if (sessionStorage.getItem('JWT')) {
        token = sessionStorage.getItem('JWT')
    }
    return request(url, {
        method: 'POST',
        data: {
            type: 'phone',
            captcha: captcha,
            phone: phone
        },
        headers: {
            token: token
        }
    })
}

export async function getPhoneCaptcha(target: string) {
    if(target===undefined){
        console.log('same phone')
        return
    }
    let url = '/api/captcha'
    let token: string = 'token'
    if (sessionStorage.getItem('JWT')) {
        token = sessionStorage.getItem('JWT')
    }
    return request(url + '?type=phone&target=' + target, {
        method: 'GET',
        headers: {
            token: token
        }
    })
}