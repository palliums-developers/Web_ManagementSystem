// import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { Link, SelectLang, useModel, useIntl } from 'umi';
import { getPageQuery } from '@/utils/utils';
import logo from '@/assets/logo.svg';
import { LoginParamsType, accountLogin } from '@/services/login';
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
  console.log(redirect)
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
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const Login: React.FC<{}> = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginStateType>({});
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const msg = await accountLogin({ ...values, type });
      if (msg.status === 'ok') {
        // let temp = intl('login.success')
        message.success('Login Success!');
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

  const { status, type: loginType } = userLoginState;
  const intl = (_temp: string) => {
    return useIntl().formatMessage({ id: _temp });
  }
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
                placeholder={intl('login.password') + ": ant.design"}
                rules={[
                  {
                    required: true,
                    message: intl('login.enterPassword'),
                  },
                ]}
              />
            </Tab>
            <Submit loading={submitting}>{intl('login.login')}</Submit>
          </LoginFrom>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
