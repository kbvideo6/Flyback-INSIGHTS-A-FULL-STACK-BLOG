import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export const ProtectedRoute = () => {
    const { session, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-white">
                Loading...
            </div>
        )
    }

    if (!session) {
        return <Navigate to="/admin/login" replace />
    }

    return <Outlet />
}

// Also export as default so existing import in App.jsx keeps working
export default ProtectedRoute

