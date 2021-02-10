import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Select, Modal, Switch } from 'antd';
import moment from 'moment';
import { useIntl, history } from 'umi';
import styles from './index.less';
import { getCoinData, postCoinData } from '@/services/bank';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [post_data, set_post_data] = useState<any>({ coin_name: '' });
  const [operationData, setOperationData] = useState();
  const onOkEdit = () => {
    // console.log(post_data);
    postCoinData('edit', post_data)
  };
  const getOperationData = async () => {
    let temp = await getCoinData('operation');
    if (temp.status === 'ok') {
      await setOperationData(temp.data);
    }
  };
  const onChangeInput = (type: string, data: string) => {
    let temp_post_data = post_data;
    switch (type) {
      case 'max_num_trade':
        temp_post_data.max_num_trade = parseInt(data);
        set_post_data(temp_post_data);
        break;
      case 'min_num_precision':
        temp_post_data.min_num_precision = parseFloat(data);
        set_post_data(temp_post_data);
        break;
      case 'min_num_trade':
        temp_post_data.min_num_trade = parseFloat(data);
        set_post_data(temp_post_data);
        break;
      case 'min_num_withdraw':
        temp_post_data.min_num_withdraw = parseInt(data);
        set_post_data(temp_post_data);
        break;
      case 'price_precision':
        temp_post_data.price_precision = parseInt(data);
        set_post_data(temp_post_data);
        break;
      case 'withdraw_fee':
        temp_post_data.withdraw_fee = parseInt(data);
        set_post_data(temp_post_data);
        break;
      default:
        break;
    }
  }
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
  const initPage = () => {
    let temp_data = window.localStorage.getItem('edit');
    if (temp_data) {
      set_post_data(JSON.parse(temp_data));
    }
  }
  useEffect(() => {
    initPage();
    getOperationData();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer className={styles.main}>
      {
        post_data.coin_name ?
          <div style={{
            paddingTop: 10,
            // textAlign: 'center'
          }}>
            <p>Coin Name: {post_data.coin_name}</p>
            <div className={styles.row}>
              <p>{intl('bank.min_num_precision') + ':  '}</p>
              <Input
                // placeholder={'bank.coin_precision_please'}
                onChange={(e) => onChangeInput('min_num_precision', e.target.value)}
                defaultValue={post_data?.min_num_precision}
              // value={post_data?.min_num_precision}
              />
            </div>
            <div className={styles.row}>
              <p>{intl('bank.max_num_trade') + ':  '}</p>
              <Input
                // placeholder={'bank.coin_min_quantity_please'}
                onChange={(e) => onChangeInput('max_num_trade', e.target.value)}
                defaultValue={post_data?.max_num_trade}
              // value={post_data?.max_num_trade}
              />
            </div>
            <div className={styles.row}>
              <p>{intl('bank.min_num_trade') + ':  '}</p>
              <Input
                // placeholder={'bank.coin_min_quantity_please'}
                onChange={(e) => onChangeInput('min_num_trade', e.target.value)}
                defaultValue={post_data?.min_num_trade}
              // value={post_data?.min_num_trade}
              />
            </div>
            <div className={styles.row}>
              <p>{intl('bank.min_num_withdraw') + ':  '}</p>
              <Input
                // placeholder={'bank.coin_man_quantity_please'}
                onChange={(e) => onChangeInput('min_num_withdraw', e.target.value)}
                defaultValue={post_data?.min_num_withdraw}
              // value={post_data?.min_num_withdraw}
              />
            </div>
            <div className={styles.row}>
              <p>{intl('bank.price_precision') + ':  '}</p>
              <Input
                // placeholder={'bank.coin_min_quantity_please'}
                onChange={(e) => onChangeInput('price_precision', e.target.value)}
                defaultValue={post_data?.price_precision}
              // value={post_data?.price_precision}
              />
            </div>
            <div className={styles.row}>
              <p>{intl('bank.withdraw_fee') + ':  '}</p>
              <Input
                // placeholder={'bank.coin_min_quantity_please'}
                onChange={(e) => onChangeInput('withdraw_fee', e.target.value)}
                defaultValue={post_data?.withdraw_fee}
              // value={post_data?.withdraw_fee}
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
          :
          <p></p>
      }
    </PageContainer>
  );
};
