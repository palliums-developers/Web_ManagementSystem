import { defineConfig, useIntl } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes'
// const intl = (_temp: string) => {
//   return useIntl().formatMessage({ id: _temp });
// }

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // name: 'Ant Design Pro',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    default: 'en-US',
    antd: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  routes,
  proxy: proxy,
  manifest: {
    basePath: '/',
  },
});
