import { cookies } from 'next/headers';

export async function checkAuth() {
    const token = cookies().get('token')?.value;
    
    if (!token) {
        return { authenticated: false };
    }

    try {
        const response = await fetch('http://localhost:3001/api/auth', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return { authenticated: false };
        }

        const data = await response.json();
        return {
            authenticated: true,
            user: data.user
        };
    } catch (error) {
        console.error('Auth check failed:', error);
        return { authenticated: false };
    }
}
