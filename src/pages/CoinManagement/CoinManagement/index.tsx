import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Select, Modal, Switch } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi'
import { coin_data, getViolasCurrency, getCoinData, postCoinData } from '@/services/bank';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [coinTable, setCoinTable] = useState<coin_data[]>();
  const [status, setStatus] = useState(undefined);
  const [operationStatus, setOperationStatus] = useState({ status: false, coinId: 0 })
  const [modal, setModal] = useState({ new: false, edit: false, status: false });
  const [selectCoin, setSelectCoin] = useState({ search: '', add: '' });
  const [currency, setCurrency] = useState({ all: ['Coin Name'], managed: [''], other: [''] });
  const [editData, setEditData] = useState<coin_data>({
    id: 0,
    precision: 0,
    name: '',
    min_quantity: 0,
    max_quantity: 0,
    status: false
  })
  const [showData, setShowData] = useState<coin_data[]>();
  const handleSelectStatus = (value: any) => {
    setStatus(value);
  }
  const handleSelectCoin = (value: any, type: any) => {
    if (type === 'modal') {
      setSelectCoin({ search: selectCoin.search, add: value });
      setEditData({
        id: editData.id,
        precision: editData.precision,
        name: value,
        min_quantity: editData.min_quantity,
        max_quantity: editData.max_quantity,
        status: editData.status
      });
    } else if (type === 'search') {
      setSelectCoin({ search: value, add: selectCoin.add });
    }
  }
  const handleSearch = () => {
    console.log(status, selectCoin.search)
    let temp=[];
    let result=[];
    for(let i in coinTable){
      if(status){
        if(status==='available' && coinTable[i].status){
          temp.push(coinTable[i]);
        }else if(status==='unavailable' && !coinTable[i].status){
          temp.push(coinTable[i]);
        }
      }else{
        temp=coinTable;
      }
    }
    for(let j in temp){
      if(selectCoin.search){
        if(selectCoin.search===temp[j].name.trim()){
          result.push(temp[j]);
        }
      }else{
        result=temp;
      }
    }
    setShowData(result)
  }
  const showModal = (type: string) => {
    switch (type) {
      case 'new':
        setEditData({
          id: 0,
          precision: 0,
          name: '',
          min_quantity: 0,
          max_quantity: 0,
          status: false
        })
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
  const onOkEdit = async () => {
    let result = {}
    if (modal.status) {
      result = await postCoinData('status', {
        id: operationStatus.coinId,
        status: !operationStatus.status
      })
    } else if (modal.new) {
      result = await postCoinData('add', {
        precision: editData?.precision,
        name: editData?.name,
        max_quantity: editData?.max_quantity,
        min_quantity: editData?.min_quantity,
        status: editData?.status
      })
    } else if (modal.edit) {
      result = await postCoinData('edit', {
        id: editData?.id,
        precision: editData?.precision,
        name: editData?.name,
        max_quantity: editData?.max_quantity,
        min_quantity: editData?.min_quantity,
        status: editData?.status
      })
    }
    if (result?.status === 'ok') {
      onCancelEdit();
      initial();
    }
  }
  const onCancelEdit = () => {
    setModal({ new: false, edit: false, status: false });
    setEditData({
      id: 0,
      precision: 0,
      name: '',
      min_quantity: 0,
      max_quantity: 0,
      status: false
    })
  }
  const modalInput = (e: any, type: string) => {
    let temp_number = parseFloat(e.target.value);
    switch (type) {
      case 'precision':
        setEditData({
          id: editData.id,
          precision: temp_number,
          name: editData.name,
          min_quantity: editData.min_quantity,
          max_quantity: editData.max_quantity,
          status: editData.status
        });
        break;
      case 'min':
        setEditData({
          id: editData.id,
          precision: editData.precision,
          name: editData.name,
          min_quantity: temp_number,
          max_quantity: editData.max_quantity,
          status: editData.status
        });
        break;
      case 'max':
        setEditData({
          id: editData.id,
          precision: editData.precision,
          name: editData.name,
          min_quantity: editData.min_quantity,
          max_quantity: temp_number,
          status: editData.status
        });
        break;
    }
  }
  const statusOperation = (status: boolean, id: number) => {
    setOperationStatus({ status: status, coinId: id });
    showModal('status');
  }
  const clickEdit = (data: coin_data) => {
    setEditData(data);
    showModal('edit');
  }
  const initial = async () => {
    let temp1 = await getViolasCurrency().then(res => { return res.data.currencies });
    let temp2: string[] = [];
    for (let i in temp1) {
      temp2.push(temp1[i].name);
    }
    let temp3 = await getCoinData('data');
    let temp4: string[] = [];
    for (let j in temp3) {
      temp4.push(temp3[j].name.trim());
    }
    let temp5 = temp2.filter(item => !temp4.includes(item));
    setCurrency({ all: temp2, managed: temp4, other: temp5 });
    setCoinTable(temp3);
    setShowData(temp3);
  }
  useEffect(() => {
    initial();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  // const dataSource = [
  //   {
  //     id: 1,
  //     name: 'BTC',
  //     precision: 0.01,
  //     min_quantity: 0.001,
  //     max_quantity: 1,
  //     status: true
  //   },
  //   {
  //     id: 2,
  //     name: 'ETH',
  //     precision: 0.01,
  //     min_quantity: 0.001,
  //     max_quantity: 1,
  //     status: false
  //   },
  // ]
  const columns1 = [
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
        title={modal.edit ? intl('bank.edit_coin') : intl('bank.new_coin')}
        visible={modal.edit || modal.new}
        // onOk={onOkEdit}
        onCancel={onCancelEdit}
        footer={null}
      >
        <div className={styles.row}>
          <p>{intl('bank.coin_name')}</p>
          {
            modal.new ?
              <Select
                allowClear
                value={selectCoin.add}
                // defaultValue={undefined}
                // placeholder={intl('bank.coin_name')}
                style={{ width: 200 }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                // onSearch={this.handleSearch}
                onChange={e => handleSelectCoin(e, 'modal')}
                notFoundContent={null}
              >
                {currency.other.map(item => {
                  return <Option value={item}>{item}</Option>
                })}
              </Select> :
              <Input value={editData?.name} />
          }
        </div>
        <div className={styles.row}>
          <p>{intl('bank.coin_precision')}</p>
          <Input placeholder={'bank.coin_precision_please'} defaultValue={editData?.precision} onChange={e => modalInput(e, 'precision')} />
        </div>
        <div className={styles.row}>
          <p>{intl('bank.coin_min_quantity')}</p>
          <Input placeholder={'bank.coin_min_quantity_please'} defaultValue={editData?.min_quantity} onChange={e => modalInput(e, 'min')} />
        </div>
        <div className={styles.row}>
          <p>{intl('bank.coin_max_quantity')}</p>
          <Input placeholder={'bank.coin_man_quantity_please'} defaultValue={editData?.max_quantity} onChange={e => modalInput(e, 'max')} />
        </div>
        {/* <Button onClick={onCancelEdit}>{intl('operation.cancel')}</Button> */}
        <Button type='primary' onClick={onOkEdit}>{intl('operation.confirm')}</Button>
        <Table></Table>
      </Modal>
      <Modal
        title={intl('bank.edit_coin')}
        visible={modal.status}
        onOk={onOkEdit}
        onCancel={onCancelEdit}
      >
        {
          operationStatus.status ?
            <h2>{intl('bank.disable_status')}</h2> :
            <h2>{intl('bank.able_status')}</h2>
        }
      </Modal>
      <Card>
        <div className={styles.row}>
          <Select
            // showSearch
            allowClear
            value={selectCoin.search}
            // defaultValue={undefined}
            // placeholder={intl('bank.coin_name')}
            style={{ width: 200 }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            // onSearch={this.handleSearch}
            onChange={e => handleSelectCoin(e, 'search')}
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
          <Button type='primary' onClick={() => handleSearch()}>{intl('operation.search')}</Button>
          <Button onClick={() => showModal('new')}>{intl('operation.new')}</Button>
        </div>
      </Card>
      <Table dataSource={showData} columns={columns1}></Table>
    </PageContainer>
  );
};
