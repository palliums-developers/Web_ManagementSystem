import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import styles from './index.less';
import {useIntl}from 'umi';
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer className={styles.main}>
      <Card>
    <div className={styles.row}>
      <p>{intl('config.platform')}</p>

    </div>
    <div className={styles.row}>
      <p>{intl('config.platform')}</p>
      
    </div>
    <div className={styles.row}>
      <p>{intl('config.platform')}</p>
      
    </div>
      </Card>
    </PageContainer>
  );
};
