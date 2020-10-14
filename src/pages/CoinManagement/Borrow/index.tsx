import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Table, Button } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}

const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [filter,setFilter]=useState();
  const filter_onClick_search=()=>{
    console.log('search')
  }
  const showModal=(type:string)=>{
    console.log(type);
  }
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const columns: any = [
    {
      title: intl('bank.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl('bank.description'),
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: intl('bank.min_deposit'),
      dataIndex: 'min_deposit',
      key: 'min_deposit'
    },
    {
      title: intl('bank.daily_deposit'),
      dataIndex: 'daily_deposit',
      key: 'daily_deposit'
    },
    {
      title: intl('bank.step_deposit'),
      dataIndex: 'step_deposit',
      key: 'step_deposit'
    },
    {
      title: intl('bank.status'),
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: intl('bank.operation'),
      dataIndex: 'operation',
      key: 'operation'
    },
  ]

  return (
    <PageContainer className={styles.main}>
      <Card>
        <div>
          <Input />
          <Select>
            <Option value='true'></Option>
            <Option value='false'></Option>
          </Select>
          <Button type='primary' onClick={filter_onClick_search}>{intl('operation.search')}</Button>
          <Button onClick={() => showModal('add')}>{intl('operation.new')}</Button>
        </div>
        <Table dataSource={filter} columns={columns} />
      </Card>
    </PageContainer>
  );
};
