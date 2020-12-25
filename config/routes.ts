export default [
  {
    layout: false,
    path: '/login',
    component: './Login',
  },
  {
    path: 'account',
    name: 'account',
    icon: 'facebook',
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
    routes: [
      {
        path: 'system_notification',
        name: 'system_notification',
        icon: 'facebook',
        component: './ConfigManagement/SystemNotification',
      },
      {
        path: 'modify',
        component: './ConfigManagement/ModifyNotification',
      },
    ],
  },
  {
    path: 'coin',
    name: 'coin',
    icon: 'dollar',
    routes: [
      {
        path: 'coin_management',
        name: 'coin_management',
        icon: 'facebook',
        component: './CoinManagement/CoinManagement',
      },
      {
        path: 'deposit',
        name: 'deposit',
        icon: 'facebook',
        component: './CoinManagement/Deposit',
      },
      {
        path: 'borrow',
        name: 'borrow',
        icon: 'facebook',
        component: './CoinManagement/Borrow',
      },
      {
        path: 'modify',
        // name:'modify',
        component: './CoinManagement/BankEdit',
      },
      {
        path: 'coin_edit',
        component: './CoinManagement/CoinEdit',
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
];
