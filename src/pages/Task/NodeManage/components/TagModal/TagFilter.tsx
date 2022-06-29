/**
 * @name TagFilter
 * @author Lester
 * @date 2021-06-29 17:38
 */

import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Tabs } from 'antd';
import { NgModal } from 'src/components';
import { queryTagList, searchTagList } from 'src/apis/task';
import { TagCategory, TagInterface } from 'src/utils/interface';
import EmptyTag from './EmptyTag';
import PanelList from './PanelList';
import style from './style.module.less';

const { Search } = Input;

interface TagFilterProps {
  onChoose: (tag: TagInterface) => any;
  visible: boolean;
  currentTag?: TagInterface;
  className?: string;
  onClose: () => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ visible, onChoose, currentTag, onClose, ...props }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [attrTagList, setAttrTagList] = useState<TagCategory[]>([]);
  const [allAttrTagList, setAllAttrTagList] = useState<TagCategory[]>([]);
  const [predictTagList, setPredictTagList] = useState<TagCategory[]>([]);
  const [allPredictTagList, setAllPredictTagList] = useState<TagCategory[]>([]);
  const [carTagList, setCarTagList] = useState<TagCategory[]>([]);
  const [allCarList, setAllCarTagList] = useState<TagCategory[]>([]);
  const [chooseTag, setChooseTag] = useState<TagInterface>();
  const [interestTagList, setinterestTagList] = useState<TagCategory[]>([]);
  const [allInterestList, setAllinterestTagList] = useState<TagCategory[]>([]);

  /**
   * 获取全部标签列表
   *  @param queryType
   */
  const getTagList = async (queryType: number) => {
    const res: any = await queryTagList({ queryType });
    let resList = Array.isArray(res) ? res : [];
    if (queryType === 1) {
      resList = [
        {
          category: 1,
          groupList: [
            {
              groupId: '40fe6b061b094e1eb25947dc825415cd',
              groupName: '年龄',
              displayType: 0,
              tagList: [
                { tagId: 'e6ce397559f34a22a99d05560e72cfbc', tagName: '18岁以下' },
                { tagId: 'df9fdd60744f49308e8c72d3d4959f0b', tagName: '19-25岁' },
                { tagId: 'bc3e7e7ec024469dac37f010c1ce7faf', tagName: '26-35岁' },
                { tagId: '68353ad425714b5ca5be7ac5bd825c08', tagName: '36-45岁' },
                { tagId: 'fc04deb5525049f5b85c1a2014420ae2', tagName: '46-55岁' },
                { tagId: '07f488cce7c241ba932a138a03e0f1e1', tagName: '56-65岁' },
                { tagId: '85309090ab8e475396bde67437512bf3', tagName: '66岁以上' }
              ]
            },
            {
              groupId: 'badcd68767ac4a35a15861530bfc6820',
              groupName: '性别',
              displayType: 0,
              tagList: [
                { tagId: '1cbb0491a3c84dde9b6c00c247810393', tagName: '男' },
                { tagId: 'f018d5a57e87445bada8815a89c8675e', tagName: '女' }
              ]
            },
            {
              groupId: '17a1280de86d49989c4a200849946b0a',
              groupName: '客户等级',
              displayType: 1,
              tagList: [
                { tagId: '6615cc841b9844dc816900d282f288d2', tagName: '一级' },
                { tagId: '44fbb541e9c041a6b9ce13af53182f9e', tagName: '二级' },
                { tagId: '95a580ac8c0c425f9fc796575a81da1e', tagName: '三级' },
                { tagId: '9157ba744a914c97a7b2ba94d90d076f', tagName: '四级' }
              ]
            },
            {
              groupId: '04e66b55be404086aa8affde62f479ad',
              groupName: '行业类别',
              displayType: 1,
              tagList: [
                { tagId: 'b4ee810ba9834119b89b5ef1ea408cb8', tagName: '未知' },
                { tagId: '932fbc9717434c1eb3fb4a22517fa043', tagName: '制造业' },
                { tagId: '49af0948adef4375abd6bb3220aaf88c', tagName: '服务业' },
                { tagId: 'dc6921f8c243437cb36e8754d7749952', tagName: '金融业' },
                { tagId: '3c67da5426c64f20bfa8fc430f8ed3fd', tagName: '互联网' },
                { tagId: '8a2d7ec90abf4dc5947c8e1d580c62fd', tagName: '教育培训' },
                { tagId: '301ec3ad363c4a678612b8034fd91bc4', tagName: '物流运输' },
                { tagId: '307f80e70b1947e4996a1f13ece8e373', tagName: '政府或非盈利组织' },
                { tagId: '6708b69e2ece444bade0f92bc15ccabe', tagName: '其他' }
              ]
            },
            {
              groupId: '7e5535c063934e87b48c4c357f99f789',
              groupName: '职业类别',
              displayType: 1,
              tagList: [
                { tagId: '9f6b26d0f1c545bcae9b1380516c0b9a', tagName: '未知' },
                { tagId: 'b625e2ff41334998b6de61cdbd2dfbcf', tagName: '务农' },
                { tagId: '6e7428fda0ae4e3ab7853240bf1290c9', tagName: '工人' },
                { tagId: '2a09de488a8b486ab421827d1b7c7d26', tagName: '白领员工' },
                { tagId: '42c44d7a08664141b0ef2a176800b020', tagName: '小企业主' },
                { tagId: 'a6bfa10627054f6d8dbf9d4c8acd2c89', tagName: '公司高管' },
                { tagId: '3d570017a0c6470087790e7efcd568bb', tagName: '自由职业' },
                { tagId: 'acd79e0bbef44c9d8db5300682526798', tagName: '家庭主妇' },
                { tagId: '6f3a8157a5ff488b95bf98f07964e7cf', tagName: '公务员' },
                { tagId: '8fad80b2b0f24643a337e80b53e5f17a', tagName: '事业单位' },
                { tagId: 'd37de52399454656b8669f0d1d658e0d', tagName: '其他' }
              ]
            },
            {
              groupId: '33bb0c3700e14c62a03701caf93b72cc',
              groupName: '个人年收入',
              displayType: 1,
              tagList: [
                { tagId: 'c19af4e1c211472095b2ea9917549fe2', tagName: '未知' },
                { tagId: '7a0d0f6aa29d4cdcb17c2cd80631a248', tagName: '5万(含)以下' },
                { tagId: 'a77d1a36460a413a9c52bb5859360705', tagName: '5万-10万' },
                { tagId: '0763c67034174ddcbf83261d17e3b2a7', tagName: '10万-30万' },
                { tagId: '89a50ff3b2914d8b9232707b1426beac', tagName: '30万-50万' },
                { tagId: 'cc8d9048bf1149f9ab993787c903f75c', tagName: '50万-100万' },
                { tagId: 'fbf8d83ef26447168e42fa64e9dd9589', tagName: '100万以上' }
              ]
            },
            {
              groupId: '51b296c4baca45519d3abf7a7e73ca21',
              groupName: '婚姻状况',
              displayType: 1,
              tagList: [
                { tagId: 'e5c36fe49b674dfab4e4161c22bf7138', tagName: '未知' },
                { tagId: 'bd2d707383b641a8ad19cf0e0208b70b', tagName: '单身' },
                { tagId: '83e8a08c330d4b5290385425606e1849', tagName: '离异' },
                { tagId: '8bdd4fe0908244cc8cff31e4443ee1be', tagName: '已婚未育' },
                { tagId: 'ee5587de1147442ba05a1b0ecfad27f5', tagName: '已婚已育' },
                { tagId: '44dcef2fb7bf4423b54a8fc47f5ce6b0', tagName: '其他' }
              ]
            },
            {
              groupId: '394b3bc534f147049281eeee3a913a41',
              groupName: '学历',
              displayType: 1,
              tagList: [
                { tagId: '7a75d458697340c68345074b069790da', tagName: '未知' },
                { tagId: '0191d0adb61f4794863cdbe0f333f7ce', tagName: '博士及以上' },
                { tagId: '9c66902ff37947c29d02eecfaee7a408', tagName: '硕士' },
                { tagId: '9de2b047a3af4f1285f6463c65717a54', tagName: '大学本科' },
                { tagId: '31b068d74739404c8492ced29b5c7fd3', tagName: '大学专科' },
                { tagId: '93d87aa1a8b1479996058c2d32cd8085', tagName: '高中' },
                { tagId: '487bb93104e042d18854a83c9aae751b', tagName: '初中及以下' },
                { tagId: '780b561311644c09a11fb833395d009f', tagName: '其他' }
              ]
            }
          ]
        },
        {
          category: 2,
          groupList: [
            {
              groupId: '410b822a07f54152a348da305c2b6581',
              groupName: '父母类别',
              displayType: 1,
              tagList: [
                { tagId: 'eacf3ece38244f129a42b1951ed80fb2', tagName: '未知' },
                { tagId: 'afc9830900344b00b2fee4953760ef1e', tagName: '父亲' },
                { tagId: 'ffb2a1170a574363a6793eae67901678', tagName: '母亲' },
                { tagId: 'd478c669737c44d29d7d101e36ed67ef', tagName: '配偶父亲' },
                { tagId: 'd2fb30aeda5543829b9024d39aa81bee', tagName: '配偶母亲' },
                { tagId: 'a1e2294429f64bceaa718dd51dd11481', tagName: '无老人' }
              ]
            },
            {
              groupId: '9d8b30bb02a24a4eb71c79585769655d',
              groupName: '子女情况',
              displayType: 1,
              tagList: [
                { tagId: 'e7d287d06f06422bb5602da3a118a4c7', tagName: '未知' },
                { tagId: '9bfce2a4164440878329d76c982a663b', tagName: '无孩' },
                { tagId: 'ef41deb5a692432d838ed68cc45a493a', tagName: '有孩' }
              ]
            },
            {
              groupId: '775827cb00134d719a7937be54242315',
              groupName: '宠物类别',
              displayType: 1,
              tagList: [
                { tagId: '6e4e5c1e0ab04915b63a9b5d7a5d4d89', tagName: '未知' },
                { tagId: '77a1e2bcaa044506aad53b9709415fe1', tagName: '猫' },
                { tagId: 'abf2b15105de4c77869d8641246dc8f8', tagName: '狗' },
                { tagId: 'e27f7b044f034c618afbbd41bcce56fd', tagName: '其他' }
              ]
            },
            {
              groupId: 'b1c4ecdac5ba48b58f6f626cf9d3f30b',
              groupName: '家庭房产情况',
              displayType: 1,
              tagList: [
                { tagId: '92f6e75658d84143844cca828c3603cd', tagName: '未知' },
                { tagId: '965abd37deb94174aef375145ce72e1c', tagName: '有房' },
                { tagId: 'e4c6e717f5c442dfad3db5076723cacf', tagName: '租房' },
                { tagId: '875cf13fa60843fb95263ae2bc5f6a8b', tagName: '与父母同住' }
              ]
            },
            {
              groupId: 'dde0e2e9f31f445fa75cb34efda1f424',
              groupName: '家庭房贷情况',
              displayType: 1,
              tagList: [
                { tagId: 'e26675b1e79f49a98179599972ee1e3e', tagName: '未知' },
                { tagId: 'b7259e735c084ecd915572d255e78561', tagName: '有房贷' },
                { tagId: 'f60a50574b444a769a371731fbe73051', tagName: '无房贷' }
              ]
            },
            {
              groupId: 'eaa7b82bc6bd479ba83ff29afb1b83c3',
              groupName: '家庭车产情况',
              displayType: 1,
              tagList: [
                { tagId: '81809450296c4a88b2c549ae8162337b', tagName: '未知' },
                { tagId: 'ce2788d1b96f4794bfb207787d8805a0', tagName: '无车' },
                { tagId: '55823b01e8e84bf1a344bcf3a04c6321', tagName: '一辆车' },
                { tagId: 'a5a4c53a86b84e01aae20cd6d1a43d0b', tagName: '多辆车' }
              ]
            },
            {
              groupId: 'f37da4cb1bf840798c96b741dd9fc347',
              groupName: '家庭车贷情况',
              displayType: 1,
              tagList: [
                { tagId: 'b77731f7a2e64c5e98ef4ffa31d04f1c', tagName: '未知' },
                { tagId: '43be084ae4f94d3a8f4bf933a0ea4376', tagName: '有车贷' },
                { tagId: 'ed06056702eb44cb95b46759ea0ae22e', tagName: '无车贷' }
              ]
            },
            {
              groupId: '810e609cc55f4b64852558cad3b78352',
              groupName: '自己购买保险情况',
              displayType: 1,
              tagList: [
                { tagId: '56e602451a4b4ab7adf133974b2f689c', tagName: '未知' },
                { tagId: '7c18e279e4784aabbb9d71367d395bce', tagName: '买了' },
                { tagId: 'b0cd6c47884f4bffac90fbc48eca47da', tagName: '没买' }
              ]
            },
            {
              groupId: '5e5d20a8b6e444cdb25b52b00c113dbf',
              groupName: '配偶购买保险情况',
              displayType: 1,
              tagList: [
                { tagId: '12677872c47e442d8684990108b8266d', tagName: '未知' },
                { tagId: '7211efbe9ad3491ab55872c33e0f1f6b', tagName: '买了' },
                { tagId: '73bb4b00947d4194b2220e01b6e1fdd7', tagName: '没买' }
              ]
            },
            {
              groupId: '4b5af26b04384a89bfdc89a4c383cfa4',
              groupName: '父母购买保险情况',
              displayType: 1,
              tagList: [
                { tagId: '51751eb53f954a7a83474d1a92a97b26', tagName: '未知' },
                { tagId: 'a76fc00c697f4a33af1b9a1c1d4cc15a', tagName: '买了' },
                { tagId: '4660774a18e9426db7a526831c0f97e6', tagName: '没买' }
              ]
            },
            {
              groupId: '5e811482387a4b5698d179c121afd947',
              groupName: '孩子购买保险情况',
              displayType: 1,
              tagList: [
                { tagId: '4f8e016f912347afbca7006e95d655dc', tagName: '未知' },
                { tagId: 'df02f9a2b6864617b5ed0ab26bcdaded', tagName: '买了' },
                { tagId: '57cb6289eeeb4e93b2c0cedbdb33a65b', tagName: '没买' }
              ]
            },
            {
              groupId: '9f83fdeb542a4cf58f9f3df8a3dbc4bb',
              groupName: '家庭购买保险情况',
              displayType: 1,
              tagList: [
                { tagId: 'c75cba932fea411a86d2dcb63e35e0e6', tagName: '未知' },
                { tagId: 'ef4ea9b8623d4a309e5ab3ff6b9bddce', tagName: '买了' },
                { tagId: '0d6f29d9f7b74f8da5ab21b72ae80a5c', tagName: '没买' }
              ]
            },
            {
              groupId: '4209b085973749a0979551fb081130ce',
              groupName: '宠物保障情况',
              displayType: 1,
              tagList: [
                { tagId: 'c29d4ae4ad5b4d4d8a631d9c4e11c110', tagName: '未知' },
                { tagId: 'c353a8e260ba42ab922ce38e8377eb26', tagName: '买了' },
                { tagId: '3c6c281528be4254b9106964253904d5', tagName: '没买' }
              ]
            }
          ]
        },
        {
          category: 5,
          groupList: [
            {
              groupId: '32ef2a9da61549bdbc0025ba1eaebe21',
              groupName: '近一年本渠道非车险投保情况',
              displayType: 1,
              tagList: [
                { tagId: 'f79960daf60d4d209105f07892f691ff', tagName: '买了' },
                { tagId: '521666b6fe98475ba6195aa5d437c36f', tagName: '没买' }
              ]
            },
            {
              groupId: '1c6c4f80b0e84b06a73ff094bd5c478b',
              groupName: '近一年本渠道重疾险投保情况',
              displayType: 1,
              tagList: [
                { tagId: '7c9a2973a12e443a908abf7c54f269d8', tagName: '买了' },
                { tagId: '156931f4122c4fcfac85533ccf5901cf', tagName: '没买' }
              ]
            },
            {
              groupId: '31244c130ec94859ade38f9993b97c19',
              groupName: '近一年本渠道医疗险投保情况',
              displayType: 1,
              tagList: [
                { tagId: '0a38a82efd774b7084d80cecf46ed344', tagName: '买了' },
                { tagId: '7f370ddf29f44075a92b5430897f5060', tagName: '没买' }
              ]
            },
            {
              groupId: '5c006574480b4fd3a3bbcbcb98b719c5',
              groupName: '近一年本渠道随人驾乘意外险投保情况',
              displayType: 1,
              tagList: [
                { tagId: '97a0b74efc1c41d893cc55a7956b3772', tagName: '买了' },
                { tagId: 'b7e3368060594b25aa4820b795d93f6b', tagName: '没买' }
              ]
            },
            {
              groupId: '5a0f80287202412db3e8a03fc8c7ac69',
              groupName: '近一年本渠道旅游意外险投保情况',
              displayType: 1,
              tagList: [
                { tagId: '0b287772a7194d6ba03c122608d1b281', tagName: '买了' },
                { tagId: '5432a6fa7dfd489fa6509dbc4aee6228', tagName: '没买' }
              ]
            },
            {
              groupId: 'dee33b0ee2d148f3b71596106cc9e5c0',
              groupName: '近一年本渠道财产意外险投保情况',
              displayType: 1,
              tagList: [
                { tagId: '4ce9b5da0bdc49b894b4e2a12da8d09c', tagName: '买了' },
                { tagId: '7f291e3560db44fb8e568efc35538e8c', tagName: '没买' }
              ]
            },
            {
              groupId: '2f26de9f9dc549d39883d3fad588af8a',
              groupName: '近一年本渠道宠物意外险投保情况',
              displayType: 1,
              tagList: [
                { tagId: '3a6053cdab1f49a88ee356f64a73f482', tagName: '买了' },
                { tagId: '2b6dfbd02cda4fa39420fee4ca7392da', tagName: '没买' }
              ]
            }
          ]
        }
      ];
      setAllAttrTagList(resList);
      setAttrTagList(resList);
    } else if (queryType === 2) {
      resList = [
        {
          category: 1,
          groupList: [
            {
              groupId: 'b44992b581f248cdb25a82658610f9c5',
              groupName: '用户亲密度',
              displayType: 1,
              tagList: [
                { tagId: '9cd76d1732d14dcaa869413c1c91094f', tagName: '低' },
                { tagId: '24e66c3ea34c475e935372f799546fee', tagName: '中' },
                { tagId: '512749e60e334710ae98ae31fffa6bba', tagName: '高' }
              ]
            }
          ]
        },
        {
          category: 2,
          groupList: [
            {
              groupId: '40e79aa13a864152af7513e604f4822a',
              groupName: '客户忠诚度',
              displayType: 1,
              tagList: [
                { tagId: 'fea408bb395c4e57befc27133ebb6ffd', tagName: '低' },
                { tagId: '649327f0a45a4219b0104787b598e2c6', tagName: '中' },
                { tagId: 'b7083aa9dfe2438e877322886e6cb68c', tagName: '高' }
              ]
            },
            {
              groupId: '0d2fd58cb0884fc1a7dcb364e5740132',
              groupName: '保障意识分',
              displayType: 1,
              tagList: [
                { tagId: 'a3467b0305a64c34853084221320b379', tagName: '低' },
                { tagId: 'aed0f2ee784d4ae897d728907d54146a', tagName: '中' },
                { tagId: 'c12a294895d641f5addaa4ed2899c7be', tagName: '高' }
              ]
            },
            {
              groupId: '3bac60ee56c84ce2a9cbe73eaa3f94e4',
              groupName: '裂变概率分',
              displayType: 1,
              tagList: [
                { tagId: 'cf4faf890b1142a287420e4cc17aebc5', tagName: '低' },
                { tagId: 'f42cb982f39541bfbac669df6c1ca824', tagName: '中' },
                { tagId: '32ae1ed3e410465f9269453b2e6c2976', tagName: '高' }
              ]
            },
            {
              groupId: '73871a7f06ac4a738a589bc583caa080',
              groupName: '价格敏感度',
              displayType: 1,
              tagList: [
                { tagId: '5729c69a9c3344f2b6dfdc77858fbd2c', tagName: '低' },
                { tagId: 'a0cbaddbd5824833b5ae17341cfdd615', tagName: '中' },
                { tagId: '4137054fa3f14a129d5873ba3d5f18b0', tagName: '高' }
              ]
            }
          ]
        },
        {
          category: 3,
          groupList: [
            {
              groupId: 'c70db32b62e94424b9d434d5e6191b40',
              groupName: '重疾险销售概率',
              displayType: 1,
              tagList: [
                { tagId: '06cbb73ac8124444b92bebe4e0fc4514', tagName: '低' },
                { tagId: '919d7a333a924ca28c75bb1724d73c3a', tagName: '中' },
                { tagId: '3009153389764f55a511558559232145', tagName: '高' }
              ]
            },
            {
              groupId: 'f15ca49a8e74422787dd8d5bb9710a6d',
              groupName: '医疗险销售概率',
              displayType: 1,
              tagList: [
                { tagId: '4c3d978e12cb4b2fbbc40469e849976e', tagName: '低' },
                { tagId: 'f44191faa24a4a689ac901221855004e', tagName: '中' },
                { tagId: 'e113c77818424f32901aafb3b2cf8bf5', tagName: '高' }
              ]
            },
            {
              groupId: 'dd4fd7d7ab61466bb791e108f7b9e3ef',
              groupName: '随人驾乘意外险销售概率',
              displayType: 1,
              tagList: [
                { tagId: '520b782ed82d45bc963960f4f8719243', tagName: '低' },
                { tagId: 'ab371d7f23a04cda8d99e062f921135a', tagName: '中' },
                { tagId: '48ec5bf229ed4b9083c7367804571654', tagName: '高' }
              ]
            },
            {
              groupId: 'a35fc89d5fc947a6ab1d79e9cd381008',
              groupName: '旅游意外险销售概率',
              displayType: 1,
              tagList: [
                { tagId: 'c6e676caf1c842d0baa554e3173bf12c', tagName: '低' },
                { tagId: '792b07183c8a48e8876c42615fbcd7f8', tagName: '中' },
                { tagId: 'c3f8c0d89d0e43c6b9017a3dd2decd91', tagName: '高' }
              ]
            },
            {
              groupId: '920fb64579b54778899585ea5e53205e',
              groupName: '财产意外险销售概率',
              displayType: 1,
              tagList: [
                { tagId: 'db6436336b594da386647b979e24f87b', tagName: '低' },
                { tagId: 'e9cfa68e0dfe4522aa585dee348d4818', tagName: '中' },
                { tagId: '53af5b8fd06d442ea64fb77629241116', tagName: '高' }
              ]
            },
            {
              groupId: '1917e8067cc14138ad39b11f07e4ba1e',
              groupName: '宠物险销售概率',
              displayType: 1,
              tagList: [
                { tagId: 'be28d0c0cd64473d8d49f097c02f9bfe', tagName: '低' },
                { tagId: '51f0d8de2f79429fb71a224e0577f5cd', tagName: '中' },
                { tagId: 'e747df5e9947414da3f38d1a04ec70f0', tagName: '高' }
              ]
            }
          ]
        }
      ];
      setAllPredictTagList(resList);
      setPredictTagList(resList);
    } else if (queryType === 3) {
      resList = [
        {
          category: 3,
          groupList: [
            {
              groupId: 'deca5da299e14e4283efb2785db228d0',
              groupName: '车国别',
              displayType: 1,
              tagList: [
                { tagId: '1f41ac99712e4b039d4d76d0e49c182e', tagName: '中国' },
                { tagId: '9bde8462d8fd4b6490ff3b0d0a76bc57', tagName: '欧系' },
                { tagId: 'ed0fd10f95be47e19ef05779d45486cd', tagName: '日本' },
                { tagId: 'bfc275e4936a4d2b88f9f306f84c89f3', tagName: '韩国' },
                { tagId: 'bf5e4cc88ed547608c9892f625968766', tagName: '美国' },
                { tagId: 'fbfbf33cac1f4633a96b7fe2fdc9f9b2', tagName: '其他' }
              ]
            },
            {
              groupId: '1451388441e54861a72f33e5a72e2848',
              groupName: '车类型',
              displayType: 1,
              tagList: [
                { tagId: '46a8f23ca1d44df3beb17d13bce9b578', tagName: '微型' },
                { tagId: 'a07e78cda0f54b368a568e4b33b50cc8', tagName: '小型' },
                { tagId: '89fa4cf980bc45afbd9b108399784a82', tagName: '紧凑型' },
                { tagId: 'd259f42565824aeeaeacbb644cd8e7bb', tagName: '中型' },
                { tagId: '3c7fb40033174ef2bdc64264fe68fa87', tagName: '中高级型' },
                { tagId: 'b68112623f5e4528a7556b7e9d4f92fb', tagName: '豪华车' },
                { tagId: '2beabbb8c4ca4010b6cb5a1ef581ab0f', tagName: 'SUV' },
                { tagId: '49248928d1ff4349baedae9a88637e62', tagName: 'MPV' },
                { tagId: 'a396ec06b1de4a69a719a788fc63d082', tagName: '货车' },
                { tagId: 'c4bf84ae9935468f855c4b475cadbf51', tagName: '客运车' }
              ]
            },
            {
              groupId: '55c14181d2e642a7b496b8bb53b07c84',
              groupName: '车出厂价',
              displayType: 1,
              tagList: [
                { tagId: '763e80a062e14c0aae95148e73963113', tagName: '【0，5万）' },
                { tagId: '433fb75d2ab24adf9e8c56a9c46952ee', tagName: '【5-10万)' },
                { tagId: 'b6b05dc8b11f496ba1b52bb5b69eb99d', tagName: '【10-15万)' },
                { tagId: 'e1d6b2a008744b768661df87a174bf51', tagName: '【15-20万)' },
                { tagId: '1d4f3039a83e4b7c8217dd487cde8e6e', tagName: '【20-30万)' },
                { tagId: '4de0ecfee7614840bcf508bbe58d75b7', tagName: '【30-40万)' },
                { tagId: '77a6145afed54346a86d5e1cec0ad6f7', tagName: '【40-50万)' },
                { tagId: 'ac9fa94735f5449aa19864e825e187db', tagName: '【50-70万）' },
                { tagId: '96a5947cfa95408db16debb82472ba0d', tagName: '【70-100万）' },
                { tagId: 'a735b77aa1ea4a8bb639804ae3f1f966', tagName: '100万及以上' }
              ]
            },
            {
              groupId: 'bb3ac5adc3214635b941f1a82f14f3ee',
              groupName: '车实际价值',
              displayType: 1,
              tagList: [
                { tagId: 'e1898d876b3e4aa9b2762ced78e20b22', tagName: '【0，5万）' },
                { tagId: '4a48cd59e36f4f5ba626d67880b846f3', tagName: '【5-10万)' },
                { tagId: 'fe2abb56b1fe465fad7fd7b4bc3d8001', tagName: '【10-15万)' },
                { tagId: 'be4d95c410ce4865bc3bba04f5619d6a', tagName: '【15-20万)' },
                { tagId: '4e500e99a49e4c279c9c1fcd614c1aac', tagName: '【20-30万)' },
                { tagId: '9fdc1961e3724a79a58b1567f9e01c62', tagName: '【30-40万)' },
                { tagId: '3c12c3ff95724b709d3904e83663bc6b', tagName: '【40-50万)' },
                { tagId: '29ab898d5e3743ec83a5e2888b524828', tagName: '【50-70万）' },
                { tagId: '1996684c1bbc46a3921446729f7e2b11', tagName: '【70-100万）' },
                { tagId: '2e1d6c1378c645678a0aeeabbae62ce4', tagName: '100万及以上' }
              ]
            },
            {
              groupId: '086b29f96e144e7092175d05d9dee657',
              groupName: '车座位数',
              displayType: 1,
              tagList: [
                { tagId: '50b8c53757044cb888df0f7fe5835c86', tagName: '2座' },
                { tagId: '5ac3202b3a2b43e680ecc7b3a49ab061', tagName: '4座' },
                { tagId: '9611d5c088864503829f2254d44117bb', tagName: '5座' },
                { tagId: 'ecb1ece5e5344ca0a9fb5b7a0c27f39d', tagName: '6座' },
                { tagId: 'ce11a636ae394f9bb2e6913f18dd72c8', tagName: '7座以上' }
              ]
            },
            {
              groupId: '06e6306307e64e878f0f3eaff4759b18',
              groupName: '车能源',
              displayType: 1,
              tagList: [
                { tagId: 'd986ba93300f466eb36702047612459b', tagName: '汽油' },
                { tagId: '7f245a7af08f4602b94165a37a7d5f93', tagName: '柴油' },
                { tagId: 'a2191cbd612b4897add6bc5d38393ced', tagName: '新能源' },
                { tagId: 'c1aece3369dd427ab21104ab92ca9609', tagName: '轻混系统' }
              ]
            },
            {
              groupId: '15695e9e8f1e49baa6acc8dd319848cf',
              groupName: '车龄',
              displayType: 1,
              tagList: [
                { tagId: '841c79a33c38460eb259b61b9b875344', tagName: '1年' },
                { tagId: '26ff3f0b46474845bbca58027b707a47', tagName: '2年' },
                { tagId: 'db2b7556fb8348f9ac345f291f866249', tagName: '3年' },
                { tagId: '8817739d4ce5467793e61349e947ae44', tagName: '4年' },
                { tagId: 'df5fd19f219743e59afec0d19baf56ab', tagName: '5年' },
                { tagId: '3d64f8df22c549378a25f388ff150625', tagName: '5年以上' }
              ]
            },
            {
              groupId: '36b457de2d5f43b49fd9ca39eded55c0',
              groupName: '车辆历史',
              displayType: 0,
              tagList: [
                { tagId: 'ccb25669554346d9896168885717c9d6', tagName: '一手车' },
                { tagId: '1fd81fcf91474da288f005014396d632', tagName: '二手车' },
                { tagId: '5180fc4425e447249d0e0405483c4209', tagName: '三手车' },
                { tagId: 'ca2b6ba3ef2b467bbfc243a7c5ba1e95', tagName: '其他' }
              ]
            },
            {
              groupId: 'd912e962f07b4d08b515001aba6a1a0e',
              groupName: '置换需求',
              displayType: 1,
              tagList: [
                { tagId: 'c8d0c4dadfe74add8523f4fe80276703', tagName: '未知' },
                { tagId: 'dfb3027abcad4a12b089abfdefa532f5', tagName: '打算换车' },
                { tagId: '8efc8a1581fc4eaea51df8500606b6bb', tagName: '不打算换车' }
              ]
            },
            {
              groupId: '255d48ec86be47bb9e7e0ff5cb4d4fdc',
              groupName: '年检到期月',
              displayType: 1,
              tagList: [
                { tagId: 'f7f2116c174049b8a12d41c34e6e5993', tagName: '1' },
                { tagId: 'a391728d600f4b899755a2a2a86e056f', tagName: '2' },
                { tagId: '757cfb77270f429baadead20de4c3b80', tagName: '3' },
                { tagId: 'bf1a65939e264fa296a5569e63ee1ca9', tagName: '4' },
                { tagId: '8019b0b6441448f5a1702a709784825d', tagName: '5' },
                { tagId: 'd34c8b2c4ceb48c680ecf84d23087699', tagName: '6' },
                { tagId: '9afb5b7ce0e040c69a1ca8b6d8de899f', tagName: '7' },
                { tagId: 'f91b746c4c6049398bc8117d4a6b7799', tagName: '8' },
                { tagId: 'd8d159af437f472995a441352a79ba2e', tagName: '9' },
                { tagId: '1a22e433c3114fab9d7351b82084364f', tagName: '10' },
                { tagId: '60109e926291463db560108c493bcf8f', tagName: '11' },
                { tagId: '15a79c4485b04930bcd6cfdf4bbd2082', tagName: '12' }
              ]
            },
            {
              groupId: '3396bb6948b94b50a3aa42d2bcbd3115',
              groupName: '年检状态',
              displayType: 1,
              tagList: [
                { tagId: '3bcb3090ff374d79829f37bedcbd3e7e', tagName: '待年检' },
                { tagId: '6cf60699a9184b119a8c319216b57794', tagName: '已年检' }
              ]
            }
          ]
        },
        {
          category: 4,
          groupList: [
            {
              groupId: '9ea263c7d6374787b7d0f62d1cda6040',
              groupName: '业务模式',
              displayType: 0,
              tagList: [
                { tagId: '2aabb02c5005421c9591e5cb644bc00a', tagName: 'DDH续保' },
                { tagId: '973e2e40b53142b5a3061a39d4b9926c', tagName: '兜底' },
                { tagId: '79bc1b560c054240978e83aec7f054d9', tagName: '电销赢回' },
                { tagId: 'c50ddf51e99a40d6a551f8f5c8750873', tagName: '自续' },
                { tagId: '83b50b8fce4a4d3d9a6f327c0dfbb886', tagName: '传统赢回' }
              ]
            },
            {
              groupId: '5adeb3dbdb38490fa8b522cde71694c6',
              groupName: '车险到期月',
              displayType: 1,
              tagList: [
                { tagId: '462f7143ec344bbe86bde82574b1094b', tagName: '1' },
                { tagId: 'd324b428e1eb48a0b0c1dc1b1601963d', tagName: '2' },
                { tagId: '09bd2cc6f7fc42f2b0e362b2893a30a6', tagName: '3' },
                { tagId: '500e04b7bbc64c6c8f3dbf1299c03107', tagName: '4' },
                { tagId: '8e3db3a1824046d28963056536b71efb', tagName: '5' },
                { tagId: 'c80b377da4034e6dad01412ac38c7930', tagName: '6' },
                { tagId: '2cde6eb3522a49daac20747342614eab', tagName: '7' },
                { tagId: 'f5a95387a7e34ab6886d0ee6ed0e62d3', tagName: '8' },
                { tagId: 'd0f6eddc99464f029ec9c1cef3ab6a5a', tagName: '9' },
                { tagId: '26737d487ea442898d7c807e0300f0dd', tagName: '10' },
                { tagId: '9f7838e544bc4b2895d4fa413a604a77', tagName: '11' },
                { tagId: '328b66d96094455eb8f35faa2b2377ae', tagName: '12' }
              ]
            },
            {
              groupId: '45ef862993244213993f703bbcf3f915',
              groupName: '交强险购买记录',
              displayType: 1,
              tagList: [
                { tagId: 'd2025e18cb0b43f4b217ee5bc55c7078', tagName: '买了' },
                { tagId: '5231c36191fc434d85b230447b8e6028', tagName: '没买' }
              ]
            },
            {
              groupId: '324addef97304966a58553ebc7d6e1f5',
              groupName: '商业险购买记录',
              displayType: 1,
              tagList: [
                { tagId: 'e3b28cb01515432da96479a27489f7ac', tagName: '买了' },
                { tagId: '6b491cdd32a8468a9ff0cd463c19aaff', tagName: '没买' }
              ]
            },
            {
              groupId: '253a5fe3b62946fda9de06726a68685c',
              groupName: '近一年本渠道随车驾乘意外险投保情况',
              displayType: 1,
              tagList: [
                { tagId: '85f1d6e3dd604703a0c2643b4bd8bab7', tagName: '买了' },
                { tagId: 'a41b1e6ac41e4fa8bb2fe4d606fbc54b', tagName: '没买' }
              ]
            }
          ]
        },
        {
          category: 5,
          groupList: [
            {
              groupId: '8a1aa57f7e1e4e94847590083992e3e2',
              groupName: '车险销售概率',
              displayType: 1,
              tagList: [
                { tagId: '69d8ae412f4d40b6b13e4d8b567c23df', tagName: '低' },
                { tagId: '539e23d3b8a84338a6e4758ac13a256e', tagName: '中' },
                { tagId: 'a97f4f5b0df548ab934005fd562eb5cd', tagName: '高' }
              ]
            },
            {
              groupId: '9c53c9aa210b4bf0b7e6fa2ea2c431ef',
              groupName: '随车驾乘意外险销售概率',
              displayType: 1,
              tagList: [
                { tagId: 'c2b9fbfdeeaf47ad94f1ea0c560c02e9', tagName: '低' },
                { tagId: 'e1ebe1820e9946eabbdb18384a16bf9f', tagName: '中' },
                { tagId: 'a065c0f6ca104abb971fe30ab6a7aa6f', tagName: '高' }
              ]
            }
          ]
        }
      ];
      setAllCarTagList(resList);
      setCarTagList(resList);
    } else {
      resList = [
        {
          category: 4,
          groupList: [
            {
              groupId: '6441a28dac0440fba9a899bd4940798b',
              groupName: '保险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '86889e372921407aa2cba5fbbe330959', tagName: '无兴趣' },
                { tagId: 'f99a1bbf833e40bbbac2b7b4dd94d167', tagName: '潜在兴趣' },
                { tagId: 'cc9795ab5b0442179946334686e340bd', tagName: '有兴趣' },
                { tagId: '750dc006dc8a49858a5ffaec525dd08a', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '820efbacd2a34fc7acfb4f54784d200b',
              groupName: '车险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '061f76f1b993463b9fd3f0dfc2ea8e22', tagName: '无兴趣' },
                { tagId: 'cd04c094c4e6476881e2fcd4592c62e6', tagName: '潜在兴趣' },
                { tagId: '6ded368a87a24c1dbc982f5b306b6db1', tagName: '有兴趣' },
                { tagId: 'f23c424e94334136ba74bf00f4032389', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '4e063391bda34f7381dacaeb92b6ddf1',
              groupName: '重疾险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '7e00c9625825488faa42333b85a701d4', tagName: '无兴趣' },
                { tagId: 'e57b55d3bdc9435b85eeb535ce4a0a0c', tagName: '潜在兴趣' },
                { tagId: '29a448c70f9548ed8bb5f557ae88e474', tagName: '有兴趣' },
                { tagId: 'dac9af4f345649a2ac7d30dd1154d8a2', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '7c5772915ca54306bdbd0724f81772c4',
              groupName: '医疗险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '5934ee088fd848ebac43e2398f46697f', tagName: '无兴趣' },
                { tagId: '438c78a2c8b24c13be6304e7b7a0d25a', tagName: '潜在兴趣' },
                { tagId: '7858eb3196664cfa943881015bca6754', tagName: '有兴趣' },
                { tagId: 'f1248580ab2f489783de11ce901aba4d', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '0863e399b45e4cae898aa4191c08281e',
              groupName: '随车驾乘意外险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'b816754a125a48168885e3f9ab7b797d', tagName: '无兴趣' },
                { tagId: 'b25742ec48b24470b9c66ea81909964a', tagName: '潜在兴趣' },
                { tagId: '6cba75e018e242529a322d216546ff06', tagName: '有兴趣' },
                { tagId: '5319c97c2f27421b900f574231dc9691', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'a161063e286f4aaab4180a17ffcd0767',
              groupName: '随人驾乘意外险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '7515dba64de04070a4d55cb73bf51741', tagName: '无兴趣' },
                { tagId: '3e5a5f4e44974052bbb1dd655dc43e1e', tagName: '潜在兴趣' },
                { tagId: 'b37a4d90f03c4839811db04f009838b8', tagName: '有兴趣' },
                { tagId: 'fe64fa739d964530be5c91d97494f29d', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'bf0f55022b8c4a3780b75538c348e94c',
              groupName: '旅游意外险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'd540cf78af1e4a47924d9e34c437b2bb', tagName: '无兴趣' },
                { tagId: '8b5a031ce7f04c64a79c190264831bac', tagName: '潜在兴趣' },
                { tagId: '718145fb784e419392865498221b4667', tagName: '有兴趣' },
                { tagId: '8e99762216634618ae824051706a0d6a', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '6d6ed5fa4b2c4228b61194a13cc77103',
              groupName: '财产意外险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '9eac71482a51444097dd9c744ffa4656', tagName: '无兴趣' },
                { tagId: '636795b7432a475d86a1f49d934ad581', tagName: '潜在兴趣' },
                { tagId: '8f43dda7a91c4abb92dd1d99dd7f818d', tagName: '有兴趣' },
                { tagId: '1f256ac330eb497785e8503178a8f23d', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '0bfa370a8d0b4a9f96a2ff3d7bfe760d',
              groupName: '宠物意外险产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '5e706aff3d454249a3164d24f40da7d8', tagName: '无兴趣' },
                { tagId: '70af5da7f0d74797a7debeb15f3b3848', tagName: '潜在兴趣' },
                { tagId: '93fa533707944eafa3e1b11f0b8a009f', tagName: '有兴趣' },
                { tagId: '7956ca5335dc4492b59492624514574f', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '79b7d5b8defe4d5fa1226cb9da1b022a',
              groupName: '其他产品兴趣',
              displayType: 1,
              tagList: [
                { tagId: '235fba59ab094ee5baec85408e6a7177', tagName: '无兴趣' },
                { tagId: 'b9424a6faf454b648d527004001ce1d8', tagName: '潜在兴趣' },
                { tagId: 'd8d64c5742c4459098da90b50917f914', tagName: '有兴趣' },
                { tagId: 'a0c32cccc6a944e5a4e094c042469751', tagName: '强烈兴趣' }
              ]
            }
          ]
        },
        {
          category: 5,
          groupList: [
            {
              groupId: '4f88c0a01bfa4fe1a03afec206a91075',
              groupName: '内容兴趣',
              displayType: 1,
              tagList: [
                { tagId: '84974d9e2b034ff1bf3ba944b82c8b54', tagName: '无兴趣' },
                { tagId: '0e5a34989c6740aa8f450d93885e03a9', tagName: '潜在兴趣' },
                { tagId: '450ec74ec79a428591aae3496912affb', tagName: '有兴趣' },
                { tagId: '87c91ac0944545118e4e9a53eaefaa28', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'a1f7d2123b6e4d198a57185bb2e3eec7',
              groupName: '选车指南兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'fb24cc75460f483d8c5cb109de3af94f', tagName: '无兴趣' },
                { tagId: '29efed2c2eb44e2a89d7962bf2666f64', tagName: '潜在兴趣' },
                { tagId: 'af6c85ae09304f5ab3d934c483648868', tagName: '有兴趣' },
                { tagId: '5602e2cb5e7e4ee9ae04b33ea8d9cb04', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '423ce60b3f674777941fb35b94d58dce',
              groupName: '养车用车兴趣',
              displayType: 1,
              tagList: [
                { tagId: '7a21f518b22e4d3c923c00de88e115f0', tagName: '无兴趣' },
                { tagId: 'f86c782bacd5400098f710307a9c2468', tagName: '潜在兴趣' },
                { tagId: '1df356a949b9441ca38f822e1e4bc782', tagName: '有兴趣' },
                { tagId: 'fbc1a040a4814ece928aa5eec138324f', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'c6e2cebdb97e497aa581ddb0d44b90d2',
              groupName: '车险百科兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'afc4a91359e141ccb9fca921696b7d81', tagName: '无兴趣' },
                { tagId: 'f89742df17bd449b9d3183679399a4d2', tagName: '潜在兴趣' },
                { tagId: '5847c4ede2ae4bc7a03537b954e71955', tagName: '有兴趣' },
                { tagId: '076cdbf21f1145339b62b2ba586d6506', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'f06fe28325b74448bcd2627333142a55',
              groupName: '健康话题兴趣',
              displayType: 1,
              tagList: [
                { tagId: '26a71dea192d4670852e7da67fecca96', tagName: '无兴趣' },
                { tagId: '999bd6d9a10f464a80164a5d1a131218', tagName: '潜在兴趣' },
                { tagId: 'b5b3d3abc87e42019a2bc0be6cb30e57', tagName: '有兴趣' },
                { tagId: '23533fa75271433b83ea325fcdeccb5b', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'e46dcd6c068a4e619b24cb12cdbac164',
              groupName: '风险保障兴趣',
              displayType: 1,
              tagList: [
                { tagId: '8ac1817976374090ac4ac9fcfeaace97', tagName: '无兴趣' },
                { tagId: 'fd99d711b4dd4fc4ab18fc3d7f98c263', tagName: '潜在兴趣' },
                { tagId: '4e10ea4cc0434151ae943709654bdbb8', tagName: '有兴趣' },
                { tagId: 'b80f1d3808054b718f9da2b53d345d72', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '03ab298b84e04a4bb865e80aaa7b33ea',
              groupName: '投资理财兴趣',
              displayType: 1,
              tagList: [
                { tagId: '38ee511313704e91b824d75035d7effc', tagName: '无兴趣' },
                { tagId: 'e690ef771d984a648a93e8f5fd23ab7d', tagName: '潜在兴趣' },
                { tagId: '7a7809d96aa84b10b596e5951ff82e67', tagName: '有兴趣' },
                { tagId: '0791faa669ba4ea294e247b432081700', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '9f1e37d7c76f4f1d8db99a15216f7837',
              groupName: '地产兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'ae69c2d05298464e87b7c3476f124675', tagName: '无兴趣' },
                { tagId: '0d9430d4856f4e6ebf8a4beaef2510fa', tagName: '潜在兴趣' },
                { tagId: 'c76641ca41b741429906c5038733ead5', tagName: '有兴趣' },
                { tagId: '33d89e8d67aa4635aac1d0ed35d2cf0c', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'fa42822bc3974b308bff795e70f309c6',
              groupName: '教育兴趣',
              displayType: 1,
              tagList: [
                { tagId: '384464f7f2944e9eb5e7a67fa80ced9c', tagName: '无兴趣' },
                { tagId: '808ca8129cd84d05b0df3ee566b1e3b6', tagName: '潜在兴趣' },
                { tagId: '1379a853ccff4053849e8cf46e823ecf', tagName: '有兴趣' },
                { tagId: 'aa1c85c4a548475997017b2c6460c690', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'abc3d9b9cc924fd594488551a1f48c6e',
              groupName: '社会热点兴趣',
              displayType: 1,
              tagList: [
                { tagId: '886ff4d0d3ce4e389b20b4961f4eea8a', tagName: '无兴趣' },
                { tagId: '76b2f09452934b3bb4189af9a16c5744', tagName: '潜在兴趣' },
                { tagId: '0c0ab6f5d6ad404f8ae798a320a582eb', tagName: '有兴趣' },
                { tagId: '804bc28fada44c9e8155d2a7482e031b', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '59e52b256a6c4490b3807b6226482fce',
              groupName: '吃喝玩乐兴趣',
              displayType: 1,
              tagList: [
                { tagId: '4bcb7c8cc55746bebed962f3b65d112d', tagName: '无兴趣' },
                { tagId: 'ab41dedd5e3d4868a9f52d49f980c21b', tagName: '潜在兴趣' },
                { tagId: '213dbac7246944c7a2ccc0e134994c80', tagName: '有兴趣' },
                { tagId: '4c4715a2a87d4af3b34a0c4eb167cbe1', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'cd402b7be65e446db28eb0aeb620f902',
              groupName: '新能源兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'a43c6c08606a4a03936d03613a93babd', tagName: '无兴趣' },
                { tagId: '23e782482aae436187afffede62aff93', tagName: '潜在兴趣' },
                { tagId: '1afeb27a266e43bb87e1bc4456ac8a85', tagName: '有兴趣' },
                { tagId: '40d28d77f52040db8c4b1886a257d6c9', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'c4812ca098dd4bf586103760772fa711',
              groupName: '七座车兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'acd3ccb81fcf49d1bf4f615e258a99ac', tagName: '无兴趣' },
                { tagId: '32062718ed7940e48e19be8cf6581ace', tagName: '潜在兴趣' },
                { tagId: '1bfd9a84b1094e64a1070919e6027c14', tagName: '有兴趣' },
                { tagId: '65e55db52f9f4ca5907bb8573454dd8c', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '67ff63bfcf1349009016dcb86f7d6d34',
              groupName: '车评兴趣',
              displayType: 1,
              tagList: [
                { tagId: '636f1c8d45754d32a29cc2d06875986d', tagName: '无兴趣' },
                { tagId: '25c3ec7311ae48cd843345d2a15009b5', tagName: '潜在兴趣' },
                { tagId: 'e9d4d1b9a3394e6a93d9b05f0df0472b', tagName: '有兴趣' },
                { tagId: 'd642e16fa0bf4fee9f741c65d884b976', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '852e083c55054c179297046780b3ec86',
              groupName: '养车兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'e36278edfece418a8f87c4585c2aa561', tagName: '无兴趣' },
                { tagId: 'f6a53c6668ac4c6e8ca8638a0fc2dcb3', tagName: '潜在兴趣' },
                { tagId: '572adc94004042cebcf5e220b2667933', tagName: '有兴趣' },
                { tagId: '078f64c45a5445b787d38ec38242ae67', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'b4519ff6801345bdb483ae2f59e2dffe',
              groupName: '用车兴趣',
              displayType: 1,
              tagList: [
                { tagId: '693fd86281be4e589e92b006ea7a87ae', tagName: '无兴趣' },
                { tagId: '6daa355568a14e828557622074accba9', tagName: '潜在兴趣' },
                { tagId: 'ddce265f49124a1790b07b0c0bd769b0', tagName: '有兴趣' },
                { tagId: '4a17511dcfd740d78b6f5669c1dd65d4', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'e4b0b9a4cad74333b343a26104f73854',
              groupName: '车险配置兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'c9f5e3a0fc5b4a8a8b7029d7c54904cb', tagName: '无兴趣' },
                { tagId: 'da91a9f7d2994cb8aaf3ed07d265c1d2', tagName: '潜在兴趣' },
                { tagId: 'dd8a96fa54284e2ca78ebcfc76f9c122', tagName: '有兴趣' },
                { tagId: '007571b8bfb549c88e725cac334c123d', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'db3272bd62314cb6ad2be86f4e1aac11',
              groupName: '车损险兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'c43a6db8b3e54ee68212242a551a4f5d', tagName: '无兴趣' },
                { tagId: '84adc6fec353406ca90aedd307212626', tagName: '潜在兴趣' },
                { tagId: '0765c689bf6a43e4892e2fe7bff0962a', tagName: '有兴趣' },
                { tagId: 'd57feb253727420a8566027930af3964', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '714ea893d2534c5a82ea14313041bd5c',
              groupName: '三者险兴趣',
              displayType: 1,
              tagList: [
                { tagId: '21717f524d124fce8b69b7c1153d7e44', tagName: '无兴趣' },
                { tagId: '2d45d1cb152a4ba18d6aeb513a68feac', tagName: '潜在兴趣' },
                { tagId: 'd5620c3d37ab4b7981cc01408ba593a7', tagName: '有兴趣' },
                { tagId: 'fd4a8ee8264d4cdd940e519049db22bc', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '12653b69d787410a8138d773b4bfc7d3',
              groupName: '座位险兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'baa24dade91a456180e3906b45df96f1', tagName: '无兴趣' },
                { tagId: '2d88538e165747398e9e00da486bed4d', tagName: '潜在兴趣' },
                { tagId: '3ce4a2cc8e774329a791e5091cba5c1a', tagName: '有兴趣' },
                { tagId: 'f89861577ca344cb81501111af60192e', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '04e371ba34ca40deaf23c1c84b74fb24',
              groupName: '随车驾乘意外险兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'e8d5e3f398bb4c7dbda488c42b7076b7', tagName: '无兴趣' },
                { tagId: '3b25cfed047d4bd89122eab8be2ac182', tagName: '潜在兴趣' },
                { tagId: 'c22040ec57f74129b0ac193a4605e646', tagName: '有兴趣' },
                { tagId: '2fbf8338007c4fd5bc18344ca0e129b1', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '034416a0390d4a1ab2b6c282d451c596',
              groupName: '随人驾乘意外险兴趣',
              displayType: 1,
              tagList: [
                { tagId: '2f7fa905800e4e8faa37f722cf18b746', tagName: '无兴趣' },
                { tagId: '9ce1a0a030594278a6b8d0043b81faf4', tagName: '潜在兴趣' },
                { tagId: '3afa826d18f54508af0c544befba8826', tagName: '有兴趣' },
                { tagId: '45d19647b5aa4397a8553eab0ec173f0', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'b1ad1326e8644ece88b12fa5f082af58',
              groupName: '出险理赔兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'dcfc9cf13bf94690a768973cc88f8f39', tagName: '无兴趣' },
                { tagId: 'b3bacd91d54f40bfad9e90295e8bd5aa', tagName: '潜在兴趣' },
                { tagId: 'cb50e981424949c9b4cfd62b73f2eb85', tagName: '有兴趣' },
                { tagId: '82e2c2d63ec948f695074f51aea6fed6', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '36fa043a83714d1fbecc2c27892a695f',
              groupName: '运动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '2939aca5609a4d12873c5d46bbb43aac', tagName: '无兴趣' },
                { tagId: '5da2dff17b1b4e73b1d80dca9eb0818a', tagName: '潜在兴趣' },
                { tagId: 'd75613fa724d4c1f9ebc8e7459feaa56', tagName: '有兴趣' },
                { tagId: 'ab93ee855ce2407d82b8835c25592de9', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '9ad73fcc454840b7aee43253661c227e',
              groupName: '生活兴趣',
              displayType: 1,
              tagList: [
                { tagId: '7202466a70c241bcabfe2d7ab2926f5b', tagName: '无兴趣' },
                { tagId: '106301a1787d4585bec2fc8b5baab0b7', tagName: '潜在兴趣' },
                { tagId: '82d1f3b158fe4b5b8fc11df30b2aae17', tagName: '有兴趣' },
                { tagId: '403108e674134cd4adad919bcfff6fad', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'e8d58da1499d4cf0be91acef1cc5ebc6',
              groupName: '养老兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'f92e9620ee314cb18b4cb016c1cb1f9d', tagName: '无兴趣' },
                { tagId: '9c568ee78c8642e8ac4eb9c48f70107f', tagName: '潜在兴趣' },
                { tagId: '9fe8b9f5b3e342d2a4c8043977d09428', tagName: '有兴趣' },
                { tagId: 'dfd3b3c5599c44389a1c8a0fdb0d8813', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '6ecb921ac022417980a50fe3f2d0e4ab',
              groupName: '两性兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'e283a5ca9c1d4fadaf408e21c1a27272', tagName: '无兴趣' },
                { tagId: 'c9412f44b62a45e28b844e0414577bfc', tagName: '潜在兴趣' },
                { tagId: '0475701d87d946d1b4b706a11e3e729d', tagName: '有兴趣' },
                { tagId: '9a8a3b3ecff6415ebc546d0a9fd36f0e', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '5bb501b9f8904cd68da7c6a1176760c9',
              groupName: '社保兴趣',
              displayType: 1,
              tagList: [
                { tagId: '4db9836da7524fcd97188bf649d73cf0', tagName: '无兴趣' },
                { tagId: '36b4776c3b8845e792a2b3317e2224c3', tagName: '潜在兴趣' },
                { tagId: '966e18fc0b964f59a51ff1a2214bbe74', tagName: '有兴趣' },
                { tagId: 'c65431af2c8442d8a0ce945bc4f8a8df', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '2246c3f17d324160bda74b489d2e2f28',
              groupName: '重疾兴趣',
              displayType: 1,
              tagList: [
                { tagId: '5c27b0ea9cab4854a4be009a35a6f343', tagName: '无兴趣' },
                { tagId: 'eed96e4b1ae64adbb99a6e0613c00a0c', tagName: '潜在兴趣' },
                { tagId: '78176d7574c74135be6fc6c530026185', tagName: '有兴趣' },
                { tagId: 'dae6a3d73a514ce4850305103ae3dcd2', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'f593980b5dff4ef6a4da8025273ed6cb',
              groupName: '医疗兴趣',
              displayType: 1,
              tagList: [
                { tagId: '39e0285270794a029fede5fc0abc42a0', tagName: '无兴趣' },
                { tagId: '1334bb1d6df84539ad4ac5324c9d6fe9', tagName: '潜在兴趣' },
                { tagId: '15bf65b640884ab58060659d4ecd0e37', tagName: '有兴趣' },
                { tagId: '3fc90749297f45f6a3658e65587edca6', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '47605f2c0c584c5c9cb678a1151b3583',
              groupName: '生育兴趣',
              displayType: 1,
              tagList: [
                { tagId: '92549eecea464413b9e240dcc0f98008', tagName: '无兴趣' },
                { tagId: 'f6915a15f34744ec8aad9a11d38f2d75', tagName: '潜在兴趣' },
                { tagId: 'a4f4e6902d01473c927525671efa3473', tagName: '有兴趣' },
                { tagId: '98d8957acef04ccaa9b40eaec31d4382', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '95ec0b2a1f7745108523b4c32402f980',
              groupName: '意外兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'be7b60ff9a7e423cb6f53ddb111dae57', tagName: '无兴趣' },
                { tagId: '49ddedd224414908b67f600698732f9b', tagName: '潜在兴趣' },
                { tagId: '9b601bf1eb35454ab751fb8a1c5a7617', tagName: '有兴趣' },
                { tagId: '03d4124a2a3546b0a22a7dbee384af2f', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '48e4452aac744bfe83acf1ef5d52aa93',
              groupName: '股票兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'd05fc5d3babd4268a08c989b15c64422', tagName: '无兴趣' },
                { tagId: '9cba6f8f761e49beb2ccb480e80516bb', tagName: '潜在兴趣' },
                { tagId: '5e8e2358c72447a782c18f022d9816c7', tagName: '有兴趣' },
                { tagId: '7e7ed078184747cba1e0282a264041a7', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '1ca65d3506084b2896dbda58889312e1',
              groupName: '基金兴趣',
              displayType: 1,
              tagList: [
                { tagId: '143df5a88d2b4615ae0918b0533df3cc', tagName: '无兴趣' },
                { tagId: '571c7e1779b44b0ab0a47cf12c8fd1bc', tagName: '潜在兴趣' },
                { tagId: '4450bb7ee8994bbca49209bd1104714c', tagName: '有兴趣' },
                { tagId: '13ed5186211c4c0d893b197a5efd10c5', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '392a266b940a4459a929b2fb248f4063',
              groupName: '银行兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'f5f213b90a444b358b6cdb63447f7fc0', tagName: '无兴趣' },
                { tagId: '051707ae5c184137a7492e63c3b2922c', tagName: '潜在兴趣' },
                { tagId: 'cbfa32566d0b4853b207f1abd7e3d796', tagName: '有兴趣' },
                { tagId: '85d8296d001740cf96c9dd79eba73c9a', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'c24830804bbb424cada9114a21aee762',
              groupName: '虚拟币兴趣',
              displayType: 1,
              tagList: [
                { tagId: '3183ac263e604799bab1da083dfa6449', tagName: '无兴趣' },
                { tagId: '65f5f387e0d64d46a5675ae6fa6fe6cb', tagName: '潜在兴趣' },
                { tagId: '622abf812be2400fb4966cb53854ac45', tagName: '有兴趣' },
                { tagId: '18e1e141175b45aeb0db0f7794ae127d', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'cbd5f79759ec4a7795000600de37f9e7',
              groupName: '保险兴趣',
              displayType: 1,
              tagList: [
                { tagId: '360b25afab9046fba36a0be7781dd200', tagName: '无兴趣' },
                { tagId: '9906d19a462841fda4b58dd9e78479f7', tagName: '潜在兴趣' },
                { tagId: '2cd6640bdb4a43b380f22943906f45ff', tagName: '有兴趣' },
                { tagId: '2bc3060cd1044b9086d313108d0610cc', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '3837c638203d437e9ea3f9b490fd2b62',
              groupName: '财经兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'ee3057dd8bb94a089eeb7593087661b7', tagName: '无兴趣' },
                { tagId: 'ea27c78025f64280bdec74a1c4dd15b7', tagName: '潜在兴趣' },
                { tagId: 'd65f33abf8e945fb9ea65dd3ed88d252', tagName: '有兴趣' },
                { tagId: 'ddcc2d19e76c489796b234cd650a00af', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '113f492b558c47b99e674e11a3ea814f',
              groupName: '时事兴趣',
              displayType: 1,
              tagList: [
                { tagId: '0156a976d2604d11aa0fa48bb9f87983', tagName: '无兴趣' },
                { tagId: '0fb4cc36bb21498c86ed566403971255', tagName: '潜在兴趣' },
                { tagId: 'd8a1e75bc3404aa5b03024f1a2a1031e', tagName: '有兴趣' },
                { tagId: '4e4b2b4122f9493fba5f63d917c1cba6', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '8fecdfa884584923886ca4a714c2bac7',
              groupName: '房产政策兴趣',
              displayType: 1,
              tagList: [
                { tagId: '43a8e1a043b64aaa9dc70ca22f60b796', tagName: '无兴趣' },
                { tagId: '4eb111961cfa4da4aa636af750d40f73', tagName: '潜在兴趣' },
                { tagId: 'c42d9c85979e4515a7ee2916d6af8459', tagName: '有兴趣' },
                { tagId: 'd98c6fa5c96345819fc6c9c8675cddab', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'ea801dace3924813baa748876c336a83',
              groupName: '房屋保护兴趣',
              displayType: 1,
              tagList: [
                { tagId: '3afcb4a8624e4d2494956f8bbfa0d64f', tagName: '无兴趣' },
                { tagId: '3e179a7592e14636bae93110ddba3096', tagName: '潜在兴趣' },
                { tagId: '1d6cb6ea2d974d5296ae3ff491781cad', tagName: '有兴趣' },
                { tagId: '57efffedaab44a5d8c1681006051e53c', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'bd9eafd9bfd140a59ec5c5530a908564',
              groupName: '育儿兴趣',
              displayType: 1,
              tagList: [
                { tagId: '02371053a7724a8eb754c9888fc9c38a', tagName: '无兴趣' },
                { tagId: '492b039398384490ba7bc91844411005', tagName: '潜在兴趣' },
                { tagId: '357c4eb889834592982d667149a55781', tagName: '有兴趣' },
                { tagId: '8a5b2b84f1b546b9ac30f087e9d38bfc', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '6aa9596e7a234fc8849efdb2e886bae9',
              groupName: '留学兴趣',
              displayType: 1,
              tagList: [
                { tagId: '0b8cdfe8275d442fb870e25f11d7a8f4', tagName: '无兴趣' },
                { tagId: '8bc5f8fa28854f3582878b54e05c0fca', tagName: '潜在兴趣' },
                { tagId: 'fa168f73b51d47ebb1761d31785dbfe4', tagName: '有兴趣' },
                { tagId: 'ed2bd2448af44991b626a876cd4ab6d9', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'cb41475da3334e419711706187b2c7a6',
              groupName: '阅读兴趣',
              displayType: 1,
              tagList: [
                { tagId: '4f2b78b6d2c64deca5e38151a35007d8', tagName: '无兴趣' },
                { tagId: '0271c16d78514d159cbd877df02ef9fd', tagName: '潜在兴趣' },
                { tagId: '4a27c474d62144a58dc511427292a478', tagName: '有兴趣' },
                { tagId: '7cb0a31fb2ef49cdbcd4224051be4816', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'eeb84b0b82ba4ecbb4fc423f5b17441f',
              groupName: '职场兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'f69f57310bf242eba8422516335a8230', tagName: '无兴趣' },
                { tagId: 'a18dbced80704af2851fab446886d19a', tagName: '潜在兴趣' },
                { tagId: '2a461ccdf79748d3b78bbdfe3972d7fa', tagName: '有兴趣' },
                { tagId: '5775231eaec843c29a90cc8ad028dd5e', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '9ed48b736e4e4eb5a90a90fc11738bf7',
              groupName: '国内要闻兴趣',
              displayType: 1,
              tagList: [
                { tagId: '12926970a78c465cb750eadc2e3f84fa', tagName: '无兴趣' },
                { tagId: '1b3fd95704df43c098eda457bbc08419', tagName: '潜在兴趣' },
                { tagId: 'acde9f9b2f7345949d169899468c8e38', tagName: '有兴趣' },
                { tagId: 'db55dc149a334b129650612db6c490f4', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '0ed9eff49d8f47959c4f5bcf8d6cfdcc',
              groupName: '政策法规兴趣',
              displayType: 1,
              tagList: [
                { tagId: '6e91ce631e1647658c6fd67e021957ab', tagName: '无兴趣' },
                { tagId: '5aeff5d2fc77431caf05a7f9a94ccc26', tagName: '潜在兴趣' },
                { tagId: '76369685b3b848d593ca922592698084', tagName: '有兴趣' },
                { tagId: '30f54e64416741469029db4efc9526d3', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '275eed4bf372428b8c0cd61c61f7f914',
              groupName: '社会环境兴趣',
              displayType: 1,
              tagList: [
                { tagId: '8fec9374a88d4aa6bf9aa09197617594', tagName: '无兴趣' },
                { tagId: '9b9541a427cb4e7d9a6670578f82ca9b', tagName: '潜在兴趣' },
                { tagId: 'dcecad7e30054bb99a057cda5b530a90', tagName: '有兴趣' },
                { tagId: 'ce98d811c17a4fe6915933740691d9d7', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'db146ea0faf84a15aa8e792aa16fd4ac',
              groupName: '国际新闻兴趣',
              displayType: 1,
              tagList: [
                { tagId: '674384be63d046cbb079abea45e87ad3', tagName: '无兴趣' },
                { tagId: '39bbde0fc58747818084d7ae93475b2a', tagName: '潜在兴趣' },
                { tagId: '6216e69d8c624756bf3103a07f776d74', tagName: '有兴趣' },
                { tagId: '5a8faff11892454698dc19ada5cbf3fa', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '9b5a2e04552d452f9e2ebb9cea3b0f32',
              groupName: '科技数码兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'ef774130cd104a06a4b96103b1f9b5a5', tagName: '无兴趣' },
                { tagId: '3fecae682c524e02bb0fefe50d4d014f', tagName: '潜在兴趣' },
                { tagId: '19ae69d455d14531a581fdb6967ee75c', tagName: '有兴趣' },
                { tagId: 'd73b59c1b240417998983d0269cedfe1', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '4b58adc4b014495ab607a545464e3305',
              groupName: '美食兴趣',
              displayType: 1,
              tagList: [
                { tagId: '60bdeab32a3d4efbbcf974cc3978bc1e', tagName: '无兴趣' },
                { tagId: 'ee8420825047412ca0be5bab3f26d48d', tagName: '潜在兴趣' },
                { tagId: 'a2045167c8af48f5aafb0fcc06d9cdba', tagName: '有兴趣' },
                { tagId: 'd999a206eec441bd8f3ff33953dc32ea', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'fa89e12302114754bfbda22158bc4f47',
              groupName: '旅游兴趣',
              displayType: 1,
              tagList: [
                { tagId: '13b1a7b4c391446d88c5f1f6c1814a69', tagName: '无兴趣' },
                { tagId: '2a9bca50112347f0b7f7d63ed9bf0820', tagName: '潜在兴趣' },
                { tagId: '4e1071679ad149e49447f05f24bb3678', tagName: '有兴趣' },
                { tagId: '47645d1d8d3345289aa3d224177e3d91', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '429f53108e294384a7fd49e24009e154',
              groupName: '时尚兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'fae196fed89e46a49c90ef3908cb7cd4', tagName: '无兴趣' },
                { tagId: 'a93e9224c9424b6d8315e5a77c65c205', tagName: '潜在兴趣' },
                { tagId: 'bf47a4e7957143cf8bed9854be15fc36', tagName: '有兴趣' },
                { tagId: '70db7873bfac4cdfa9a77e1dd3a9cbd9', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'b45d7caa91a34b64802cf3c9892468b4',
              groupName: '星座兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'f2746af25e474b969669bcbcf0ce28f7', tagName: '无兴趣' },
                { tagId: 'ef6e960e54604985b73835d8cc0a7fcb', tagName: '潜在兴趣' },
                { tagId: '3f5cf785d6c64c909985eba9873cdbdd', tagName: '有兴趣' },
                { tagId: '7932c311967d4fb78b24823963d4d372', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '696cae91b0a04bb9940b47e2e397db1e',
              groupName: '动漫游戏兴趣',
              displayType: 1,
              tagList: [
                { tagId: '9346904d17c2429cb1a7fda6d853419a', tagName: '无兴趣' },
                { tagId: 'cbe77c9967a74e4f91998b2ca558fe3b', tagName: '潜在兴趣' },
                { tagId: 'fea47f6ff67c47d688f23b9b02203379', tagName: '有兴趣' },
                { tagId: '92f9703171df4db5b7bc812094db505f', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '09bbb799698f4cfd8bf1a130f0f090c1',
              groupName: '宠物兴趣',
              displayType: 1,
              tagList: [
                { tagId: '0e693f108f994029bc6913de5639477c', tagName: '无兴趣' },
                { tagId: '94b80de4780847db942f15f31a272544', tagName: '潜在兴趣' },
                { tagId: '749882a6936d46c98caba565a958ac6e', tagName: '有兴趣' },
                { tagId: 'f74bf748c9554959993cc588818bd0f8', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '274b1f679f4b4e1d97e5bb9a96fb56b9',
              groupName: '电影兴趣',
              displayType: 1,
              tagList: [
                { tagId: '9fc816fd59cc4edf888556c6fc623096', tagName: '无兴趣' },
                { tagId: '4e7a51d596c64f63a995a2a736f4d570', tagName: '潜在兴趣' },
                { tagId: '4b3e79e90e474204b3962d38b6cdb880', tagName: '有兴趣' },
                { tagId: '85e5173197284232a3ab1a1040234d38', tagName: '强烈兴趣' }
              ]
            }
          ]
        },
        {
          category: 6,
          groupList: [
            {
              groupId: '2360a55efebf41aca370d92b79261b84',
              groupName: '活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'b5132a305afe4fc5b6b7cc4b382c5afd', tagName: '无兴趣' },
                { tagId: '73aab7af94984b9f9b205f49f18a6acf', tagName: '潜在兴趣' },
                { tagId: '02aa5ffe9b534114ba58deb9d5646033', tagName: '有兴趣' },
                { tagId: '67d28745ff65428181a215066b4a357b', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'fa174f46dee24b408b73377d81183bd0',
              groupName: '营销类活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '95a71a6b3d634772be658a03fdd93cb5', tagName: '无兴趣' },
                { tagId: 'e8ec9dfa86b94f0494fbfb84a5c90740', tagName: '潜在兴趣' },
                { tagId: '1c1eabcec31d41d4b8aea82dfd228f0d', tagName: '有兴趣' },
                { tagId: 'f3a172e7e5574d5db50c187d6f552663', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'e0ba28961f254fb1afbe4d036c39a4d1',
              groupName: '互动类活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '684df8223f89466ab6d7d31c135856ef', tagName: '无兴趣' },
                { tagId: '8ae3546a7150497a8651575df9b86656', tagName: '潜在兴趣' },
                { tagId: '2da3b3ca858d4c409c6e84a60c7ff033', tagName: '有兴趣' },
                { tagId: 'bda55371f7d04eaebe5c9d388fc22e88', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '074b4df29a63426bb44a23e02f00ff3e',
              groupName: '标签类活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '77e1792f3035479b93c1202c1a1478af', tagName: '无兴趣' },
                { tagId: 'a76ef1487f8d4c6cbcd390dca1785b51', tagName: '潜在兴趣' },
                { tagId: 'ce1cebaaa22b48c2b5ee4ed037cdfd36', tagName: '有兴趣' },
                { tagId: '5dce4b914c91458f9e61233d5d2d054b', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '13183b0fb9784e2f94c474cb8980f5e2',
              groupName: '车险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'e6cc973d93e84c5d8c4ba4c4ecb31cf3', tagName: '无兴趣' },
                { tagId: '2591ea80447f44e3b6ce442fe2d318b9', tagName: '潜在兴趣' },
                { tagId: '42eaa7cc421a45da8026caf9b8e99110', tagName: '有兴趣' },
                { tagId: '8370c36713e64103b8685a949cf8054a', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '336ed0d9bbba46b78d7c8577646d9ecf',
              groupName: '重疾险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'ea377920ceec4a3cae9ef76cd6243bbe', tagName: '无兴趣' },
                { tagId: 'a9c60a2573754ffa9b5072bb517c419d', tagName: '潜在兴趣' },
                { tagId: 'a96b231586654fe696c29891698f5039', tagName: '有兴趣' },
                { tagId: '37048867f3794c698d4058cd69d786f4', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'e6a76b3f8fda4dd4a2175eb364b5c47e',
              groupName: '医疗险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'b6b21aac56e94683b23662cdb0340bed', tagName: '无兴趣' },
                { tagId: '053f6b05f20b4ab3827aadf6516aa138', tagName: '潜在兴趣' },
                { tagId: 'bb346a192c3b40f0994354222eea5b2a', tagName: '有兴趣' },
                { tagId: '8c17cf56823b4aafb1530ddc978aa9f2', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'ee14a05babc24203a25886d2377a9b34',
              groupName: '随车驾乘意外险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '77d78c14e6a842ee86f7cb0e38e3b95a', tagName: '无兴趣' },
                { tagId: '9a693dc7aa124a05a718dc5ac07b7e97', tagName: '潜在兴趣' },
                { tagId: '5366ee412a2b4f4a9f37139f07842bce', tagName: '有兴趣' },
                { tagId: '0cca7ec7c0f445f98fd3417122fd9b1c', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '3c24833e71e244a1a2187478df44bbc7',
              groupName: '随人驾乘意外险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '320fc7089d7847ba9a7d178edd553662', tagName: '无兴趣' },
                { tagId: 'bcb9ce7ea6b04477901ce87b960019ac', tagName: '潜在兴趣' },
                { tagId: '49ba7590bdda4fc0a02a20e3a96f55f3', tagName: '有兴趣' },
                { tagId: '1accff94e637466cb71691135063349c', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'b34b14141540442daee6c116c811a9d6',
              groupName: '旅游意外险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: 'bf452a4531dc42569efb74a034aeb3c9', tagName: '无兴趣' },
                { tagId: '140fe212689b433b96c4833097186864', tagName: '潜在兴趣' },
                { tagId: 'b407482e9ff841be897bdec453ca37fc', tagName: '有兴趣' },
                { tagId: '12e2f4a59e0044cfa29e97c7bb14304c', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: 'ac4331cd52b2484b863bdd8f3849de04',
              groupName: '财产意外险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '0868cc49d8bc4d6c9f982518ccccbb53', tagName: '无兴趣' },
                { tagId: 'd66ed4bf9e4f4858908534220b1175cd', tagName: '潜在兴趣' },
                { tagId: 'b237c96ab607494aadb2a9023077291d', tagName: '有兴趣' },
                { tagId: '1986a5646afa429f863b135db3de635a', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '7c7a057640a1443f9df061dc4323c16e',
              groupName: '宠物意外险营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '4b987e599dd94f72a2779b4ae6c0cf4e', tagName: '无兴趣' },
                { tagId: '4e02e99fc4b348aa992d9ffe979897b5', tagName: '潜在兴趣' },
                { tagId: '8a9f66b81df24b25b2fa312e58cc1b8b', tagName: '有兴趣' },
                { tagId: '12477453e44448acb6a94aa223e8e7d4', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '9ee44074e96e4044ac4f220dcbdf2ef6',
              groupName: '其他营销活动兴趣',
              displayType: 1,
              tagList: [
                { tagId: '4627045153704c7abd42360d40728420', tagName: '无兴趣' },
                { tagId: '2601b7739ac1475a88462b5dae93c78e', tagName: '潜在兴趣' },
                { tagId: '32849995d44c444e8279e15b388d9061', tagName: '有兴趣' },
                { tagId: 'fc4964c85bae418bbd7219e435cbf9c0', tagName: '强烈兴趣' }
              ]
            }
          ]
        },
        {
          category: 7,
          groupList: [
            {
              groupId: '512542d043234b58890c3fb6de17fb17',
              groupName: '周报兴趣',
              displayType: 1,
              tagList: [
                { tagId: '215cdc0c116d44b1b4492ecae84eef7f', tagName: '无兴趣' },
                { tagId: 'af924d47117c4d7f83bfc74119360087', tagName: '潜在兴趣' },
                { tagId: '82d41b3cdef84f5ba3f38dc149d6de75', tagName: '有兴趣' },
                { tagId: '8cd67299bfc74a0889e31caf231eb966', tagName: '强烈兴趣' }
              ]
            },
            {
              groupId: '3db5a8118b2b4378ab8fdd4adb603de0',
              groupName: '分享意愿',
              displayType: 1,
              tagList: [
                { tagId: 'a85d3c67eb2249c4b35905507ff2b44b', tagName: '无意愿' },
                { tagId: '3d5412e0f85344df9663ab9267ae0975', tagName: '潜在意愿' },
                { tagId: 'f4c455ec45804adfb676d7063be1b927', tagName: '意愿中' },
                { tagId: 'a591918d354340ffadf34e595f885457', tagName: '意愿强' }
              ]
            },
            {
              groupId: '4c1d096dc90d4e0899360bd432dc2485',
              groupName: '点赞意愿',
              displayType: 1,
              tagList: [
                { tagId: '235968ca623f437aa417c7b5ecaf96b2', tagName: '无意愿' },
                { tagId: '641ca407bc73457bb761a733d9a51879', tagName: '潜在意愿' },
                { tagId: 'f89fcc0b98e04fb7ad84cd8631eb48fc', tagName: '意愿中' },
                { tagId: '5cf408da591041ebb80ca992dcd0d507', tagName: '意愿强' }
              ]
            }
          ]
        }
      ];
      setAllinterestTagList(resList);
      setinterestTagList(resList);
    }
  };

  /**
   * 搜索标签
   * @param tagName
   */
  const searchTag = async (tagName: string) => {
    if (tagName) {
      if (tabIndex === 0) {
        const res1 = await searchTagList({ queryType: 1, tagName });
        const res2 = await searchTagList({ queryType: 2, tagName });
        if (res1.groupList) {
          setAttrTagList([
            {
              category: 0,
              groupList: res1.groupList
            }
          ]);
        } else {
          setAttrTagList([]);
        }
        if (res2.groupList) {
          setPredictTagList([
            {
              category: 0,
              groupList: res2.groupList
            }
          ]);
        } else {
          setPredictTagList([]);
        }
      } else {
        const res3 = await searchTagList({ queryType: 3, tagName });
        setinterestTagList([
          {
            category: 0,
            groupList: res3.groupList || []
          }
        ]);
      }
    } else {
      if (tabIndex === 0) {
        setAttrTagList(allAttrTagList);
        setPredictTagList(allPredictTagList);
      } else if (tabIndex === 2) {
        setCarTagList(allCarList);
      } else {
        setinterestTagList(allInterestList);
      }
    }
  };

  useEffect(() => {
    if (visible) {
      setChooseTag(currentTag);
      getTagList(1);
      getTagList(2);
      getTagList(3);
      getTagList(4);
    }
  }, [visible]);

  const onTagClick = (tagItem: TagInterface) => {
    setChooseTag(tagItem);
  };

  return (
    <NgModal
      width={1000}
      title="筛选标签"
      visible={visible}
      maskClosable={false}
      className={style.filterModal}
      {...props}
      bodyStyle={{ paddingBottom: 80 }}
      onCancel={() => {
        onClose();
      }}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Space size={20}>
            <Button onClick={onClose} style={{ marginRight: 8 }} shape="round">
              取消
            </Button>
            <Button onClick={() => onChoose(chooseTag!)} type="primary" shape="round">
              确定筛选
            </Button>
          </Space>
        </div>
      }
    >
      <Tabs className={style.tabContent} onChange={(activeKey) => setTabIndex(+activeKey)}>
        <Tabs.TabPane tab={'属性标签'} key={0}>
          <div className={style.searchWrap}>
            <Search placeholder="可输入标签名称查询" allowClear onSearch={(val) => searchTag(val)} />
          </div>

          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={0}
              tagType={2}
              dataSource={attrTagList}
              chooseTag={chooseTag!}
              onTagClick={onTagClick}
            />
          </div>
          {/* 预测标签 */}
          {predictTagList.length === 0 && attrTagList.length === 0 && <EmptyTag />}
          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={-1}
              tagType={1}
              dataSource={predictTagList}
              chooseTag={chooseTag!}
              onTagClick={onTagClick}
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key={1} tab="兴趣标签">
          <div className={style.searchWrap}>
            <Search placeholder="可输入标签名称查询" allowClear onSearch={(val) => searchTag(val)} />
          </div>
          {(interestTagList.length === 0 || (interestTagList[0].groupList || []).length === 0) && <EmptyTag />}
          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={0}
              tagType={4}
              dataSource={interestTagList}
              chooseTag={chooseTag!}
              onTagClick={onTagClick}
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key={2} tab="车标签">
          {(carTagList.length === 0 || (carTagList[0].groupList || []).length === 0) && <EmptyTag />}
          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={0}
              tagType={3}
              dataSource={carTagList}
              chooseTag={chooseTag!}
              onTagClick={onTagClick}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </NgModal>
  );
};
export default TagFilter;
