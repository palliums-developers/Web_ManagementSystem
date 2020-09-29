import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Input, Card, Table, Switch, Modal, Checkbox, Button, Select } from 'antd';
import styles from './index.less';
import { Link, SelectLang, useModel, useIntl } from 'umi';
import moment from 'moment';
import { getUserList, postUserList, user_data } from '@/services/userList';
import { OmitProps } from 'antd/es/transfer/ListBody';
import { user_data_interface, status_interface } from './index'

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}


export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userList, setUserList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState({ status: false, name: 'none' });
  const [operation, setOperation] = useState({ name: 'None', email: 'None', role: 'None' });
  const [status_modal, setStatus_Modal] = useState(false);
  const [operation_modal, setOperation_Modal] = useState(false);

  const statusChange = async (checked: Boolean, name: String) => {
    let temp: status_interface = { status: !checked, name: name }
    await setStatus(temp)
    showModal('status')
  }

  const showModal = (target: string, data?: user_data) => {
    if (target == 'status') {
      setStatus_Modal(true);
    } else if (target == 'operation') {
      console.log(data)
      setOperation_Modal(true);
    }
  }

  const handleModalOk = async (target: string) => {
    if (target == 'status') {
      let result = await postUserList({ type: 'status', name: status.name, status: status.status })
      setStatus_Modal(false);
      if (result && result.status === 'ok') {
        getUserData();
      }
    } else if (target == 'operation') {
      setOperation_Modal(false);
    }
  }

  const handleModalCancel = (target: string) => {
    if (target == 'status') {
      setStatus_Modal(false);
    } else if (target == 'operation') {
      setOperation_Modal(false);
    }
  }

  const role_checkbox = (checkedValues: Array<String>) => {
    console.log(checkedValues)
  }

  const getUserData = async () => {
    const temp = await getUserList();
    setUserList(temp);
  }

  useEffect(() => {
    // (async () => {
    //   const temp = await getUserList();
    //   setUserList(temp);
    // }
    // )()
    getUserData();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const dataSource = []
  const role_option = [
    { label: intl('role.product'), value: 'product' },
    { label: intl('role.developer'), value: 'developer' },
    { label: intl('role.operation'), value: 'operation' },
    { label: intl('role.servicer'), value: 'servicer' },
    { label: intl('role.designer'), value: 'designer' },
  ]

  const columns: any = [
    {
      title: intl('user.id'),
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: intl('user.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl('user.role'),
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: intl('user.email'),
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: intl('user.phone'),
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: intl('user.add_time'),
      dataIndex: 'add_time',
      key: 'add_time',
      render: (time: any) => {
        return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: intl('user.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: user_data) => <Switch checked={status} onClick={() => { statusChange(status, record.name) }} />
    },
    {
      title: intl('user.operation'),
      dataIndex: 'operation',
      // TODO:get edit data
      render: (record: user_data) => <p style={{ color: 'Blue', cursor: 'pointer', marginBottom: 0 }} onClick={() => { showModal('operation', record); console.log(record) }}>{intl('operation.edit')}</p>
    }
  ];
  return (
    <PageContainer className={styles.main}>
      <Card>
        <Modal
          visible={status_modal}
          onOk={() => handleModalOk('status')}
          onCancel={() => handleModalCancel('status')}
        >
          <h1>{status ? intl('user.disable_status') : intl('user.able_status')}</h1>
        </Modal>
        <Modal
          title={intl('user.edit_user')}
          visible={operation_modal}
          onOk={() => handleModalOk('operation')}
          onCancel={() => handleModalCancel('operation')}
        >
          {intl('user.name')}<Input></Input>
          {intl('user.email')}<Input></Input>
          <Checkbox.Group options={role_option} onChange={role_checkbox} />
        </Modal>
        <Input placeholder={intl('operation.keyword')} style={{ width: 200 }} />
        <Select placeholder={intl('user.status')} style={{ width: 200 }} allowClear onClear={() => setStatus({ status: false, name: 'none' })}>
          <Option value="True">{intl('user.status_t')}</Option>
          <Option value="False">{intl('user.status_f')}</Option>
        </Select>
        <Button type='primary'>{intl('operation.search')}</Button>
        <Button>{intl('operation.new')}</Button>
        <Table dataSource={userList} columns={columns} />
      </Card>
    </PageContainer>
  );
};

