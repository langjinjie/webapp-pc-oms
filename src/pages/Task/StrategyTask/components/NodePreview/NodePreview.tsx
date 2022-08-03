import React from 'react';
import { Preview } from 'src/components';
import { Drawer } from 'antd';
import style from './style.module.less';

export interface IValue {
  nodeRuleCode: string; // 节点动作规则编号
  nodeRuleName: string; // 节点规则名称
  contentType: number; // 动作规则类型: 1-文章、2-海报、3-产品、4-活动、5-销售宝典话术
  logicName: string; // 触发逻辑
  wayName: string; // 触达方式
  speechcraft: string; // 自定义话术
  pushTime: string;
  actionRule: any;
  [prop: string]: string;
}

interface INodePreviewProps {
  visible: boolean;
  title?: string;
  onClose?: () => void;
  value?: IValue;
  maskClosable?: boolean;
}

const NodePreview: React.FC<INodePreviewProps> = ({ visible, title, onClose, value }) => {
  const contentType2Name = ['发文章', '发海报', '发产品', '发活动', '发营销宝典话术'];
  // 关闭弹窗
  const onCloseHandle = () => {
    onClose?.();
  };
  return (
    <Drawer
      maskClosable={true}
      className={style.drawerWrap}
      width={490}
      visible={visible}
      title={title || '节点动作规则详情'}
      onClose={onCloseHandle}
    >
      {/* <div className={style.infoItem}>
        <div className={style.key}>节点动作规则编号：</div>
        <div className={style.value}>{value?.nodeRuleCode}</div>
      </div> */}
      <div className={style.infoItem}>
        <div className={style.key}>节点规则名称：</div>
        <div className={style.value}>{value?.nodeRuleName}</div>
      </div>
      <div className={style.infoItem}>
        <div className={style.key}>动作规则名称：</div>
        <div className={style.value}>{contentType2Name[(value?.actionRule?.contentType || 0) - 1]}</div>
      </div>
      {/* <div className={style.infoItem}>
        <div className={style.key}>触发逻辑：</div>
        <div className={style.value}>{value?.logicName}</div>
      </div> */}
      <div className={style.infoItem}>
        <div className={style.key}>触达形式：</div>
        <div className={style.value}>{value?.wayName}</div>
      </div>
      <div className={style.preItem}>
        <div className={style.key}>
          发送内容预览：
          {value?.actionRule?.category
            ? (
            <span
              dangerouslySetInnerHTML={{
                __html: `按照 <span class="italic"> ${value.actionRule.category} </span> 最新发布的内容`
              }}
            ></span>
              )
            : null}
        </div>

        <div className={style.value}>
          <Preview value={value} isMoment={value?.wayName === '群发朋友圈' || value?.wayCode === 'batch_moment'} />
        </div>
      </div>
    </Drawer>
  );
};
export default NodePreview;
