import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Switch, Checkbox, Tabs, Input, Button, Collapse } from 'antd';
import styles from './index.less';
import E from 'wangeditor';
import { history } from 'umi';
import { article, category, group } from '@/services/helpCenter';
import Modal from 'antd/lib/modal/Modal';
import { setArticle, getArticle, getGroup, getCategory } from '@/services/helpCenter'
// import get_array_ji from '@/utils/array_ji'
// import { toLower } from 'lodash';

const { Panel } = Collapse;
const { TabPane } = Tabs;
let edit_en: any = null;
let edit_cn: any = null;
let edit_ja: any = null;
let edit_ko: any = null;

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [operation_json, set_operation_json] = useState({
    operation: '',
    id: 0,
  })
  const [language, setLanguage] = useState(['EN']);
  const [select_tab, set_select_tab] = useState<string>('en');
  const [show_group, set_show_group] = useState<string>('select a group');
  const [groupId, setGroupId] = useState<number>(0);
  const [all_category, set_all_category] = useState<category[]>([]);
  const [all_modal, set_all_modal] = useState({ category: false, publish: false });
  const [initial_article, set_initial_article] = useState<article>({
    // author: '',
    // last_edit_time: '',
    // last_edit_author: '',

    group: 0,
    published: false,
    publish_time: '',
    language: 'EN',
    recommend: false,
    title_en: '',
    content_en: '',
    title_cn: '',
    content_cn: '',
    title_ja: '',
    content_ja: '',
    title_ko: '',
    content_ko: '',
    order: 99,

    // content_cn: "<p>gjgj</p>",
    // content_en: "<h1><b>aaa</b></h1>",
    // content_ja: "<p>jaja</p>",
    // content_ko: "<p>jojo</p>",
    // group: 3,
    // language: "EN",
    // publish_time: "",
    // published: false,
    // recommend: false,
    // title_cn: "aaa",
    // title_en: "222",
    // title_ja: "zxx",
    // title_ko: "pp",
    // order: 9,
    // todo order
  });
  const [post_article, set_post_article] = useState<any>({});
  const ok_modal = (type: string) => {
    change_modal(type, false)
  }
  const change_modal = async (type: string, key: boolean) => {
    switch (type) {
      case 'category':
        set_all_modal({ category: key, publish: all_modal.publish });
        break;
      case 'published':
        set_all_modal({ category: all_modal.category, publish: key });
        break;
      default:
        set_all_modal({ category: key, publish: key });
        break;
    }
  }
  const change_group = async (group_id: number) => {
    let temp = post_article;
    temp.group = group_id;
    await set_post_article(temp);
  }
  const select_group = async (categoty_id: number, group_id: number, category_name: string, group_name: string) => {
    await setGroupId(group_id);
    let temp_group = category_name + ' / ' + group_name;
    set_show_group(temp_group)
  }
  const create_rich_text_editor = (language: string) => {
    switch (language) {
      case 'en':
        edit_en = new E("#en");
        edit_en.create();
        break;
      case 'cn':
        edit_cn = new E("#cn");
        edit_cn.create();
        break;
      case 'ja':
        edit_ja = new E("#ja");
        edit_ja.create();
        break;
      case 'ko':
        edit_ko = new E("#ko");
        edit_ko.create();
        break;
      default:
        break;
    }
  }
  const changeTitle = (language: string, e: string) => {
    let temp_article = post_article;
    switch (language) {
      case 'en':
        temp_article.title_en = e;
        break;
      case 'cn':
        temp_article.title_cn = e;
        break;
      case 'ja':
        temp_article.title_ja = e;
        break;
      case 'ko':
        temp_article.title_ko = e;
        break;
      default:
        break;
    }
  }
  const able_tab = (type: string) => {
    return language.includes(type)
  }
  const switch_recommend = (status: boolean) => {
    let temp = post_article;
    temp.recommend = status;
  }
  const switch_tabs = (e: any) => {
    // create_rich_text_editor(e)
    set_select_tab(e);
  }
  const editor2article = () => {
    let temp_article = post_article;
    temp_article.content_en = edit_en.txt.html();
    temp_article.content_cn = edit_cn.txt.html();
    temp_article.content_ja = edit_ja.txt.html();
    temp_article.content_ko = edit_ko.txt.html();
  }
  const confirm_button = async (type: string) => {
    switch (type) {
      case 'saveAsDraft':
        editor2article();
        // console.log(initial_article);
        // console.log(post_article);
        setArticle(operation_json.operation, post_article)
        break;
      case 'select_group':
        await change_group(groupId);
        change_modal('category', false);
        break;
      default:
        break;
    }
  }
  const selectLanguage = (e: any) => {

    // if (e.length > language.length) {
    //   let add_language_editor = (get_array_ji('minus', e, language))[0];
    //   create_rich_text_editor(toLower(add_language_editor))
    // }
    // console.log(language)
    if (!e.includes('EN')) {
      e.push('EN')
    }
    setLanguage(e);
    let temp = post_article;
    temp.language = (e.toString())

    // let clear_language = [];
    // if (!e.includes('CN')) {
    //   clear_language.push('cn');
    // } else if (!e.includes('JA')) {
    //   clear_language.push('ja');
    // } else if (!e.includes('KO')) {
    //   clear_language.push('ko');
    // }
    // for (let i in temp) {
    //   if (i === 'language') {
    //     temp[i] = e.toString();
    //   }
    //   if (clear_language.length > 0) {
    //     for (let j in clear_language) {
    //       if (clear_language[j] === i.split('_')[1] && i.split('_')[0] === 'content') {

    //         console.log(i, temp[i])
    //         // temp[i] = '';
    //       }
    //     }
    //   }
    // }
  };
  const decode_location_search = () => {
    let temp_operation = operation_json;
    if (location.search) {
      let temp1 = location.search.split('?')[1].split('&');
      for (let i in temp1) {
        let temp2 = temp1[i].split('=');
        if (temp2[0] === 'operation') {
          temp_operation.operation = temp2[1];
        } else if (temp2[0] === 'id') {
          temp_operation.id = parseInt(temp2[1]);
        }
      }
    } else {
      history.push('/helpCenter/all_article');
    }
  }
  const initialGroup = (group: number, category: any) => {
    for (let i in category) {
      for (let j in category[i].group) {
        if (category[i].group[j].id === group) {
          set_show_group(category[i].name_en + ' / ' + category[i].group[j].name_en);
          break;
        }
      }
    }
  };
  const get_category2group_info = async () => {
    let temp_category = await getArticle('level')
    await set_all_category(temp_category.data);
    let loading_flag = false;
    if (operation_json.operation === 'edit') {
      let temp = (await getArticle('article', operation_json.id)).data;
      await set_initial_article(temp);
      await initial_post_article(JSON.stringify(temp));
      await initialGroup(temp.group, temp_category.data);
      loading_flag = true;
    } else if (operation_json.operation === 'add') {
      await initial_post_article(JSON.stringify(initial_article))
      loading_flag = true;
    }
    setLoading(loading_flag)
  }
  const initial_post_article = async (edit_data: string) => {
    let temp = JSON.parse(edit_data);
    await selectLanguage(temp.language);
    await set_post_article(temp);
  }
  const initialPage = async () => {
    await decode_location_search();
    await get_category2group_info();
    create_rich_text_editor('en');
    create_rich_text_editor('cn');
    create_rich_text_editor('ja');
    create_rich_text_editor('ko');
  }
  useEffect(() => {
    initialPage();
    // setTimeout(() => {
    //   setLoading(false);
    // }, 3000);
  }, []);
  return (
    <PageContainer className={styles.main}>
      <Card>
        <Modal
          title='Select a category'
          visible={all_modal.category}
          onOk={() => ok_modal('category')}
          onCancel={() => change_modal('category', false)}
          footer={<Button onClick={() => confirm_button('select_group')}>Confirm</Button>}
        >
          {
            all_category.length > 0 &&
            <Collapse accordion expandIconPosition={'right'}>{
              all_category.map((items, index) => {
                return <Panel header={items.name_en ? items.name_en : ''} key={items.id}>
                  <div>{items.group.length > 0 &&
                    items.group.map((item, index) => {
                      return <p onClick={() => { select_group(items.id, item.id, items.name_en, item.name_en) }}>{item.name_en}</p>
                    })
                  }</div>
                </Panel>
              })
            }
            </Collapse>
          }
        </Modal>
        <Modal
          title='Publish time'
          visible={all_modal.publish}
        >
          <p>111</p>
        </Modal>
        {
          loading &&
          <div>
            <p>Published in group</p>
            <Input
              value={show_group}
              suffix={<Button onClick={() => change_modal('category', true)}
              >edit</Button>}
            ></Input>
            <Switch onChange={(e) => switch_recommend(e)} defaultChecked={post_article.recommend}></Switch>
            <br></br>
            <Checkbox.Group
              onChange={selectLanguage}
              defaultValue={language}
            >
              <Checkbox value="EN" disabled>EN</Checkbox>
              <Checkbox value="CN">CN</Checkbox>
              <Checkbox value="JA">JA</Checkbox>
              <Checkbox value="KO">KO</Checkbox>
            </Checkbox.Group>
          </div>
        }
        <Tabs style={{ display: (all_modal.category ? 'none' : 'flex') }} defaultActiveKey="en" onChange={(e) => switch_tabs(e)}>
          <TabPane tab="EN" key="en">
            <Input onChange={e => changeTitle('en', e.target.value)}></Input>
            <div id='en' style={{ zIndex: 0 }} dangerouslySetInnerHTML={{
              __html: initial_article.content_en
            }}></div>
          </TabPane>
          <TabPane tab="CN" key="cn" forceRender disabled={!able_tab('CN')}>
            <Input onChange={e => changeTitle('cn', e.target.value)}></Input>
            <div id='cn' dangerouslySetInnerHTML={{
              __html: initial_article.content_cn
            }}></div>
          </TabPane>
          <TabPane tab="JA" key="ja" forceRender disabled={!able_tab('JA')}>
            <Input onChange={e => changeTitle('ja', e.target.value)}></Input>
            <div id='ja' dangerouslySetInnerHTML={{
              __html: initial_article.content_ja
            }}></div>
          </TabPane>
          <TabPane tab="KO" key="ko" forceRender disabled={!able_tab('KO')}>
            <Input onChange={e => changeTitle('ko', e.target.value)}></Input>
            <div id='ko' dangerouslySetInnerHTML={{
              __html: initial_article.content_ko
            }}></div>
          </TabPane>
        </Tabs>
        <Button onClick={() => confirm_button('saveAsDraft')}>Save</Button>
        <Button type='primary'>Save and Published</Button>
      </Card>
    </PageContainer>
  );
};
