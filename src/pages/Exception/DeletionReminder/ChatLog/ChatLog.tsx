import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { DatePicker, Input, Button, message, Spin, Radio, Pagination, Tag, Tooltip, Modal, Image } from 'antd';
import { requesrtGetSingleChatList } from 'src/apis/exception';
import moment, { Moment } from 'moment';
import { Icon, BreadCrumbs } from 'src/components';
import { copy, getQueryParam } from 'tenacity-tools';
import { useLocation } from 'react-router-dom';
import { TOKEN_KEY } from 'src/utils/config';
import { IDelStaffList } from 'src/pages/Exception/DeletionReminder/Config';
import AudioPlay from './AudioPlay';
import style from './style.module.less';
import classNames from 'classnames';

const chatLog: React.FC = () => {
  const [filterDateRange, setfilterDateRange] = useState<[Moment | null, Moment | null]>([
    moment().subtract(1, 'months'),
    moment()
  ]);
  const [filterKey, setFilterKey] = useState('');
  const [clientInfo, setClientInfo] = useState<IDelStaffList>();
  const [isChatListLoading, setIsChatListLoading] = useState(false);
  const [filterChatType, setFilterChatType] = useState(0);
  const [audioModalVisible, setAudioModalVisible] = useState(false);
  const [audioSource, setAudioSource] = useState('');
  const [chatList, setChatList] = useState<{ total: number; list: any[] }>({ total: 0, list: [] });
  const [voiceModal, setVoiceModal] = useState(false);
  const [voiceSrc, setVoiceSrc] = useState('');
  const [voiceType, setVoiceType] = useState('');
  const [pagination, setPagination] = useState<{ pageNum: number; pageSize: number }>({
    pageNum: 1,
    pageSize: 10
  });

  const location = useLocation();

  const myToken = useMemo(() => {
    return window.localStorage.getItem(TOKEN_KEY);
  }, []);

  // 获取token

  // 时间范围
  const onChangeDate = (date: any) => {
    setfilterDateRange(date);
  };

  // 关键词
  const handleChangeKey = (ev: ChangeEvent<HTMLInputElement>) => {
    setFilterKey(ev.target.value);
  };

  // 获取外部联系人信息
  const getClientInfo = () => {
    const { clientInfo } = location.state as { clientInfo: IDelStaffList };
    setClientInfo(clientInfo);
  };

  // 获取私聊记录
  const fetchSingleChat = async (paream?: { [key: string]: any }) => {
    setIsChatListLoading(true);
    const { partnerId, userId } = getQueryParam();
    // @ts-ignore
    const fromDate = filterDateRange?.[0] ? filterDateRange?.[0].format('YYYY-MM-DD') : '';
    // @ts-ignore
    const toDate = filterDateRange?.[1] ? filterDateRange?.[1].format('YYYY-MM-DD') : '';
    // 除了翻页 其他任何动作触发的请求数据都请求第一页
    const data = {
      // 日期
      beginTime: fromDate,
      endTime: toDate,
      // 关键词
      queryContent: filterKey,
      // 私聊者
      // userId: 'LangJinJie',
      userId,
      // 私聊对象
      // partnerId: 'LiuJunJie',
      partnerId,
      // 聊天记录类型
      msgType: filterChatType,
      pageSize: pagination.pageSize,
      pageNum: pagination.pageNum
    };
    // 获取聊天记录
    const res = await requesrtGetSingleChatList({ ...data, ...paream });
    setIsChatListLoading(false);
    if (res) {
      const { list, total } = res;
      setChatList({ total, list });
    }
  };

  // 混合消息
  const formatChatMsgHunhe = (type: any, msgObj: any /* , chatObj: any */) => {
    switch (type) {
      case 1: {
        // 文字
        return <div className={style.textHunhe}>{msgObj.content}</div>;
      }
      case 2:
        // 图片
        return (
          <div>
            {!msgObj.fileUrl || (
              <span>
                <Image
                  src={
                    '/tenacity-admin/api/chat/chat_record/chat_file_preview?' + msgObj.fileUrl + '&myToken=' + myToken
                  }
                  // onError={(e) => getImage(e, msgObj.fileUrl)}
                  className={style.chatImgHunhe}
                ></Image>
              </span>
            )}
            {!msgObj.fileUrl && '图片同步中，暂不能查看'}
          </div>
        );
    }
  };

  // 视频播放弹框
  const audioClick = (data: string) => {
    setAudioModalVisible(true);
    setAudioSource(data);
  };

  const voiceClick = (data: any, type: any) => {
    setVoiceModal(true);
    setVoiceSrc(data);
    setVoiceType(type === 'yuyin' ? '语音' : '语音通话');
  };

  // 查询事件
  const search = () => {
    // @ts-ignore
    const day = (filterDateRange?.[1]?.format('X') - filterDateRange?.[0]?.format('X')) / (3600 * 24);
    if (day > 180) {
      return message.error('时间范围不能超过半年');
    }
    fetchSingleChat();
  };

  // 聊天记录翻页
  const onChangePage = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, pageNum, pageSize: pageSize as number }));
    fetchSingleChat({ pageNum });
  };

  // 重置
  const reset = () => {
    setfilterDateRange([moment().subtract(1, 'months'), moment()]);
    setFilterKey('');
    setFilterChatType(0);
    fetchSingleChat({
      msgType: 0,
      pageNum: 1,
      beginTime: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
      queryContent: ''
    });
  };

  // 筛选聊天记录类型
  const onChangeFilterChatType = (e: any) => {
    setPagination((pagination) => ({ ...pagination, pageNum: 1 }));
    setFilterChatType(e.target.value);
    fetchSingleChat({ msgType: e.target.value, pageNum: 1 });
  };

  // 关闭视频播放
  const audioChange = () => {
    setAudioModalVisible(false);
    setAudioSource('');
  };

  const voiceCancel = () => {
    setVoiceModal(false);
    setVoiceSrc('');
  };

  useEffect(() => {
    fetchSingleChat();
    getClientInfo();
  }, []);

  // 聊天记录展现
  const formatChatMsg = (type: any, msgObj: any /* , chatObj: any */) => {
    switch (type) {
      case 1: {
        // 文字
        return <div>{msgObj.content}</div>;
      }
      case 2: {
        // 图片
        return (
          <div>
            {!msgObj.fileUrl || (
              <>
                <Image
                  src={
                    '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' + msgObj.fileUrl + '&myToken=' + myToken
                  }
                  // onError={(e) => getImage(e, msgObj.fileUrl)}
                  className={style.chatImg}
                />
                <a
                  href={
                    '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' + msgObj.fileUrl + '&myToken=' + myToken
                  }
                  target={'_blank'}
                  rel="noreferrer"
                >
                  下载
                </a>
              </>
            )}
            {!msgObj.fileUrl && '图片同步中，暂不能查看'}
          </div>
        );
      }
      case 4: {
        // 同意存档消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p></p>
                  <span style={{ color: '#000' }}>同意会话聊天内容</span>
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/file.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>同意</div>
              </div>
            </div>
          </div>
        );
      }
      case 5: {
        // 语音
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p>{msgObj.playLength}秒</p>
                  {/* <span>{msgObj['fileSize']}M</span> */}
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/voice.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>语音</div>
                <div className={style.down}>
                  {msgObj.fileUrl && (
                    <a
                      href={
                        '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' +
                        msgObj.fileUrl +
                        '&myToken=' +
                        myToken
                      }
                    >
                      下载
                    </a>
                  )}{' '}
                  {msgObj.fileUrl || '同步中，暂不能下载'}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 6: {
        // 视频文件
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p>{msgObj.playLength}秒</p>
                  <span>{msgObj.fileSize}b</span>
                </div>
                <div
                  className={style.img}
                  onClick={() =>
                    audioClick(
                      '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' +
                        msgObj.fileUrl +
                        '&myToken=' +
                        myToken
                    )
                  }
                  style={{
                    background: `url(${require('src/assets/images/exception/audio.png')})`,
                    backgroundSize: '100%, 100%',
                    cursor: 'pointer'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>视频</div>
                <div className={style.down}>
                  {msgObj.fileUrl && (
                    <a
                      href={
                        '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' +
                        msgObj.fileUrl +
                        '&myToken=' +
                        myToken
                      }
                    >
                      下载
                    </a>
                  )}
                  {msgObj.fileUrl || '同步中，暂不能下载'}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 7: {
        // 名片 corpName cardUserId
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p>{msgObj.corpName}</p>
                  <span style={{ width: '122pt', overflow: 'auto', display: 'inline-block' }}>{msgObj.userId}</span>
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/card.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>个人名片</div>
              </div>
            </div>
          </div>
        );
      }
      case 8: {
        // 位置消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.chatMsg}>
              <div className={style.positionWrap}>
                <div className={style.top}>
                  <p>{msgObj.title}</p>
                </div>
                <div
                  className={style.bottom}
                  style={{
                    background: `url(${require('src/assets/images/exception/position.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      }
      case 9: {
        // 表情
        return (
          <div>
            {msgObj.fileUrl && (
              <Image
                src={
                  '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' + msgObj.fileUrl + '&myToken=' + myToken
                }
                width={'100px'}
              />
            )}
            {msgObj.fileUrl || '表情同步中，暂不能查看'}
          </div>
        );
      }
      case 10: {
        // 文件消息
        const fileFixArr = msgObj.fileName.split('.');
        const fileFix = fileFixArr[fileFixArr.length - 1]; // 文件后缀，根据后缀名加载不同的背景图片
        const commonImg = require('src/assets/images/exception/common.png');
        const xlsxImg = require('src/assets/images/exception/xlsx.png');
        const docxImg = require('src/assets/images/exception/docx.png');
        const fileType = {
          txt: commonImg,
          xlsx: xlsxImg,
          xls: xlsxImg,
          ppt: require('src/assets/images/exception/ppt.png'),
          doc: docxImg,
          docx: docxImg,
          rp: require('src/assets/images/exception/rp.png'),
          ext: commonImg,
          pdf: require('src/assets/images/exception/pdf.png')
        };
        // @ts-ignore
        const url = fileType[fileFix] ? fileType[fileFix] : fileType.txt;
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p>{msgObj.fileName}</p>
                  <span>{msgObj.fileSize}b</span>
                </div>
                <div className={style.img} style={{ background: `url(${url})`, backgroundSize: '100%, 100%' }}></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>文件</div>
                <div className={style.down}>
                  {msgObj.fileUrl && (
                    <a
                      href={
                        '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' +
                        msgObj.fileUrl +
                        '&myToken=' +
                        myToken
                      }
                    >
                      下载
                    </a>
                  )}
                  {msgObj.fileUrl || '同步中，暂不能下载'}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 11: {
        // 链接消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p style={{ fontSize: '14px' }}>{msgObj.title}</p>
                  <p style={{ marginTop: -11, color: '#ccc', fontSize: '14px' }}>{msgObj.description}</p>
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/link.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>链接</div>
                <div className={style.down}>
                  {msgObj.linkUrl && (
                    <a href={msgObj.linkUrl} target={'_blank'} rel="noreferrer">
                      前往链接
                    </a>
                  )}
                  {!msgObj.linkUrl && '同步中，暂不能下载'}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 12: {
        // 小程序消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.smallAppWrap}>
              <div className={style.header}>
                <div
                  className={style.icon}
                  style={{
                    background: `url(${require('src/assets/images/exception/smallAppIcon.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
                <p>{msgObj.displayName}</p>
              </div>
              <p
                className={style.title}
                style={{
                  background: `url(${require('src/assets/images/exception/smallApp.png')})`,
                  backgroundSize: '100%, 100%'
                }}
              >
                {msgObj.title}
              </p>
              <div className={style.bottom}>小程序</div>
            </div>
          </div>
        );
      }
      case 13: {
        // 聊天记录消息 getChatMsg中处理 聊天记录嵌套聊天记录暂不支持
        return <div>[该消息类型暂不能展示]</div>;
      }
      case 14: {
        // 代办消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p>{msgObj.title}</p>
                  <span style={{ color: '#000' }}>创建人：{msgObj.creator || '无'}</span>
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/daiban.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>待办</div>
              </div>
            </div>
          </div>
        );
      }
      case 15: {
        // 投票消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text} style={{ overflow: 'auto', width: '136pt' }}>
                  {msgObj.title}
                  <span style={{ color: '#000' }}>{msgObj.voteTitle}</span>
                  {msgObj.voteItem.map((item: any, i: number) => {
                    return (
                      <li key={item} style={{ width: '124pt', margin: '0 auto', fontSize: '10pt', marginTop: '2pt' }}>
                        {i + 1}.{item}
                      </li>
                    );
                  })}
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/toupiao.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>投票</div>
              </div>
            </div>
          </div>
        );
      }
      case 16: {
        // 红包消息
        const redPaperDict = {
          1: '普通红包',
          2: '拼手气群红包',
          3: '激励群红包'
        };
        return (
          <div className={style.chatMsgArea}>
            <div className={style.redbagWrap}>
              <div className={style.top}>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/hongbao.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
                <div className={style.textWrap}>
                  <div className={style.wish}>{msgObj.wish}</div>
                  <div className={style.money}>
                    {(msgObj.totalAmount / 100).toFixed(2)}元/{msgObj.totalCnt}个
                  </div>
                </div>
              </div>
              <div className={style.bottom}>
                <div className={style.text}>
                  红包-{redPaperDict[msgObj.type as keyof { '1': string; '2': string; '3': string }]}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 17: {
        // 会议邀请消息
        const meetingDict = {
          1: '参加会议',
          2: '拒绝会议',
          3: '待定',
          4: '未被邀请',
          5: '会议已过期',
          6: '不在房间内'
        };
        const Time0 = new Date(msgObj.startTime * 1000);
        const Time10 = new Date(msgObj.endTime * 1000);
        const mon1 = Time0.getMonth() + 1;
        const day1 = Time0.getDate();
        const starHour1 = Time0.getHours();
        let startMin1 = Time0.getMinutes();
        if (startMin1 < 10) {
          startMin1 = +(startMin1 + '0');
        }
        const endHour1 = Time10.getHours();
        let endMin1 = Time10.getMinutes();
        if (endMin1 < 10) {
          endMin1 = +(endMin1 + '0');
        }
        return (
          <div className={style.chatMsgArea}>
            <div>
              <div className={style.remainDealWrap}>
                <div className={style.text}>
                  <p>
                    <Tooltip title={msgObj.title}>{msgObj.title}</Tooltip>
                  </p>
                  <p>
                    <Tooltip title={msgObj.address}>{msgObj.address}</Tooltip>
                  </p>
                  {msgObj.status ? <p>处理状态：{meetingDict[msgObj.status as keyof object]}</p> : <p>会议发起</p>}
                  <p>
                    {mon1}月{day1}日 {starHour1}：{startMin1}-{endHour1}：{endMin1}
                  </p>
                </div>
                <div
                  className={style.icon}
                  style={{
                    background: `url(${require('src/assets/images/exception/huiyi.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.remainDealBottom}>
                <div className={style.line}></div>
                <div className={style.title}>会议邀请</div>
              </div>
            </div>
          </div>
        );
      }
      case 19: {
        // 在线文档消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p>{msgObj.title}</p>
                  <span style={{ color: '#000' }}>{msgObj.docCreator}</span>
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/onlineDoc.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>在线文档</div>
                <div className={style.down}>
                  {msgObj.linkUrl
                    ? (
                    <a href={msgObj.linkUrl} target={'_blank'} rel="noreferrer">
                      访问链接
                    </a>
                      )
                    : (
                        '同步中，暂不能下载'
                      )}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 20: {
        // markdown文本
        return (
          <div>
            <div className={'chatMsgArea'}>
              <div style={{ display: 'flex', border: '0.5pt solid #ccc', borderBottom: 'none' }}>
                <div className={style.markdownText} dangerouslySetInnerHTML={{ __html: msgObj.content }}></div>
                <div
                  className={style.markdownIcon}
                  style={{
                    background: `url(${require('src/assets/images/exception/markdown.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
            </div>
            <div className={style.markdownLine}></div>
            <div className={style.markdownbottom}>markdown文本</div>
          </div>
        );
      }
      case 21: {
        // 图文消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  {msgObj.item && msgObj.item.length
                    ? msgObj.item.map((item: any, i: number) => {
                      return (
                          <div key={i}>
                            <p style={{ fontSize: '14px' }}>{item.title}</p>
                            <p style={{ marginTop: -11, fontSize: '14px' }}>{item.description}</p>
                            <div
                              style={{
                                fontSize: '10pt',
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderTop: '0.5pt solid #ccc',
                                marginLeft: '2pt'
                              }}
                              className={style.fileType}
                            >
                              <span>图文消息</span>
                              <span>
                                {item.linkUrl
                                  ? (
                                  <a href={'https://' + item.linkUrl} target={'_blank'} rel="noreferrer">
                                    访问链接
                                  </a>
                                    )
                                  : (
                                      '同步中，暂不能访问'
                                    )}
                              </span>
                            </div>
                          </div>
                      );
                    })
                    : null}
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/tuwen.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.bottom}>
                <div className={style.down}></div>
              </div>
            </div>
          </div>
        );
      }
      case 22: {
        // 日程消息
        const startTime = moment(msgObj.startTime * 1000).format('YYYY-MM-DD HH:mm:ss');
        const endTime = moment(msgObj.endTime * 1000).format('YYYY-MM-DD HH:mm:ss');
        const Time = new Date(msgObj.startTime * 1000);
        const Time1 = new Date(msgObj.endTime * 1000);
        const mon = Time.getMonth() + 1;
        const day = Time.getDate();
        const starHour = Time.getHours();
        let startMin = Time.getMinutes();
        if (startMin < 10) {
          startMin = +(startMin + '0');
        }
        const endHour = Time1.getHours();
        let endMin = Time1.getMinutes();
        if (endMin < 10) {
          endMin = +(endMin + '0');
        }
        return (
          <div className={'chatMsgArea'}>
            <div>
              <div className={style.remainDealWrap}>
                <div className={style.text}>
                  <p>{msgObj.title}</p>
                  <p>{msgObj.place}</p>
                  <p>
                    {mon}月{day}日 {starHour}：{startMin}-{endHour}：{endMin}
                  </p>
                  <p style={{ color: '#ccc' }}>组织者：{msgObj.creatorName}</p>
                  <p style={{ color: '#ccc' }}>参会者：{msgObj.attendeeName.join('、')}</p>
                </div>
                <div
                  className={style.icon}
                  style={{
                    background: `url(${require('src/assets/images/exception/richeng.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.remainDealBottom}>
                <div className={style.line}></div>
                <div className={style.title}>日程</div>
              </div>
            </div>
            <div className={style.chatMsg}>
              <div className={style.content}>主题：{msgObj.title}</div>
              <div className={style.content}>发起人：{msgObj.creatorName}</div>
              <div className={style.content}>参与者：{msgObj.attendeeName.join('、')}</div>
              <div className={style.content}>开始时间：{startTime}</div>
              <div className={style.content}>结束时间：{endTime}</div>
              <div className={style.content}>地址：{msgObj.place}</div>
              <div className={style.content}>备注：{msgObj.remarks}</div>
              <div className={style.bottom}>日程消息</div>
            </div>
          </div>
        );
      }
      case 23: {
        // 填表消息
        return (
          <div className={style.chatMsgArea}>
            <div>
              <div className={style.remainDealWrap}>
                <div className={style.text}>
                  <p>{msgObj.title}</p>
                  {msgObj.item && msgObj.item.length
                    ? msgObj.item.map((obj: any) => {
                      return <li key={obj.id}>{obj.ques}</li>;
                    })
                    : null}
                  <p style={{ color: '#ccc' }}>创建人：{msgObj.creator}</p>
                  <p style={{ color: '#ccc' }}>群名称：{msgObj.roomName}</p>
                </div>
                <div
                  className={style.icon}
                  style={{
                    background: `url(${require('src/assets/images/exception/form.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.remainDealBottom}>
                <div className={style.line}></div>
                <div className={style.title}>填表</div>
              </div>
            </div>
          </div>
        );
      }
      case 24: {
        // 不同意存档消息
        return (
          <div className={style.chatMsgArea}>
            <div className={style.fileWrap}>
              <div className={style.top}>
                <div className={style.text}>
                  <p></p>
                  <span style={{ color: '#000' }}>不同意会话聊天内容</span>
                </div>
                <div
                  className={style.img}
                  style={{
                    background: `url(${require('src/assets/images/exception/file.png')})`,
                    backgroundSize: '100%, 100%'
                  }}
                ></div>
              </div>
              <div className={style.line}></div>
              <div className={style.bottom}>
                <div className={style.fileType}>不同意</div>
              </div>
            </div>
          </div>
        );
      }
      case 26: {
        // 音频消息
        return (
          <div style={{ width: 520, display: 'flex' }}>
            <div style={{ width: 220, height: 80, background: '#f2f2f2', padding: 6 }}>
              <p>语音通话时长：{msgObj.duration}</p>
              <p style={{ marginTop: 30 }}>{msgObj.userName}</p>
            </div>
            <div style={{ overflow: 'hidden', backgroundColor: '#f2f2f2', padding: 18 }}>
              <div
                onClick={() =>
                  voiceClick(
                    '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' + msgObj.fileUrl + '&myToken=' + myToken,
                    ''
                  )
                }
                style={{
                  backgroundImage: `url(${require('src/assets/images/exception/voice.png')})`,
                  backgroundSize: '100%, 100%',
                  cursor: 'pointer',
                  width: 40,
                  height: 40
                }}
              ></div>
            </div>
            <div style={{ marginLeft: 4, textAlign: 'center', paddingTop: 33 }}>
              {/* <a href={urls.fileBaseUrl + msgObj.fileUrl} target={'_blank'} rel="noreferrer"> */}
              <a
                href={
                  '/tenacity-webapp/api/chat/chat_record/chat_file_preview?' + msgObj.fileUrl + '&myToken=' + myToken
                }
                target={'_blank'}
                rel="noreferrer"
              >
                下载语音通话音频
              </a>
            </div>
            {/* <Image src={urls.fileBaseUrl + msgObj['fileUrl']} className={'chatImgHunhe'}></Image> */}
            {/* <a href={urls.fileBaseUrl + msgObj['fileUrl']} target={'_blank'}>下载</a> */}
          </div>
        );
      }
      default: {
        return <div>[该消息类型暂不能展示]</div>;
      }
    }
  };

  // 聊天记录展现
  const getChatMsg = (chatObj: any) => {
    const { msgType, info } = chatObj;
    if (msgType === 13) {
      // 聊天记录消息
      return (
        <div className={style.chatRecords}>
          {info.childList.map((obj: any) => {
            return (
              <div className={style.chatRecordContent} key={obj.detail.id}>
                <span className={style.name}>{info.detail.title}</span>
                <span className={style.date}>{moment(chatObj.msgTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                <div className={style.chatItemBottom} style={{ marginLeft: '0px' }}>
                  {formatChatMsg(obj.detail.msgType, obj.detail /* , chatObj */)}
                </div>
              </div>
            );
          })}
          <div className={style.bottom}>会话记录</div>
        </div>
      );
    } else if (msgType === 25) {
      let keyId = 0;
      // 混合消息
      return (
        <div className={style.hunheContainer}>
          {info.childList && info.childList.length
            ? info.childList.map((obj: any) => {
              return (
                  <div className={style.hunheWrap} key={'kb' + keyId++}>
                    {formatChatMsgHunhe(obj.detail.msgType, obj.detail /* , chatObj */)}
                  </div>
              );
            })
            : null}
          <div className={style.line} />
          <div className={style.bottom}>混合消息</div>
        </div>
      );
    } else {
      return formatChatMsg(msgType, info.detail || {} /* , chatObj */);
    }
  };

  return (
    <div className={style.chatLog}>
      <div className={style.breadCrumbs}>
        <BreadCrumbs
          navList={[{ name: '删人提醒', path: '/deletionReminder' }, { name: clientInfo?.clientName + '的聊天记录' }]}
        />
      </div>
      <div className={style.header}>
        <span className={style.left}>
          <span className={style.leftItem}>
            日期：
            <DatePicker.RangePicker
              style={{ width: 300 }}
              allowClear={false}
              value={filterDateRange}
              onChange={onChangeDate}
              disabledDate={(selectedDate) => moment(selectedDate).isAfter(moment(), 'day')}
            />
          </span>
          <span className={style.leftItem}>
            关键词：
            <Input style={{ width: 150 }} value={filterKey} placeholder="聊天关键词" onChange={handleChangeKey} />
          </span>
          <span className={style.leftItem}>
            <Button type="primary" onClick={search}>
              查询
            </Button>
          </span>
          <span className={style.leftItem}>
            <Button onClick={reset}>重置</Button>
          </span>
        </span>
      </div>
      <Spin spinning={isChatListLoading}>
        <div className={style.content}>
          <div className={style.contentMiddle}>
            <div className={style.contentLeftTitle}>{clientInfo?.staffName}的聊天对象</div>
            <div className={style.targetPersonWrap}>
              <div className={style.targetPerson}>
                <span className={style.myTitle}>
                  <Image
                    style={{
                      display: 'block',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      margin: '0 10px 0 0'
                    }}
                    src={clientInfo?.clientAvatar}
                  />
                  <span title={clientInfo?.clientName} className={classNames(style.title, 'ellipsis')}>
                    {clientInfo?.clientName}
                  </span>
                  <Icon
                    className={style.editIcon}
                    name="a-icon_common_16_modelcharge"
                    onClick={() => {
                      copy(clientInfo?.externalUserid || '', false);
                      message.success('外部联系人id复制成功');
                    }}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className={style.contentRight}>
            <div className={style.contentRightTitle}>
              <span style={{ lineHeight: '24px' }}>聊天记录</span>
              <span className={style.filterChatType}>
                <Radio.Group value={filterChatType} onChange={onChangeFilterChatType} size="small">
                  <Radio.Button value={0}>全部</Radio.Button>
                  <Radio.Button value={5}>文件</Radio.Button>
                  <Radio.Button value={2}>图片</Radio.Button>
                  <Radio.Button value={4}>视频</Radio.Button>
                  <Radio.Button value={3}>语音</Radio.Button>
                  <Radio.Button value={7}>链接</Radio.Button>
                  {/* <Radio.Button value={3}>语音</Radio.Button> */}
                  <Radio.Button value={6}>红包</Radio.Button>
                </Radio.Group>
              </span>
            </div>
            <div className={style.chatList}>
              {!chatList.list.length ||
                chatList.list.map((obj: any) => {
                  return (
                    <div className={style.chatItem} key={obj.id}>
                      <div className={style.chatItemTop}>
                        <Image
                          className={style.avatar}
                          src={
                            obj.fromUser && obj.fromUser.avatar
                              ? obj.fromUser.avatar
                              : require('src/assets/images/exception/member_avatar.png')
                          }
                          alt=""
                        />
                        <span className={style.name}>{obj.fromUser ? obj.fromUser.userName : '成员'}</span>
                        <span className={style.date}>{moment(obj.msgTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                        {obj.isRevoke && (
                          <span>
                            <Tag color="red">已撤回</Tag>
                          </span>
                        )}
                      </div>
                      <div className={style.chatItemBottom}>{getChatMsg(obj)}</div>
                    </div>
                  );
                })}
              {!!chatList.list.length || (
                <div className={style.noDataArea}>
                  <div className={style.noDataIcon}>{/* <Icon type="info-circle" /> */}</div>
                  <div className={style.noDataInfo}>暂无聊天记录</div>
                </div>
              )}
            </div>
            <div className={style.pagination}>
              <Pagination
                size="small"
                showQuickJumper={Boolean(chatList.total)}
                current={pagination.pageNum}
                total={chatList.total}
                onChange={onChangePage}
                showTotal={(total) => `共 ${total}条记录`}
                pageSize={pagination.pageSize}
              />
            </div>
          </div>
        </div>
      </Spin>
      {/* 播放视频 @ts-ignore */}
      <AudioPlay audioVisible={audioModalVisible} handleChange={audioChange} source={audioSource} />
      {/* 播放音频 */}
      <Modal visible={voiceModal} title={voiceType} onOk={voiceCancel} width={360} onCancel={voiceCancel} footer={null}>
        {voiceSrc && <audio src={voiceSrc} controls></audio>}
      </Modal>
    </div>
  );
};
export default chatLog;
