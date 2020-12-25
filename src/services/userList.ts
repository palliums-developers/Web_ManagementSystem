// import { status } from '@/services/userList';
import { request } from 'umi';

export interface user_data {
  type?: string;
  name: string;
  role?: string;
  password?: string;
  id?: number;
  status?: boolean;
  email?: string;
}

export interface userList {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: boolean;
  add_time: number;
}
export interface operation {
  id: number | undefined;
  name: string;
  email: string;
  role: string;
}

export interface status {
  status: boolean;
  name: string;
}

export interface filter {
  keyword: string;
  status: any;
  userList: userList[];
  intlRole: string[];
}

export async function postUserList(params: user_data) {
  let token: string | null = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT');
  }
  return request('/api/user', {
    method: 'POST',
    data: params,
    headers: {
      token: token,
    },
  });
}

export async function getUserList() {
  let url = `/api/user`;
  let token: string | null = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT');
  } else {
    return;
  }
  return request(url, {
    method: 'GET',
    headers: {
      token: token,
    },
  });
}
