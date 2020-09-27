import { request } from 'umi';

export async function getUserList() {
    let url = `/api/user`
    return request(url);
}