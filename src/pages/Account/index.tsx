import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Card } from 'antd';
import { Link, SelectLang, useModel, useIntl } from 'umi';
import styles from './index.less';
import Information from './Information';
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const intl = (_temp: string) => {
    return useIntl().formatMessage({ id: _temp });
  }
  return (
    // <PageContainer content="这是一个新页面，从这里进行开发！" className={styles.main}>
    //   <Information />
    //   <div
    //     style={{
    //       paddingTop: 100,
    //       textAlign: 'center',
    //     }}
    //   >
    //     <Spin spinning={loading} size="large" />
    //   </div>
    // </PageContainer>
    <PageContainer>
      <Card>
        <h2>{intl('account.information')}</h2>
        <p>{intl('account.name')}</p>
        <p>{intl('account.email')}</p>
      </Card>
      <br />
      <Card>
        <h2>{intl('account.safe')}</h2>
        <p>{intl('account.password')}</p>
        <p>{intl('account.phone')}</p>
        <p>{intl('account.google')}</p>
      </Card>
    </PageContainer>
  );
};
