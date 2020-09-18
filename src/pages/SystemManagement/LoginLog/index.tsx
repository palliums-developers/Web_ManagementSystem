import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button } from 'antd';
import styles from './index.less';
import { render } from 'react-dom';
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
      time: '123123123',
      ip: '127.0.0.1',
      location: 'Beijing',
      browser: 'firefox',
    },
    {
      name: 'admin',
      time: '123123123',
      ip: '127.0.0.1',
      location: 'New York',
      browser: 'Chromium',
    }
  ]
  const columns: any = [
    {
      title: intl('systemLog.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl('systemLog.time'),
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: intl('systemLog.ip'),
      dataIndex: 'ip',
      key: 'ip'
    },
    {
      title: intl('systemLog.location'),
      dataIndex: 'location',
      key: 'location'
    },
    {
      title: intl('systemLog.browser'),
      dataIndex: 'browser',
      key: 'browser'
    },
  ];
  return (
    <PageContainer>
      <Card>
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