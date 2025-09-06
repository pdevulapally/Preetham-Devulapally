import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from './firebase';

export interface AnalyticsEvent {
  id?: string;
  type: 'page_view' | 'cv_download' | 'project_view' | 'contact_form_submit' | 'section_view' | 'social_click' | 'email_click' | 'phone_click' | 'scroll_depth' | 'time_on_page' | 'bounce' | 'return_visitor';
  page?: string;
  section?: string;
  project?: string;
  socialPlatform?: string;
  userAgent?: string;
  referrer?: string;
  timestamp: any;
  createdAt: string;
  metadata?: Record<string, any>;
  sessionId?: string;
  userId?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  screenResolution?: string;
  language?: string;
}

export interface DeviceAnalytics {
  device: string;
  percentage: number;
  count: number;
}

// Generate or get session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Get browser and OS information
function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  let os = 'Unknown';

  // Browser detection
  if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Edge')) browser = 'Edge';
  else if (ua.includes('Opera')) browser = 'Opera';

  // OS detection
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS')) os = 'iOS';

  return { browser, os };
}

// Track analytics events
export async function trackEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'createdAt' | 'sessionId' | 'userAgent' | 'referrer' | 'browser' | 'os' | 'screenResolution' | 'language'>) {
  try {
    // Check if we're online and in production
    if (!navigator.onLine || !(import.meta as any).env?.PROD) {
      if ((import.meta as any).env?.DEV) {
        console.log('Development mode - analytics event not tracked');
      } else {
        console.log('Offline - analytics event not tracked');
      }
      return;
    }

    const { browser, os } = getBrowserInfo();
    const sessionId = getSessionId();

    await addDoc(collection(db, 'analytics'), {
      ...event,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
      sessionId,
      userAgent: navigator.userAgent,
      referrer: document.referrer || 'direct',
      browser,
      os,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
    });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    // Don't throw the error, just log it to prevent app crashes
  }
}

// Track page views
export function trackPageView(page: string) {
  try {
    trackEvent({
      type: 'page_view',
      page,
    });
  } catch (error) {
    console.log('Analytics tracking disabled - page view not tracked');
  }
}

// Track CV downloads
export function trackCVDownload() {
  try {
    trackEvent({
      type: 'cv_download',
    });
  } catch (error) {
    console.log('Analytics tracking disabled - CV download not tracked');
  }
}

// Track project views
export function trackProjectView(project: string) {
  try {
    trackEvent({
      type: 'project_view',
      project,
    });
  } catch (error) {
    console.log('Analytics tracking disabled - project view not tracked');
  }
}

// Track section views
export function trackSectionView(section: string) {
  try {
    trackEvent({
      type: 'section_view',
      section,
    });
  } catch (error) {
    console.log('Analytics tracking disabled - section view not tracked');
  }
}

// Track social media clicks
export function trackSocialClick(platform: string) {
  try {
    trackEvent({
      type: 'social_click',
      socialPlatform: platform,
    });
  } catch (error) {
    console.log('Analytics tracking disabled - social click not tracked');
  }
}

// Track email clicks
export function trackEmailClick() {
  try {
    trackEvent({
      type: 'email_click',
    });
  } catch (error) {
    console.log('Analytics tracking disabled - email click not tracked');
  }
}

// Track phone clicks
export function trackPhoneClick() {
  try {
    trackEvent({
      type: 'phone_click',
    });
  } catch (error) {
    console.log('Analytics tracking disabled - phone click not tracked');
  }
}

// Track scroll depth
export function trackScrollDepth(depth: number) {
  try {
    trackEvent({
      type: 'scroll_depth',
      metadata: { depth },
    });
  } catch (error) {
    console.log('Analytics tracking disabled - scroll depth not tracked');
  }
}

// Track time on page
export function trackTimeOnPage(timeInSeconds: number) {
  try {
    trackEvent({
      type: 'time_on_page',
      metadata: { timeInSeconds },
    });
  } catch (error) {
    console.log('Analytics tracking disabled - time on page not tracked');
  }
}

// Track bounce (user leaves quickly)
export function trackBounce() {
  try {
    trackEvent({
      type: 'bounce',
    });
  } catch (error) {
    console.log('Analytics tracking disabled - bounce not tracked');
  }
}

// Track return visitor
export function trackReturnVisitor() {
  try {
    trackEvent({
      type: 'return_visitor',
    });
  } catch (error) {
    console.log('Analytics tracking disabled - return visitor not tracked');
  }
}

