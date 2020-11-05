import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Button, Input } from 'antd';
import { getLoginList } from '@/services/loginLog';
import styles from './index.less';
import { render } from 'react-dom';
import { useIntl } from 'umi';
import moment from 'moment';
import DateSelecter from '@/components/DateSelecter';

let pageSize = 10;

// function changeDate(value: Array<any>, dateString: Array<String>) {
//   console.log('Selected Time: ', value);
//   console.log('Formatted Selected Time: ', dateString);
// }

// function dateOk(value: Array<any>) {
//   console.log('onOk: ', value[0].format('X'), value[1]);
// }

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
// let date1 = moment().format('X');
// let date2 = moment().toDate();
// console.log(date1, date2)

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [loginList, setLoginList] = useState({
    total: 0,
    pages: 0,
    pageSize: pageSize,
    items: [],
  });
  const [start_date, setStart_date] = useState(0);
  const [end_date, setEnd_date] = useState(0);
  const [userName, setUserName] = useState('');
  const { RangePicker } = DatePicker;

  useEffect(() => {
    (async () => {
      const temp = await getLoginList(1, pageSize);
      setLoginList(temp);
    })();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const getPage = (page: object): void => {
    (async () => {
      const temp = await getLoginList(page?.current, pageSize, userName, start_date, end_date);
      setLoginList(temp);
    })();
  };

  const getName = (e: any) => {
    setUserName(e.target.value);
  };

  const changeDate = (value: Array<any>, dateString: Array<String>) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    if (value[0] && value[1]) {
      setStart_date(value[0].format('X'));
      setEnd_date(value[1].format('X'));
    }
  };

  const dateOk = (value: Array<any>) => {
    // console.log('onOk: ', value[0].format('X'), value[1]);
    setStart_date(value[0] && value[0].format('X'));
    setEnd_date(value[1] && value[1].format('X'));
  };

  const searchLoginLog = async () => {
    const temp = await getLoginList(1, pageSize, userName, start_date, end_date);
    setLoginList(temp);
  };

  const columns: any = [
    {
      title: intl('systemLog.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl('systemLog.time'),
      dataIndex: 'time',
      key: 'time',
      render: (time: any) => {
        return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: intl('systemLog.ip'),
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: intl('systemLog.location'),
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: intl('systemLog.browser'),
      dataIndex: 'browser',
      key: 'browser',
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Input
          style={{ width: 200 }}
          placeholder={intl('systemLog.name')}
          onChange={getName}
          allowClear={true}
        />
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={changeDate}
          onOk={dateOk}
        />
        <Button type="primary" onClick={searchLoginLog}>
          {intl('operation.search')}
        </Button>
        <Table
          dataSource={loginList.items}
          columns={columns}
          pagination={{
            pageSize: loginList.pageSize,
            total: loginList.total,
          }}
          onChange={getPage}
        />
      </Card>
    </PageContainer>
  );
};
