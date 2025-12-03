import { Suspense } from 'react';
import VerifyForm from '@/views/auth/verify/components/verifyForm';

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading verification data...</div>}>
      <VerifyForm />
    </Suspense>
  );
}