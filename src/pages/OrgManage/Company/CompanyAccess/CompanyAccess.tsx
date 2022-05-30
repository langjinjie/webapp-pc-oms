/**
 * @name CompanyAccess
 * @author Lester
 * @date 2021-12-21 14:42
 */
import React, { useEffect, useState } from 'react';
import { setTitle } from 'tenacity-tools';
import { RouteComponentProps } from 'react-router-dom';
import { Steps } from 'antd';
import { DrawerItem } from 'tenacity-ui';
import { queryCompanyStep } from 'src/apis/company';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';
import StepSix from './StepSix';
import style from './style.module.less';

interface StepItem {
  name: string;
  desc: string;
}

const { Step } = Steps;

const CompanyAccess: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [companyStep, setCompanyStep] = useState<number>(0);
  const [loadedIndexes, setLoadedIndexes] = useState<number[]>([]);

  const { corpId }: any = location.state || {};

  const steps: StepItem[] = [
    {
      name: '第一步',
      desc: '配置企业信息'
    },
    {
      name: '第二步',
      desc: '配置通讯录'
    },
    {
      name: '第三步',
      desc: '配置客户联系'
    },
    {
      name: '第四步',
      desc: '配置自建应用'
    },
    {
      name: '第五步',
      desc: '配置企业logo'
    },
    {
      name: '第六步',
      desc: '设置应用账号'
    }
  ];

  /**
   * 获取企业当前信息步骤
   */
  const getCompanyStep = async () => {
    const res: any = await queryCompanyStep({ corpId });
    if (res) {
      const step = res - 1;
      setCurrentStep(step);
      setCompanyStep(step);
      setLoadedIndexes([step]);
    }
  };

  /**
   * 添加懒加载步骤
   * @param index
   */
  useEffect(() => {
    if (!loadedIndexes.includes(currentStep)) {
      setLoadedIndexes([...loadedIndexes, currentStep]);
    }
    if (currentStep > companyStep) {
      setCompanyStep(currentStep);
    }
  }, [currentStep]);

  useEffect(() => {
    setTitle('企业接入');
    if (corpId) {
      getCompanyStep();
    } else {
      setCurrentStep(0);
    }
  }, []);

  return (
    <div className={style.wrap}>
      <Steps current={currentStep} onChange={(index) => setCurrentStep(index)}>
        {steps.map((item: StepItem, index) => (
          <Step key={item.name} title={item.name} description={item.desc} disabled={index > companyStep} />
        ))}
      </Steps>
      <div className={style.contentWrap}>
        {loadedIndexes.includes(0) && (
          <DrawerItem visible={currentStep === 0}>
            <StepOne corpId={corpId} nextStep={() => setCurrentStep(1)} />
          </DrawerItem>
        )}
        {loadedIndexes.includes(1) && (
          <DrawerItem visible={currentStep === 1}>
            <StepTwo corpId={corpId} nextStep={() => setCurrentStep(2)} prevStep={() => setCurrentStep(0)} />
          </DrawerItem>
        )}
        {loadedIndexes.includes(2) && (
          <DrawerItem visible={currentStep === 2}>
            <StepThree corpId={corpId} nextStep={() => setCurrentStep(3)} prevStep={() => setCurrentStep(1)} />
          </DrawerItem>
        )}
        {loadedIndexes.includes(3) && (
          <DrawerItem visible={currentStep === 3}>
            <StepFour corpId={corpId} nextStep={() => setCurrentStep(4)} prevStep={() => setCurrentStep(2)} />
          </DrawerItem>
        )}
        {loadedIndexes.includes(4) && (
          <DrawerItem visible={currentStep === 4}>
            <StepFive corpId={corpId} nextStep={() => setCurrentStep(5)} prevStep={() => setCurrentStep(3)} />
          </DrawerItem>
        )}
        {loadedIndexes.includes(5) && (
          <DrawerItem visible={currentStep === 5}>
            <StepSix corpId={corpId} prevStep={() => setCurrentStep(4)} nextStep={() => history.goBack()} />
          </DrawerItem>
        )}
      </div>
    </div>
  );
};

export default CompanyAccess;
