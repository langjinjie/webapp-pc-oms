import { Button, Input, Select, Space } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import styles from './style.module.less';

interface FormBlockProps {
  value?: any[];
  onChange?: (value: any) => void;
}
const FormBlock: React.FC<FormBlockProps> = ({ value = [{ name: 'yuyd' }], onChange }) => {
  console.log(value, onChange);
  const [nodeList] = useState<any[]>([{}]);

  return (
    <div>
      {value?.map((item, index) => {
        return (
          <div className={styles.formBlock} key={'block' + index}>
            <div className={classNames(styles.blockTitle, 'flex justify-between align-center')}>
              <span>序号一</span>
              <Button className={styles.blockDelete} type="link" disabled>
                删除
              </Button>
            </div>
            <div className="ph20">
              <div className={styles.blockAttr}>
                <div>
                  <label htmlFor="">节点类别</label>
                  <Select>
                    <Select.Option value={'date'}>日历类</Select.Option>
                    <Select.Option value={'1'}>节日类</Select.Option>
                    <Select.Option value={'2'}>新闻类</Select.Option>
                  </Select>
                </div>
                <div>
                  <label htmlFor="">选择日期</label>
                  <Input></Input>
                </div>

                <div>
                  <label htmlFor="">节点名称</label>
                  {'10月1日(国庆节)'}
                </div>
              </div>

              <div className={styles.taskNode}>
                <ul className={classNames(styles.nodeTitle, 'flex justify-between')}>
                  <li>配置节点规则</li>
                  <li>触达方式</li>
                  <li>动作规则区</li>
                  <li>手工自定义话(点击可修改)</li>
                  <li>建议推送时间</li>
                  <li>操作</li>
                </ul>
                <ul className={styles.nodeBody}>
                  {nodeList.map((node, index) => {
                    return (
                      <>
                        <li className={classNames(styles.nodeItem, 'flex justify-between')} key={index}>
                          <div>
                            <Select placeholder="待输入">
                              <Select.Option value={1}>10月1日国庆节</Select.Option>
                            </Select>
                          </div>
                          <div>
                            <Select placeholder="待输入">
                              <Select.Option value={1}>10月1日国庆节</Select.Option>
                            </Select>
                          </div>
                          <div>
                            <Button type="link">配置</Button>
                          </div>
                          <div>
                            <Input placeholder="点击输入文本"></Input>
                          </div>
                          <div>09：00</div>
                          <div>
                            <Space>
                              <Button type="link">查看</Button>
                              <Button type="link">删除</Button>
                              <Button type="link">复制</Button>
                            </Space>
                          </div>
                        </li>
                        <li className={styles.nodeItem}>
                          <Button shape="round" ghost type="primary">
                            新增
                          </Button>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormBlock;
