import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import styles from './index.less';

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
        <p>{location}</p>
      </Card>
    </PageContainer>
  );
};
