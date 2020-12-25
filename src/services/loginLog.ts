import { request } from 'umi';

export async function getLoginList(page: string | Number, per_page: string | Number, name?: string, start_date?: Number, end_date?: Number) {
    let url = `/api/loginLog?page=${page}&per_page=${per_page}`
    if (name && name !== '') {
        url += `&name=${name}`
    }
    if ((start_date && start_date !== 0) && (end_date && end_date !== 0)) {
        url += `&date_start=${start_date}&date_end=${end_date}`
    }
    let token: string | null = 'token';
    if (sessionStorage.getItem('JWT')) {
        token = sessionStorage.getItem('JWT')
    }
    return request(url, {
        method: 'GET',
        headers: {
            token: token
        }
    });
    // if (name) {
    //     return request(`/api/loginLog?page=${page}&per_page=${per_page}&name=${name}`);
    // } else {
    //     return request(`/api/loginLog?page=${page}&per_page=${per_page}`);
    // }
}