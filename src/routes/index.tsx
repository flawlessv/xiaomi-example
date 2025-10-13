import { RouteConfig } from '../components/Layout/MainLayout';

/**
 * 导航菜单配置
 * 这里的配置会显示在左侧导航栏中
 * 添加新菜单项时，只需在这里添加即可
 */
export const routesConfig: RouteConfig[] = [
  {
    path: '/',
    label: '首页',
    icon: '🏠',
  },
  {
    path: '/table',
    label: '数据表格',
    icon: '📊',
  },
  {
    path: '/about',
    label: '关于',
    icon: 'ℹ️',
  },
  // 在这里添加更多导航项
  // 例如：
  // {
  //   path: '/new-module',
  //   label: '新模块',
  //   icon: '🎯',
  // },
];

