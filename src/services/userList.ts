import { request } from 'umi';

export interface user_data {
    type: string,
    name: string,
    role?: string,
    password?: string,
    id?: number,
    status?: boolean,
    email?: string
}

export async function postUserList(params: user_data) {
    return request('/api/user', {
      method: 'POST',
      data: params,
    });
  }

export async function getUserList() {
    let url = `/api/user`
    return request(url);
}