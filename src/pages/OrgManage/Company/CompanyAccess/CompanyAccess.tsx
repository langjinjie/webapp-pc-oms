/**
 * @name CompanyAccess
 * @author Lester
 * @date 2021-12-21 14:42
 */
import React, { useEffect, useState } from 'react';
import { setTitle } from 'lester-tools';
import { Steps } from 'antd';
import { DrawerItem } from 'src/components';
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

const CompanyAccess: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(5);

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

  useEffect(() => {
    setTitle('企业接入');
  }, []);

  return (
    <div className={style.wrap}>
      <Steps current={currentStep} onChange={(index) => setCurrentStep(index)}>
        {steps.map((item: StepItem, index) => (
          <Step key={item.name} title={item.name} description={item.desc} disabled={index > 3} />
        ))}
      </Steps>
      <div className={style.contentWrap}>
        <DrawerItem visible={currentStep === 0}>
          <StepOne nextStep={() => setCurrentStep(1)} />
        </DrawerItem>
        <DrawerItem visible={currentStep === 1}>
          <StepTwo nextStep={() => setCurrentStep(2)} prevStep={() => setCurrentStep(0)} />
        </DrawerItem>
        <DrawerItem visible={currentStep === 2}>
          <StepThree nextStep={() => setCurrentStep(3)} prevStep={() => setCurrentStep(1)} />
        </DrawerItem>
        <DrawerItem visible={currentStep === 3}>
          <StepFour nextStep={() => setCurrentStep(4)} prevStep={() => setCurrentStep(2)} />
        </DrawerItem>
        <DrawerItem visible={currentStep === 4}>
          <StepFive nextStep={() => setCurrentStep(5)} prevStep={() => setCurrentStep(3)} />
        </DrawerItem>
        <DrawerItem visible={currentStep === 5}>
          <StepSix nextStep={() => setCurrentStep(5)} prevStep={() => setCurrentStep(4)} />
        </DrawerItem>
      </div>
    </div>
  );
};

export default CompanyAccess;
