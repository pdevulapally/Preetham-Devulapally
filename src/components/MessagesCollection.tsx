'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  User, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Reply, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ContactMessage } from '../hooks/useAdminData';

interface MessagesCollectionProps {
  messages: ContactMessage[];
  onMarkAsRead: (id: string) => void;
  onMarkAsReplied: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export function MessagesCollection({ 
  messages, 
  onMarkAsRead, 
  onMarkAsReplied, 
  onDelete, 
  loading = false 
}: MessagesCollectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'replied'>('all');
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Filter and search messages
  const filteredMessages = messages
    .filter(message => {
      const matchesSearch = 
        message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = 
        filterStatus === 'all' ||
        (filterStatus === 'unread' && !message.read) ||
        (filterStatus === 'replied' && message.replied);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp.toMillis() - a.timestamp.toMillis();
        case 'oldest':
          return a.timestamp.toMillis() - b.timestamp.toMillis();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const unreadCount = messages.filter(m => !m.read).length;
  const repliedCount = messages.filter(m => m.replied).length;

  const formatDate = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (timestamp: any) => {
    const now = new Date();
    const messageTime = timestamp.toDate();
    const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 dark:bg-white/10 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-neutral-200 dark:bg-white/10 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-brand/10 to-fuchsia-500/10">
            <MessageSquare className="w-6 h-6 text-brand" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Contact Messages</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {messages.length} total messages
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            <AlertCircle className="w-4 h-4" />
            {unreadCount} unread
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm">
            <CheckCircle className="w-4 h-4" />
            {repliedCount} replied
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="replied">Replied</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredMessages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl border transition-all duration-200 ${
                message.read 
                  ? 'border-white/10 bg-white/30 dark:bg-white/5' 
                  : 'border-brand/20 bg-gradient-to-r from-brand/5 to-fuchsia-500/5'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-500" />
                      <span className="font-medium text-sm">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                        {message.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {formatTimeAgo(message.timestamp)}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-2">{message.subject}</h4>
                  
                  <div className="flex items-center gap-2 mb-3">
                    {!message.read && (
                      <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs">
                        Unread
                      </span>
                    )}
                    {message.replied && (
                      <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs">
                        Replied
                      </span>
                    )}
                  </div>

                  <AnimatePresence>
                    {expandedMessage === message.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-white/10"
                      >
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                          {message.message}
                        </p>
                        <div className="mt-2 text-xs text-neutral-500">
                          Received: {formatDate(message.timestamp)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setExpandedMessage(
                      expandedMessage === message.id ? null : message.id
                    )}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {expandedMessage === message.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  
                  {!message.read && (
                    <button
                      onClick={() => onMarkAsRead(message.id)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Mark as read"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                    </button>
                  )}
                  
                  {!message.replied && (
                    <button
                      onClick={() => onMarkAsReplied(message.id)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Mark as replied"
                    >
                      <Reply className="w-4 h-4 text-green-500" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onDelete(message.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              No messages found
            </h3>
            <p className="text-sm text-neutral-500">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No contact messages have been received yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
