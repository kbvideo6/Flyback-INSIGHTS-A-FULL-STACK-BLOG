// ProtectedRoute — Redirects to /admin/login if the user is not authenticated
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-gray-400 text-sm">
                Checking session…
            </div>
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />
}

export default ProtectedRoute
