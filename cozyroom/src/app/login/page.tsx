'use client';
import { loginAction } from './actions';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Suspense } from 'react';

function LoginForm() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <div className="flex gap-4 justify-center items-center h-screen">
      <form action={formAction} className="flex flex-col gap-4 w-full md:w-[40%] lg:w-[35%]">
        {state?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{state.error}</span>
          </div>
        )}
        <input 
          name="email" 
          type="email" 
          required 
          placeholder="Email"
          className="border border-gray-300 rounded-md p-2 w-full" 
        />
        <input 
          name="password" 
          type="password" 
          required 
          placeholder="Password"
          className="border border-gray-300 rounded-md p-2 w-full" 
        />
        <Submit />
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

const Submit = () => {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}