'use server';

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const isDevelopment = process.env.NODE_ENV === 'development';

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません。`);
  }
  return value;
}

function getServiceTypeLabel(value: string): string {
  const serviceTypeLabels: Record<string, string> = {
    free_consultation: '無料相談',
    template_plan: 'テンプレートプラン',
    full_customization: 'フルカスタマイズ',
    upgrade_replace: '改修・リプレイス'
  };
  return serviceTypeLabels[value] || value;
}

export async function submitForm(formData: FormData) {
  const serviceType = formData.get('serviceType') as string;
  const serviceTypeLabel = getServiceTypeLabel(serviceType);
  const message = formData.get('message') as string;
  const company = formData.get('company') as string;
  const lastName = formData.get('lastName') as string;
  const firstName = formData.get('firstName') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  
  try {
    // 管理者への通知メール
    const adminEmail = isDevelopment ? getEnvVariable('MY_TEST_EMAIL_ADDRESS') :  getEnvVariable('MY_EMAIL_ADDRESS');
    await resend.emails.send({
      from: isDevelopment ? 'onboarding@resend.dev' : 'noreply@yuki-engineer.com',
      to: adminEmail,
      subject: 'blogから新しいお問い合わせがありました',
      html: `
        <h1>新しいお問い合わせ</h1>
        <p><strong>種別:</strong> ${serviceTypeLabel}</p>
        <p><strong>名前:</strong> ${lastName} ${firstName}</p>
        <p><strong>会社名:</strong> ${company}</p>
        <p><strong>メール:</strong> ${email}</p>
        <p><strong>電話番号:</strong> ${phone}</p>
        <p><strong>メッセージ:</strong> ${message}</p>
      `
    });

    // ユーザーへの自動返信メール
    await resend.emails.send({
      from: isDevelopment ? 'onboarding@resend.dev' : 'noreply@yuki-engineer.com',
      to: email,
      subject: 'お問い合わせありがとうございます',
      html: `
        <h1>${lastName} ${firstName}様</h1>
        <p>お問い合わせいただき、ありがとうございます。<br/>
        内容を確認の上、担当者より折り返しご連絡させていただきます。<br/>
        今しばらくお待ちくださいますようお願い申し上げます。</p>
        <br/>
        <p>HARU TECHNOLOGY<br/>
        Yuki Itoi </p>
      `
    });

    return { success: true };
  } catch (error) {
    console.error('メール送信エラー:', error);
    if (error instanceof Error && error.message.includes('環境変数')) {
      return { success: false, error: '設定エラーが発生しました。管理者に連絡してください。' };
    }

    return { success: false, error: 'メールの送信に失敗しました。' };
  }
}
