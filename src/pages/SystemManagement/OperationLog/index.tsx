import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button, Input } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import { getOperationList } from '@/services/operationLog'
import moment from 'moment';

let pageSize = 10;

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [operationList, setOperationList] = useState({ total: 0, pages: 0, pageSize: pageSize, items: [] });
  const [start_date, setStart_date] = useState(0);
  const [end_date, setEnd_date] = useState(0);
  const [userName, setUserName] = useState('');
  const { RangePicker } = DatePicker;
  useEffect(() => {
    (async () => {
      const temp = await getOperationList(1, pageSize, 'all');
      setOperationList(temp)
    })();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const getPage = (page: object): void => {
    (async () => {
      const temp = await getOperationList(page.current, pageSize, 'all', userName, start_date, end_date);
      setOperationList(temp)
    })();
  }

  const getName = (e: any) => {
    setUserName(e.target.value)
  }

  const changeDate = (value: Array<any>, dateString: Array<String>) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    if (value && value.length > 1 && value[0] && value[1]) {
      setStart_date(value[0].format('X'));
      setEnd_date(value[1].format('X'));
    }
  }

  const dateOk = (value: Array<any>) => {
    // console.log('onOk: ', value[0].format('X'), value[1]);
    setStart_date(value[0].format('X'));
    setEnd_date(value[1].format('X'));
  }

  const searchOperationinLog = async () => {
    const temp = await getOperationList(1, pageSize, 'all', userName, start_date, end_date);
    setOperationList(temp)
  }
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
      key: 'time',
      render: (time: any) => {
        return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
      }
    },
  ];
  return (
    <PageContainer>
      <Card>
        <Input placeholder={intl('systemLog.name')} onChange={getName} allowClear={true} />
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={changeDate}
          onOk={dateOk}
        />
        <Button type="primary" onClick={searchOperationinLog}>{intl('operation.search')}</Button>
        <Table
          dataSource={operationList.items}
          columns={columns}
          pagination={
            {
              pageSize: operationList.pageSize,
              total: operationList.total,
            }
          }
          onChange={getPage}
        />
      </Card>
    </PageContainer>
  );
};
