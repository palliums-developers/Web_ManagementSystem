import { operation } from './userList';
import { request } from 'umi';

export interface category {
  id?: number;
  language: string;
  name_en: string;
  description_en: string;
  name_cn: string;
  description_cn: string;
  name_ja: string;
  description_ja: string;
  name_ko: string;
  description_ko: string;
  order: number;
}
export interface group {
  id?: number;
  language: string;
  name_en: string;
  description_en: string;
  name_cn: string;
  description_cn: string;
  name_ja: string;
  description_ja: string;
  name_ko: string;
  description_ko: string;
  order: number;
  category: number;
}
export interface article {
  id?: number;
  author?: string;
  group: number;
  published: boolean;
  publish_time?: string;
  last_edit_time?: string;
  last_edit_author?: string;
  language: string;
  recommend: boolean;
  title_en: string;
  content_en: string;
  title_cn: string;
  content_cn: string;
  title_ja: string;
  content_ja: string;
  title_ko: string;
  content_ko: string;
  order?: number;
}
let url_category = '/api/category';
let url_group = '/api/group';
let url_article = '/api/article';

export async function getCategory() {
  return request(url_category, {
    method: 'GET',
    headers: {
      token: getJWT(),
    },
  });
}
export async function getGroup(type: string, id: number) {
  return request(url_group + '?type=' + type + '&id=' + id, {
    method: 'GET',
    headers: {
      token: getJWT(),
    },
  });
}
export async function getArticle(type: string, id?: number) {
  let url = url_article;
  url += `?type=${type}`;
  if (type == 'all') {
    id = 0;
  }
  url += `&id=${id}`;
  return request(url, {
    method: 'GET',
    headers: {
      token: getJWT(),
    },
  });
}
export async function setGroup(operation: string, data: group) {
  return request(url_group, {
    method: 'POST',
    data: {
      operation: operation,
      data: data,
    },
    headers: {
      token: getJWT(),
    },
  });
}
export async function setCategory(operation: string, data: category) {
  return request(url_category, {
    method: 'POST',
    data: {
      operation: operation,
      data: data,
    },
    headers: {
      token: getJWT(),
    },
  });
}
export async function setArticle(operation: string, data: article) {
  return request(url_article, {
    method: 'POST',
    data: {
      operation: operation,
      data: data,
    },
    headers: {
      token: getJWT(),
    },
  });
}

const getJWT = () => {
  let token: any;
  sessionStorage.getItem('JWT') ? (token = sessionStorage.getItem('JWT')) : (token = 'token');
  return token;
};
