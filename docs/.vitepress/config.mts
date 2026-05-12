import {defineConfig} from 'vitepress';

export default defineConfig({
  title: 'Shopify Tanstack',
  description: 'Documentation for Shopify App TanStack package',
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      {text: 'Guide', link: '/guide/overview'},
      {text: 'Migration', link: '/guide/migration'},
      {
        text: 'GitHub',
        link: 'https://github.com/yanuaraditia/shopify-app-tanstack',
      },
    ],
    sidebar: [
      {
        text: 'Documentation',
        items: [
          {text: 'Overview', link: '/guide/overview'},
          {text: 'Project Structure', link: '/guide/project-structure'},
          {text: 'Server API', link: '/guide/server-api'},
          {text: 'React API', link: '/guide/react-api'},
          {text: 'Authentication Flows', link: '/guide/authentication-flows'},
          {text: 'Testing', link: '/guide/testing'},
          {text: 'Migration', link: '/guide/migration'},
        ],
      },
    ],
  },
});
