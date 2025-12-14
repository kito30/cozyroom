'use client';
import { loginAction } from './actions';
import { useFormStatus } from 'react-dom';

export default function Page() {
  return (
    <div className="flex gap-4 justify-center items-center h-screen">
      <form action={loginAction} className="flex flex-col gap-4">
      <input 
        name="email" 
        type="email" 
        required 
        className="border border-gray-300 rounded-md p-2 w-full" 
      />
      <input 
        name="password" 
        type="password" 
        required 
        className="border border-gray-300 rounded-md p-2 w-full" 
      />
        <Submit />
      </form>
    </div>

  );
}
const Submit = () => {
  
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}