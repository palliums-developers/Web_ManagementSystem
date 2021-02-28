// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, message, Input, Modal, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, SelectLang, useModel, useIntl, history } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import { getInitialState } from '../../app';
import {
  LoginParamsType,
  accountLogin,
  getImgCaptcha,
  verifyGoogle,
  setGoogle,
} from '@/services/login';
// import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';
// import login from '@/locales/zh-CN/login';
import QRCode from 'qrcode.react';

const { Tab, Username, Password, Submit } = LoginFrom;

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  //todo here is the login and redirect
  // console.log(urlParams.href.split(urlParams.pathname)[0] + (redirect || '/'))
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/welcome');
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');
  const [captcha, setCaptcha] = useState({ img: '', code: '' });
  const [warning, setWarning] = useState({ name: '', password: '', captcha: '' });
  const [modal, setModal] = useState({ google_verify: false, google_new: false });
  const [google, setGoogle] = useState('');
  const [verify_code, setVerify_code] = useState('');

  const handleCaptcha = async (e: any) => {
    if (e.length === 4) {
      if (e === captcha.code) {
        await setWarning({
          name: warning.name,
          password: warning.password,
          captcha: 'Same CAPTCHA',
        });
      } else {
        await setWarning({
          name: warning.name,
          password: warning.password,
          captcha: 'Error CAPTCHA',
        });
      }
    } else {
      await setWarning({
        name: warning.name,
        password: warning.password,
        captcha: '',
      });
    }
  };
  const handleVerify = async (e: any) => {
    await setVerify_code(e.target.value);
  };
  const getCaptcha = async () => {
    const temp = await getImgCaptcha();
    setCaptcha(temp);
  };
  /**
   * click submit to post username and password
   * @param values
   */
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = (await accountLogin({ ...values, type }));
      if (msg.status === 'ok') {
        // let temp = intl('login.success')
        message.success('Login Success!');
        sessionStorage.setItem('JWT', msg?.token);
        console.log(msg);
        await setGoogle(msg?.google);
        if (msg?.google == 'none') {
          setModal({ google_verify: false, google_new: true });
        } else {
          setModal({ google_verify: true, google_new: false });
        }
        // replaceGoto();
        // setTimeout(() => {
        //   refresh();
        // }, 0);
        return;
      }
      // 如果失败去设置用户错误信息
      setUserLoginState(msg);
    } catch (error) {
      // let temp = intl('login.failed')
      message.error('Login Failed, please try again!');
    }
    setSubmitting(false);
  };
  /**
   * google authentication
   * @param type
   */
  const handleOk = async (type: string) => {
    if (type === 'new') {
      // todo
      console.log('google ', google, verify_code);
      console.log('go to welcome');
      // let google_result = await setGoogle();
      // await setGoogle(google_result.data);
      // verifyGoogle(verify_code);
      // await getInitialState();
      replaceGoto();
    } else if (type === 'verify') {
      console.log(google, '11', verify_code);
      let google_result = await verifyGoogle(verify_code);
      console.log(google_result);
      if (google_result.status === 'ok') {
        history.push('/');
      } else {
      }
    }
    // handleCancel();
  };
  const handleCancel = () => {
    setModal({ google_verify: false, google_new: false });
  };
  useEffect(() => {
    getCaptcha();
  }, []);
  const { status, type: loginType } = userLoginState;
  const intl = (_temp: string) => {
    return useIntl().formatMessage({ id: _temp });
  };
  return (
    <div className={styles.container}>
      <div className={styles.lang}>
        <SelectLang />
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>{intl('login.title')}</span>
            </Link>
          </div>
          {/* <div className={styles.desc}>Backend Management System</div> */}
        </div>
        <div className={styles.main}>
          <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
            <Modal
              title="verify"
              visible={modal.google_verify}
              // onOk={() => handleOk('verify')}
              // onCancel={handleCancel}
              closable={false}
              footer={[
                <Button onClick={() => handleOk('verify')}>{intl('operation.confirm')}</Button>,
              ]}
            >
              <Input onChange={handleVerify}></Input>
            </Modal>
            <Modal
              title="set"
              visible={modal.google_new}
              // onOk={() => handleOk('new')}
              // onCancel={handleCancel}
              closable={false}
              footer={[
                <Button onClick={() => handleOk('new')}>{intl('operation.confirm')}</Button>,
              ]}
            >
              {
                // todo new one should get now code
                console.log('google: ' + google)
              }
              <QRCode value={google} />
              <p>Please Verify Google Authenticator</p>
              <Input onChange={handleVerify}></Input>
            </Modal>
            <Tab key="account" tab="">
              {status === 'error' && loginType === 'account' && !submitting && (
                <LoginMessage content={intl('login.error')} />
              )}
              <Username
                name="username"
                // placeholder="用户名: admin or user"
                placeholder={intl('login.username') + ': admin or user'}
                rules={[
                  {
                    required: true,
                    message: intl('login.enterUsername'),
                  },
                ]}
              />
              <Password
                name="password"
                placeholder={intl('login.password') + ': ant.design'}
                rules={[
                  {
                    required: true,
                    message: intl('login.enterPassword'),
                  },
                ]}
              />
              <div
                style={{
                  width: '100%',
                  height: '40px',
                }}
              >
                <Input
                  style={{
                    height: '100%',
                  }}
                  onChange={(e) => handleCaptcha(e.target.value)}
                  maxLength={4}
                  allowClear
                  placeholder="CAPTCHA"
                  suffix={
                    <img
                      src={captcha.img}
                      onClick={() => {
                        // todo Input clear
                        getCaptcha();
                      }}
                    />
                  }
                ></Input>
                <p style={{ color: '#ff4d4f', fontSize: 14, lineHeight: 1.5715 }}>
                  {warning.captcha}
                </p>
              </div>
            </Tab>
            <Submit loading={submitting}>{intl('login.login')}</Submit>
          </LoginFrom>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
