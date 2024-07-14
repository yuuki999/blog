import React, { useEffect, useState } from 'react';
import styles from '../../../styles/contact.module.scss';
import { contactFormSchema } from '../validate/form';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';

interface ContactFormProps {
  onSubmit: (formData: FormData) => void;
  initialData: FormData;
}

const serviceTypes = [
  { value: "free_consultation", label: "無料相談" },
  { value: "template_plan", label: "テンプレートプラン" },
  { value: "full_customization", label: "フルカスタマイズ" },
  { value: "upgrade_replace", label: "改修・リプレイス" },
] as const;

type ServiceType = typeof serviceTypes[number]['value'];

// Zod スキーマから型を生成
type FormData = z.infer<typeof contactFormSchema>;

export default function ContactForm({ onSubmit, initialData }: ContactFormProps) {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  useEffect(() => {
    const serviceType = searchParams.get('serviceType');
    if (serviceType && serviceTypes.some(type => type.value === serviceType)) {
      setFormData(prevState => ({ ...prevState, serviceType: serviceType as ServiceType }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    
    // リアルタイムバリデーション
    try {
      contactFormSchema.shape[name as keyof FormData].parse(value);
      setErrors(prev => ({ ...prev, [name]: undefined }));
    } catch (error: any) {
      setErrors(prev => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validatedData = contactFormSchema.parse(formData);
      onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          acc[err.path[0] as keyof FormData] = err.message;
          return acc;
        }, {} as Partial<Record<keyof FormData, string>>);
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className={styles.contactContainer}>
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label>お問い合わせ種別 <span className={styles.required}>必須</span></label>
          <div className={styles.radioGroup}>
            {serviceTypes.map((service) => (
              <label key={service.value} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="serviceType"
                  value={service.value}
                  checked={formData.serviceType === service.value}
                  onChange={handleChange}
                  required
                  className={styles.radioInput}
                />
                <span className={styles.radioCustom}></span>
                {service.label}
              </label>
            ))}
          </div>
          {errors.serviceType && <span className={styles.error}>{errors.serviceType}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">問い合わせ内容</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="問い合わせ内容を入力してください"
          />
          {errors.message && <span className={styles.error}>{errors.message}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="company">会社名</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="会社名"
          />
          {errors.company && <span className={styles.error}>{errors.company}</span>}
        </div>
        <div className={styles.formGroup}>
          <label>
            お名前 <span className={styles.required}>必須</span>
          </label>
          <div className={styles.nameInputs}>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="姓"
              required
            />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="名"
              required
            />
          </div>
          {(errors.lastName || errors.firstName) && (
            <span className={styles.error}>
              {errors.lastName || errors.firstName}
            </span>
          )}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone">電話番号</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="電話番号"
          />
          {errors.phone && <span className={styles.error}>{errors.phone}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">
            メールアドレス <span className={styles.required}>必須</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="メールアドレス"
            required
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div className={styles.submitContainer}>
          <button type="submit" className={styles.submitButton}>入力内容を確認する</button>
        </div>
      </form>
    </div>
  );
}
