import { Injectable, Logger } from '@nestjs/common';
import {
  ICheckUserNotificationAllowed,
  INotificationProviderService,
  ISendNotifications,
  NotificationProvider,
  UserNotification,
} from '../types/notification.types';
import { partition, groupBy, keys } from 'lodash';

@Injectable()
export class NotificationsService implements ISendNotifications {
  private providers: Map<NotificationProvider, INotificationProviderService>;

  constructor(
    private readonly userNotificationCheckerService: ICheckUserNotificationAllowed,
    private readonly logger: Logger,
  ) {}

  async sendNotifications(
    userNotifications: UserNotification[],
  ): Promise<void> {
    const userNotificationStatuses =
      await this.userNotificationCheckerService.getUserNotificationsStatus(
        userNotifications,
      );

    const [enabledUserNotifications, disabledUserNotifications] = partition(
      userNotificationStatuses,
      ({ enabled }) => enabled,
    );

    this.logger.debug('disabledUserNotifications', disabledUserNotifications);

    const enabledUserNotificationsByProvider = groupBy(
      enabledUserNotifications,
      ({ notificationProvider }) => notificationProvider,
    );

    Promise.allSettled(
      keys(enabledUserNotificationsByProvider).map(
        (notificationProvider: NotificationProvider) =>
          this.providers
            .get(notificationProvider)
            .sendNotifications(
              enabledUserNotificationsByProvider[notificationProvider],
            ),
      ),
    );
  }
}
