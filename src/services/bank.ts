import { status } from '@/services/userList';
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

export async function getBankProduct(type: string | undefined) {
    let url = '/api/bank';
    if (type) {
        url += `?type=${type}`
    }
    return request(url);
}

export async function postBankProduct(type: string, database: string, data: bank_product) {
    let url = '/api/bank';
    let params = {
        "type": type,
        "database": database,
        "data": data
    }
    return request(url, {
        method: 'POST',
        data: params,
    })
}