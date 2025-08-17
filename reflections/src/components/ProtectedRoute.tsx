import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })

        return () => unsub();
    }, []);

    if (loading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default ProtectedRoute;