export type NotificationProvider = string;
export type NotificationType = string;
export type NotificationPayload = Record<string, any>;

export type Notification = {
  type: NotificationType;
  payload: NotificationPayload;
};

export type UserNotification = {
  userId: string;
  notification: Notification;
  notificationProvider: NotificationProvider;
};

export interface INotificationProviderService {
  sendNotifications(
    userNotifications: Pick<UserNotification, 'userId' | 'notification'>[],
  ): Promise<void>;
}

export interface ISendNotifications {
  sendNotifications(userNotifications: UserNotification[]): Promise<void>;
}

export interface ICheckUserNotificationAllowed {
  getUserNotificationsStatus(
    userNotifications: UserNotification[],
  ): Promise<(UserNotification & { enabled: boolean })[]>;
}
