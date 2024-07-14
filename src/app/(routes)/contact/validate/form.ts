import { z } from 'zod';

// 日本の電話番号の正規表現
const phoneRegex = /^(0[5-9]0|0[1-9][1-9]0)-?\d{4}-?\d{4}$/;

// サービスタイプの定義
const serviceTypes = [
  'free_consultation',
  'template_plan',
  'full_customization',
  'upgrade_replace'
] as const;

export const contactFormSchema = z.object({
  serviceType: z.enum(serviceTypes, {
    required_error: 'サービスタイプを選択してください',
    invalid_type_error: '無効なサービスタイプです',
  }),
  
  message: z.string()
    .max(1000, '問い合わせ内容は1000文字以内で入力してください'),
  
  company: z.string()
    .max(100, '会社名は100文字以内で入力してください')
    .optional(),
  
  lastName: z.string()
    .min(1, '姓を入力してください')
    .max(50, '姓は50文字以内で入力してください'),
  
  firstName: z.string()
    .min(1, '名を入力してください')
    .max(50, '名は50文字以内で入力してください'),
  
  phone: z.union([
    z.string().regex(phoneRegex, '有効な電話番号を入力してください（例: 090-1234-5678）'),
    z.string().max(0)
  ]).optional(),

  email: z.string()
    .email('有効なメールアドレスを入力してください')
    .min(1, 'メールアドレスを入力してください')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// バリデーション関数
export const validateForm = (data: unknown) => {
  try {
    const validatedData = contactFormSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path[0]] = err.message;
        return acc;
      }, {} as Record<string, string>);
      return { success: false, errors };
    }
    return { success: false, errors: { form: '予期せぬエラーが発生しました' } };
  }
};
