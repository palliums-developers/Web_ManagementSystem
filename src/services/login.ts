import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  browser?: string;
  CAPTCHA: string;
  type: string;
  token?: string
}

export interface userInformation {
  id: number,
  name: string,
  role: string,
  phone?: string,
  email: string,
  status: boolean,
  add_time: number,
  google?: string
}

let userAgent = navigator.userAgent;
let browser = '';
if (userAgent.indexOf("Firefox") > -1) {
  browser = 'Firefox'
} else if (userAgent.indexOf("Chrome") > -1) {
  browser = 'Chrome';
} else if (userAgent.indexOf("Safari") > -1) {
  browser = 'Safari';
} else if (!!window.ActiveXObject || "ActiveXObject" in window) {
  browser = 'IE';
} else {
  browser = 'Other';
}
// export async function fakeAccountLogin(params: LoginParamsType) {
//   params.password = 'ant.design';
//   sessionStorage.setItem('user', params.username)
//   return request<API.LoginStateType>('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });
// }
export async function accountLogin(params: LoginParamsType) {
  params.CAPTCHA = '123';
  params.browser = browser;
  return request<API.LoginStateType>('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function accountInformation() {
  let url = '/api/login';
  let token: string = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT')
  }
  return request(url, {
    method: 'GET',
    headers: {
      token: token
    }
  })
}

export async function changePassword(name: string, old_password: string, new_password: string) {
  let url = '/api/user';
  let token: string = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT')
  }
  return request(url, {
    method: 'POST',
    data: {
      type: 'password',
      name: name,
      old_password: old_password,
      new_password: new_password
    },
    headers: {
      token: token
    }
  })
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
export async function getImgCaptcha() {
  return request(`/api/captcha?type=captcha`)
}
export async function outLogin() {
  return request('/api/login/outLogin');
}
export async function verifyGoogle(code: string) {
  let url = '/api/captcha';
  let token: string = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT')
  }
  return request(url, {
    method: 'POST',
    data: {
      type: 'verify_auth',
      code: code
    },
    headers: {
      token: token
    }
  })
}
export async function setGoogle() {
  let url = '/api/captcha';
  let token: string = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT')
  }
  return request(url, {
    method: 'POST',
    data: {
      type: 'get_auth',
      // code: code
    },
    headers: {
      token: token
    }
  })
}
export function generateGoogleImg(name: string, key: string) {
  return `otpauth://totp/IAM%20MFA%20Code:${name}?secret=${key}&issuer=IAM%20MFA%20Code`
}