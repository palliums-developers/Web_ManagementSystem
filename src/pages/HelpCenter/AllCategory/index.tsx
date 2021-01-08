import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Spin } from 'antd';
import styles from './index.less';
import { getCategory } from '@/services/helpCenter';
import { useIntl, history } from 'umi';
import List from '../../../components/Dnd/List'

const style = {
  width: 400,
  margin: 100,
}

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [category_list, set_category_list] = useState([
    { "id": 1, "language": "EN,CN,JA,KO", "name_en": "1", "description_en": "1", "name_cn": "1", "description_cn": "1", "name_ja": "1", "description_ja": "1", "name_ko": "1", "description_ko": "1" },
    { "id": 2, "language": "EN,CN", "name_en": "2", "description_en": "2", "name_cn": "2", "description_cn": "2", "name_ja": "", "description_ja": "", "name_ko": "", "description_ko": "" },
    { "id": 3, "language": "EN,CN", "name_en": "3", "description_en": "3", "name_cn": "3", "description_cn": "3", "name_ja": "", "description_ja": "", "name_ko": "", "description_ko": "" },
    { "id": 4, "language": "EN,CN", "name_en": "4", "description_en": "4", "name_cn": "4", "description_cn": "4", "name_ja": "", "description_ja": "", "name_ko": "", "description_ko": "" }
  ]);
  const changeCardList = (list: any[]) => {
    set_category_list([...list]);
  };
  const initialPage = async () => {
    let result = await getCategory();
    changeCardList(result.data)
  }
  const add_category = () => {
    history.push('/helpCenter/edit_category?operation=add')
  }
  const edit_category = (id: number) => {
    history.push('/helpCenter/edit_category?operation=edit&id=' + id)
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
        <Button onClick={() => { add_category() }}>add</Button>
        {/* <p>{JSON.stringify(category_list)}</p> */}
        {/* <List cardList={category_list} changeCardList={changeCardList} /> */}
        {category_list.map((item: any, key: number) => {
          return <div>
            <Button onClick={() => edit_category(item.id)}>edit</Button>
            <Button onClick={() => history.push('/helpCenter/all_group?category=' + item.id)}>chosen</Button>
            {item.id+' '}{item.name_en}
          </div>
        })}
      </Card>
    </PageContainer>
  );
};
