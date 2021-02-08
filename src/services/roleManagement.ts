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
export async function updateRole(data: any) {
  let url = '/api/role';
  let token: string | null = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT');
  }
  return request(url, {
    method: 'POST',
    data: {
      data: data,
    },
    headers: {
      token: token,
    },
  });
}
