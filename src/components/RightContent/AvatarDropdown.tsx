import React, { useCallback, useState } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Modal, Button } from 'antd';
import { history, useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { outLogin } from '@/services/login';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import useModal from 'antd/lib/modal/useModal';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  await localStorage.removeItem('notification');
  await localStorage.removeItem('edit');
  await sessionStorage.clear();
  await outLogin();
  const { redirect } = getPageQuery();
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/login' && !redirect) {
    history.replace({
      pathname: '/login',
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
};
const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  // console.log(useModel('@@initialState').initialState);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [modal_state, setModal_state] = useState(false);
  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState({ ...initialState, currentUser: undefined });
        loginOut();
        return;
      }
      history.push(`/account/${key}`);
    },
    [],
  );
  const showModal = async () => {
    await localStorage.removeItem('notification');
    await localStorage.removeItem('edit');
    await sessionStorage.clear();
    setModal_state(true);
    // setInitialState({ ...initialState, currentUser: undefined });
  };
  const handleOK = async () => {
    // await outLogin();
    const { redirect } = getPageQuery();
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/login' && !redirect) {
      history.replace({
        pathname: '/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
    handleCancel();
  };
  const handleCancel = () => {
    setModal_state(false);
  };
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;
  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
    // <LogoutOutlined/>
  );
  return (
    // <HeaderDropdown overlay={menuHeaderDropdown}>
    //   <span className={`${styles.action} ${styles.account}`}>
    //     <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
    //     <span className={`${styles.name} anticon`}>{currentUser.name}</span>
    //   </span>
    // </HeaderDropdown>
    <>
      <Modal
        closable={false}
        visible={modal_state}
        onCancel={handleCancel}
        onOk={handleOK}
        footer={[]}
      >
        <h1>You are Logout</h1>
        <Button type="primary" onClick={handleOK}>
          Confirm
        </Button>
      </Modal>
      <span style={{ cursor: 'pointer' }} onClick={showModal}>
        Logout
      </span>
    </>
  );
};

export default AvatarDropdown;
