import { residentBasicInfoSchema, type ResidentBasicInfo } from '@/validations/resident-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

interface UseResidentFormOptions {
  initialData?: Partial<ResidentBasicInfo>;
  onSubmit: (data: ResidentBasicInfo) => Promise<void>;
}

const initialFormData: ResidentBasicInfo = {
  name: '',
  furigana: '',
  dob: '',
  age: '65',
  sex: '男',

  floorGroup: '',
  unitTeam: '',
  roomInfo: '',
  admissionDate: '',
  dischargeDate: '',
  profileImage: '',

  notes: '', // 備考フィールドの初期値を追加
};

export const useResidentForm = ({ initialData, onSubmit }: UseResidentFormOptions) => {
  const {
    register,
    handleSubmit: hookFormHandleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm<ResidentBasicInfo>({
    resolver: zodResolver(residentBasicInfoSchema),
    defaultValues: {
      ...initialFormData,
      ...initialData,
    },
    mode: 'onChange', // リアルタイムバリデーション
  });

  // formDataをwatchして取得
  const formData = watch();

  // setFormData関数（既存のAPIを維持）
  const setFormData = useCallback(
    (newData: ResidentBasicInfo | ((prev: ResidentBasicInfo) => ResidentBasicInfo)) => {
      if (typeof newData === 'function') {
        const currentData = getValues();
        const updatedData = newData(currentData);
        Object.keys(updatedData).forEach((key) => {
          setValue(key as keyof ResidentBasicInfo, updatedData[key as keyof ResidentBasicInfo]);
        });
      } else {
        Object.keys(newData).forEach((key) => {
          setValue(key as keyof ResidentBasicInfo, newData[key as keyof ResidentBasicInfo]);
        });
      }
    },
    [setValue, getValues]
  );

  // errorsをuseResidentFormの既存の形式に変換
  const convertedErrors = useCallback(() => {
    const converted: Partial<Record<keyof ResidentBasicInfo, string>> = {};
    Object.keys(errors).forEach((key) => {
      const error = errors[key as keyof ResidentBasicInfo];
      if (error) {
        converted[key as keyof ResidentBasicInfo] = error.message;
      }
    });
    return converted;
  }, [errors]);

  // handleSubmit関数（既存のAPIを維持）
  const handleSubmit = useCallback(async () => {
    return new Promise<boolean>((resolve) => {
      hookFormHandleSubmit(
        async (data) => {
          try {
            await onSubmit(data);
            resolve(true);
          } catch (error) {
            console.error('Form submission error:', error);
            resolve(false);
          }
        },
        () => {
          resolve(false);
        }
      )();
    });
  }, [hookFormHandleSubmit, onSubmit]);

  // resetForm関数（既存のAPIを維持）
  const resetForm = useCallback(() => {
    reset({ ...initialFormData, ...initialData });
  }, [reset, initialData]);

  return {
    formData,
    setFormData,
    errors: convertedErrors(),
    isSubmitting,
    handleSubmit,
    resetForm,
    isValid,
    // React Hook Form の追加機能
    register,
    setValue,
    getValues,
  };
};
