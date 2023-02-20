import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const searchColsFun = (): SearchCol[] => [
  {
    type: 'input',
    label: '关键词搜索',
    name: 'videoId',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '视频标题',
    name: 'videoName',
    placeholder: '请输入'
  }
];
