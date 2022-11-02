
export interface Topic {
  id: string;
  name: string;
}

export interface FireBaseTopicDto {
  group: string;
  topics: Topic[];
}


