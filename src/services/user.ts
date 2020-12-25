import { request } from 'umi';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  // return request<API.CurrentUser>('/api/currentUser');
  let url = `/api/currentUser`;
  let token: string | null = 'token';
  if (sessionStorage.getItem('JWT')) {
    token = sessionStorage.getItem('JWT');
  }
  return request<API.CurrentUser>(url, {
    method: 'GET',
    headers: {
      token: token,
    },
  });
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}
