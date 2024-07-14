'use client';

import { Suspense, useState } from 'react';
import Confirmation from './_compornents/Confirmation';
import ContactForm from './_compornents/ContactForm';
import { submitForm } from './_actions/submitForm';
import { useRouter } from 'next/navigation';
import { contactFormSchema } from './validate/form';
import { z } from 'zod';

type FormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    serviceType: 'free_consultation',
    message: '',
    lastName: '',
    firstName: '',
    email: '',
    company: '',
    phone: '',
  });

  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; error?: string } | null>(null);

  const handleFormSubmit = (data: typeof formData) => {
    setFormData(data);
    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    const result = await submitForm(formDataToSubmit);
    setSubmitResult(result);
    setIsSubmitting(false);

    if (result.success) {
      alert('お問い合わせが完了しました。担当者よりご連絡をお待ちください。');
      router.push('/');
    } else {
      console.error('メール送信失敗:', result.error);
    }
  };

  const handleEdit = () => {
    setIsConfirming(false);
  };

  if (isConfirming) {
    return (
      <Confirmation
        formData={formData}
        onConfirm={handleConfirm}
        onEdit={handleEdit}
        isSubmitting={isSubmitting}
        submitResult={submitResult}
      />
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactForm onSubmit={handleFormSubmit} initialData={formData} />;
    </Suspense>
  )
}
