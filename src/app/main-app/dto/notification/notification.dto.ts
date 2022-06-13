export interface NotificationGetMappingDTO {
  Page: number;
  Limit: number;
  IsRead?: boolean | null;
}

export interface TPosAppMongoDBNotificationDTO {
  Id: string;
  Title: string;
  Image: string;
  Content: string;
  Description: string;
  NotificationId: string;
  EnablePopup: boolean;
  Images: TPosAppMongoDBNotificationImageDTO[];
  Topics: TPosAppMongoDBNotificationTopicDTO[];
  MarkReadBy: TPosAppMongoDBNotificationUserDTO;
  DateRead?: Date;
  DateCreated: Date;
}

export interface TPosAppMongoDBNotificationUserDTO {
  Id: string;
  Name: string;
}

export interface TPosAppMongoDBNotificationImageDTO {
  Title: string;
  Url: string;
}

export interface TPosAppMongoDBNotificationTopicDTO {
  Url: string;
  Title: string;
  Image: string;
  Description: string;
}
