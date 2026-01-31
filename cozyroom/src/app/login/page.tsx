import { Suspense } from 'react';
import { LoginForm } from '@/src/components/login';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
