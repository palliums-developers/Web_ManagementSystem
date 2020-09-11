import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  mobile?: string;
  CAPTCHA: string;
  type: string;
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
  params.CAPTCHA='123';
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
