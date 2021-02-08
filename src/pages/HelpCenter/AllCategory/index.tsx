import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Select, Popover } from 'antd';
import styles from './index.less';
import { category, getCategory, setCategory } from '@/services/helpCenter';
import { useIntl, history } from 'umi';
// import List from '../../../components/Dnd/List'
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { SortableContainer as sortableContainer, SortableElement, SortableHandle, } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const { Option } = Select;


export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'])
  const [category_list, set_category_list] = useState<category[]>([]);
  const select_change = (value: string) => {
    history.push(value);
  }
  const changeCardList = (list: category[]) => {
    // set_category_list([...list]);
    set_category_list(list);
  };
  const initialPage = async () => {
    let result = await getCategory();
    // console.log(JSON.stringify(result.data))
    set_category_list(result.data);
    // changeCardList(result.data)
  }
  const add_category = () => {
    history.push('/helpCenter/edit_category?operation=add')
  }
  const edit_category = (id: number) => {
    history.push('/helpCenter/edit_category?operation=edit&id=' + id)
  }


  const DragHandle = SortableHandle(() => <span>::</span>);
  const content = (id: number, order: number) => {
    return (
      <div>
        <Button onClick={() => edit_category(id)}>edit</Button>
        <Button onClick={() => history.push('/helpCenter/all_group?category=' + id)}>chosen</Button>
        <Button onClick={() => onSortEnd({ oldIndex: order, newIndex: 0 })}>Top</Button>
      </div>
    )
  }
  const SortableItem = SortableElement((value: category) => (
    <li className={styles.sort}>
      <DragHandle />
      <p className={styles.left} onClick={() => history.push('/helpCenter/all_group?category=' + value.value.id)}>{(value.value.name_en)}</p>
      <Popover
        content={content(value.value.id, value.value.order - 1)}
        trigger="hover"
        placement="bottom"
      >
        <p className={styles.right}>==</p>
      </Popover>
    </li>
  ));

  const SortableContainer = sortableContainer(({ children }) => {
    return <ul>{children}</ul>;
  });

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    let changeArray = arrayMove(category_list, oldIndex, newIndex);
    let temp_changeOrder = changeOrder(changeArray);
    // console.log(temp_changeOrder)
    let result = update_sort(temp_changeOrder);
    set_category_list(temp_changeOrder);
  };
  const update_sort = (sort_array: category[]) => {
    let result = {};
    let temp = [];
    for (let i in sort_array) {
      temp.push({ id: sort_array[i].id, order: sort_array[i].order })
    }
    result = setCategory('sort', { order: temp })
    return result;
  }
  const changeOrder = (array: category[]) => {
    for (let i in array) {
      array[i].order = parseInt(i) + 1;
    }
    return array;
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
        {/* <Button onClick={() => { add_category() }}>add</Button> */}
        <Select value='Add' onChange={select_change}>
          <Option value='/helpCenter/edit_article?operation=add'>Article</Option>
          <Option value='/helpCenter/edit_group?operation=add'>Group</Option>
          <Option value='/helpCenter/edit_category?operation=add'>Category</Option>
        </Select>
        {/* <p>{JSON.stringify(category_list)}</p> */}
        {/* <List cardList={category_list} changeCardList={changeCardList} /> */}
        {/* {category_list.map((item: any, key: number) => {
          return <div>
            <Button onClick={() => edit_category(item.id)}>edit</Button>
            <Button onClick={() => history.push('/helpCenter/all_group?category=' + item.id)}>chosen</Button>
            {item.id + ' '}{item.name_en}
          </div>
        })} */}
        {
          category_list.length > 0 &&
          <SortableContainer onSortEnd={onSortEnd} useDragHandle>
            {category_list.map((value, index) => (
              <SortableItem key={`${value}`} index={index} value={value} />
            ))}
          </SortableContainer>
        }
      </Card>
    </PageContainer>
  );
};
