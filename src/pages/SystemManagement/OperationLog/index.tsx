import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';


function onChange(value: Array<any>, dateString: Array<String>) {
  console.log('Selected Time: ', value);
  console.log('Formatted Selected Time: ', dateString);
}

function onOk(value: Array<any>) {
  console.log('onOk: ', value);
}

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { RangePicker } = DatePicker;
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const dataSource = [
    {
      name: 'huangw',
      role: 'developer',
      operation: 'gogogo',
      time: '123123123',
    },
    {
      name: 'administration',
      role: 'admin',
      operation: 'gogogo',
      time: '123123123',
    }
  ]
  const columns: any = [
    {
      title: intl('systemLog.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl('systemLog.role'),
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: intl('systemLog.operation'),
      dataIndex: 'operation',
      key: 'operation'
    },
    {
      title: intl('systemLog.time'),
      dataIndex: 'time',
      key: 'time'
    },
  ];
  return (
    <PageContainer>
      <Card>
        <input></input>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={onChange}
          onOk={onOk}
        />
        <Button type="primary">{intl('operation.search')}</Button>
        <Table dataSource={dataSource} columns={columns} />
      </Card>
    </PageContainer>
  );
};
