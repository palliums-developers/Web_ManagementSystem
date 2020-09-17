import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Card, Table, Switch } from 'antd';
import styles from './index.less';
import { Link, SelectLang, useModel, useIntl } from 'umi';

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
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  }
  const dataSource = [
    {
      id: 1,
      name: 'huangw',
      role: 'admin',
      email: 'hch@palliums.org',
      phone: '123123',
      time: '123123123',
      status: true,
      operation: 'edit'
    },
    {
      id: 2,
      name: 'admin',
      role: 'admin',
      email: 'hch@palliums.org',
      phone: '123123',
      time: '123123123',
      status: true,
      operation: 'edit'
    }
  ]
  const columns: any = [
    {
      title: intl('user.id'),
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: intl('user.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl('user.role'),
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: intl('user.email'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: intl('user.phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: intl('user.time'),
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: intl('user.status'),
      dataIndex: 'status',
      render: (status: boolean) => <Switch defaultChecked onChange={onChange} />
    },
    {
      title: intl('user.operation'),
      dataIndex: 'operation',
      render: (text: string) => <p onClick={() => { console.log('edit') }}>{text}</p>
    }
  ];
  return (
    <PageContainer className={styles.main}>
      <Card>
        <input></input>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </PageContainer>
  );
};
