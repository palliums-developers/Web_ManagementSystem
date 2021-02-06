import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Select, DatePicker, Modal } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import moment from 'moment';
import { notification, notification_time } from '@/services/configManagement';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
const { Option } = Select;
const { RangePicker } = DatePicker;
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [platform, setPlatform] = useState<string>();
  const [notification, setNotification] = useState();
  const [modal, setModal] = useState({ status: false, data: {} });
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const handleSelect = (value: string) => {
    console.log(value);
  };
  const handleDateOk = (values: any[]) => {
    console.log(values[0].format('X'), values[1].format('X'));
  };
  const handleModalCancel = () => {
    setModal({ status: false, data: {} });
  };
  const clickEdit = (record: notification) => {
    localStorage.setItem('notification', JSON.stringify(record));
  };
  const showModal = (type: string, data: any) => {
    if (type === 'view') {
      setModal({ status: true, data: data });
    }
  };
  const dataSource = [
    // {
    //   id: '1',
    //   platform: 'android',
    //   time: { time: '1603818800', type: 'immediately' },
    //   title: 'hahaha',
    //   detail: {
    //     en: {
    //       title: 'aaa1',
    //       description: 'aaa2',
    //     },
    //     cn: {
    //       title: 'bbb1',
    //       description: 'bbb2',
    //     },
    //   },
    // },
    {
      id: 0,
      messageId: 'a_qwe',
      content: {
        cn: {
          title: 'title',
          summary: 'summary',
          body: 'body',
          author: 'author',
        },
        en: {
          title: 'title',
          summary: 'summary',
          body: 'body',
          author: 'author',
        },
        ja: {
          title: 'title',
          summary: 'summary',
          body: 'body',
          author: 'author',
        },
        ko: {
          title: 'title',
          summary: 'summary',
          body: 'body',
          author: 'author',
        },
      },
      platform: ['web'],
      date: {
        time: 1603818800,
        immediately: false
      },
    },
  ];
  const columns = [
    {
      title: intl('config.table_id'),
      dataIndex: 'id',
      key: 'name',
    },
    {
      title: intl('config.table_type'),
      dataIndex: 'platform',
      key: 'age',
    },
    {
      title: intl('config.table_title'),
      dataIndex: 'title',
      key: 'address',
    },
    {
      title: intl('config.table_time'),
      dataIndex: 'date',
      key: 'date',
      render: (date: any) => {
        return (
          <div>
            <p>{intl('config.' + (date.immediately ? 'immediately' : 'delay'))}</p>
            <p>{moment(date.time * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
          </div>
        );
      },
    },
    {
      title: intl('user.operation'),
      dataIndex: 'operation',
      render: (index: number, record: notification) => (
        <div className={styles.row}>
          <a
            style={{ color: 'Blue', cursor: 'pointer', marginBottom: 0 }}
            onClick={() => {
              clickEdit(record);
            }}
            href="/config/modify"
          >
            {intl('operation.edit')}
          </a>
          |
          <p
            style={{ color: 'Blue', cursor: 'pointer', marginBottom: 0 }}
            onClick={() => showModal('view', record)}
          >
            {intl('operation.view')}
          </p>
        </div>
      ),
    },
  ];
  return (
    <PageContainer className={styles.main}>
      <Modal
        visible={modal.status}
        title={intl('operation.view')}
        onCancel={handleModalCancel}
        footer={null}
      >
        {modal.data.detail?.en && (
          <div>
            <p>EN</p>
            <p>{modal.data.detail.en.title}</p>
            <p>{modal.data.detail.en.description}</p>
          </div>
        )}
        {modal.data.detail?.cn && (
          <div>
            <p>CN</p>
            <p>{modal.data.detail.cn.title}</p>
            <p>{modal.data.detail.cn.description}</p>
          </div>
        )}
        {/* <p>{modal.data?.detail}</p> */}
      </Modal>
      <Card>
        <div className={styles.row}>
          <Input placeholder={intl('config.keyword')} />
          <Select
            mode="multiple"
            allowClear
            placeholder={intl('config.platform')}
            onChange={handleSelect}
            style={{ width: 330 }}
          >
            <Option value="pc">{intl('config.pc')}</Option>
            <Option value="web">{intl('config.web')}</Option>
            <Option value="android">{intl('config.android')}</Option>
            <Option value="ios">{intl('config.ios')}</Option>
          </Select>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onOk={handleDateOk}
          />
          <Button type="primary">{intl('operation.search')}</Button>
          <Button
            onClick={() => {
              localStorage.setItem('notification', '');
            }}
          >
            <a href="/config/modify">{intl('operation.new')}</a>
          </Button>
        </div>
      </Card>
      <Table dataSource={dataSource} columns={columns}></Table>
    </PageContainer>
  );
};
