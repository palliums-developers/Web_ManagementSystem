import { parse } from 'querystring';
// import { useIntl } from 'umi';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => {
  const { href } = window.location;
  const qsIndex = href.indexOf('?');
  const sharpIndex = href.indexOf('#');
  if (qsIndex !== -1) {
    if (qsIndex > sharpIndex) {
      return parse(href.split('?')[1]);
    }
    return parse(href.slice(qsIndex + 1, sharpIndex));
  }
  return {};
};

/**
 * product manager=1
 * developer=2
 * operations manager=4
 * customer servicer=8
 * designer=16
 *  { label: intl('role.product'), value: 'product' },
    { label: intl('role.developer'), value: 'developer' },
    { label: intl('role.operation'), value: 'operation' },
    { label: intl('role.servicer'), value: 'servicer' },
    { label: intl('role.designer'), value: 'designer' },
 */
// let user_data_auth = {
//   product: 0b00001,
//   developer: 0b00010,
//   operation: 0b00100,
//   servicer: 0b01000,
//   designer: 0b10000,
// }
// let { product, developer, operation, servicer, designer } = user_data_auth;
// let temp = product|developer|operation|servicer | designer;
// console.log(temp,(temp & product) === product, (temp & designer) === designer, (temp & servicer) === servicer)
const user_data_auth = {
  product: 1,
  developer: 2,
  operation: 4,
  servicer: 8,
  designer: 16,
}
// const intl = (_temp: string) => {
//   return useIntl().formatMessage({ id: _temp });
// }
const checkRole = (temp: number, role: number) => {
  return (temp & role) === role;
}
const addRole = (temp: number, role: number) => {
  return (temp | role);
}
const removeRole = (temp: number, role: number) => {
  return (temp ^ role);
}
export const str2auth = (data: string): string[] => {
  let result: string[] = [];
  if (data === 'admin') {
    // result.push(intl(`role.admin`))
    result.push('admin')
  } else {
    // let num = Number.parseInt(parseInt(data).toString(2),2)
    let num = parseInt(data);
    for (let item in user_data_auth) {
      if (checkRole(num, user_data_auth[item])) {
        // result.push(intl(`role.${item}`))
        result.push(item)
      }
    }
  }
  return result
}
export const auth2str = (data: string[]): string => {
  let result = 0;
  data.forEach(function (item, value) {
    if (item === 'admin') {
      return 'admin';
    } else {
      for (let role in user_data_auth) {
        if (item === role) {
          result += user_data_auth[role]
        }
      }
    }
  })
  return '' + result
}