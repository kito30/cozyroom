import { Suspense } from 'react';
import RegisterForm from './register-form';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
