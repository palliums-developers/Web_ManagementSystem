import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Button, Card } from 'antd';
import styles from './index.less';
import { history } from 'umi';
import { getArticle, article } from '@/services/helpCenter'

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [all_article, set_all_article] = useState<article[]>([]);
  const getData = async () => {
    let temp = await getArticle('all', 1);
    set_all_article(temp.data);
    console.log(temp.data);
  }
  const initialPage = async () => {
    await getData();
  }
  useEffect(() => {
    initialPage()
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const goto_edit_article = (operation: string, article_id?: number) => {
    let edit_article_url = '/helpCenter/edit_article';
    if (operation === 'edit') {
      edit_article_url += `?operation=${operation}&id=${article_id}`;
    } else if (operation === 'add') {
      edit_article_url += `?operation=${operation}`;
    } else {
      alert('wrong operation')
    }
    history.push(edit_article_url)
  }
  return (
    <PageContainer className={styles.main}>
      <Card>
        {
          all_article.map((key, value) => {
            return <p>
              <Button onClick={() => goto_edit_article('edit', key.id)}>edit</Button>
              <Button onClick={() => goto_edit_article('add')}>add</Button>
              {key.id}{' '}
              {key.author}{' '}
              {key.title_en}{' '}
            </p>
          })
        }
      </Card>
    </PageContainer>
  );
};
