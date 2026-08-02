export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
}

export const useNotificationsRealtime = () => {
  let notifications: NotificationItem[] = [
    { id: 'n1', title: 'Session Confirmed', message: 'Your mentor session with Arjun Mehta is confirmed.', read: false },
    { id: 'n2', title: 'ATS Score Ready', message: 'Your resume ATS scan is complete. Score: 92/100.', read: true },
  ];

  const markAllAsRead = () => {
    notifications = notifications.map(n => ({ ...n, read: true }));
  };

  return { notifications, markAllAsRead };
};