// Get analytics data
export async function getAnalyticsData() {
  try {
    // Get recent events
    const eventsQuery = query(
      collection(db, 'analytics'),
      orderBy('timestamp', 'desc'),
      limit(1000)
    );
    
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AnalyticsEvent[];

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

    // Calculate device analytics
    const deviceCounts: Record<string, number> = {};
    const browserCounts: Record<string, number> = {};
    const osCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};

    events.forEach(event => {
      // Device analytics
      if (event.userAgent) {
        const device = getDeviceType(event.userAgent);
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      }

      // Browser analytics
      if (event.browser) {
        browserCounts[event.browser] = (browserCounts[event.browser] || 0) + 1;
      }

      // OS analytics
      if (event.os) {
        osCounts[event.os] = (osCounts[event.os] || 0) + 1;
      }

      // Referrer analytics
      if (event.referrer) {
        const referrer = event.referrer === 'direct' ? 'Direct' : 
                        event.referrer.includes('google') ? 'Google' :
                        event.referrer.includes('linkedin') ? 'LinkedIn' :
                        event.referrer.includes('github') ? 'GitHub' : 'Other';
        referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
      }
    });

    const totalDeviceEvents = Object.values(deviceCounts).reduce((sum, count) => sum + count, 0);
    const deviceAnalytics: DeviceAnalytics[] = Object.entries(deviceCounts).map(([device, count]) => ({
      device,
      count,
      percentage: totalDeviceEvents > 0 ? Math.round((count / totalDeviceEvents) * 100) : 0,
    }));

    // Calculate bounce rate
    const bounceRate = pageViews > 0 ? Math.round((bounces / pageViews) * 100) : 0;

    // Calculate return visitor rate
    const returnVisitorRate = pageViews > 0 ? Math.round((returnVisitors / pageViews) * 100) : 0;

    // Get unique sessions
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;

    return {
      pageViews,
      cvDownloads,
      projectViews,
      contactSubmissions,
      socialClicks,
      emailClicks,
      phoneClicks,
      bounces,
      returnVisitors,
      bounceRate,
      returnVisitorRate,
      uniqueSessions,
      deviceAnalytics,
      browserAnalytics: Object.entries(browserCounts).map(([browser, count]) => ({
        browser,
        count,
        percentage: totalDeviceEvents > 0 ? Math.round((count / totalDeviceEvents) * 100) : 0,
      })),
      osAnalytics: Object.entries(osCounts).map(([os, count]) => ({
        os,
        count,
        percentage: totalDeviceEvents > 0 ? Math.round((count / totalDeviceEvents) * 100) : 0,
      })),
      referrerAnalytics: Object.entries(referrerCounts).map(([referrer, count]) => ({
        referrer,
        count,
        percentage: totalDeviceEvents > 0 ? Math.round((count / totalDeviceEvents) * 100) : 0,
      })),
      events,
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return empty data when Firebase is not available
    return {
      pageViews: 0,
      cvDownloads: 0,
      projectViews: 0,
      contactSubmissions: 0,
      socialClicks: 0,
      emailClicks: 0,
      phoneClicks: 0,
      bounces: 0,
      returnVisitors: 0,
      bounceRate: 0,
      returnVisitorRate: 0,
      uniqueSessions: 0,
      deviceAnalytics: [],
      browserAnalytics: [],
      osAnalytics: [],
      referrerAnalytics: [],
      events: [],
    };
  }
}

// Helper function to determine device type from user agent
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  } else {
    return 'Desktop';
  }
}

// Get recent activity from analytics
export function getRecentActivityFromAnalytics(events: AnalyticsEvent[]) {
  const recentEvents = events.slice(0, 10);
  
  return recentEvents.map(event => {
    const timeAgo = formatTimeAgo(event.timestamp);
    
    switch (event.type) {
      case 'page_view':
        return {
          id: event.id,
          action: `Portfolio page viewed: ${event.page || 'Home'}`,
          time: timeAgo,
          type: 'view' as const,
        };
      case 'cv_download':
        return {
          id: event.id,
          action: 'CV downloaded',
          time: timeAgo,
          type: 'download' as const,
        };
      case 'project_view':
        return {
          id: event.id,
          action: `${event.project} project viewed`,
          time: timeAgo,
          type: 'project' as const,
        };
      case 'contact_form_submit':
        return {
          id: event.id,
          action: 'Contact form submitted',
          time: timeAgo,
          type: 'contact' as const,
        };
      case 'section_view':
        return {
          id: event.id,
          action: `${event.section} section viewed`,
          time: timeAgo,
          type: 'view' as const,
        };
      case 'social_click':
        return {
          id: event.id,
          action: `Clicked on ${event.socialPlatform} link`,
          time: timeAgo,
          type: 'social' as const,
        };
      case 'email_click':
        return {
          id: event.id,
          action: 'Email address clicked',
          time: timeAgo,
          type: 'contact' as const,
        };
      case 'phone_click':
        return {
          id: event.id,
          action: 'Phone number clicked',
          time: timeAgo,
          type: 'contact' as const,
        };
      case 'scroll_depth':
        return {
          id: event.id,
          action: `Scrolled ${event.metadata?.depth || 0}% of page`,
          time: timeAgo,
          type: 'view' as const,
        };
      case 'time_on_page':
        return {
          id: event.id,
          action: `Spent ${Math.round((event.metadata?.timeInSeconds || 0) / 60)} minutes on page`,
          time: timeAgo,
          type: 'view' as const,
        };
      case 'bounce':
        return {
          id: event.id,
          action: 'User bounced (left quickly)',
          time: timeAgo,
          type: 'view' as const,
        };
      case 'return_visitor':
        return {
          id: event.id,
          action: 'Return visitor detected',
          time: timeAgo,
          type: 'view' as const,
        };
      default:
        return {
          id: event.id,
          action: 'Unknown activity',
          time: timeAgo,
          type: 'view' as const,
        };
    }
  });
}

// Helper function to format time ago
function formatTimeAgo(timestamp: any): string {
  if (!timestamp) return 'Unknown time';
  
  const now = new Date();
  const eventTime = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - eventTime.getTime()) / 1000);

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
