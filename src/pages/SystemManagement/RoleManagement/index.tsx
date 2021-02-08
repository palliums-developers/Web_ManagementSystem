import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Button, Tree } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import { getRole } from '@/services/roleManagement';


// class RoleManagement extends React.Component{
//   constructor(props) {
//     super(props)
// }
// }

export default () => {

  const [loading, setLoading] = useState<boolean>(true);
  const [role_data, set_role_data] = useState<any[]>([]);
  const [click_role_name, set_click_role_name] = useState<string>('');
  const [check_page, set_check_page] = useState<string[]>();
  const [right_list, set_right_list] = useState<any[]>();
  const [select_page, set_select_page] = useState<string[]>();
  const [check_right, set_check_right] = useState<string[]>();
  const [select_right, set_select_right] = useState<string[]>();
  const [post_data, set_post_data] = useState<any>(
    {
      account: 0,
      article: 0,
      borrow: 0,
      category: 0,
      coin_management: 0,
      deposit: 0,
      group: 1,
      id: 0,
      login_log: 0,
      name: "",
      operation_log: 0,
      role: 0,
      system_notification: 0,
      user_management: 0,
      welcome: 1,
    }
  );
  const getRoleData = async () => {
    let temp_role_data = await getRole();
    // console.log(temp_role_data.data);
    set_role_data(temp_role_data.data);
  }
  const all_right = {
    view: 0b0001,
    edit: 0b0010,
    add: 0b0100,
    del: 0b1000,
  };
  const initPage = async () => {
    await getRoleData();
  }
  useEffect(() => {
    initPage();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const intl = (_temp: string) => {
    return useIntl().formatMessage({ id: _temp });
  }

  const onClickRoleName = (role_name: string) => {
    set_click_role_name(role_name);
    renderPageList(role_name);
  }

  const renderPageList = (page_name: string) => {
    for (let i in role_data) {
      if (role_data[i].name === page_name) {
        set_check_page(traverseRoleData('name', role_data[i]));
        set_post_data(role_data[i]);
        return;
      }
    }
  }

  const renderRightList = (page_name: string) => {
    // for (let i in role_data) {
    //   if (role_data[i].name === role_name) {
    //     for (let j in role_data[i]) {
    //       if (j === page_name) {
    //         set_right_list(num2right(role_data[i][j]));
    //       }
    //     }
    //   }
    // }
    for (let i in post_data) {
      if (i === page_name) {
        set_right_list(num2right(post_data[i]))
      }
    }
  }

  const num2right = (num: number) => {
    let result = [];
    for (let i in all_right) {
      if ((all_right[i] & num) === all_right[i]) {
        result.push(i)
      }
    }
    return result;
  }

  const traverseRoleData = (type: string, role_data: any) => {
    if (type === 'name') {
      let result = []
      for (let i in role_data) {
        result.push(i)
      }
      return result;
    }
  }

  const onSelectPage = (selectedKeys: React.Key[], info: any) => {
    set_select_page(selectedKeys[0]);
    renderRightList(selectedKeys[0]);
  };

  const onCheckPage = (checkedKeys: React.Key[], info: any) => {
    set_check_page(checkedKeys);
    // console.log('onCheck', checkedKeys, info);
  };

  const onSelectRight = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheckRight = (checkedKeys: React.Key[], info: any) => {
    console.log('onCheck', checkedKeys, info);
    set_right_list(checkedKeys)
  };

  const formatDisplayData = () => {

  }

  const formatPostData = () => {

  }

  const menuData = [
    {
      title: intl('menu.system'),
      key: 'system',
      children: [
        {
          title: intl('menu.system.user'),
          key: 'user_management',
        },
        {
          title: intl('menu.system.role'),
          key: 'role',
        },
        {
          title: intl('menu.system.login_log'),
          key: 'login_log',
        },
        {
          title: intl('menu.system.operation_log'),
          key: 'operation_log',
        },
      ],
    },
    {
      title: intl('menu.config'),
      key: 'config',
      children: [
        {
          title: intl('menu.config.system_notification'),
          key: 'system_notification',
        },
      ],
    },
    {
      title: intl('menu.coin'),
      key: 'coin',
      children: [
        {
          title: intl('menu.coin.coin_management'),
          key: 'coin_management',
        },
        {
          title: intl('menu.coin.deposit'),
          key: 'deposit',
        },
        {
          title: intl('menu.coin.borrow'),
          key: 'borrow',
        },
      ],
    },
    {
      title: intl('menu.help'),
      key: 'help',
      children: [
        {
          title: intl('menu.help.all_category'),
          key: 'category',
        },
        {
          title: intl('menu.help.all_group'),
          key: 'group'
        },
        {
          title: intl('menu.help.all_article'),
          key: 'article'
        },
      ]
    }
  ];
  const operationData = [
    {
      title: intl('operation.all'),
      key: 'all',
      children: [
        {
          title: intl('operation.view'),
          key: 'view',
        },
        {
          title: intl('operation.edit'),
          key: 'edit',
        },
        {
          title: intl('operation.new'),
          key: 'new',
        },
        {
          title: intl('operation.del'),
          key: 'del',
        }
      ]
    }
  ]
  return (
    <PageContainer>
      <Card>
        <div className={styles.operation}>
          <Button type="primary">{intl('operation.new')}</Button>
          <Button>{intl('operation.save')}</Button>
        </div>
        <div className={styles.role}>
          <div className={styles.role_name_list}>
            <p className={styles.title}>{intl('role.list')}</p>
            <p className={styles.role_name}>Admin</p>
            {
              role_data.length > 0 &&
              role_data.map((v, i) => {
                return <p className={styles.role_name} onClick={() => { onClickRoleName(v.name) }}>{v.name}</p>
              })
            }
          </div>
          <div className={styles.role_data}>
            <div className={styles.role_page}>
              <p className={styles.title}>{intl('role.menuList')}</p>
              <Tree
                checkable
                defaultExpandedKeys={['system', 'coin', 'help', 'config']}
                defaultSelectedKeys={[]}
                checkedKeys={check_page}
                onSelect={onSelectPage}
                onCheck={onCheckPage}
                treeData={menuData}
              />
            </div>
            <div className={styles.role_right}>
              <p className={styles.title}>{intl('role.right')}</p>
              <Tree
                checkable
                defaultExpandedKeys={['all']}
                defaultSelectedKeys={[]}
                // defaultCheckedKeys={['del', 'view']}
                checkedKeys={right_list}
                onSelect={onSelectRight}
                onCheck={onCheckRight}
                treeData={operationData}
              />
            </div>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};