import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  browser?: string;
  CAPTCHA: string;
  type: string;
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
console.log(browser)
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

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}
