'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
    const router = useRouter();
    useEffect (() => {
        const checkAuthState = async () => {
            const auth = await fetch('localhost:3001/profile');
            if(auth.ok) {
                router.push('/profile');
            }
            else {
                throw new Error('Unauthorized');
            }
        }
        checkAuthState();
    }, []);  
    return null;
}