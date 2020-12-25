import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Select, Modal, Switch } from 'antd';
import moment from 'moment';
import { useIntl, history } from 'umi';
import styles from './index.less';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [operationData, setOperationData] = useState();
  const onOkEdit = () => {};
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const columns2 = [
    {
      title: intl('bank.operator'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl('operation.time'),
      dataIndex: 'time',
      key: 'time',
      render: (time: any) => {
        return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: intl('operation.type'),
      dataIndex: 'operation_type',
      render: (value: string) => {
        return value.split('_')[0];
      },
    },
    {
      title: intl('operation.log'),
      dataIndex: 'operation',
    },
  ];
  return (
    <PageContainer content="这是一个新页面，从这里进行开发！" className={styles.main}>
      <div style={{ paddingTop: 100, textAlign: 'center' }}>
        <Input value={'111'} />
        <div className={styles.row}>
          <p>{intl('bank.coin_precision')}</p>
          <Input
            placeholder={'bank.coin_precision_please'}
            // defaultValue={editData?.precision}
            // onChange={(e) => modalInput(e, 'precision')}
          />
        </div>
        <div className={styles.row}>
          <p>{intl('bank.coin_min_quantity')}</p>
          <Input
            placeholder={'bank.coin_min_quantity_please'}
            // defaultValue={editData?.min_quantity}
            // onChange={(e) => modalInput(e, 'min')}
          />
        </div>
        {/* <Button onClick={onCancelEdit}>{intl('operation.cancel')}</Button> */}
        <div className={styles.row}>
          <p>{intl('bank.coin_max_quantity')}</p>
          <Input
            placeholder={'bank.coin_man_quantity_please'}
            // defaultValue={editData?.max_quantity}
            // onChange={(e) => modalInput(e, 'max')}
          />
        </div>
        <Button type="primary" onClick={onOkEdit}>
          {intl('operation.confirm')}
        </Button>
        <Table
          dataSource={operationData}
          columns={columns2}
          size="small"
          pagination={{ pageSize: 5 }}
        ></Table>
      </div>
    </PageContainer>
  );
};
