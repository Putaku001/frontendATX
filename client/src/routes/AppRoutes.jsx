import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Unauthorized from '../pages/Unauthorized'
import ForgotPassword from '../pages/ForgotPassword'
import VerifyCode from '../pages/VerifyCode'
import ResetPassword from '../pages/ResetPassword'
import UserList from '../pages/admin/UserList'
import UserCreate from '../pages/admin/UserCreate'
import UserEdit from '../pages/admin/UserEdit'
import PrivateRoute from './PrivateRoute'
import AdminLayout from '../components/AdminLayout'
import Lists from '../pages/Lists'
import ListDetail from '../pages/ListDetail'
import AnimeList from '../pages/AnimeList'
import AnimeForm from '../pages/AnimeForm'
import AnimeDetail from '../pages/AnimeDetail'
import Settings from '../pages/Settings'
import Profile from '../pages/Profile'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route 
        path="/lists"
        element={
          <PrivateRoute>
            <Lists />
          </PrivateRoute>
        }
      />

      <Route 
        path="/lists/:id"
        element={
          <PrivateRoute>
            <ListDetail />
          </PrivateRoute>
        }
      />

      <Route 
        path="/animes"
        element={
          <PrivateRoute>
            <AnimeList />
          </PrivateRoute>
        }
      />

      <Route 
        path="/animes/create"
        element={
          <PrivateRoute>
            <AnimeForm />
          </PrivateRoute>
        }
      />

      <Route 
        path="/animes/edit/:id"
        element={
          <PrivateRoute>
            <AnimeForm />
          </PrivateRoute>
        }
      />

      <Route 
        path="/animes/:id"
        element={
          <PrivateRoute>
            <AnimeDetail />
          </PrivateRoute>
        }
      />

      <Route 
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route 
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />

      <Route 
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Rutas de Administración (solo para Admin) */}
      <Route 
        path="/admin"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<UserList />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/edit/:id" element={<UserEdit />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes 