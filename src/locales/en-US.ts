import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menu from './en-US/menu';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import login from './en-US/login';
import account from './en-US/account';
import user from './en-US/userManagement';
import role from './en-US/roleManagement';
import operation from './en-US/operation';
import systemLog from './en-US/systemLog';
import bank from './en-US/bank'

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...login,
  ...account,
  ...user,
  ...role,
  ...operation,
  ...systemLog,
  ...bank
};
