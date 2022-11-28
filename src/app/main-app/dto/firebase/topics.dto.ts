export interface TopicDetailDto {
  id: string;
  name: string;
  isActive: boolean;
}

export interface FireBaseTopicDto {
  group: string;
  topics: TopicDetailDto[];
}

export enum FireBaseDevice {
  Platform = 0,
  Apple = 1,
  Google = 2
}

