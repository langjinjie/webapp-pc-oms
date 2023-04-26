import React from 'react';

interface NgTreeProps {
  dataSource: any[];
  parentDatas: any[];
}
interface NgTreeItemProps {
  children: any[];
  dataLevel: any[];
}

const NgTree: React.FC<NgTreeProps> = ({ dataSource, parentDatas }) => {
  const NgTreeItem: React.FC<NgTreeItemProps> = (props: any) => {
    return (
      <div>
        <button>{props.label}</button>
        {props.children?.length > 0 && <NgTree dataSource={props.children} parentDatas={props.dataLevel} />}
      </div>
    );
  };

  return (
    <div>
      {dataSource.map((item: NgTreeItemProps, index: number) => (
        <NgTreeItem key={index + '1'} {...item} dataLevel={[...parentDatas, item]} />
      ))}
    </div>
  );
};

export default NgTree;
