import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Card, Modal, Input, Button } from 'antd';
import { Link, SelectLang, useModel, useIntl } from 'umi';
import styles from './index.less';
import Information from './Information';
import { accountInformation, userInformation } from '@/services/login';
import { useInterval } from '@/utils/utils'
const intl = (_temp: string) => {
  return useIntl().formatMessage({ id: _temp });
}
export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userInformation, setUserInformation] = useState<userInformation>();
  const [modal, setModal] = useState({ password: false, phone: false, google: false });
  const [captchaTime, setCaptchaTime] = useState(0);
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
  const handleModalOk = async (target: string) => {
    if (target === 'password') {

    } else if (target === 'phone') {

    } else if (target === 'google') {

    }
    handleModalCancel();
  }
  const handleModalCancel = () => {
    setModal({ password: false, phone: false, google: false });
    setCaptchaTime(0);
  }
  const getCAPTCHA = () => {
    if (captchaTime === 0) {
      setCaptchaTime(60)
    }
  }
  useEffect(() => {
    getInformation()
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  useInterval(()=>{
    if(captchaTime===0){
      return
    }
    setCaptchaTime(captchaTime-1)
    console.log(captchaTime)
  },1000);
  return (
    <PageContainer>
      {
        userInformation &&
        <div>
          <Modal
            visible={modal.password}
            onOk={() => handleModalOk('password')}
            onCancel={() => handleModalCancel()}
            title={intl('account.modifyPassword')}
          >
            <p>{intl('account.originalPassword')}<Input.Password placeholder={intl('account.enterPassword')} /></p>
            <p>{intl('account.newPassword')}<Input.Password placeholder={intl('account.passwordLimit')} /></p>
            <p>{intl('account.confirmPassword')}<Input.Password placeholder={intl('account.passwordConfirm')} /></p>
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

          </Modal>
          <Card>
            <h2>{intl('account.information')}</h2>
            <div className='information'>
              <p>{intl('account.name')}</p>
              <p>{userInformation.name}</p>
            </div>
            <div className='information'>
              <p>{intl('account.email')}</p>
              <p>{userInformation.email}</p>
            </div>
          </Card>
          <br />
          <Card>
            <h2>{intl('account.safe')}</h2>
            <div className='information'>
              <p>{intl('account.password')}</p>
              <p onClick={() => showModal('password')}>{intl('account.modify')}</p>
            </div>
            <div className='information'>
              <p>{intl('account.phone')}</p>
              <p onClick={() => showModal('phone')}>{userInformation.phone ? intl('account.modify') : intl('account.set')}</p>
            </div>
            <div className='information'>
              <p>{intl('account.google')}</p>
              <p onClick={() => showModal('google')}>{intl('account.modify')}</p>
            </div>
          </Card>
        </div>
      }
    </PageContainer>
  );
};
