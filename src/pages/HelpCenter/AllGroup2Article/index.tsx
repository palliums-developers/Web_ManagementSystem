import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Popover, Collapse } from 'antd';
import styles from './index.less';
import { article, getArticle, setArticle } from '@/services/helpCenter';
import { history } from 'umi';
import Modal from 'antd/lib/modal/Modal';
import { SortableContainer as sortableContainer, SortableElement, SortableHandle, } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const { Option } = Select;
const { Panel } = Collapse;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [group, setGroup] = useState<number>(0);
  const [article_list, set_article_list] = useState<article[]>([]);
  const [show_modal, set_show_modal] = useState(false);
  const [move_data, set_move_data] = useState({ article: 0, group: 0 })
  const [category_group, set_category_group] = useState([]);
  const click_function = (type: string, data: {}) => {
    switch (type) {
      case 'chosen':
        history.push('/helpCenter/edit_article?operation=edit&id=' + data?.article_id)
        break;
      case 'move':
        set_move_data({ article: data.article_id, group: move_data.group })
        set_show_modal(true);
      default:
        break;
    }
  }
  const select_change = (value: string) => {
    history.push(value);
  }
  const decode_location = () => {
    let temp = group;
    if (location.search) {
      let temp1 = location.search.split('?')[1];
      let temp2 = temp1.split('&');
      for (let i in temp2) {
        let temp3 = temp2[i].split('=');
        if (temp3[0] === 'group') {
          temp = parseInt(temp3[1]);
        }
      }
    }
    return temp;
  }
  const initialPage = async () => {
    let temp_group = await decode_location();
    let temp_article_list = await getArticle('group', temp_group);
    let temp_category_group = (await getArticle('level', 0)).data;
    console.log(temp_category_group);
    await set_category_group(temp_category_group);
    await set_article_list(temp_article_list.data);
  }
  const move_function = async () => {
    console.log(move_data);
    let result = setArticle('move', move_data);
    if (result.status && result.status === 'ok') {
      set_show_modal(false);
    }
  }

  const DragHandle = SortableHandle(() => <span>::</span>);
  const content = (id: number, order: number) => {
    return (
      <div>
        <Button onClick={() => click_function('chosen', { article_id: id })}>Chosen</Button>
        <Button onClick={() => click_function('move', { article_id: id })}>Move</Button>
        <Button onClick={() => onSortEnd({ oldIndex: order, newIndex: 0 })}>Top</Button>
      </div>
    )
  }
  const SortableItem = SortableElement((value: article) => (
    <li className={styles.sort}>
      <DragHandle />
      <p>{(value.value.title_en)}</p>
      <Popover
        content={content(value.value.id, value.value.order - 1)}
        trigger="hover"
        placement="bottom"
      >
        <p>==</p>
      </Popover>
    </li>
  ));

  const SortableContainer = sortableContainer(({ children }) => {
    return <ul>{children}</ul>;
  });

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    let changeArray = arrayMove(article_list, oldIndex, newIndex);
    let temp_changeOrder = changeOrder(changeArray);
    // console.log(temp_changeOrder)
    let result = update_sort(temp_changeOrder);
    set_article_list(temp_changeOrder);
  };
  const update_sort = (sort_array: article[]) => {
    let result = {};
    let temp = [];
    for (let i in sort_array) {
      temp.push({ id: sort_array[i].id, order: sort_array[i].order })
    }
    result = setArticle('sort', { order: temp })
    return result;
  }
  const changeOrder = (array: article[]) => {
    for (let i in array) {
      array[i].order = parseInt(i) + 1;
    }
    return array;
  }
  useEffect(() => {
    initialPage();
    setTimeout(() => {
      initialPage();
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer className={styles.main}>
      <Card>
        <Modal
          title='Move'
          visible={show_modal}
          onOk={() => set_show_modal(false)}
          onCancel={() => set_show_modal(false)}
          footer={<Button onClick={() => move_function()}>Move</Button>}
        >
          {
            category_group.length > 0 &&
            // category_group.map((item, key) => {
            //   // todo change as Collapse
            //   return <p>{item.name_en}</p>
            // })
            <Collapse accordion expandIconPosition={'right'}>{
              category_group.map((items, index) => {
                return <Panel header={items.name_en ? items.name_en : ''} key={items.id}>
                  <div>{items.group.length > 0 &&
                    items.group.map((item, index) => {
                      return <p onClick={() => {
                        console.log(items.id, item.id, items.name_en, item.name_en);
                        set_move_data({ article: move_data.article, group: item.id });
                      }
                      }> {item.name_en}</p>
                    })
                  }</div>
                </Panel>
              })
            }
            </Collapse>
          }
        </Modal>
        <Select value='Add' onChange={select_change}>
          <Option value='/helpCenter/edit_article?operation=add'>Article</Option>
          <Option value='/helpCenter/edit_group?operation=add'>Group</Option>
          <Option value='/helpCenter/edit_category?operation=add'>Category</Option>
        </Select>
        {
          article_list.length > 0 &&
          <SortableContainer onSortEnd={onSortEnd} useDragHandle>
            {article_list.map((value, index) => (
              <SortableItem key={`${value}`} index={index} value={value} />
            ))}
          </SortableContainer>
        }
      </Card>
    </PageContainer >
  );
};
