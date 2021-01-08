import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Button, Card, Modal } from 'antd';
import styles from './index.less';
import { getGroup, group, setGroup } from '@/services/helpCenter';
import { history, useIntl } from 'umi';
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [category_id, set_category_id] = useState<number>();
  const [group_data, set_group_data] = useState<group[]>([])
  const decode_location_search = async () => {
    let temp1 = location.search.split('?')[1].split('&');
    for (let i in temp1) {
      if (temp1[i].split('=')[0] === 'category') {
        await set_category_id(parseInt(temp1[i].split('=')[1]));
        return parseInt(temp1[i].split('=')[1])
      }
    }
  }
  const initialPage = async () => {
    let temp = await decode_location_search();
    let data = (await getGroup('category',temp || 1)).data;
    set_group_data(data);
  }
  const add_group = () => {
    history.push('/helpCenter/edit_group?operation=add')
  }
  const edit_group = (id: number) => {
    history.push('/helpCenter/edit_group?operation=edit&id=' + id)
  }
  const chosen_group = (id: number) => {
    history.push('/helpCenter/group2article?group=' + id)
  }
  useEffect(() => {
    initialPage()
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer className={styles.main}>
      <Card>
        <Button onClick={() => add_group()}>add group</Button>
        {
          group_data.length > 0 &&
          group_data.map((item, key) => {
            return <div>
              <Button onClick={() => edit_group(item.id)}>edit</Button>
              <Button onClick={() => chosen_group(item.id)}>chosen</Button>
              {item.name_en}
            </div>
          })
        }
      </Card>
    </PageContainer>
  );
};
