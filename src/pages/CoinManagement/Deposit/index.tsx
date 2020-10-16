import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Table, Button, Switch, Modal } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import { getBankProduct, postBankProduct, bank_product, show_data, raw_bank_product, modal } from '@/services/bank';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}

const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rawData, setRawData] = useState<bank_product[]>();
  const [showData, setShowData] = useState<show_data[]>([{ id: 999, name: 'Loading', description: 'Loading', min: 0, max: 0, increase: 0, status: false }]);
  const [status, setStatus] = useState({ status: false, id: 0 });
  const [modal, setModal] = useState<modal>({ status: false, view: false, data: {} });
  const [postData, setPostData] = useState();
  const filter_onClick_search = () => {
    console.log('search')
  }
  const showModal = (type: string, data?: any) => {
    switch (type) {
      case 'status':
        setModal({ status: true, view: false, data: data });
        break;
      case 'add':
        localStorage.setItem('edit',JSON.stringify('add'));
        break;
      case 'edit':
        let edit_data=''
        for(let i in rawData){
          if(rawData[i].id===data.id){
            edit_data=JSON.stringify(rawData[i]);
            break;
          }
        }
        localStorage.setItem('edit',JSON.stringify(edit_data))
        break;
      case 'view':
        console.log(data)
        setModal({ status: false, view: true, data: data });
        break;
    }
  }
  const handleModalOk = async (type: string) => {
    let result;
    switch (type) {
      case 'status':
        let postData = {
          "id": modal.data.id,
          "status": !modal.data.status
        }
        result = await postBankProduct(type, 'deposit', postData)
        break;
      case 'add':
        break;
      case 'edit':
        break;
      case 'view':
        break;
    }
    if (result.status && result.status === 'ok') {
      initial();
      handleModalCancel();
    }
  }
  const handleModalCancel = () => {
    setModal({ status: false, view: false, data: {} });
  }
  const initial = async () => {
    const temp = await getBankProduct('deposit');
    setRawData(temp);
    setShowData(getShowDataFromRawData(temp));
  }
  const getShowDataFromRawData = (temp: raw_bank_product[]) => {
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
      render: (status: boolean, record: bank_product) => <Switch checked={status} onChange={() => {
        showModal('status', { status: status, id: record.id })
      }} />
    },
    {
      title: intl('operation'),
      // dataIndex: 'operation',
      // key: 'operation'
      render: (index: number, record: show_data) => <div className={styles.raw_operation}><p onClick={() => showModal('edit', record)}>{intl('operation.edit')}  </p>|<p onClick={() => showModal('view', record)}>{intl('operation.view')}</p></div>
    },
  ]

  return (
    <PageContainer className={styles.main}>
      <Card>
        <Modal
          title={intl('bank.status')}
          visible={modal.status}
          onOk={() => handleModalOk('status')}
          onCancel={() => handleModalCancel()}
        >
          <h1>{modal.data && modal.data.status ? intl('bank.disable_status') : intl('bank.able_status') + ' ?'} </h1>
        </Modal>
        {/* <Modal
          title={intl('bank.add_deposit')}
          visible={modal.add}
          onOk={() => handleModalOk('add')}
          onCancel={() => handleModalCancel()}
        >
          <h1>add</h1>
        </Modal> */}
        {/* <Modal
          width='100%'
          title={intl('bank.edit_deposit')}
          visible={modal.edit}
          onOk={() => handleModalOk('edit')}
          onCancel={() => handleModalCancel()}
        >
          <h1>edit</h1>
        </Modal> */}
        <Modal
          title={intl('operation.view')}
          visible={modal.view}
          onOk={() => handleModalOk('view')}
          onCancel={() => handleModalCancel()}
        >
          <h1>view</h1>
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
