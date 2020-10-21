import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Input, Card, Table, Switch, Modal, Checkbox, Button, Select } from 'antd';
import styles from './index.less';
import { Link, SelectLang, useModel, useIntl } from 'umi';
import moment from 'moment';
import { getUserList, postUserList, user_data, operation, status, filter, userList } from '@/services/userList';
import { str2auth, auth2str } from '@/utils/utils'
import { lowerCase } from 'lodash';
// import { user_data_interface, status_interface } from './index'

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}

const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userList, setUserList] = useState<userList>();
  const [filter, setFilter] = useState<filter>({ keyword: '', status: undefined, userList: [], intlRole: [] });
  const [status, setStatus] = useState<status>({ status: false, name: 'none' });
  const [operation, setOperation] = useState<operation>({ id: 0, name: 'None', email: '', role: '' });
  const [status_modal, setStatus_Modal] = useState(false);
  const [operation_modal, setOperation_Modal] = useState(false);
  const [add_modal, setAdd_Modal] = useState({ visibility: false, name: '', email: '', role: '' });

  const statusChange = async (checked: Boolean, name: string) => {
    let temp: status = { status: !checked, name: name }
    await setStatus(temp)
    showModal('status')
  }

  const clickEdit = async (data: user_data) => {
    await setOperation({ id: data.id, name: data.name, email: data.email ? data.email : '', role: data.role ? data.role : '' })
    await showModal('operation')
  }

  const showModal = (target: string) => {
    if (target === 'status') {
      setStatus_Modal(true);
    } else if (target === 'operation') {
      setOperation_Modal(true);
    } else if (target === 'add') {
      setAdd_Modal({ visibility: true, name: add_modal.name, email: add_modal.email, role: add_modal.role });
    }
  }

  const handleModalOk = async (target: string) => {
    if (target === 'status') {
      let result = await postUserList({ type: 'status', name: status.name, status: status.status })
      setStatus_Modal(false);
      if (result && result.status === 'ok') {
        getUserData();
      }
    } else if (target === 'operation') {
      let { id, name, email, role } = operation;
      let result = await postUserList({ type: 'edit', id: id, name: name, email: email, role: role });
      setOperation_Modal(false);
      if (result && result.status === 'ok') {
        getUserData();
        //todo: update table to refresh filter.intlRole
      }
    } else if (target === 'add') {
      let { name, email, role } = add_modal;
      let result = await postUserList({ type: 'add', name: name, email: email, role: role });
      setAdd_Modal({ visibility: false, name: add_modal.name, email: add_modal.email, role: add_modal.role });
      if (result && result.status === 'ok') {
        //todo: update table to refresh filter.intlRole
        getUserData();
      }
    }
  }

  const handleModalCancel = (target: string) => {
    if (target === 'status') {
      setStatus_Modal(false);
    } else if (target === 'operation') {
      setOperation_Modal(false);
    } else if (target === 'add') {
      setAdd_Modal({ visibility: false, name: add_modal.name, email: add_modal.email, role: add_modal.role });
    }
  }
  const edit_onChange_input_name = async (e: any) => {
    await setOperation({ id: operation.id, name: e.target.value, email: operation.email, role: operation.role })
  }
  const edit_onChange_input_email = async (e: any) => {
    await setOperation({ id: operation.id, name: operation.name, email: e.target.value, role: operation.role })
  }
  const edit_onChange_checkbox = async (e: any) => {
    await setOperation({ id: operation.id, name: operation.name, email: operation.email, role: auth2str(e) })
  }
  const add_onChange_input_name = async (e: any) => {
    await setAdd_Modal({ visibility: add_modal.visibility, name: e.target.value, email: add_modal.email, role: add_modal.role })
  }
  const add_onChange_input_email = async (e: any) => {
    await setAdd_Modal({ visibility: add_modal.visibility, name: add_modal.name, email: e.target.value, role: add_modal.role })
  }
  const add_onChange_checkbox = async (e: any) => {
    await setAdd_Modal({ visibility: add_modal.visibility, name: add_modal.name, email: add_modal.email, role: auth2str(e) })
  }

  const filter_onChange_keyword = async (e: any) => {
    await setFilter({ keyword: e.target.value, status: filter.status, userList: filter.userList, intlRole: filter.intlRole })
  }
  const filter_onChange_status = async (e: any) => {
    await setFilter({ keyword: filter.keyword, status: e, userList: filter.userList, intlRole: filter.intlRole })
  }
  const filter_onClick_search = () => {
    let filter_list: any = [];
    if (filter.status !== undefined) {
      for (let item in userList) {
        if (userList[item].status === (filter.status === 'true')) {
          filter_list.push(userList[item]);
        }
      }
    } else {
      filter_list = userList;
    }
    if (filter.keyword) {
      let keyword_filter_list: any[] = [];
      for (let item1 in filter_list) {
        for (let item2 in filter_list[item1]) {
          if (item2 === 'role') {
            // if ((str2auth('' + filter_list[item1][item2])).toString().indexOf(/filter.keyword/!)) {
            // console.log(filter_list[item1][item2],(str2auth('' + filter_list[item1][item2])),(str2auth('' + filter_list[item1][item2])).toString(),(str2auth('' + filter_list[item1][item2])).toString().search(filter.keyword))
            //   keyword_filter_list.push(filter_list[item1]);
            //   continue;
            // }
            // let roles: string[] = [];
            // (str2auth('' + filter_list[item1][item2])).forEach(function (item3) {
            //   //  roles.push(intl(`role.${item3}`))
            //   console.log(item3)
            // });
            if (lowerCase(filter.intlRole[item1]).search(lowerCase(filter.keyword)) > -1) {
              keyword_filter_list.push(filter_list[item1]);
              break;
            }
          } else if (item2 === 'add_time') {
            if (moment(filter_list[item1][item2] * 1000).format('YYYY-MM-DD HH:mm:ss').search(filter.keyword) > -1) {
              keyword_filter_list.push(filter_list[item1]);
              break;
            }
          } else if (item2 !== 'status') {
            if (lowerCase(('' + filter_list[item1][item2])).search(lowerCase(filter.keyword)) > -1) {
              keyword_filter_list.push(filter_list[item1]);
              break;
            }
          }
          // if (!('' + filter_list[item1][item2]).search(filter.keyword)) {
          //   console.log(item2, filter_list[item1][item2])
          // filter_list.splice(item1, 1);
          // break;
          // }
        }
      }
      filter_list = keyword_filter_list;
    }
    setFilter({ keyword: filter.keyword, status: filter.status, userList: filter_list, intlRole: filter.intlRole });
  }

  const getIntlRole = async (roles: string[]) => {
    if (filter.intlRole.length < filter.userList.length) {
      const temp = filter.intlRole;
      temp.push(roles.toString());
      await setFilter({ keyword: filter.keyword, status: filter.status, userList: filter.userList, intlRole: temp })
    }
  }

  const getUserData = async () => {
    const temp1 = await getUserList();
    setUserList(temp1);
    setFilter({ keyword: filter.keyword, status: filter.status, userList: temp1, intlRole: filter.intlRole });
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
      key: 'role',
      render: (role: string) => {
        let roles: string[] = [];
        str2auth(role).forEach(function (item) { roles.push(intl(`role.${item}`)) });
        getIntlRole(roles);
        return roles.join(', ');
      }
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
      render: (index: number, record: user_data) => <p style={{ color: 'Blue', cursor: 'pointer', marginBottom: 0 }} onClick={() => { clickEdit(record) }}>{intl('operation.edit')}</p>
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
          keyboard={true}
          forceRender={true}
          destroyOnClose={true}
        >
          {intl('user.name')}<Input defaultValue={operation.name} onChange={edit_onChange_input_name}></Input>
          {intl('user.email')}<Input defaultValue={operation.email} onChange={edit_onChange_input_email}></Input>
          <Checkbox.Group
            options={role_option}
            defaultValue={str2auth(operation.role)}
            onChange={edit_onChange_checkbox}
          />
        </Modal>
        <Modal
          title={intl('user.add_user')}
          visible={add_modal.visibility}
          onOk={() => handleModalOk('add')}
          onCancel={() => handleModalCancel('add')}
          keyboard={true}
          forceRender={true}
          destroyOnClose={true}
        >
          {intl('user.name')}<Input placeholder={intl('user.add_user_name')} onChange={add_onChange_input_name}></Input>
          {intl('user.email')}<Input placeholder={intl('user.add_user_email')} onChange={add_onChange_input_email}></Input>
          <Checkbox.Group
            options={role_option}
            // defaultValue={str2auth(operation.role)}
            onChange={add_onChange_checkbox}
          />
        </Modal>
        <Input allowClear={true} placeholder={intl('operation.keyword')} style={{ width: 200 }} onChange={filter_onChange_keyword} />
        <Select onChange={filter_onChange_status} placeholder={intl('user.status')} style={{ width: 200 }} allowClear onClear={() => setStatus({ status: false, name: 'none' })}>
          <Option value="true">{intl('user.status_t')}</Option>
          <Option value="false">{intl('user.status_f')}</Option>
        </Select>
        <Button type='primary' onClick={filter_onClick_search}>{intl('operation.search')}</Button>
        <Button onClick={() => showModal('add')}>{intl('operation.new')}</Button>
        <Table dataSource={filter.userList} columns={columns} />
      </Card>
    </PageContainer>
  );
};

