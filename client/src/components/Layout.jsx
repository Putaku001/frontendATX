import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  const { isAuthenticated, user } = useAuthStore()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isAuthenticated && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          toggleCollapse={toggleSidebarCollapse}
          toggleMobile={toggleMobileSidebar}
          user={user}
        />
      )}
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ${isAuthenticated ? (
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        ) : ''}`}
      >
        <Navbar
          isAuthenticated={isAuthenticated}
          isMobileSidebarOpen={isMobileSidebarOpen}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Layout 