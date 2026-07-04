'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  BookOpen,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: '/admin/dashboard', active: true },
    { icon: <Calendar className="w-5 h-5" />, label: 'Bookings', href: '/admin/bookings', badge: '3' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'Messages', href: '/admin/messages', badge: '5' },
    { icon: <FileText className="w-5 h-5" />, label: 'Blog Posts', href: '/admin/blog' },
    { icon: <Briefcase className="w-5 h-5" />, label: 'Portfolio', href: '/admin/portfolio' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'Services', href: '/admin/services' },
    { icon: <Users className="w-5 h-5" />, label: 'Testimonials', href: '/admin/testimonials' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/admin/settings' },
  ];

  const stats = [
    { label: 'Total Bookings', value: '24', change: '+12%', color: 'blue' },
    { label: 'Blog Posts', value: '18', change: '+3', color: 'green' },
    { label: 'Portfolio Items', value: '12', change: '+2', color: 'purple' },
    { label: 'Messages', value: '45', change: '+8', color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-sm">Syntax Admin</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                item.active
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
              {session?.user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {session?.user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {session?.user?.name || 'Admin'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</h3>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8"
          >
            <h2 className="text-2xl font-black mb-2">🎉 Welcome to Syntax Pro Admin!</h2>
            <p className="text-blue-100 mb-4">
              Your dashboard is ready. Start managing bookings, blog posts, portfolio items, and more.
            </p>
            <div className="flex gap-3">
              <Link href="/admin/blog" className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Create Blog Post
              </Link>
              <Link href="/admin/bookings" className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/20 transition-colors">
                View Bookings
              </Link>
            </div>
          </motion.div>

          {/* Coming Soon Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon...</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Messages</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon...</p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
