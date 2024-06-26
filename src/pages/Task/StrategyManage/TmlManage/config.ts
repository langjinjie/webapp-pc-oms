import { SearchCol } from 'src/components';

export const searchCols: SearchCol[] = [
  {
    name: 'tplName',
    type: 'input',
    label: '策略任务名称',
    width: '240px',
    placeholder: '待输入'
  }
];

export type TplType = {
  displayCoverImg: string;
  resultDesc: string;
  sceneDesc: string;
  taskDesc: string;
  tplCode: string;
  tplId: string;
  tplName: string;
};
