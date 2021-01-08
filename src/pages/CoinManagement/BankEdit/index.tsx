import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Collapse, Checkbox } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import {
  postBankProduct,
  bank_product,
  operation_data,
  local_data,
  getBankProduct,
} from '@/services/bank';
import moment, { lang } from 'moment';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
const { TextArea } = Input;
const { Panel } = Collapse;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [edit_data, setEdit_data] = useState<local_data>({
    operation: '',
    database: '111',
    data: {},
  });
  const [operationLog, setOperationLog] = useState<operation_data[]>();
  const [language, setLanguage] = useState(['']);
  const initial = async () => {
    const edit_data_string = await localStorage.getItem('edit');
    let edit_data_json: local_data = { data: {}, database: 'deposit', operation: 'add' };
    if (edit_data_string) {
      edit_data_json = JSON.parse(edit_data_string);
    }
    await setEdit_data(edit_data_json);
    const temp = await getBankProduct('operation', edit_data_json.database);
    await setOperationLog(temp);
  };
  const selectLanguage = (e: any) => {
    // console.log(e);
    setLanguage(e);
  };
  useEffect(() => {
    initial();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const options = [
    { label: 'English', value: 'EN' },
    { label: '中文', value: 'CN' },
  ];
  const columns = [
    {
      title: intl('bank.operator'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl('bank.operation_time'),
      dataIndex: 'time',
      key: 'time',
      render: (time: number) => {
        return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: intl('operation.type'),
      dataIndex: 'operation_type',
    },
    {
      title: intl('bank.operation_detail'),
      dataIndex: 'operation',
      key: 'detail',
    },
  ];
  return (
    <PageContainer className={styles.main}>
      {edit_data.operation !== '' && (
        <Card>
          <p>
            {intl('bank.currency')}:
            <Input style={{ width: 200 }} defaultValue={edit_data.data.currency}></Input>
            {intl('bank.product_logo')}:
            <Input style={{ width: 200 }} defaultValue={edit_data.data.logo}></Input>
          </p>
          <p>
            {intl('bank.product_id')}:
            <Input style={{ width: 200 }} defaultValue={edit_data.data.product_id}></Input>
            {intl('bank.product_name')}:
            <Input style={{ width: 200 }} defaultValue={edit_data.data.product_name}></Input>
          </p>
          <p>
            {edit_data.database == 'deposit' ? intl('bank.min_deposit') : intl('bank.min_borrow')}:
            <Input style={{ width: 200 }} defaultValue={edit_data.data.minimum_amount}></Input>
            {edit_data.database == 'deposit' ? intl('bank.step_deposit') : intl('bank.step_borrow')}
            :<Input style={{ width: 200 }} defaultValue={edit_data.data.pledge_rate}></Input>
          </p>
          <p>
            {edit_data.database == 'deposit'
              ? intl('bank.daily_deposit')
              : intl('bank.daily_borrow')}
            :<Input style={{ width: 200 }} defaultValue={edit_data.data.max_limit}></Input>
            {edit_data.data.rate_desc}:
            <Input style={{ width: 200 }} defaultValue={edit_data.data.rate}></Input>
          </p>
          <Checkbox.Group options={options} onChange={selectLanguage} />
          {language.includes('EN') && (
            <div className={styles.product_desc}>
              <div className={styles.title}>
                <span></span>
                <h1>English</h1>
                <span></span>
              </div>
              <div className={styles.row}>
                <p>{intl('bank.introduction')}:</p>
                <Input style={{ width: 200 }} placeholder="Please Enter Introduction"></Input>
              </div>
              <div className={styles.row}>
                <p>{intl('bank.description')}</p>
                <TextArea
                  className="inputArea"
                  rows={4}
                  allowClear
                  maxLength={100}
                  placeholder="Please enter description"
                />
              </div>
              <div className={styles.row}>
                <p>{intl('bank.questions')}</p>
                <TextArea
                  className="inputArea"
                  rows={4}
                  allowClear
                  maxLength={100}
                  placeholder="Please enter question"
                />
              </div>
            </div>
          )}
          {language.includes('CN') && (
            <div className={styles.product_desc}>
              <div className={styles.title}>
                <span></span>
                <h1>中文</h1>
                <span></span>
              </div>
              <div className={styles.row}>
                <p>简介:</p>
                <Input
                  style={{ width: 200 }}
                  placeholder="请输入简介"
                  defaultValue={edit_data.data.description}
                ></Input>
              </div>
              <div className={styles.row}>
                <p>产品说明:</p>
                <TextArea
                  className="inputArea"
                  rows={4}
                  allowClear
                  maxLength={100}
                  placeholder="请输入产品说明"
                  defaultValue={edit_data.data.intor}
                />
              </div>
              <div className={styles.row}>
                <p>常见问题:</p>
                <TextArea
                  className="inputArea"
                  rows={4}
                  allowClear
                  maxLength={100}
                  placeholder="请输入常见问题"
                  defaultValue={edit_data.data.question}
                />
              </div>
            </div>
          )}
          <br />
          {
            // todo
          }
          <Button type="primary">{intl('operation.confirm')}</Button>
          <h1>{intl('bank.operation_log')}</h1>
          <Table dataSource={operationLog} columns={columns} />
        </Card>
      )}
    </PageContainer>
  );
};
