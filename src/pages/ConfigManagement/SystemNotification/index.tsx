import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Select, DatePicker, Modal } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import moment from 'moment';
import { notification, notification_time, getNotificationList, notification_data } from '@/services/configManagement';

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
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    initialPage()
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const initialPage = async () => {
    let temp_data = await getNotificationList();
    for (let i in temp_data.data) {
      temp_data.data[i].date_type = {
        time: temp_data.data[i].date,
        immediately: temp_data.data[i].immediately
      }
      temp_data.data[i].title = temp_data.data[i].content.en.title;
    }
    setDataSource(temp_data.data);
  }
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
    console.log(data)
    if (type === 'view') {
      setModal({ status: true, data: data });
    }
  };
  // const dataSource = [
  //   {
  //     id: 0,
  //     message_id: 'a_qwe',
  //     content: {
  //       cn: {
  //         title: 'title',
  //         summary: 'summary',
  //         body: 'body',
  //         author: 'author',
  //       },
  //       en: {
  //         title: 'title',
  //         summary: 'summary',
  //         body: 'body',
  //         author: 'author',
  //       },
  //       ja: {
  //         title: 'title',
  //         summary: 'summary',
  //         body: 'body',
  //         author: 'author',
  //       },
  //       ko: {
  //         title: 'title',
  //         summary: 'summary',
  //         body: 'body',
  //         author: 'author',
  //       },
  //     },
  //     platform: ['web'],
  //     date: {
  //       time: 1603818800,
  //       immediately: false
  //     },
  //   },
  // ];
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
      dataIndex: 'date_type',
      key: 'date_type',
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
        {modal.data.content?.en.title && (
          <div>
            <p>EN</p>
            <p>{modal.data.content.en.title}</p>
            <div dangerouslySetInnerHTML={{ __html: modal.data.content.en.body }}></div>
          </div>
        )}
        {modal.data.content?.cn.title && (
          <div>
            <p>CN</p>
            <p>{modal.data.content.cn.title}</p>
            <div dangerouslySetInnerHTML={{ __html: modal.data.content.cn.body }}></div>
          </div>
        )}
        {modal.data.content?.ja.title && (
          <div>
            <p>JA</p>
            <p>{modal.data.content.ja.title}</p>
            <div dangerouslySetInnerHTML={{ __html: modal.data.content.ja.body }}></div>
          </div>
        )}
        {modal.data.content?.ko.title && (
          <div>
            <p>KO</p>
            <p>{modal.data.content.ko.title}</p>
            <div dangerouslySetInnerHTML={{ __html: modal.data.content.ko.body }}></div>
          </div>
        )}
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
