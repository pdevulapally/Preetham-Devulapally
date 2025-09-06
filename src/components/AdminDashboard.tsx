'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Activity, 
  DollarSign, 
  Eye, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  UserPlus,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  MessageSquare,
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { personal } from '../data/cv';
import { useAdminData } from '../hooks/useAdminData';
import { MessagesCollection } from './MessagesCollection';
import AnalyticsDashboard from './AnalyticsDashboard';

// Device analytics data
const deviceData = [
  { device: 'Desktop', percentage: 65, count: 8025, icon: Monitor },
  { device: 'Mobile', percentage: 28, count: 3456, icon: Smartphone },
  { device: 'Tablet', percentage: 7, count: 864, icon: Tablet },
];

// System status data
const systemStatus = [
  { service: 'Portfolio Website', status: 'operational', uptime: '99.9%' },
  { service: 'Contact Form', status: 'operational', uptime: '100%' },
  { service: 'CV Download', status: 'operational', uptime: '99.8%' },
  { service: 'Firebase Analytics', status: 'operational', uptime: '99.9%' },
];

export function AdminDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Fetch dynamic data from Firebase
  const { 
    messages, 
    stats, 
    recentActivity, 
    loading, 
    error, 
    connectionStatus,
    markMessageAsRead, 
    markMessageAsReplied, 
    deleteMessage, 
    refresh 
  } = useAdminData();

  // Create dynamic stats array
  const dynamicStats = [
    {
      title: 'Portfolio Views',
      value: stats.portfolioViews.toLocaleString(),
      change: `+${stats.portfolioViewsChange.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: Eye,
      color: 'text-brand',
      bgColor: 'bg-gradient-to-r from-brand/10 to-fuchsia-500/10',
    },
    {
      title: 'Contact Form Submissions',
      value: stats.contactSubmissions.toString(),
      change: `+${stats.contactSubmissionsChange.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-fuchsia-500',
      bgColor: 'bg-gradient-to-r from-fuchsia-500/10 to-cyan-400/10',
    },
    {
      title: 'CV Downloads',
      value: stats.cvDownloads.toString(),
      change: `+${stats.cvDownloadsChange.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: Download,
      color: 'text-cyan-400',
      bgColor: 'bg-gradient-to-r from-cyan-400/10 to-brand/10',
    },
    {
      title: 'Project Views',
      value: stats.projectViews.toLocaleString(),
      change: `+${stats.projectViewsChange.toFixed(1)}%`,
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'text-orange-500',
      bgColor: 'bg-gradient-to-r from-orange-500/10 to-brand/10',
    },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    console.log('Exporting analytics data...');
  };

  const handleAddUser = () => {
    console.log('Adding new contact...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
              {personal.name} Admin
            </h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {personal.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-lg">{personal.name}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Admin Dashboard</p>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { name: 'Dashboard', icon: BarChart3, section: 'dashboard' },
                { name: 'Messages', icon: MessageSquare, section: 'messages' },
                { name: 'Analytics', icon: Activity, section: 'analytics' },
                { name: 'Contacts', icon: Users, section: 'contacts' },
                { name: 'Projects', icon: Globe, section: 'projects' },
                { name: 'Settings', icon: Settings, section: 'settings' },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.section)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${
                    activeSection === item.section
                      ? 'bg-gradient-to-r from-brand/10 to-fuchsia-500/10 text-brand'
                      : 'hover:bg-white/10 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
                  Welcome to Admin Dashboard
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                  Monitor your portfolio performance and analytics
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand/50"
                  />
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="mb-6">
            <div className={`p-3 rounded-xl border ${
              connectionStatus === 'connected' 
                ? 'border-green-200/70 dark:border-green-800/60 bg-green-50/70 dark:bg-green-900/20'
                : connectionStatus === 'connecting'
                ? 'border-yellow-200/70 dark:border-yellow-800/60 bg-yellow-50/70 dark:bg-yellow-900/20'
                : 'border-red-200/70 dark:border-red-800/60 bg-red-50/70 dark:bg-red-900/20'
            }`}>
              <div className={`flex items-center gap-2 ${
                connectionStatus === 'connected' 
                  ? 'text-green-700 dark:text-green-300'
                  : connectionStatus === 'connecting'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-500'
                    : connectionStatus === 'connecting'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium">
                  Firebase: {
                    connectionStatus === 'connected' 
                      ? 'Connected' 
                      : connectionStatus === 'connecting'
                      ? 'Connecting...'
                      : 'Disconnected (Using Demo Data)'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-200/70 dark:border-red-800/60 bg-red-50/70 dark:bg-red-900/20">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {dynamicStats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{stat.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          {activeSection === 'dashboard' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Charts Section */}
              <div className="xl:col-span-2 space-y-6">
                {/* Device Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Device Analytics</h3>
                  <div className="space-y-4">
                    {deviceData.map((device, index) => (
                      <div key={device.device} className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-white/10">
                          <device.icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{device.device}</span>
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                              {device.count.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 dark:bg-white/10 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400"
                              style={{ width: `${device.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-brand" />
                      </div>
                    ) : recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={activity.id || index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-brand via-fuchsia-500 to-cyan-400" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">{activity.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-neutral-500">
                        <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar Section */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveSection('messages')}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-brand" />
                      <span className="text-sm">View Messages ({messages.length})</span>
                    </button>
                    <button
                      onClick={handleExport}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <Download className="w-5 h-5 text-fuchsia-500" />
                      <span className="text-sm">Export Analytics</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <Settings className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm">Portfolio Settings</span>
                    </button>
                  </div>
                </motion.div>

                {/* System Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="card p-6"
                >
                  <h3 className="text-lg font-semibold mb-4">System Status</h3>
                  <div className="space-y-3">
                    {systemStatus.map((service, index) => (
                      <div key={service.service} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium">{service.service}</span>
                        </div>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400">
                          {service.uptime}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="card p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-5 h-5 text-brand" />
                    <h3 className="text-lg font-semibold">Notifications</h3>
                  </div>
                  <div className="space-y-3">
                    {messages.filter(m => !m.read).length > 0 ? (
                      <div className="p-3 rounded-xl bg-gradient-to-r from-brand/10 to-fuchsia-500/10">
                        <p className="text-sm font-medium">
                          {messages.filter(m => !m.read).length} unread message{messages.filter(m => !m.read).length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          Latest: {messages[0]?.name || 'No messages'}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/10">
                        <p className="text-sm font-medium">All messages read</p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">No unread messages</p>
                      </div>
                    )}
                    <div className="p-3 rounded-xl bg-white/10">
                      <p className="text-sm font-medium">Portfolio performance report ready</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">1 hour ago</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Messages Section */}
          {activeSection === 'messages' && (
            <MessagesCollection
              messages={messages}
              onMarkAsRead={markMessageAsRead}
              onMarkAsReplied={markMessageAsReplied}
              onDelete={deleteMessage}
              loading={loading}
            />
          )}

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <AnalyticsDashboard />
          )}

          {/* Other sections placeholder */}
          {activeSection !== 'dashboard' && activeSection !== 'messages' && activeSection !== 'analytics' && (
            <div className="card p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-brand/10 to-fuchsia-500/10 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-brand" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  The {activeSection} section is under development.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}