import { useEffect, useState, type JSX } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import supabase from '../supabase';

function ProtectedRoute({ children }: { children: JSX.Element }) {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        }

    }, [navigate, location.hash, location.pathname]);

    if (loading) {
        return null;
    }

    if (!session) {
        return <Navigate to="/login" replace />
    }

    return children;
}

export default ProtectedRoute;