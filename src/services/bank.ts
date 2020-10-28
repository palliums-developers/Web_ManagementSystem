import { status, operation } from '@/services/userList';
import { request } from 'umi';

export interface raw_bank_product {
    id: number,
    product_id: string,
    product_name: string,
    logo: string,
    minimum_amount: number,
    max_limit: number,
    pledge_rate: number,
    description: string,
    intor: string,
    question: string,
    currency: string,
    rate: number,
    rate_desc: string,
    status: boolean
}

export interface bank_product {
    id?: number,
    name?: string,
    product_id?: string,
    product_name?: string,
    logo?: string,
    minimum_amount?: number,
    max_limit?: number,
    pledge_rate?: number,
    description?: string,
    intor?: string,
    question?: string,
    currency?: string,
    rate?: number,
    rate_desc?: string,
    status?: boolean
}

export interface modal {
    status: boolean,
    view: boolean,
    data: bank_product
}
export interface show_data {
    id: number,
    name: string,
    description: string,
    min: number,
    max: number,
    increase: number,
    status: boolean
}

export interface operation_data {
    id?: number,
    operator: string,
    operation_time: string,
    operation: string
}
export interface local_data {
    operation: string,
    database: string,
    data: bank_product
}

export interface coin_data{
    id?:number,
    name:string,
    precision:number,
    min_quantity:number,
    max_quantity:number,
    status:boolean
}

export async function getBankProduct(type: string | undefined, database: string | undefined) {
    let url = '/api/bank';
    let token: string = 'token';
    if (sessionStorage.getItem('JWT')) {
        token = sessionStorage.getItem('JWT')
    }
    if (type) {
        url += `?type=${type}`
    }
    if (database) {
        url += `&database=${database}`
    }
    return request(url, {
        method: 'GET',
        headers: {
            token: token
        }
    });
}

export async function postBankProduct(type: string, database: string, data: bank_product) {
    let url = '/api/bank';
    let token: string = 'token';
    if (sessionStorage.getItem('JWT')) {
        token = sessionStorage.getItem('JWT')
    }
    let params = {
        "type": type,
        "database": database,
        "data": data
    }
    return request(url, {
        method: 'POST',
        data: params,
        headers: {
            token: token
        }
    })
}

export async function getViolasCurrency(){
    let url='/1.0/violas/currency';
    return request(url);
}