import { layout } from '../src/app'; // https://umijs.org/config/

import { defineConfig, useIntl } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env; // console.log(sessionStorage.getItem('user'));
// const intl = (_temp: string) => {
//   return useIntl().formatMessage({ id: _temp });
// }

let vls_back_management_url = 'http://localhost:5000/';
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // name: 'Ant Design Pro',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    // enable: true,
    // default zh-CN
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    // {
    //   path: '/user',
    //   layout: false,
    //   routes: [
    //     {
    //       name: 'login',
    //       path: '/user/login',
    //       component: './user/login',
    //     },
    //   ],
    // },
    {
      // name: 'login',
      layout: false,
      path: '/login',
      component: './Login',
    },
    // {
    //   name: '个人设置',
    //   icon: 'smile',
    //   path: '/account/accountsettings',
    //   component: './Account/AccountSettings',
    // },
    {
      path: 'account',
      name: 'Account',
      icon: '',
      component: './Account',
    },
    {
      path: '/welcome',
      // name: currentUser.name,
      icon: 'smile',
      component: './Welcome',
    },
    {
      path: 'system',
      name: 'system',
      icon: 'control',
      routes: [
        {
          path: 'user_management',
          name: 'user',
          icon: 'facebook',
          component: './SystemManagement/UserManagement',
        },
        {
          path: 'role_management',
          name: 'role',
          icon: 'facebook',
          component: './SystemManagement/RoleManagement',
        },
        {
          path: 'login_log',
          name: 'login_log',
          icon: 'facebook',
          component: './SystemManagement/LoginLog',
        },
        {
          path: 'operation_log',
          name: 'operation_log',
          icon: 'facebook',
          component: './SystemManagement/OperationLog',
        },
      ],
    },
    {
      path: 'config',
      name: 'config',
      icon: 'setting',
      component: './ConfigManagement',
    },
    {
      path: 'coin',
      name: 'coin',
      icon: 'dollar',
      // component: './CoinManagement'
      routes: [
        {
          path: 'deposit',
          name: 'Deposit',
          icon: 'facebook',
          component: './CoinManagement/Deposit',
        },
        {
          path: 'borrow',
          name: 'Borrow',
          icon: 'facebook',
          component: './CoinManagement/Borrow',
        },
        {
          path: 'modify',
          // name:'modify',
          component: './CoinManagement/BankEdit',
        },
      ],
    }, // {
    //   path: '/admin',
    //   name: 'admin',
    //   icon: 'crown',
    //   access: 'canAdmin',
    //   component: './Admin',
    //   routes: [
    //     {
    //       path: '/admin/sub-page',
    //       name: 'sub-page',
    //       icon: 'smile',
    //       component: './Welcome',
    //     },
    //     {
    //       name: '空白页面',
    //       icon: 'smile',
    //       path: '/admin/temp',
    //       component: './Temps',
    //     },
    //   ],
    // },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  // proxy: proxy[REACT_APP_ENV || 'dev'],
  proxy: {
    '/api/login': {
      target: vls_back_management_url,
      changeOrigin: true,
      pathRewrite: {
        '^/localhost': '',
      },
    },
    '/api/loginLog': {
      target: vls_back_management_url,
      changeOrigin: true,
      pathRewrite: {
        '^/localhost': '',
      },
    },
    '/api/operationLog': {
      target: vls_back_management_url,
      changeOrigin: true,
      pathRewrite: {
        '^/localhost': '',
      },
    },
    '/api/user': {
      target: vls_back_management_url,
      changeOrigin: true,
      pathRewrite: {
        '^/localhost': '',
      },
    },
    '/api/bank': {
      target: vls_back_management_url,
      changeOrigin: true,
      pathRewrite: {
        '^/localhost': '',
      },
    },
  },
  manifest: {
    basePath: '/',
  },
});
