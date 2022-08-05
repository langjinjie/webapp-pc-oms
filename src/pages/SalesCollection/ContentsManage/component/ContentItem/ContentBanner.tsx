import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import { AuthBtn, Icon } from 'src/components';
import { ICatalogItem, IEditOrAddCatalogParam, IFirmModalParam } from 'src/utils/interface';
import { getCategoryList, requestSaveSortCatalog, requestDeleteCatalog } from 'src/apis/salesCollection';
import { useHistory } from 'react-router';
import { catalogLastLeve } from 'src/utils/commonData';
import { Context } from 'src/store';

import classNames from 'classnames';
import style from './style.module.less';
import { Button, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

interface IContentBannerProps {
  parentId: string;
  catalog: ICatalogItem;
  currentContents: string;
  isHiddenMoveUp: boolean;
  isHiddenMoveDown: boolean;
  isHiddenDelete?: boolean;
  setCurrentContents: (param: string) => void;
  setEditOrAddCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setFirmModalParam: (param: IFirmModalParam) => void;
  setEditOrAddLastCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setParentChildrenList: (param: ICatalogItem[]) => void;
  parentCatalog?: any;
}

const ContentBanner: React.FC<IContentBannerProps> = ({
  parentId,
  catalog,
  isHiddenMoveUp,
  isHiddenMoveDown,
  isHiddenDelete = false,
  setCurrentContents,
  currentContents,
  setEditOrAddCatalogParam,
  setFirmModalParam,
  setEditOrAddLastCatalogParam,
  setParentChildrenList,
  parentCatalog
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [childrenList, setChildrenList] = useState<ICatalogItem[]>([]);
  const [currentContent, setCurrentContent] = useState('');
  const history = useHistory();

  // 获取当前目录的子目录
  const getCurrentChildrenList = async () => {
    const res = await getCategoryList({ corpId, sceneId: catalog.sceneId, catalogId: catalog.catalogId });
    setChildrenList(res);
  };

  // 获取父级的子目录
  const getParentChildrenList = async () => {
    const res = await getCategoryList({
      corpId,
      sceneId: parentId === '0' ? 0 : catalog.sceneId,
      catalogId: parentId === '0' ? undefined : parentId
    });
    setParentChildrenList(res);
  };

  // 点击目录
  const contentsClickHandle = async () => {
    if (catalog.lastLevel) return;
    if (currentContents === catalog.catalogId) {
      setCurrentContents('');
      setCurrentContent('');
    } else {
      setCurrentContents(catalog.catalogId);
      getCurrentChildrenList();
    }
  };
  // 编辑
  const editClickHandle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (catalog.lastLevel) {
      setEditOrAddLastCatalogParam({ title: '编辑', catalog, parentId, visible: true, getParentChildrenList });
    } else {
      setEditOrAddCatalogParam({ visible: true, title: '编辑', catalog, parentId, getParentChildrenList });
    }
  };
  // 新增
  const addClickHandle = (parentCatalog: ICatalogItem, parentId: string) => {
    const catalog = { ...parentCatalog, level: parentCatalog.level + 1 };
    // 该级目录是否是最后一级目录
    if (catalog.level >= catalogLastLeve[parentCatalog.sceneId - 1]) {
      catalog.lastLevel = 1;
      catalog.level = catalogLastLeve[parentCatalog.sceneId - 1]; // 修正目录
      setEditOrAddLastCatalogParam({
        title: '新增',
        catalog,
        parentId,
        visible: true,
        getParentChildrenList: getCurrentChildrenList
      });
    } else {
      setEditOrAddCatalogParam({
        visible: true,
        title: '新增',
        catalog,
        parentId,
        getParentChildrenList: getCurrentChildrenList
      });
    }
  };
  const firmModalOnOk = async (type: number) => {
    const res = await requestSaveSortCatalog({
      corpId,
      sceneId: catalog.sceneId,
      catalogId: catalog.catalogId,
      sort: type
    });
    if (res) {
      message.success(`目录${type === -1 ? '上移' : '下移'}成功`);
      await setFirmModalParam({ visible: false, title: '', content: '' });
      getParentChildrenList();
    }
  };
  // 上/下移 -1上移 1下移
  const moveClickHandle = (e: React.MouseEvent, type: number, hidden: boolean) => {
    e.stopPropagation();
    if (hidden) return;
    setFirmModalParam({
      title: type === -1 ? '上移' : '下移' + '提醒',
      content: `确定${type === -1 ? '上移' : '下移'}目录“${catalog.name}”吗？`,
      visible: true,
      onOk: async () => {
        await firmModalOnOk(type);
      },
      onCancel: () => {
        setFirmModalParam({ title: '', content: '', visible: false });
      }
    });
  };
  const deleFirmModalOnOk = async () => {
    const res = await requestDeleteCatalog({ corpId, sceneId: catalog.sceneId, catalogId: catalog.catalogId });
    if (res) {
      message.success('删除成功');
      await setFirmModalParam({ title: '', content: '', visible: false });
      getParentChildrenList();
    }
  };
  // 删除
  const delClickHandle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFirmModalParam({
      title: '删除提醒',
      content: `确定删除目录“${catalog.name}”吗？`,
      visible: true,
      onOk: async () => {
        await deleFirmModalOnOk();
      },
      onCancel: () => {
        setFirmModalParam({ title: '', content: '', visible: false });
      }
    });
  };
  useEffect(() => {
    return () => {
      setCurrentContent('');
    };
  }, []);
  const transTree = (data: any[]) => {
    const result: any[] = [];
    const map = {};
    if (!Array.isArray(data)) {
      // 验证data是不是数组类型
      return [];
    }
    data.forEach((item: any) => {
      // 建立每个数组元素id和该对象的关系
      // @ts-ignore
      map[item.id] = item; // 这里可以理解为浅拷贝，共享引用
    });
    data.forEach((item) => {
      // @ts-ignore
      const parent = map[item.parentId]; // 找到data中每一项item的爸爸
      if (parent) {
        // 说明元素有爸爸，把元素放在爸爸的children下面
        (parent.children || (parent.children = [])).unshift(item);
      } else {
        // 说明元素没有爸爸，是根节点，把节点push到最终结果中
        result.push(item); // item是对象的引用
      }
    });
    return result; // 数组里的对象和data是共享的
  };

  // 查看&新增话术
  const navigateToSpeech = async (PageType: 'list' | 'edit') => {
    // TODO 针对树形结构类目回显数据处理
    const map = await Promise.all(
      parentCatalog.map(async (item: any, index: number) => {
        const children = await getCategoryList({ sceneId: item.sceneId, catalogId: item.catalogId });
        const filterChildren: any[] = [];
        if (children.length > 0) {
          children.forEach((item: any) => {
            if (item.lastLevel === 0) {
              item.isLeaf = false;
            }
            if (item.catalogId !== parentCatalog[index + 1].catalogId) {
              filterChildren.push(item);
            }
          });
        }
        return Promise.resolve({
          ...item,
          id: index + 1,
          parentId: index,
          isLeaf: false,
          children: filterChildren
        });
      })
    );
    const treeData = transTree(map);
    localStorage.setItem('catalogTree', JSON.stringify(treeData));
    const res = parentCatalog.reduce((pre: any, next: any) => {
      pre.push(next.catalogId);
      return pre;
    }, []);
    if (PageType === 'list') {
      history.push(`/speechManage?catalog=${res.join(',')}`);
    } else {
      sessionStorage.setItem('backRoute', '/contentsManage');
      history.push(`/speechManage/edit?catalog=${res.join(',')}`);
    }
  };
  // 同步话术
  const syncSpeechHandle = (e: MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <>
      <div
        className={classNames(
          style.bannerWrap,
          { [style.isChildrenContents]: !!catalog.level },
          { [style.isLastContents]: !!catalog.lastLevel }
        )}
        onClick={contentsClickHandle}
      >
        {!!catalog.lastLevel || (
          <div
            className={classNames(style.icon, {
              [style.active]: currentContents === catalog.catalogId
            })}
          />
        )}
        <div className={classNames(style.name, { [style.empty]: !catalog.onlineContentNum })}>{catalog.name}</div>
        <div
          className={classNames(style.info, { [style.empty]: !catalog.onlineContentNum })}
        >{`（上架${catalog.onlineContentNum}/全部${catalog.contentNum}）`}</div>
        <div className={style.edit}>
          {catalog.lastLevel === 1 && (
            <>
              <AuthBtn path="/viewSpeech">
                <Button type="link" onClick={() => navigateToSpeech('list')}>
                  <EyeOutlined />
                  查看话术
                </Button>
              </AuthBtn>
              <AuthBtn path="/addSpeech">
                <Button type="link" onClick={() => navigateToSpeech('edit')}>
                  <Icon className={'svgIcon'} name="tianjiafenzu" />
                  新增话术
                </Button>
              </AuthBtn>
            </>
          )}
          <Button type="link" onClick={syncSpeechHandle}>
            同步话术
          </Button>
          <AuthBtn path="/edit">
            <Button type="link" onClick={editClickHandle}>
              <Icon className={'svgIcon'} name="bianji" />
              编辑
            </Button>
          </AuthBtn>
          <AuthBtn path="/sort">
            <Button
              type="link"
              className={classNames({ is_disabled: isHiddenMoveUp })}
              onClick={(e) => moveClickHandle(e, -1, isHiddenMoveUp)}
            >
              <Icon className={'svgIcon'} name="shangyi" />
              上移
            </Button>
            <Button
              type="link"
              className={classNames({ is_disabled: isHiddenMoveDown })}
              onClick={(e) => moveClickHandle(e, 1, isHiddenMoveDown)}
            >
              <Icon className={'svgIcon'} name="xiayi" />
              下移
            </Button>
          </AuthBtn>
          <AuthBtn path="/delete">
            {!catalog.level || isHiddenDelete || (
              <Button type="link" onClick={delClickHandle}>
                <Icon className={'svgIcon'} name="shanchu" />
                删除
              </Button>
            )}
          </AuthBtn>
        </div>
      </div>
      <div className={style.children}>
        {currentContents === catalog.catalogId && (
          <>
            {childrenList.map((item, index) => (
              <div key={item.catalogId}>
                <ContentBanner
                  parentId={catalog.catalogId}
                  parentCatalog={[...parentCatalog, item]}
                  catalog={item}
                  isHiddenMoveUp={childrenList.length === 1 || index === 0}
                  isHiddenMoveDown={childrenList.length === 1 || index === childrenList.length - 1}
                  isHiddenDelete={childrenList.length === 1}
                  currentContents={currentContent}
                  setCurrentContents={setCurrentContent}
                  setEditOrAddCatalogParam={setEditOrAddCatalogParam}
                  setFirmModalParam={setFirmModalParam}
                  setEditOrAddLastCatalogParam={setEditOrAddLastCatalogParam}
                  setParentChildrenList={setChildrenList}
                />
              </div>
            ))}
            <AuthBtn path="/add">
              <span className={classNames(style.add)} onClick={() => addClickHandle(catalog, catalog.catalogId)}>
                <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                新增
              </span>
            </AuthBtn>
          </>
        )}
      </div>
    </>
  );
};
export default ContentBanner;
