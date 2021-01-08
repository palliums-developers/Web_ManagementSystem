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
  },
  {
    path: 'helpCenter',
    name: 'help',
    icon: 'Profile',
    routes: [
      {
        path: 'all_category',
        name: 'all_category',
        component: './HelpCenter/AllCategory',
      },
      {
        path: 'all_group',
        component: './HelpCenter/AllGroup',
      },
      {
        path: 'group2article',
        component: './HelpCenter/AllGroup2Article',
      },
      {
        path: 'edit_group',
        component: './HelpCenter/EditGroup',
      },
      {
        path: 'edit_category',
        component: './HelpCenter/EditCategory',
      },
      {
        path: 'all_article',
        name: 'all_article',
        component: './HelpCenter/AllArticle',
      },
      {
        path: 'edit_article',
        component: './HelpCenter/EditArticle',
      },
      {
        path: 'work_order',
        name: 'work_order',
        component: './HelpCenter/WorkOrder',
      },
    ],
  },
  // {
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
