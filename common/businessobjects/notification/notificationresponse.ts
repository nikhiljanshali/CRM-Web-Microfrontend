import { Notifications } from "common/entities";

export class NotificationResponse {
      notifications: Notifications[];
      totalCount: number;

      constructor() {
            this.notifications = [];
            this.totalCount = 0;
      }
}