import { request } from 'umi';

export interface rightList {
  view: boolean;
  edit: boolean;
  add: boolean;
  delete: boolean;
}

export async function getRole() {
  let url = '/api/role';
  let token: string | null = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT');
  }
  return request(url, {
    method: 'GET',
    headers: {
      token: token,
    },
  });
}
export async function postRole(type: string, data: any) {
  let url = '/api/role';
  let token: string | null = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT');
  }
  return request(url, {
    method: 'POST',
    data: {
      type: type,
      data: data,
    },
    headers: {
      token: token,
    },
  });
}
