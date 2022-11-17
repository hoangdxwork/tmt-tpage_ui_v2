export interface Notification {
  id: string;
  type: number;
  title: string;
  shortContent: string;
  thumbnail: string;
  dateCreated: Date;
}

export interface NotificationItemDto {
  id: string;
  dateRead?: Date;
  notification: Notification;
  dateCreated: Date;
}

export interface FireBaseNotificationDto {
  items: NotificationItemDto[];
  cursor: string;
}
