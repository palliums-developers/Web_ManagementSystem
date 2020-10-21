import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Table, Button, Switch, Modal } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import { getBankProduct, postBankProduct, bank_product, show_data, raw_bank_product, modal, local_data } from '@/services/bank';
import { lowerCase } from 'lodash';
import { raw } from 'express';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}

const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [rawData, setRawData] = useState<bank_product[]>();
  const [showData, setShowData] = useState<show_data[]>([{ id: 999, name: 'Loading', description: 'Loading', min: 0, max: 0, increase: 0, status: false }]);
  const [search, setSearch] = useState({ keyword: '', status: undefined });
  const [modal, setModal] = useState<modal>({ status: false, view: false, data: {} });
  const [postData, setPostData] = useState();
  const filter_onClick_search = () => {
    let temp: any = [];
    if (search.status !== undefined) {
      for (let item in rawData) {
        if (rawData[item].status === (search.status === 'true')) {
          temp.push(rawData[item]);
        }
      }
    } else {
      temp = rawData;
    }
    if (search.keyword !== '') {
      let keyword_filter_list: any[] = [];
      for (let item1 in temp) {
        for (let item2 in temp[item1]) {
          if (item2 === 'product_name' || item2 === 'description' || item2 === 'minimum_amount' || item2 === 'max_limit' || item2 === 'pledge_rate') {
            if (lowerCase(('' + temp[item1][item2])).search(lowerCase(search.keyword)) > -1) {
              keyword_filter_list.push(temp[item1]);
              break;
            }
          }
        }
      }
      temp = keyword_filter_list;
    }
    setShowData(getShowDataFromRawData(temp));
  }
  const showModal = (type: string, data?: any) => {
    let localEdit: local_data = {
      operation: '',
      database: 'deposit',
      data: {}
    }
    switch (type) {
      case 'status':
        setModal({ status: true, view: false, data: data });
        break;
      case 'add':
        localEdit.operation = 'add',
          localStorage.setItem('edit', JSON.stringify(localEdit));
        break;
      case 'edit':
        for (let i in rawData) {
          if (rawData[i].id === data.id) {
            localEdit.data = (rawData[i]);
            break;
          }
        }
        localEdit.operation = 'edit';
        localStorage.setItem('edit', JSON.stringify(localEdit))
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
  const keyword_input = async (e: any) => {
    setSearch({ keyword: e.target.value, status: search.status })
  }
  const filter_onChange_status = async (e: any) => {
    setSearch({ keyword: search.keyword, status: e })
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
      render: (index: number, record: show_data) => <div className={styles.raw_operation}><a onClick={() => showModal('edit', record)} href='/coin/modify'>{intl('operation.edit')}</a>|<p onClick={() => showModal('view', record)}>{intl('operation.view')}</p></div>
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
          <Input allowClear={true} placeholder={intl('operation.keyword')} style={{ width: 200 }} onChange={keyword_input} />
          <Select onChange={filter_onChange_status} placeholder={intl('user.status')} style={{ width: 200 }} allowClear onClear={() => setSearch({ keyword: search.keyword, status: undefined })}>
            <Option value="true">{intl('user.status_t')}</Option>
            <Option value="false">{intl('user.status_f')}</Option>
          </Select>
          <Button type='primary' onClick={filter_onClick_search}>{intl('operation.search')}</Button>
          <Button onClick={() => showModal('add')} href='/coin/modify'>{intl('operation.new')}</Button>
        </div>
        <Table dataSource={showData} columns={columns} />
      </Card>
    </PageContainer>
  );
};
