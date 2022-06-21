import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Select, Space } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { ManuallyAddSpeech } from '../ManuallyAddSpeech/ManuallyAddSpeech';
import styles from './style.module.less';

interface FormBlockProps {
  value?: any[];
  onChange?: (value: any) => void;
}
const FormBlock: React.FC<FormBlockProps> = ({ value = [{ name: 'yuyd' }], onChange }) => {
  console.log(value, onChange);
  const [nodeList, setNodeList] = useState<any[]>([{}]);
  const [blockList, setBlockList] = useState<any[]>([{}, {}]);
  const [currentNode, setCurrentNode] = useState<any>();

  // 配置弹框
  const [speechVisible, setSpeechVisible] = useState(false);

  const handleAddNodeItem = () => {
    setNodeList((nodeList) => [...nodeList, {}]);
  };
  useEffect(() => {
    setBlockList(value);
  }, []);

  const handleAddBlock = () => {
    onChange?.([...value, {}]);
    setBlockList((blockList) => [...blockList, {}]);
  };

  const handleDeleteBlock = (index: number) => {
    const data = [...blockList];
    data.splice(index, 1);
    console.log(data);
    setBlockList(data);
  };

  const setSpeech = (value: string) => {
    console.log(value);
    setSpeechVisible(false);
    console.log(currentNode);
    setCurrentNode((currentNode: any) => ({ ...currentNode!, speech: value }));
  };

  const showSpeechModal = (current: any, index: number, nodeIndex: number) => {
    setSpeechVisible(true);
    setCurrentNode(current);
    console.log(current, index, nodeIndex);
  };

  return (
    <div>
      {blockList?.map((item, index) => {
        return (
          <div className={styles.formBlock} key={'block' + index}>
            <div className={classNames(styles.blockTitle, 'flex justify-between align-center')}>
              <span>序号 {index + 1}</span>
              <Button
                className={styles.blockDelete}
                type="link"
                disabled={index === 0}
                onClick={() => handleDeleteBlock(index)}
              >
                删除
              </Button>
            </div>
            <div className="ph20">
              <div className={classNames(styles.blockAttr, 'flex align-center')}>
                <div className={classNames(styles.nodeType, styles.attrItem, 'flex align-center')}>
                  <label className={styles.attrItemLabel} htmlFor="">
                    节点类别:
                  </label>
                  <Select className={styles.attrItemContent}>
                    <Select.Option value={'date'}>日历类</Select.Option>
                    <Select.Option value={'1'}>节日类</Select.Option>
                    <Select.Option value={'2'}>新闻类</Select.Option>
                  </Select>
                </div>
                <div className={classNames(styles.attrItem, 'flex align-center')}>
                  <label className={styles.attrItemLabel} htmlFor="">
                    选择日期:
                  </label>
                  <Input className={styles.attrItemContent}></Input>
                </div>

                <div className={classNames(styles.attrItem, 'flex align-center')}>
                  <label className={styles.attrItemLabel} htmlFor="">
                    节点名称:
                  </label>
                  <span>{'10月1日(国庆节)'}</span>
                </div>
              </div>

              <div className={styles.taskNode}>
                <ul className={classNames(styles.nodeTitle, 'flex justify-between')}>
                  <li className={styles.nodeCol}>配置节点规则</li>
                  <li className={styles.nodeCol}>触达方式</li>
                  <li className={styles.ruleCol}>动作规则区</li>
                  <li className={styles.speechCol}>手工自定义话(点击可修改)</li>
                  <li className={styles.timeCol}>建议推送时间</li>
                  <li className={classNames(styles.operateCol, 'flex justify-center')}>操作</li>
                </ul>
                <ul className={styles.nodeBody}>
                  {nodeList.map((node, nodeIndex: number) => {
                    return (
                      <li className={classNames(styles.nodeItem, 'flex justify-between')} key={nodeIndex}>
                        <div className={styles.nodeCol}>
                          <Select placeholder="待输入">
                            <Select.Option value={1}>10月1日国庆节</Select.Option>
                          </Select>
                        </div>
                        <div className={styles.nodeCol}>
                          <Select placeholder="待输入">
                            <Select.Option value={1}>10月1日国庆节</Select.Option>
                          </Select>
                        </div>
                        <div className={styles.ruleCol}>
                          <Button type="link">配置</Button>
                        </div>
                        <div className={styles.speechCol}>
                          <Input
                            placeholder="点击输入文本"
                            value={node.speech}
                            onClick={() => showSpeechModal()}
                            readOnly
                          ></Input>
                        </div>
                        <div className={classNames(styles.timeCol)}>09：00</div>
                        <div className={styles.operateCol}>
                          <Space>
                            <Button type="link">查看</Button>
                            <Button type="link">删除</Button>
                            <Button type="link">复制</Button>
                          </Space>
                        </div>
                      </li>
                    );
                  })}
                  <li className={styles.nodeItem}>
                    <Button shape="round" ghost type="primary" onClick={handleAddNodeItem}>
                      新增
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      <Button
        className="ml20"
        icon={<PlusOutlined />}
        type="primary"
        shape="round"
        ghost
        onClick={() => handleAddBlock()}
        size="large"
      >
        新增节点
      </Button>

      {/* 添加话术modal */}
      <ManuallyAddSpeech
        visible={speechVisible}
        speech="请输入话术"
        onOk={setSpeech}
        onCancel={() => setSpeechVisible(false)}
      />
    </div>
  );
};

export default FormBlock;
