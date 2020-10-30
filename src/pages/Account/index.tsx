import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Card, Modal, Input, Button } from 'antd';
import { Link, SelectLang, useModel, useIntl } from 'umi';
import styles from './index.less';
import { accountInformation, userInformation, changePassword } from '@/services/login';
import { useInterval } from '@/utils/utils'
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userInformation, setUserInformation] = useState<userInformation>();
  const [modal, setModal] = useState({ password: false, phone: false, google: false });
  const [captchaTime, setCaptchaTime] = useState(0);
  const [password, setPassword] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const getInformation = async () => {
    let temp = await accountInformation();
    await setUserInformation(temp);
  }
  const showModal = (target: string) => {
    if (target === 'password') {
      setModal({ password: true, phone: false, google: false });
    } else if (target === 'phone') {
      setModal({ password: false, phone: true, google: false });
    } else if (target === 'google') {
      setModal({ password: false, phone: false, google: true });
    }
  }
  const handleChange = (type: string, data: any) => {
    switch (type) {
      case 'old_password':
        setPassword({
          old_password: data,
          new_password: password.new_password,
          confirm_password: password.confirm_password
        });
        break;
      case 'new_password':
        setPassword({
          old_password: password.old_password,
          new_password: data,
          confirm_password: password.confirm_password
        });
        sameString(data, password.confirm_password);
        break;
      case 'confirm_password':
        setPassword({
          old_password: password.old_password,
          new_password: password.new_password,
          confirm_password: data
        });
        sameString(password.new_password, data);
        break;
    }
  }
  const sameString = (string1: string, string2: string) => {
    if (string1 === string2) {
      console.log('same string');
    } else {
      console.log('not the same');
    }
  }
  const handleModalOk = async (target: string) => {
    if (target === 'password') {
      let result = await changePassword(userInformation?.name, password.old_password, password.new_password);
      console.log(result);
    } else if (target === 'phone') {

    } else if (target === 'google') {

    }
    handleModalCancel();
  }
  const handleModalCancel = () => {
    setModal({ password: false, phone: false, google: false });
    setCaptchaTime(0);
    setPassword({
      old_password: '',
      new_password: '',
      confirm_password: ''
    })
  }
  const getCAPTCHA = () => {
    if (captchaTime === 0) {
      // todo get captcha code
      setCaptchaTime(60)
    }
  }
  useEffect(() => {
    getInformation()
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  useInterval(() => {
    if (captchaTime === 0) {
      return
    }
    setCaptchaTime(captchaTime - 1)
    console.log(captchaTime)
  }, 1000);
  return (
    <PageContainer className={styles.main}>
      {
        userInformation &&
        <div>
          <Modal
            visible={modal.password}
            onOk={() => handleModalOk('password')}
            onCancel={() => handleModalCancel()}
            title={intl('account.modifyPassword')}
          >
            <p>{intl('account.originalPassword')}<Input.Password placeholder={intl('account.enterPassword')} onChange={e => handleChange('old_password', e.target.value)} /></p>
            <p>{intl('account.newPassword')}<Input.Password placeholder={intl('account.passwordLimit')} onChange={e => handleChange('new_password', e.target.value)} /></p>
            <p>{intl('account.confirmPassword')}<Input.Password placeholder={intl('account.passwordConfirm')} onChange={e => handleChange('confirm_password', e.target.value)} /></p>
          </Modal>
          <Modal
            visible={modal.phone}
            onOk={() => handleModalOk('phone')}
            onCancel={() => handleModalCancel()}
            title={userInformation.phone ? intl('account.modifyPhone') : intl('account.settingPhone')}
          >
            <p>{intl('account.phone')}<Input placeholder={userInformation.phone} /></p>
            <p>{intl('account.CAPTCHA')}<Input placeholder={intl('account.enterCAPTCHA')} addonAfter={
              <Button onClick={getCAPTCHA}>{captchaTime === 0 ? intl('account.getCAPTCHA') : captchaTime + 'S'}</Button>
              // <Button onClick={getCAPTCHA}>{captchaStatus.clickable ? intl('account.getCAPTCHA') : captchaStatus.time + 'S'}</Button>
            } /></p>
          </Modal>
          <Modal
            visible={modal.google}
            onOk={() => handleModalOk('google')}
            onCancel={() => handleModalCancel()}
            title={intl('account.modifyGoogle')}
          >
            <p>this is google</p>
          </Modal>
          <Card>
            <h2>{intl('account.information')}</h2>
            <div className={styles.information}>
              <p>{intl('account.name')}</p>
              <p> {userInformation.name}</p>
            </div>
            <div className={styles.information}>
              <p>{intl('account.email')}</p>
              <p>{userInformation.email}</p>
            </div>
          </Card>
          <br />
          <Card>
            <h2>{intl('account.safe')}</h2>
            <div className={styles.information}>
              <p>{intl('account.password')}</p>
              <span onClick={() => showModal('password')}>{intl('account.modify')}</span>
            </div>
            <div className={styles.information}>
              <p>{intl('account.phone')}</p>
              <span onClick={() => showModal('phone')}>{userInformation.phone ? intl('account.modify') : intl('account.set')}</span>
            </div>
            <div className={styles.information}>
              <p>{intl('account.google')}</p>
              <span onClick={() => showModal('google')}>{intl('account.modify')}</span>
            </div>
          </Card>
        </div>
      }
    </PageContainer>
  );
};
