import { request } from 'umi';

export interface bank_product {
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
    status:boolean
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