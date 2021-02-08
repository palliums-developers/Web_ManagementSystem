import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Select, Table, DatePicker } from 'antd';
import styles from './index.less';
import { history, useIntl } from 'umi';
import { getArticle, article } from '@/services/helpCenter';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}

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
  const select_change = (value: string) => {
    history.push(value);
  }
  useEffect(() => {
    initialPage()
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const handleDateOk = (values: any[]) => {
    console.log(values[0].format('X'), values[1].format('X'));
  };
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
  const columns: any = [
    {
      title: 'Title',
      dataIndex: 'title_en'
    }, {
      title: 'Last Edit time',
      dataIndex: 'last_edit_time',
      render: (time: any) => {
        return moment(time * 1000).format('YYYY-MM-DD HH:mm:ss');
      }
    }, {
      title: intl('user.status'),
      dataIndex: 'published',
      render: (published: boolean) =>
        published ?
          <p style={{ color: 'green' }}>Published</p> :
          <p>Draft</p>

    }, {
      title: intl('user.operation'),
      dataIndex: 'id',
      render: (id: number) =>
        <p style={{cursor:'pointer'}} onClick={() => goto_edit_article('edit', id)}>{intl('operation.edit')}</p>

    }
  ]
  return (
    <PageContainer className={styles.main}>
      <Card>
        <div>
          <Input placeholder={intl('config.keyword')}></Input>
          <Select  style={{ width: 120 }} placeholder='Status'>
            <Option value='Published'>Published</Option>
            <Option value='Draft'>Draft</Option>
          </Select>
          <RangePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            onOk={handleDateOk}
          />
          <Button type="primary">{intl('operation.search')}</Button>
          <Select value='Add' onChange={select_change}>
            <Option value='/helpCenter/edit_article?operation=add'>Article</Option>
            <Option value='/helpCenter/edit_group?operation=add'>Group</Option>
            <Option value='/helpCenter/edit_category?operation=add'>Category</Option>
          </Select>
        </div>
        {/* {
          all_article.map((key, value) => {
            return <p className={styles.list}>
              <Button onClick={() => goto_edit_article('edit', key.id)}>edit</Button>
              {key.id}{' '}
              {key.author}{' '}
              {key.title_en}{' '}
            </p>
          })
        } */}
        <Table dataSource={all_article} columns={columns} />
      </Card>
    </PageContainer>
  );
};
