import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Radio, DatePicker, Select, Checkbox, Input, Table } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import moment from 'moment';
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
const { Option } = Select;
const { TextArea } = Input;
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [releaseTime, setReleaseTime] = useState({ delay: false, time: '' });
  const [language, setLanguage] = useState(['en']);
  const [platform, setPlatform] = useState([]);
  const [inputEN, setInputEN] = useState({ title: '', detail: '' });
  const [inputCN, setInputCN] = useState({ title: '', detail: '' });
  const [inputJA, setInputJA] = useState({ title: '', detail: '' });
  const [inputKO, setInputKO] = useState({ title: '', detail: '' });
  const handleChangeRelease = (type: string, e: any) => {
    if (type === 'type') {
      setReleaseTime({ delay: e, time: releaseTime.time })
    } else if (type === 'time') {
      console.log(e.format('X'))
      setReleaseTime({ delay: releaseTime.delay, time: e.format('X') })
    }
  }
  const handleSelect = (type: string, e: any) => {
    if (type === 'platform') {
      setPlatform(e)
    } else if (type === 'language') {
      setLanguage(e)
    }
  }
  const handleInput = (type: string, e: string) => {
    switch (type) {
      case 'en-title':
        setInputEN({ title: e, detail: inputEN.detail });
        break;
      case 'en-detail':
        setInputEN({ title: inputEN.title, detail: e });
        break;
      case 'cn-title':
        setInputCN({ title: e, detail: inputCN.detail });
        break;
      case 'cn-detail':
        setInputCN({ title: inputCN.title, detail: e });
        break;
      case 'ja-title':
        setInputJA({ title: e, detail: inputJA.detail });
        break;
      case 'ja-detail':
        setInputJA({ title: inputJA.title, detail: e });
        break;
      case 'ko-title':
        setInputKO({ title: e, detail: inputKO.detail });
        break;
      case 'ko-detail':
        setInputKO({ title: inputKO.title, detail: e });
        break;
    }
  }
  const options = [
    { label: 'EN', value: 'en', disabled: true, checked: true },
    { label: '中文', value: 'cn' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
  ]
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const datasource = [
    {
      name: 'haha',
      time: '1603818800',
      detail: 'en'
    },
    {
      name: 'haha',
      time: '1603819800',
      detail: 'en'
    },
  ]
  const column = [
    {
      title: intl('operation.operator'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl('operation.time'),
      dataIndex: 'time',
      key: 'time',
      render: ((time: string) => {
        return moment(parseInt(time) * 1000).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    {
      title: intl('operation'),
      dataIndex: 'detail',
      key: 'detail'
    }
  ];
  return (
    <PageContainer className={styles.main}>
      <Card>
        <div className={styles.row}>
          <p>{intl('config.platform')}</p>
          <Select
            mode='multiple'
            allowClear
            placeholder={intl('config.platform')}
            onChange={e => handleSelect('platform', e)}
            style={{ width: 330 }}
          >
            <Option value='pc'>{intl('config.pc')}</Option>
            <Option value='web'>{intl('config.web')}</Option>
            <Option value='android'>{intl('config.android')}</Option>
            <Option value='ios'>{intl('config.ios')}</Option>
          </Select>
        </div>
        <div className={styles.row}>
          <p>{intl('config.release')}</p>
          <Radio.Group
            onChange={e => handleChangeRelease('type', e.target.value)}
            defaultValue={releaseTime.delay}
          >
            <Radio value={false}>{intl('config.immediately')}</Radio>
            <Radio value={true}>{intl('config.delay')}</Radio>
          </Radio.Group>
          {
            releaseTime.delay &&
            <DatePicker
              showTime
              showNow={false}
              format="YYYY-MM-DD HH:mm"
              onOk={e => handleChangeRelease('time', e)} />
          }
        </div>
        <div className={styles.row}>
          <p>{intl('config.language')}</p>
          <Checkbox.Group options={options} onChange={e => handleSelect('language', e)} defaultValue={['en']} />
        </div>
        <div className={styles.inputNotification}>
          <div className={styles.title}>
            <span></span>
            <h2>English</h2>
            <span></span>
          </div>
          <div className={styles.row}>
            <p>{intl('config.title')}:</p>
            <Input onChange={e=>handleInput('en-title',e.target.value)} maxLength={30} />
          </div>
          <div className={styles.row}>
            <p>{intl('config.detail')}:</p>
            <TextArea onChange={e=>handleInput('en-detail',e.target.value)} maxLength={1000} />
          </div>
        </div>
        {
          language.includes('cn') &&
          <div className={styles.inputNotification}>
            <div className={styles.title}>
              <span></span>
              <h2>中文</h2>
              <span></span>
            </div>
            <div className={styles.row}>
              <p>{intl('config.title')}:</p>
              <Input onChange={e=>handleInput('cn-title',e.target.value)} maxLength={30} />
            </div>
            <div className={styles.row}>
              <p>{intl('config.detail')}:</p>
              <TextArea onChange={e=>handleInput('cn-detail',e.target.value)} maxLength={1000} />
            </div>
          </div>
        }
        {
          language.includes('ja') &&
          <div className={styles.inputNotification}>
            <div className={styles.title}>
              <span></span>
              <h2>日本語</h2>
              <span></span>
            </div>
            <div className={styles.row}>
              <p>{intl('config.title')}:</p>
              <Input onChange={e=>handleInput('ja-title',e.target.value)} maxLength={30} />
            </div>
            <div className={styles.row}>
              <p>{intl('config.detail')}:</p>
              <TextArea onChange={e=>handleInput('ja-detail',e.target.value)} maxLength={1000} />
            </div>
          </div>
        }
        {
          language.includes('ko') &&
          <div className={styles.inputNotification}>
            <div className={styles.title}>
              <span></span>
              <h2>한국어</h2>
              <span></span>
            </div>
            <div className={styles.row}>
              <p>{intl('config.title')}:</p>
              <Input onChange={e=>handleInput('ko-title',e.target.value)} maxLength={30} />
            </div>
            <div className={styles.row}>
              <p>{intl('config.detail')}:</p>
              <TextArea onChange={e=>handleInput('ko-detail',e.target.value)} maxLength={1000} />
            </div>
          </div>
        }
        <h2>{intl('operation.log')}</h2>
        <Table columns={column} dataSource={datasource}></Table>
      </Card>
    </PageContainer>
  );
};
