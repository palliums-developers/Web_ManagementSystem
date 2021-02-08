import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Radio, DatePicker, Select, Checkbox, Input, Table, Button } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import moment from 'moment';
import E from 'wangeditor'
import { Md5 } from 'ts-md5/dist/md5';
import { notification_data, postNotification } from '@/services/configManagement';
let edit_en: any = null;
let edit_cn: any = null;
let edit_ja: any = null;
let edit_ko: any = null;

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [releaseTime, setReleaseTime] = useState({ delay: false, time: '' });
  const [language, setLanguage] = useState(['en']);
  const [platform, setPlatform] = useState<string[]>([]);
  const [operation, setOperation] = useState('');
  const [inputEN, setInputEN] = useState<string>('');
  const [inputCN, setInputCN] = useState<string>('');
  const [inputJA, setInputJA] = useState<string>('');
  const [inputKO, setInputKO] = useState<string>('');
  const [inputEN_body, setInputEN_body] = useState<string>('');
  const [inputCN_body, setInputCN_body] = useState<string>('');
  const [inputJA_body, setInputJA_body] = useState<string>('');
  const [inputKO_body, setInputKO_body] = useState<string>('');
  const [postData, setPostData] = useState<notification_data>({
    message_id: '',
    content: {
      cn: {
        title: '',
        summary: '',
        body: '',
        author: '',
      },
      en: {
        title: '',
        summary: '',
        body: '',
        author: '',
      },
      ja: {
        title: '',
        summary: '',
        body: '',
        author: '',
      },
      ko: {
        title: '',
        summary: '',
        body: '',
        author: '',
      },
    },
    platform: [],
    date: 0,
    immediately: true
  });
  const handleChangeRelease = (type: string, e: any) => {
    if (type === 'type') {
      setReleaseTime({ delay: e, time: releaseTime.time });
    } else if (type === 'time') {
      console.log(e.format('X'));
      setReleaseTime({ delay: releaseTime.delay, time: e.format('X') });
    }
  }
  const handleSelect = (type: string, e: any) => {
    if (type === 'platform') {
      setPlatform(e);
    } else if (type === 'language') {
      setLanguage(e);
    }
  }
  const create_rich_text_editor = (language: string) => {
    switch (language) {
      case 'en':
        edit_en = new E("#en");
        edit_en.create();
        break;
      case 'cn':
        edit_cn = new E("#cn");
        edit_cn.create();
        break;
      case 'ja':
        edit_ja = new E("#ja");
        edit_ja.create();
        break;
      case 'ko':
        edit_ko = new E("#ko");
        edit_ko.create();
        break;
      default:
        break;
    }
  }
  const handleInput = (type: string, e: string) => {
    switch (type) {
      case 'en-title':
        setInputEN(e);
        break;
      case 'cn-title':
        setInputCN(e);
        break;
      case 'ja-title':
        setInputJA(e);
        break;
      case 'ko-title':
        setInputKO(e);
        break;
      default:
        break;
    }
  }
  const options = [
    { label: 'EN', value: 'en', disabled: true, checked: true },
    { label: '中文', value: 'cn' },
    { label: '日本語', value: 'ja' },
    { label: '한국어', value: 'ko' },
  ]
  const get_notification_log = () => {
    console.log('notification log');
  }
  const initData = () => {
    let data = window.localStorage.getItem('notification');
    let temp_inputEN = inputEN;
    let temp_inputCN = inputCN;
    let temp_inputJA = inputJA;
    let temp_inputKO = inputKO;
    let temp_post_data = postData;
    let temp_language = language;
    if (data) {
      setOperation('edit');
      let temp_data = JSON.parse(data);
      temp_post_data.id = temp_data.id;
      temp_post_data.content = temp_data.content;
      temp_post_data.date = temp_data.date.time;
      temp_post_data.immediately = temp_data.date.immediately;
      temp_post_data.message_id = temp_data.message_id;
      temp_post_data.platform = temp_data.platform;
      setPlatform(temp_data.platform.split(','));
      temp_inputEN = temp_data.content.en.title;
      temp_inputCN = temp_data.content.cn.title;
      temp_inputJA = temp_data.content.ja.title;
      temp_inputKO = temp_data.content.ko.title;
      setInputEN_body(temp_data.content.en.body);
      setInputCN_body(temp_data.content.cn.body);
      setInputJA_body(temp_data.content.ja.body);
      setInputKO_body(temp_data.content.ko.body);

      if (temp_inputEN) {
        // create_rich_text_editor('en')
      }
      if (temp_inputCN) {
        temp_language.push('cn');
        // create_rich_text_editor('cn');
      }
      if (temp_inputJA) {
        temp_language.push('ja');
        // create_rich_text_editor('ja');
      }
      if (temp_inputKO) {
        temp_language.push('ko');
        // create_rich_text_editor('ko');
      }

    } else {
      setOperation('add');
    }
  }
  const getMessageId = (title: string, body: string) => {
    return 'a_' + Md5.hashStr(title + body);
  }
  const getSummary = (body: string, number: number) => {
    return body.substring(0, number);
  }
  const modifyPostData = () => {
    let temp_post_data = postData;
    temp_post_data.content.en.body = edit_en.txt.html();
    temp_post_data.content.cn.body = edit_cn.txt.html();
    temp_post_data.content.ja.body = edit_ja.txt.html();
    temp_post_data.content.ko.body = edit_ko.txt.html();
    temp_post_data.content.en.summary = getSummary(edit_en.txt.text(), 20);
    temp_post_data.content.cn.summary = getSummary(edit_cn.txt.text(), 20);
    temp_post_data.content.ja.summary = getSummary(edit_ja.txt.text(), 20);
    temp_post_data.content.ko.summary = getSummary(edit_ko.txt.text(), 20);
    temp_post_data.message_id = getMessageId(edit_en.txt.text(), edit_en.txt.text());
    temp_post_data.content.en.title = inputEN;
    temp_post_data.content.cn.title = inputCN;
    temp_post_data.content.ja.title = inputJA;
    temp_post_data.content.ko.title = inputKO;
    temp_post_data.platform = platform;
    temp_post_data.immediately = !releaseTime.delay;
    if (!releaseTime.delay) {
      temp_post_data.date = Math.floor(Date.now() / 1000);
    } else {
      temp_post_data.date = parseInt(releaseTime.time);
    }
    console.log(temp_post_data)
  }
  const clickConfirm = async () => {
    await modifyPostData();
    await postNotification(operation, postData);
  }
  const initPage = () => {
    initData();
    create_rich_text_editor('en');
    create_rich_text_editor('cn');
    create_rich_text_editor('ja');
    create_rich_text_editor('ko');
    get_notification_log();
  }
  useEffect(() => {
    initPage();
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
        {/* 选择平台 */}
        <div className={styles.row}>
          <p>{intl('config.platform')}</p>
          <Select
            mode='multiple'
            allowClear
            placeholder={intl('config.platform')}
            onChange={e => handleSelect('platform', e)}
            value={platform}
            style={{ width: 330 }}
          >
            <Option value='pc'>{intl('config.pc')}</Option>
            <Option value='web'>{intl('config.web')}</Option>
            <Option value='android'>{intl('config.android')}</Option>
            <Option value='apple'>{intl('config.ios')}</Option>
          </Select>
        </div>
        {/* 选择发布时间*/}
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
        {/* 选择语言 */}
        <div className={styles.row}>
          <p>{intl('config.language')}</p>
          <Checkbox.Group options={options} onChange={e => handleSelect('language', e)} defaultValue={['en']} />
        </div>
        {
          <>
            <div className={styles.inputNotification}>
              <div className={styles.title}>
                <span></span>
                <h2>English</h2>
                <span></span>
              </div>
              <div className={styles.row}>
                <p>{intl('config.title')}:</p>
                <Input value={inputEN} onChange={e => handleInput('en-title', e.target.value)} maxLength={30} />
              </div>
              <div className={styles.row}>
                <p>{intl('config.detail')}:</p>
                <div id='en'
                  dangerouslySetInnerHTML={{ __html: inputEN_body }}
                >
                </div>
              </div>
            </div>
            <div className={styles.inputNotification}
              style={{ display: (language.includes('cn') ? 'block' : 'none') }}
            >
              <div className={styles.title}>
                <span></span>
                <h2>中文</h2>
                <span></span>
              </div>
              <div className={styles.row}>
                <p>{intl('config.title')}:</p>
                <Input value={inputCN} onChange={e => handleInput('cn-title', e.target.value)} maxLength={30} />
              </div>
              <div className={styles.row}>
                <p>{intl('config.detail')}:</p>
                <div id='cn'
                  dangerouslySetInnerHTML={{ __html: inputCN_body }}
                >
                </div>
              </div>
            </div>
            <div className={styles.inputNotification}
              style={{ display: (language.includes('ja') ? 'block' : 'none') }}>
              <div className={styles.title}>
                <span></span>
                <h2>日本語</h2>
                <span></span>
              </div>
              <div className={styles.row}>
                <p>{intl('config.title')}:</p>
                <Input value={inputJA} onChange={e => handleInput('ja-title', e.target.value)} maxLength={30} />
              </div>
              <div className={styles.row}>
                <p>{intl('config.detail')}:</p>
                <div id='ja'
                  dangerouslySetInnerHTML={{ __html: inputJA_body }}
                ></div>
              </div>
            </div>
            <div className={styles.inputNotification}
              style={{ display: (language.includes('ko') ? 'block' : 'none') }}
            >
              <div className={styles.title}>
                <span></span>
                <h2>한국어</h2>
                <span></span>
              </div>
              <div className={styles.row}>
                <p>{intl('config.title')}:</p>
                <Input value={inputKO} onChange={e => handleInput('ko-title', e.target.value)} maxLength={30} />
              </div>
              <div className={styles.row}>
                <p>{intl('config.detail')}:</p>
                <div id='ko'
                  dangerouslySetInnerHTML={{ __html: inputKO_body }}
                ></div>
              </div>
            </div>
          </>}
        <Button type='primary' onClick={() => clickConfirm()}>Confirm</Button>
        {/* <h2>{intl('operation.log')}</h2>
        <Table columns={column} dataSource={datasource}></Table> */}
      </Card>
    </PageContainer>
  );
};
