// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, message, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, SelectLang, useModel, useIntl } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import { LoginParamsType, accountLogin, getImgCaptcha } from '@/services/login';
import Footer from '@/components/Footer';
import LoginFrom from './components/Login';
import styles from './style.less';
import login from '@/locales/zh-CN/login';

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
      window.location.href = '/welcome';
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
  const getCaptcha = async () => {
    const temp = await getImgCaptcha();
    setCaptcha(temp);
  };
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await accountLogin({ ...values, type });
      if (msg.status === 'ok') {
        // let temp = intl('login.success')
        message.success('Login Success!');
        sessionStorage.setItem('JWT', msg.token);
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
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
