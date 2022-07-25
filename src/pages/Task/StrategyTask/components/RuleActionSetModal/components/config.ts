import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export const setSearchCols = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'name',
      type: 'input',
      label: '海报名称',
      placeholder: '海报名称',
      width: 150
    },

    {
      name: 'typeIds',
      type: 'cascader',
      fieldNames: { label: 'name', value: 'typeId', children: 'childs' },
      label: '分类',
      width: 160,
      cascaderOptions: options
    }
  ];
};
