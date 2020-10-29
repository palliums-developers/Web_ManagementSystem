import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Button, Tree } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';


// class RoleManagement extends React.Component{
//   constructor(props) {
//     super(props)
// }
// }

export default () => {

  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const intl = (_temp: string) => {
    return useIntl().formatMessage({ id: _temp });
  }
  const menuData = [
    {
      title: intl('menu.system'),
      key: 'system',
      children: [
        {
          title: intl('menu.system.user'),
          key: 'user',
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
          title: intl('menu.system.user'),
          key: 'user11111111',
        },
        {
          title: intl('menu.system.role'),
          key: 'role1111111111111111111111111111111111',
        },
        {
          title: intl('menu.system.login_log'),
          key: 'login_log1111111111111111111111111111111111',
        },
        {
          title: intl('menu.system.operation_log'),
          key: 'operation_log1111111111111111111111',
        },
      ],
    },
    {
      title: intl('menu.coin'),
      key: 'coin',
      children: [
        {
          title: intl('menu.system.user'),
          key: 'user2',
        },
        {
          title: intl('menu.system.role'),
          key: 'role2',
        },
        {
          title: intl('menu.system.login_log'),
          key: 'login_log2',
        },
        {
          title: intl('menu.system.operation_log'),
          key: 'operation_log2',
        },
      ],
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
    // <PageContainer content="这是一个新页面，从这里进行开发！" className={styles.main}>
    //   <div style={{ paddingTop: 100, textAlign: 'center' }}>
    //     <Spin spinning={loading} size="large" />
    //   </div>
    // </PageContainer>
    <PageContainer>
      <Card>
        {/* <div>
          <Button type="primary">{intl('operation.new')}</Button>
          <Button>{intl('operation.save')}</Button>
        </div>
        <div>
          <div>
            <p>{intl('role.list')}</p>

          </div>
          <div>
            <p>{intl('role.menuList')}</p>
            <Tree
              checkable
              defaultExpandedKeys={['0-0-0', '0-0-1']}
              defaultSelectedKeys={['0-0-0', '0-0-1']}
              defaultCheckedKeys={['0-0-0', '0-0-1']}
              // onSelect={onSelect}
              // onCheck={onCheck}
              treeData={menuData}
            />
          </div>
          <div>
            <Tree
              checkable
              defaultExpandedKeys={['all']}
              defaultSelectedKeys={[]}
              defaultCheckedKeys={['del', 'view']}
              // onSelect={onSelect}
              // onCheck={onCheck}
              treeData={operationData}
            />
          </div>
        </div> */}
      </Card>
    </PageContainer>
  );
};