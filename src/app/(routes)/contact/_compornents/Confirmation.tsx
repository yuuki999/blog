import React from 'react';
import styles from '../../../styles/contact.module.scss';
import { contactFormSchema } from '../validate/form';
import { z } from 'zod';

type FormData = z.infer<typeof contactFormSchema>;
interface ConfirmationProps {
  formData: FormData;
  onConfirm: () => void;
  onEdit: () => void;
  isSubmitting: boolean;
  submitResult: { success: boolean; error?: string } | null;
}

function getLabelForKey(key: string): string {
  const labels = {
    serviceType: 'お問い合わせ種別',
    message: '問い合わせ内容',
    company: '会社名',
    lastName: '姓',
    firstName: '名',
    phone: '電話番号',
    email: 'メールアドレス'
  };
  return labels[key as keyof typeof labels] || key;
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

export default function Confirmation({ 
  formData, 
  onConfirm, 
  onEdit, 
  isSubmitting, 
  submitResult 
}: ConfirmationProps) {
  const emailAddress = process.env.NEXT_PUBLIC_MY_EMAIL_ADDRESS || '';

  return (
    <div className={styles.contactContainer}>
      <h2 className={styles.confirmationTitle}>入力内容の確認</h2>
      <div className={styles.confirmationContent}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className={styles.confirmationItem}>
            <span className={styles.confirmationLabel}>{getLabelForKey(key)}:</span>
            <p className={styles.confirmationValue}>
              {key === 'serviceType' ? getServiceTypeLabel(value as string) : value}
            </p>
          </div>
        ))}
      </div>
      <p className={styles.confirmationMessage}>
        こちらの内容でお間違いなければ、送信ボタンを押してください。
      </p>
      <div className={styles.buttonContainer}>
        <button onClick={onEdit} className={styles.editButton} disabled={isSubmitting}>
          編集する
        </button>
        <button onClick={onConfirm} className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : '送信する'}
        </button>
      </div>
      {submitResult && !submitResult.success && (
        <div className={styles.errorMessage}>
          送信に失敗しました。時間を置いてから再度お試しください。<br />
          または、直接こちらのメールアドレスにお問い合わせください：<br />
          <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
        </div>
      )}
    </div>
  );
}
