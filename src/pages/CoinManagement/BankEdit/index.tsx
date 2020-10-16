import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Input, Table, Button, Collapse, Checkbox } from 'antd';
import styles from './index.less';
import { useIntl } from 'umi';
import { postBankProduct, bank_product, show_data, raw_bank_product, modal } from '@/services/bank';

const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
const { TextArea } = Input;
const { Panel } = Collapse;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [operation, setOperation] = useState({ type: 'add', database: 'deposit' });
  const [edit_data, setEdit_data] = useState<bank_product | null>();
  const [operationLog, setOperationLog] = useState();
  const initial = () => {
    const edit_data_string = localStorage.getItem('edit');
    if (edit_data_string) {
      setEdit_data(JSON.parse(edit_data_string));
    }
  }
  const selectLanguage = (e: any) => {
    console.log(e)
  }
  useEffect(() => {
    initial()
    console.log(edit_data)
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const options = [
    { label: '中文', value: 'CN' },
    { label: 'English', value: 'EN' }
  ];
  const columns = [
    {
      title: intl('bank.operator'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: intl('bank.operation_time'),
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: intl('bank.operation_detail'),
      dataIndex: 'detail',
      key: 'detail'
    }
  ];
  return (
    <PageContainer className={styles.main}>
      <Card>
        <p>{intl('bank.currency')}:<Input style={{ width: 200 }}></Input></p>
        <p>
          {intl('bank.currency')}:<Input style={{ width: 200 }}></Input>
          {intl('bank.currency')}:<Input style={{ width: 200 }}></Input>
        </p>
        <p>{intl('bank.currency')}:<Input style={{ width: 200 }}></Input></p>
        <Checkbox.Group
          options={options}
          onChange={selectLanguage}
        />
        <h1>中文</h1>
        <p>{intl('bank.introduction')}:<Input style={{ width: 200 }}></Input></p>
        <p>
          {intl('bank.description')}
          <TextArea className='inputArea' rows={4} allowClear showCount maxLength={100} />
        </p>
        <p>
          {intl('bank.questions')}
          <TextArea className='inputArea' rows={4} allowClear showCount maxLength={100} />
        </p>
        <h1>English</h1>
        <p>{intl('bank.introduction')}:<Input style={{ width: 200 }}></Input></p>
        <p>
          {intl('bank.description')}
          <TextArea className='inputArea' rows={4} allowClear showCount maxLength={100} />
        </p>
        <p>
          {intl('bank.questions')}
          <TextArea className='inputArea' rows={4} allowClear showCount maxLength={100} />
        </p>
        <Button type='primary'>{intl('operation.confirm')}</Button>
        <h1>{intl('bank.operation_log')}</h1>
        <Table dataSource={operationLog} columns={columns} />
      </Card>
    </PageContainer>
  );
};
