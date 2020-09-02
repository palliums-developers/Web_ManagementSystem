import { Settings as LayoutSettings } from '@ant-design/pro-layout';

export default {
  navTheme: 'dark',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'Violas',
  pwa: false,
  iconfontUrl: '',
  "headerRender": false,
  "footerRender": false,
} as LayoutSettings & {
  pwa: boolean;
};
