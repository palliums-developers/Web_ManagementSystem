import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Select, Popover } from 'antd';
import styles from './index.less';
import { category, getCategory, getGroup, group, setGroup } from '@/services/helpCenter';
import { history, useIntl } from 'umi';
import { SortableContainer as sortableContainer, SortableElement, SortableHandle, } from 'react-sortable-hoc';
import arrayMove from 'array-move';
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
const { Option } = Select;

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [category_id, set_category_id] = useState<number>();
  const [group_data, set_group_data] = useState<group[]>([]);
  const [move_modal, set_move_modal] = useState(false);
  const [move_data, set_move_data] = useState({ group_id: 0, category_id: 0 });
  const [category_list, set_category_list] = useState<category[]>([]);
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
    let data = (await getGroup('category', temp || 1)).data;
    let temp_category_list = (await getCategory()).data;
    await set_category_list(temp_category_list);
    set_group_data(data);
  }
  // const add_group = () => {
  //   history.push('/helpCenter/edit_group?operation=add&category=' + category_id)
  // }
  const edit_group = (id: number) => {
    history.push('/helpCenter/edit_group?operation=edit&id=' + id)
  }
  const chosen_group = (id: number) => {
    history.push('/helpCenter/group2article?group=' + id)
  }
  const select_change = (value: string) => {
    history.push(value);
  }
  const move_group2category = async () => {
    console.log(move_data);
    let result = await setGroup('edit', { id: move_data.group_id, category: move_data.category_id });
    console.log(result)
  }

  const DragHandle = SortableHandle(() => <span>::</span>);
  const content = (id: number, order: number) => {
    return (
      <div>
        <Button onClick={() => edit_group(id)}>edit</Button>
        <Button onClick={() => { set_move_modal(true); set_move_data({ group_id: id, category_id: 0 }) }}>Move</Button>
        <Button onClick={() => onSortEnd({ oldIndex: order, newIndex: 0 })}>Top</Button>
      </div>
    )
  }
  const SortableItem = SortableElement((value: group) => (
    <li className={styles.sort}>
      <DragHandle />
      <p onClick={() => chosen_group(value.value.id)}>{(value.value.name_en)}</p>
      <Popover
        content={content(value.value.id, value.value.order - 1)}
        trigger="hover"
        placement="bottom"
      >
        <p>==</p>
      </Popover>
    </li >
  ));

  const SortableContainer = sortableContainer(({ children }) => {
    return <ul>{children}</ul>;
  });

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    let changeArray = arrayMove(group_data, oldIndex, newIndex);
    let temp_changeOrder = changeOrder(changeArray);
    let result = update_sort(temp_changeOrder);
    set_group_data(temp_changeOrder);
  };
  const update_sort = (sort_array: group[]) => {
    let result = {};
    let temp = [];
    for (let i in sort_array) {
      temp.push({ id: sort_array[i].id, order: sort_array[i].order })
    }
    result = setGroup('sort', { order: temp })
    return result;
  }
  const changeOrder = (array: group[]) => {
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
        {/* <Button onClick={() => add_group()}>add group</Button> */}
        {
          category_list.length > 0 &&
          <Modal
            title='move category'
            visible={move_modal}
            onOk={() => set_move_modal(false)}
            onCancel={() => set_move_modal(false)}
            footer={<Button onClick={() => {
              move_group2category();
              set_move_modal(false);
            }}>Confirm</Button>}
          >
            {
              category_list.map((item, key) => {
                return <p onClick={() => set_move_data({
                  group_id: move_data.group_id,
                  category_id: item.id
                })}>{item.name_en}</p>
              })
            }
          </Modal>
        }
        <Select value='Add' onChange={select_change}>
          <Option value='/helpCenter/edit_article?operation=add'>Article</Option>
          <Option value='/helpCenter/edit_group?operation=add'>Group</Option>
          <Option value='/helpCenter/edit_category?operation=add'>Category</Option>
        </Select>
        {/* {
          group_data.length > 0 &&
          group_data.map((item, key) => {
            return <div>
              <Button onClick={() => edit_group(item.id)}>edit</Button>
              <Button onClick={() => chosen_group(item.id)}>chosen</Button>
              <Button onClick={() => { set_move_modal(true); set_move_data({ group_id: item.id, category_id: 0 }) }}>Move</Button>
              {item.name_en}
            </div>
          })
        } */}
        {
          category_list.length > 0 &&
          <SortableContainer onSortEnd={onSortEnd} useDragHandle>
            {group_data.map((value, index) => (
              <SortableItem key={`${value}`} index={index} value={value} />
            ))}
          </SortableContainer>
        }
      </Card>
    </PageContainer>
  );
};
