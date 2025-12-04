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
    path: '/virtual-list',
    label: '虚拟滚动',
    icon: '🚀',
  },
  {
    path: '/css-selectors',
    label: 'CSS选择器',
    icon: '🎨',
  },
  {
    path: '/classic-layouts',
    label: '经典布局',
    icon: '📐',
  },
  {
    path: '/dom-export-image',
    label: 'DOM导出图片',
    icon: '🖼️',
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

