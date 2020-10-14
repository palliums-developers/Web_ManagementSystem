import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Table, Button, Switch, Modal } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import { getBankProduct, bank_product, show_data } from '@/services/bank'

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}

const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rawData, setRawData] = useState<bank_product[]>();
  const [showData, setShowData] = useState<show_data[]>([{ id: 999, name: 'Loading', description: 'Loading', min: 0, max: 0, increase: 0, status: false }]);
  const [status, setStatus] = useState({ status: false, id: 0 });
  const [modal, setModal] = useState({ status: false, add: false, edit: false, view: false });
  const filter_onClick_search = () => {
    console.log('search')
  }
  const statusChange = async (_status: boolean, id: number) => {
    // console.log(status, id)
    // let temp=showData;
    // for(let i in temp){
    //   if(temp[i].id===id){
    //     temp[i].status=!status;
    //   }
    // }
    // console.log(temp)
    // setShowData(temp);
    showModal('status', { status: !_status, id: id });
  }
  const showModal = (type: string, data?: any) => {
    let temp = modal;
    switch (type) {
      case 'status':
        temp.status = true;
        break;
      case 'add':
        temp.add = true;
        break;
      case 'edit':
        temp.edit = true;
        break;
      case 'view':
        temp.view = true;
        break;
    }
    console.log(temp)
    setModal(temp);
  }
  const handleModalOk = (type: string) => {
    handleModalCancel(type)
  }
  const handleModalCancel = (type: string) => {
    let temp = modal;
    switch (type) {
      case 'status':
        temp.status = false;
        break;
      case 'add':
        temp.add = false;
        break;
      case 'edit':
        temp.edit = false;
        break;
      case 'view':
        temp.view = false;
        break;
    }
    console.log(temp)
    setModal(temp);
  }
  const initial = async () => {
    const temp = await getBankProduct('deposit');
    setRawData(temp);
    setShowData(getShowDataFromRawData(temp));
  }
  const getShowDataFromRawData = (temp: bank_product[]) => {
    let result = [];
    for (let i in temp) {
      result.push(
        {
          id: temp[i].id,
          name: temp[i].product_name,
          description: temp[i].description,
          min: temp[i].minimum_amount,
          max: temp[i].max_limit,
          increase: temp[i].pledge_rate,
          status: temp[i].status
        }
      )
    }
    return result;
  }

  const filter_onChange_status = () => {
    console.log(11)
  }
  useEffect(() => {
    initial()
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
      dataIndex: 'min',
      key: 'min_deposit'
    },
    {
      title: intl('bank.daily_deposit'),
      dataIndex: 'max',
      key: 'daily_deposit'
    },
    {
      title: intl('bank.step_deposit'),
      dataIndex: 'increase',
      key: 'step_deposit'
    },
    {
      title: intl('bank.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: bank_product) => <Switch checked={status} onClick={() => {
        // statusChange(status, record.id)
        showModal('status', { status: status, id: record.id })
      }} />
    },
    {
      title: intl('operation'),
      // dataIndex: 'operation',
      // key: 'operation'
      render: (index: number, record: show_data) => <div className='raw_operation'><p onClick={()=>showModal('edit',record)}>{intl('operation.edit')}</p>|<p onClick={()=>showModal('add',record)}>{intl('operation.view')}</p></div>
    },
  ]

  return (
    <PageContainer className={styles.main}>
      <Card>
        {/**
         *change status modal
         */}
        <Modal
          visible={modal.status}
          onOk={() => handleModalOk('status')}
          onCancel={() => handleModalCancel('status')}
        >
          <h1>{status ? intl('bank.disable_status') : intl('bank.able_status') + ' ?'} </h1>
        </Modal>
        <div>
          <Input allowClear={true} placeholder={intl('operation.keyword')} style={{ width: 200 }} />
          <Select onChange={filter_onChange_status} placeholder={intl('user.status')} style={{ width: 200 }} allowClear onClear={() => setStatus({ status: false, id: 0 })}>
            <Option value="true">{intl('user.status_t')}</Option>
            <Option value="false">{intl('user.status_f')}</Option>
          </Select>
          <Button type='primary' onClick={filter_onClick_search}>{intl('operation.search')}</Button>
          <Button onClick={() => showModal('add')}>{intl('operation.new')}</Button>
        </div>
        <Table dataSource={showData} columns={columns} />
      </Card>
    </PageContainer>
  );
};
