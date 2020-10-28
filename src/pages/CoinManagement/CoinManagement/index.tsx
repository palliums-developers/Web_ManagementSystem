import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Select, Modal, Switch } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi'
import { coin_data, getViolasCurrency } from '@/services/bank';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [coinTable, setCoinTable] = useState();
  const [status, setStatus] = useState(undefined);
  const [operationStatus, setOperationStatus] = useState({ status: false, coinId: Number })
  const [modal, setModal] = useState({ new: false, edit: false, status: false });
  const [selectCoin, setSelectCoin] = useState('');
  const [currency, setCurrency] = useState({ all: [''], managed: [''], other: [''] });
  const handleSelectStatus = (value: any) => {
    console.log(value);
    setStatus(value);
  }
  const handleSelectCoin = (value: any) => {
    console.log(value);
    setSelectCoin(value);
  }
  const showModal = (type: string) => {
    switch (type) {
      case 'new':
        setModal({ new: true, edit: false, status: false });
        break;
      case 'edit':
        setModal({ new: false, edit: true, status: false });
        break;
      case 'status':
        setModal({ new: false, edit: false, status: true });
        break;
    }
  }
  const onOkEdit = () => {
    onCancelEdit();
  }
  const onCancelEdit = () => {
    setModal({ new: false, edit: false, status: false });
  }
  const statusOperation = (status: boolean, id: number) => {
    console.log(status, id);
  }
  const clickEdit = (data: coin_data) => {
    console.log(data);
  }
  const getCurrency = async () => {
    let temp1 = await getViolasCurrency().then(res => { return res.data.currencies });
    let temp2: string[] = [];
    for (let i in temp1) {
      temp2.push(temp1[i].name)
    }
    // todo managed api 
    setCurrency({ all: temp2, managed: [], other: [] });
  }
  useEffect(() => {
    getCurrency();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const dataSource = [
    {
      id: 1,
      name: 'BTC',
      precision: 0.01,
      min_quantity: 0.001,
      max_quantity: 1,
      status: true
    },
    {
      id: 2,
      name: 'ETH',
      precision: 0.01,
      min_quantity: 0.001,
      max_quantity: 1,
      status: false
    },
  ]
  const columns = [
    {
      title: intl('bank.coin_name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl('bank.coin_precision'),
      dataIndex: 'precision',
      key: 'precision',
    },
    {
      title: intl('bank.coin_min_quantity'),
      dataIndex: 'min_quantity',
      key: 'min_quantity',
    },
    {
      title: intl('bank.coin_max_quantity'),
      dataIndex: 'max_quantity',
      key: 'max_quantity',
    },
    {
      title: intl('bank.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: coin_data) => <Switch checked={status} onClick={() => {
        statusOperation(status, record.id)
      }} />
    },
    {
      title: intl('operation'),
      render: (record: coin_data) => <p style={{ color: 'Blue', cursor: 'pointer', marginBottom: 0 }} onClick={() => { clickEdit(record) }}>{intl('operation.edit')}</p>
    },
  ]
  // const options = currency.map(item => <Option value={item.name}>{item.name}</Option>)
  return (
    <PageContainer className={styles.main}>
      <Modal
        title={intl('bank.edit_coin')}
        visible={modal.edit}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
      >
      </Modal>
      <Modal
        title={intl('bank.edit_coin')}
        visible={modal.status}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
      >
        <h2>{intl('bank.disable_status')}</h2>
      </Modal>
      <Card>
        <div className={styles.row}>
          {/* <Input placeholder={intl('bank.coin_name')} /> */}
          <Select
            // showSearch
            allowClear
            value={selectCoin}
            // defaultValue={undefined}
            placeholder={intl('bank.coin_name')}
            style={{ width: 200 }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            // onSearch={this.handleSearch}
            onChange={handleSelectCoin}
            notFoundContent={null}
          >
            {currency.all.map(item => {
              // console.log(item);
              return <Option value={item}>{item}</Option>
            })
            }
          </Select>
          <Select
            style={{ width: 200 }}
            allowClear
            placeholder={intl('bank.status')}
            onChange={handleSelectStatus}
          >
            <Option value='available'>{intl('bank.status_ava')}</Option>
            <Option value='unavailable'>{intl('bank.status_una')}</Option>
          </Select>
          <Button type='primary'>{intl('operation.search')}</Button>
          <Button onClick={() => showModal('new')}>{intl('operation.new')}</Button>
        </div>
      </Card>
      <Table dataSource={dataSource} columns={columns}></Table>
    </PageContainer>
  );
};
