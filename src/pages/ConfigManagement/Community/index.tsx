import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin, Card } from 'antd';
import styles from './index.less';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    // <PageContainer content="这是一个新页面，从这里进行开发！" className={styles.main}>
    //   <div style={{ paddingTop: 100, textAlign: 'center' }}>
    //     <Spin spinning={loading} size="large" />
    //   </div>
    // </PageContainer>
    <PageContainer className={styles.main}>
      <Card>
        <p>{location.pathname}</p>
      </Card>
    </PageContainer>
  );
};
