import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Download, 
  Eye, 
  Mail, 
  Phone, 
  Share2,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Target
} from 'lucide-react';
import { getAnalyticsData } from '../lib/analytics';

interface AnalyticsData {
  pageViews: number;
  cvDownloads: number;
  projectViews: number;
  contactSubmissions: number;
  socialClicks: number;
  emailClicks: number;
  phoneClicks: number;
  bounces: number;
  returnVisitors: number;
  bounceRate: number;
  returnVisitorRate: number;
  uniqueSessions: number;
  deviceAnalytics: Array<{ device: string; count: number; percentage: number }>;
  browserAnalytics: Array<{ browser: string; count: number; percentage: number }>;
  osAnalytics: Array<{ os: string; count: number; percentage: number }>;
  referrerAnalytics: Array<{ referrer: string; count: number; percentage: number }>;
  events: any[];
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAnalyticsData();
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-indigo-600 hover:text-indigo-800"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No analytics data available</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Page Views',
      value: analyticsData.pageViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Unique Sessions',
      value: analyticsData.uniqueSessions.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'CV Downloads',
      value: analyticsData.cvDownloads.toLocaleString(),
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%'
    },
    {
      title: 'Project Views',
      value: analyticsData.projectViews.toLocaleString(),
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+23%'
    },
    {
      title: 'Contact Submissions',
      value: analyticsData.contactSubmissions.toLocaleString(),
      icon: Mail,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+5%'
    },
    {
      title: 'Bounce Rate',
      value: `${analyticsData.bounceRate}%`,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '-3%'
    }
  ];

  const engagementStats = [
    {
      title: 'Social Clicks',
      value: analyticsData.socialClicks,
      icon: Share2,
      color: 'text-indigo-600'
    },
    {
      title: 'Email Clicks',
      value: analyticsData.emailClicks,
      icon: Mail,
      color: 'text-blue-600'
    },
    {
      title: 'Phone Clicks',
      value: analyticsData.phoneClicks,
      icon: Phone,
      color: 'text-green-600'
    },
    {
      title: 'Return Visitors',
      value: analyticsData.returnVisitors,
      icon: Target,
      color: 'text-purple-600'
    }
  ];

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop': return Monitor;
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Globe;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time insights into your portfolio performance</p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {engagementStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex p-3 rounded-lg bg-gray-50 dark:bg-gray-700 mb-2`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Device Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Device Analytics</h3>
          <div className="space-y-4">
            {analyticsData.deviceAnalytics.map((device, index) => {
              const Icon = getDeviceIcon(device.device);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{device.device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {device.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Browser Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Browser Analytics</h3>
          <div className="space-y-4">
            {analyticsData.browserAnalytics.map((browser, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{browser.browser}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${browser.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {browser.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referrer Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.referrerAnalytics.map((referrer, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{referrer.count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{referrer.referrer}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{referrer.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-900 dark:text-white font-medium">Real-time Analytics</span>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
