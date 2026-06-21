import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'dark',
    colorPrimary: '#d1385c',
    colorSecondary: '#d1385c',
    appBg: '#000000',
    appContentBg: '#000000',
    appBorderColor: '#1a1a1a',
    appBorderRadius: 8,
    textColor: '#e0e0e0',
    textInverseColor: '#ffffff',
    barTextColor: '#999999',
    barHoverColor: '#d1385c',
    barSelectedColor: '#d1385c',
    barBg: '#000000',
    inputBg: '#0a0a0a',
    inputBorder: '#1a1a1a',
    inputTextColor: '#e0e0e0',
    brandTitle: '@onnechat/ui',
    brandImage: 'https://onne.chat/favicon.ico',
  }),
});
