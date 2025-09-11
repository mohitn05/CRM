"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"

interface Notification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

interface NotificationBellProps {
  studentId?: number;
  adminId?: number;
}

export function NotificationBell({ studentId, adminId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      let url = "";
      if (adminId !== undefined) {
        url = `http://localhost:5000/api/admin/${adminId}/notifications`;
      } else if (studentId !== undefined) {
        url = `http://localhost:5000/api/students/${studentId}/notifications`;
      }
      if (!url) return;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      })
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      let url = "";
      if (adminId !== undefined) {
        url = `http://localhost:5000/api/admin/${adminId}/notifications/read-all`;
      } else if (studentId !== undefined) {
        url = `http://localhost:5000/api/students/${studentId}/notifications/read-all`;
      }
      if (!url) return;
      const response = await fetch(url, {
        method: 'PUT'
      });
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      let url = "";
      if (adminId !== undefined) {
        url = `http://localhost:5000/api/admin/${adminId}/notifications`;
      } else if (studentId !== undefined) {
        url = `http://localhost:5000/api/students/${studentId}/notifications`;
      }
      if (!url) return;
      const response = await fetch(url, {
        method: 'DELETE'
      });
      if (response.ok) {
        setNotifications([]);
        setUnreadCount(0);
        // Refresh notifications from backend to ensure UI is up to date
        fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to clear all notifications:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return '🔄'
      default:
        return '📢'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [studentId, adminId]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 hover:bg-blue-50 transition-all duration-200"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse bg-blue-500 hover:bg-blue-500"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0 z-[9999] bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl rounded-2xl overflow-hidden" align="end" side="bottom" sideOffset={12}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Notifications</h3>
                <p className="text-blue-100 text-sm">Stay updated with your application</p>
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-white hover:bg-white/20 text-xs px-3 py-1 rounded-full transition-all duration-200"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-white hover:bg-white/20 text-xs px-3 py-1 rounded-full transition-all duration-200"
                >
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Bell className="h-8 w-8 text-blue-400" />
              </div>
              <h4 className="text-gray-600 font-medium mb-2">No notifications yet</h4>
              <p className="text-gray-400 text-sm">We'll notify you when there are updates</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-300 group ${!notification.is_read ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-l-4 border-l-blue-500' : 'bg-white'
                    }`}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-full flex-shrink-0 ${!notification.is_read
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                      }`}>
                      <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`text-sm font-semibold truncate pr-2 ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                          )}
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatDate(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      {!notification.is_read && (
                        <div className="flex items-center gap-2 text-xs">
                          <div className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                            New
                          </div>
                          <span className="text-blue-600 group-hover:text-purple-600 transition-colors">
                            Click to mark as read
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-t">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up! 🎉'}
              </p>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}


