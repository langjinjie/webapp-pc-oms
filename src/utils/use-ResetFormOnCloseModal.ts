import { FormInstance } from 'antd';
import { useEffect, useRef } from 'react';
export const useResetFormOnCloseModal = ({ form, visible }: { form: FormInstance; visible: boolean }): void => {
  const prevVisibleRef = useRef<boolean>();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;

  useEffect(() => {
    console.log({ form, prevVisible, visible });
    if (!visible && prevVisible) {
      console.log(form.getFieldsValue());
      form.resetFields();
    }
  }, [form, prevVisible, visible]);
};
