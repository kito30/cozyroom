import { Suspense } from 'react';
import { RegisterForm } from '@/src/components/register';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
