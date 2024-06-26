import classNames from 'classnames';
import React from 'react';
import NgUpload from '../../Components/Upload/Upload';
import styles from './style.module.less';

interface PictureCardProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}
export const PictureCard: React.FC<PictureCardProps> = ({ value, onChange }) => {
  const handleChange = (str: string, index: number) => {
    const copyValue = [...value!];
    copyValue.splice(index, 1, str);
    onChange?.(copyValue);
  };
  return (
    <div className={classNames(styles.pictureList, 'flex')}>
      {value?.map((item, index) => {
        return (
          <NgUpload showDeleteBtn value={item} key={index} onChange={(value) => handleChange(value, index)}></NgUpload>
        );
      })}
    </div>
  );
};
