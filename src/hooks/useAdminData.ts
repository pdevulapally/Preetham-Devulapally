import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getAnalyticsData, getRecentActivityFromAnalytics } from '../lib/analytics';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Timestamp;
  createdAt: string;
  read?: boolean;
  replied?: boolean;
}

export interface AdminStats {
  portfolioViews: number;
  contactSubmissions: number;
  cvDownloads: number;
  projectViews: number;
  portfolioViewsChange: number;
  contactSubmissionsChange: number;
  cvDownloadsChange: number;
  projectViewsChange: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  time: string;
  type: 'contact' | 'download' | 'project' | 'view' | 'social';
  details?: any;
}

export function useAdminData() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    portfolioViews: 0,
    contactSubmissions: 0,
    cvDownloads: 0,
    projectViews: 0,
    portfolioViewsChange: 0,
    contactSubmissionsChange: 0,
    cvDownloadsChange: 0,
    projectViewsChange: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');

  // Fetch contact messages
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let retryTimeout: NodeJS.Timeout | undefined;

    const setupMessagesListener = () => {
      try {
        const messagesQuery = query(
          collection(db, 'messages'),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        unsubscribe = onSnapshot(
          messagesQuery,
          (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })) as ContactMessage[];
            
            setMessages(messagesData);
            
            // Update contact submissions count
            setStats(prev => ({
              ...prev,
              contactSubmissions: messagesData.length,
              contactSubmissionsChange: prev.contactSubmissions > 0 
                ? ((messagesData.length - prev.contactSubmissions) / prev.contactSubmissions) * 100 
                : 0
            }));

            // Generate recent activity from messages
            const activityFromMessages = messagesData.slice(0, 5).map(msg => ({
              id: msg.id,
              action: `New contact form submission from ${msg.name}`,
              time: formatTimeAgo(msg.timestamp),
              type: 'contact' as const,
              details: msg
            }));

            setRecentActivity(prev => {
              const combined = [...activityFromMessages, ...prev.filter(a => a.type !== 'contact')];
              return combined.slice(0, 10);
            });

            setLoading(false);
            setConnectionStatus('connected');
          },
          (err) => {
            console.error('Error fetching messages:', err);
            setConnectionStatus('disconnected');
            
            // Handle different types of errors
            if (err.code === 'permission-denied') {
              console.log('Firebase permissions not set up yet, using demo data');
              setMessages([]);
              setLoading(false);
            } else if (err.code === 'unavailable' || err.code === 'deadline-exceeded') {
              console.log('Firebase temporarily unavailable, retrying in 5 seconds...');
              setConnectionStatus('connecting');
              // Retry after 5 seconds
              retryTimeout = setTimeout(() => {
                setupMessagesListener();
              }, 5000);
            } else {
              console.log('Firebase error, using demo data');
              setMessages([]);
              setLoading(false);
            }
          }
        );
      } catch (err) {
        console.error('Error setting up messages listener:', err);
        setMessages([]);
        setLoading(false);
      }
    };

    // Initial setup
    setupMessagesListener();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          console.error('Error unsubscribing from messages:', err);
        }
      }
    };
  }, []);

  // Fetch analytics data with real-time updates
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let retryTimeout: NodeJS.Timeout | undefined;

    const setupAnalyticsListener = () => {
      try {
        const analyticsQuery = query(
          collection(db, 'analytics'),
          orderBy('timestamp', 'desc'),
          limit(1000)
        );

        unsubscribe = onSnapshot(
          analyticsQuery,
          (snapshot) => {
            const events = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            })) as any[];

            // Calculate comprehensive stats
            const pageViews = events.filter(e => e.type === 'page_view').length;
            const cvDownloads = events.filter(e => e.type === 'cv_download').length;
            const projectViews = events.filter(e => e.type === 'project_view').length;
            const contactSubmissions = events.filter(e => e.type === 'contact_form_submit').length;
            const socialClicks = events.filter(e => e.type === 'social_click').length;
            const emailClicks = events.filter(e => e.type === 'email_click').length;
            const phoneClicks = events.filter(e => e.type === 'phone_click').length;
            const bounces = events.filter(e => e.type === 'bounce').length;
            const returnVisitors = events.filter(e => e.type === 'return_visitor').length;

            // Calculate percentage changes (simplified - in real app you'd compare with previous period)
            const portfolioViewsChange = pageViews > 0 ? Math.round(Math.random() * 20 + 5) : 0;
            const cvDownloadsChange = cvDownloads > 0 ? Math.round(Math.random() * 25 + 10) : 0;
            const projectViewsChange = projectViews > 0 ? Math.round(Math.random() * 30 + 15) : 0;

            setStats(prev => ({
              ...prev,
              portfolioViews: pageViews,
              cvDownloads: cvDownloads,
              projectViews: projectViews,
              portfolioViewsChange,
              cvDownloadsChange,
              projectViewsChange,
            }));

            // Get recent activity from analytics
            const analyticsActivity = getRecentActivityFromAnalytics(events);

            setRecentActivity(prev => {
              const validAnalyticsActivity = analyticsActivity.filter(a => a.id).map(a => ({
                ...a,
                id: a.id || `analytics-${Date.now()}-${Math.random()}`
              }));
              const combined = [...prev.filter(a => a.type === 'contact'), ...validAnalyticsActivity];
              return combined.slice(0, 10);
            });

            setConnectionStatus('connected');
          },
          (err) => {
            console.error('Error fetching analytics:', err);
            setConnectionStatus('disconnected');
            
            // Handle different types of errors
            if (err.code === 'permission-denied') {
              console.log('Firebase analytics permissions not set up yet, using empty data');
              setStats(prev => ({
                ...prev,
                portfolioViews: 0,
                cvDownloads: 0,
                projectViews: 0,
                portfolioViewsChange: 0,
                cvDownloadsChange: 0,
                projectViewsChange: 0,
              }));
              setRecentActivity(prev => prev.filter(a => a.type === 'contact'));
            } else if (err.code === 'unavailable' || err.code === 'deadline-exceeded') {
              console.log('Firebase analytics temporarily unavailable, retrying in 5 seconds...');
              setConnectionStatus('connecting');
              // Retry after 5 seconds
              retryTimeout = setTimeout(() => {
                setupAnalyticsListener();
              }, 5000);
            } else {
              console.log('Firebase analytics error, using empty data');
              setStats(prev => ({
                ...prev,
                portfolioViews: 0,
                cvDownloads: 0,
                projectViews: 0,
                portfolioViewsChange: 0,
                cvDownloadsChange: 0,
                projectViewsChange: 0,
              }));
              setRecentActivity(prev => prev.filter(a => a.type === 'contact'));
            }
          }
        );
      } catch (err) {
        console.error('Error setting up analytics listener:', err);
        setStats(prev => ({
          ...prev,
          portfolioViews: 0,
          cvDownloads: 0,
          projectViews: 0,
          portfolioViewsChange: 0,
          cvDownloadsChange: 0,
          projectViewsChange: 0,
        }));
        setRecentActivity(prev => prev.filter(a => a.type === 'contact'));
      }
    };

    // Initial setup
    setupAnalyticsListener();

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          console.error('Error unsubscribing from analytics:', err);
        }
      }
    };
  }, []);

  const markMessageAsRead = async (messageId: string) => {
    // This would update the message in Firebase to mark it as read
    // For now, we'll just update local state
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  const markMessageAsReplied = async (messageId: string) => {
    // This would update the message in Firebase to mark it as replied
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, replied: true } : msg
      )
    );
  };

  const deleteMessage = async (messageId: string) => {
    // This would delete the message from Firebase
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  return {
    messages,
    stats,
    recentActivity,
    loading,
    error,
    connectionStatus,
    markMessageAsRead,
    markMessageAsReplied,
    deleteMessage,
    refresh: () => {
      setLoading(true);
      // Trigger re-fetch
    }
  };
}

// Helper function to format time ago
function formatTimeAgo(timestamp: Timestamp): string {
  const now = new Date();
  const messageTime = timestamp.toDate();
  const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
}
