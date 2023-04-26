import React, { useEffect, useState } from 'react';
import { NgModal, Icon } from 'src/components';
import { Radio, RadioChangeEvent } from 'antd';
import { requestGetStaffTagList } from 'src/apis/orgManage';
import { numberToChinese } from 'src/utils/base';
import style from './style.module.less';
import classNames from 'classnames';

interface IUserTagModal {
  value?: { ruleType: number; tagValues: string; tagName: string }[];
  onChange?: (value: { ruleType: number; tagValues: string }[]) => void;
}

const StaffTagModal: React.FC<IUserTagModal> = ({ value, onChange }) => {
  const [modalParam, setModalParam] = useState<{ visible: boolean }>({ visible: false });
  const [staffTagList, setStaffTagList] = useState<
    { ruleType: number; tagName: string; tagValues: string; sortId: number }[]
  >([]);
  const [selectedList, setSelectedList] = useState<{ ruleType: number; tagValues: string; tagName: string }[]>([]);
  const [radioVal, setRadioVal] = useState(0);

  const onReset = () => {
    setSelectedList([]);
    setRadioVal(0);
  };
  const onOk = () => {
    onChange?.(radioVal ? selectedList : []);
    setModalParam({ visible: false });
  };
  const onCancel = () => {
    setModalParam({ visible: false });
  };
  const radioOnChange = (event: RadioChangeEvent) => {
    setRadioVal(event.target.value);
  };
  const clearTags = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.stopPropagation();
    onChange?.([]);
  };
  // 选择人员标签
  const chooseStaffTag = () => {
    setModalParam({ visible: true });
  };
  // 获取标签列表
  const getStaffTagList = async () => {
    const res = await requestGetStaffTagList({});

    if (res) {
      const arr = (res.list as any[]).sort(function (a: any, b: any) {
        return a.sortId - b.sortId; // 升序
      });
      setStaffTagList(arr);
    }
  };
  // 选择人员标签
  const chooseTag = (
    item: { ruleType: number; tagName: string; tagValues: string; sortId: number },
    tagVal: string
  ) => {
    let list: any[] = [...selectedList];
    // 判断是否有同类型的标签
    const selectedItem = selectedList.find(
      (findItem) => findItem.ruleType === item.ruleType // && findItem.tagValues.split(',').includes(tagVal)
    );
    if (selectedItem) {
      // 判断是否同类型的标签是否有相同的标签
      if (selectedItem.tagValues.split(';').includes(tagVal)) {
        list = list.map((mapItem) => {
          if (mapItem.ruleType === item.ruleType && mapItem.tagValues.split(';').includes(tagVal)) {
            return {
              ...mapItem,
              tagValues: mapItem.tagValues.replace(tagVal, '').replace(/^(\s|;)+|(\s|;)+$/g, '')
            };
          } else {
            return { ...mapItem };
          }
        });
      } else {
        list = list.map((mapItem) => {
          if (mapItem.ruleType === item.ruleType) {
            return { ...mapItem, tagValues: mapItem.tagValues + ';' + tagVal };
          } else {
            return { ...mapItem };
          }
        });
      }
    } else {
      list = [...list, { ...item, tagValues: tagVal }];
    }

    setSelectedList(list.filter((filterItem) => filterItem.tagValues));
  };
  // 清除单个标签选择
  const delSingleTag = (ruleType: number) => {
    onChange?.(value?.filter((item) => item.ruleType !== ruleType) || []);
  };
  useEffect(() => {
    getStaffTagList();
  }, []);
  useEffect(() => {
    if (modalParam.visible) {
      setSelectedList(value || []);
      value?.length && setRadioVal(1);
    } else {
      onReset();
    }
  }, [modalParam.visible]);
  return (
    <div className={style.wrap}>
      <div className={style.chooseTagList} onClick={chooseStaffTag}>
        {!value?.length && <span className={style.placeholder}>请选择</span>}
        {value?.map((item) => (
          <div key={item.ruleType} className={style.tagItem}>
            {item.tagName + '：' + item.tagValues}
            <Icon className={style.delItem} name="icon_common_Line_Close" onClick={() => delSingleTag(item.ruleType)} />
          </div>
        ))}
        {!value?.length || <Icon name="guanbi" className={style.clear} onClick={clearTags} />}
      </div>
      <NgModal
        className={style.modalWrap}
        visible={modalParam.visible}
        title="选择人员标签"
        onOk={onOk}
        onCancel={onCancel}
        maskClosable={false}
      >
        <Radio.Group onChange={radioOnChange} value={radioVal}>
          <Radio value={0}>不配置</Radio>
          <Radio value={1}>配置</Radio>
        </Radio.Group>
        {!radioVal || (
          <div className={style.tagWrap}>
            {staffTagList.map((item, index: number) => (
              <div className={style.tagItem} key={item.sortId}>
                <div className={style.tagName}>
                  标签{numberToChinese(index + 1)}：{item.tagName}
                </div>
                <div className={style.tagValWrap}>
                  {(item.tagValues || '')
                    .split(';')
                    .filter((filterItem) => filterItem)
                    .map((mapItem) => (
                      <div
                        key={mapItem}
                        className={classNames(style.tagValItem, {
                          [style.selected]: selectedList.find(
                            (findItem) =>
                              findItem.ruleType === item.ruleType && findItem.tagValues.split(';').includes(mapItem)
                          )
                        })}
                        onClick={() => chooseTag(item, mapItem)}
                      >
                        {mapItem}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </NgModal>
    </div>
  );
};
export default StaffTagModal;
