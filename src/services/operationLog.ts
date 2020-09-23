import { request } from 'umi';

export async function getOperationList(page: string | Number, per_page: string | Number, name?: string, start_date?: Number, end_date?: Number) {
    let url = `/api/operationLog?page=${page}&per_page=${per_page}`
    if (name && name !== '') {
        url += `&name=${name}`
    }
    if ((start_date && start_date !== 0) && (end_date && end_date !== 0)) {
        url += `&date_start=${start_date}&date_end=${end_date}`
    }
    return request(url);
}