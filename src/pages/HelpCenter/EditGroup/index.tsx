import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Input, Button } from 'antd';
import styles from './index.less';
import { getGroup, group, setGroup } from '@/services/helpCenter';
import { useIntl, history } from 'umi';
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
};
const { TextArea } = Input;
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [language, setLanguage] = useState([]);
  // todo category id 
  const [location_operation, set_location_operation] = useState({ operation: '', id: 0, category_id: 0 })
  const [data, setData] = useState<group>({
    language: '',
    name_en: '',
    description_en: '',
    name_cn: '',
    description_cn: '',
    name_ja: '',
    description_ja: '',
    name_ko: '',
    description_ko: '',
    order: 99,
    category: 1,
  });
  const onChangeData = (_language: string, _type: string, e: string) => {
    let temp = data;
    for (let i in temp) {
      if (i === (_type + '_' + _language)) {
        temp[i] = e
      }
    }
    setData(temp);
  }
  const submitGroup = () => {
    console.log(location_operation, data)
    setGroup(location_operation.operation, data);
  }
  const selectLanguage = (e: any) => {
    setLanguage(e);
    let temp = data;
    let clear_language = [];
    if (!e.includes('CN')) {
      clear_language.push('cn');
    } else if (!e.includes('JA')) {
      clear_language.push('ja');
    } else if (!e.includes('KO')) {
      clear_language.push('ko');
    }
    for (let i in temp) {
      if (i === 'language') {
        temp[i] = e.toString();
      }
      if (clear_language.length > 0) {
        for (let j in clear_language) {
          if (clear_language[j] === i.split('_')[1]) {
            temp[i] = '';
          }
        }
      }
    }
  };
  const decode_location = () => {
    let temp = location_operation;
    if (location.search) {
      let temp1 = location.search.split('?')[1];
      let temp2 = temp1.split('&');
      for (let i in temp2) {
        let temp3 = temp2[i].split('=');
        if (temp3[0] === 'operation') {
          temp.operation = temp3[1];
        } else if (temp3[0] === 'id') {
          temp.id = parseInt(temp3[1]);
        }
      }
    }
    return temp
  }
  const initial_data = async (temp_operation: any) => {
    let temp_language = language;
    let temp_data = data;
    // let temp_category = (await getGroup('category',temp_operation.id)).data;
    let temp_category = (await getGroup('group', temp_operation.id)).data;
    if (temp_operation.operation === 'edit') {
      for (let i in temp_category) {
        if (temp_category[i].id === temp_operation.id) {
          temp_data = (temp_category[i]);
          temp_language = (temp_category[i].language.split(','));
          await setData(temp_data);
          await setLanguage(temp_language);
          break;
        }
      }
    } else if (temp_operation.operation === 'add') {
      temp_data.order = temp_category.length + 1
      setLanguage(['EN'])
    } else {
      history.push('/helpCenter/all_group');
    }
  }
  const initialPage = async () => {
    let temp_operation = decode_location();
    initial_data(temp_operation);
  }
  useEffect(() => {
    initialPage();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <PageContainer className={styles.main}>
      <Card>
        {(language).length > 0 &&
          <Checkbox.Group
            onChange={selectLanguage}
            defaultValue={language}
          >
            <Checkbox value="EN" disabled>EN</Checkbox>
            <Checkbox value="CN">CN</Checkbox>
            <Checkbox value="JA">JA</Checkbox>
            <Checkbox value="KO">KO</Checkbox>
          </Checkbox.Group>
        }
        {language.includes('EN') && (
          <div className={styles.product_desc}>
            <div className={styles.title}>
              <span></span>
              <h1>English</h1>
              <span></span>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.name')}:</p>
              <Input
                style={{ width: 200 }}
                placeholder="Please Enter Introduction"
                onChange={(e) => { onChangeData('en', 'name', e.target.value) }}
                defaultValue={data.name_en}
              ></Input>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.description')}</p>
              <TextArea
                className="inputArea"
                rows={4}
                allowClear
                maxLength={100}
                placeholder="Please enter description"
                onChange={(e) => { onChangeData('en', 'description', e.target.value) }}
                defaultValue={data.description_en}
              />
            </div>
          </div>
        )}
        {language.includes('CN') && (
          <div className={styles.product_desc}>
            <div className={styles.title}>
              <span></span>
              <h1>Chinese</h1>
              <span></span>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.name')}:</p>
              <Input
                style={{ width: 200 }}
                placeholder="Please Enter Introduction"
                onChange={(e) => { onChangeData('cn', 'name', e.target.value) }}
                defaultValue={data.name_cn}
              >
              </Input>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.description')}</p>
              <TextArea
                className="inputArea"
                rows={4}
                allowClear
                maxLength={100}
                placeholder="Please enter description"
                onChange={(e) => { onChangeData('cn', 'description', e.target.value) }}
                defaultValue={data.description_cn}
              />
            </div>
          </div>
        )}
        {language.includes('JA') && (
          <div className={styles.product_desc}>
            <div className={styles.title}>
              <span></span>
              <h1>Japanese</h1>
              <span></span>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.name')}:</p>
              <Input
                style={{ width: 200 }}
                placeholder="Please Enter Introduction"
                onChange={(e) => { onChangeData('ja', 'name', e.target.value) }}
                defaultValue={data.name_ja}
              >
              </Input>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.description')}</p>
              <TextArea
                className="inputArea"
                rows={4}
                allowClear
                maxLength={100}
                placeholder="Please enter description"
                onChange={(e) => { onChangeData('ja', 'description', e.target.value) }}
                defaultValue={data.description_ja}
              />
            </div>
          </div>
        )}
        {language.includes('KO') && (
          <div className={styles.product_desc}>
            <div className={styles.title}>
              <span></span>
              <h1>Korean</h1>
              <span></span>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.name')}:</p>
              <Input
                style={{ width: 200 }}
                placeholder="Please Enter Introduction"
                onChange={(e) => { onChangeData('ko', 'name', e.target.value) }}
                defaultValue={data.name_ko}
              >
              </Input>
            </div>
            <div className={styles.row}>
              <p>{intl('bank.description')}</p>
              <TextArea
                className="inputArea"
                rows={4}
                allowClear
                maxLength={100}
                placeholder="Please enter description"
                onChange={(e) => { onChangeData('ko', 'description', e.target.value) }}
                defaultValue={data.description_ko}
              />
            </div>
          </div>
        )}
        <br />
        <Button type="primary" onClick={() => submitGroup()}>{intl('operation.confirm')}</Button>
      </Card>
    </PageContainer>
  );
};
