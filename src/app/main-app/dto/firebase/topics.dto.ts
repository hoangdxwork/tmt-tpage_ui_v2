
export interface Topic {
  id: string;
  name: string;
  isActive?: boolean;
}

export interface FireBaseTopicDto {
  group: string;
  topics: Topic[];
}


