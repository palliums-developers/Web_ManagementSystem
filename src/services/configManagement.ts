import { status, operation } from '@/services/userList';
import { request } from 'umi';

export interface notification{
    id?:number,
    platform?:string[],
    time?:notification_time,
    en_title?:string,
    en_detail?:string,
    cn_title?:string,
    cn_detail?:string,
    ja_title?:string,
    ja_detail?:string,
    ko_title?:string,
    ko_detail?:string,
}
export interface notification_time{
    time:string,
    type:string
}

// export async function getBankProduct(type: string | undefined, database: string | undefined) {
//     let url = '/api/bank';
//     let token: string = 'token';
//     if (sessionStorage.getItem('JWT')) {
//         token = sessionStorage.getItem('JWT')
//     }
//     if (type) {
//         url += `?type=${type}`
//     }
//     if (database) {
//         url += `&database=${database}`
//     }
//     return request(url, {
//         method: 'GET',
//         headers: {
//             token: token
//         }
//     });
// }

// export async function postBankProduct(type: string, database: string, data: bank_product) {
//     let url = '/api/bank';
//     let token: string = 'token';
//     if (sessionStorage.getItem('JWT')) {
//         token = sessionStorage.getItem('JWT')
//     }
//     let params = {
//         "type": type,
//         "database": database,
//         "data": data
//     }
//     return request(url, {
//         method: 'POST',
//         data: params,
//         headers: {
//             token: token
//         }
//     })
// }