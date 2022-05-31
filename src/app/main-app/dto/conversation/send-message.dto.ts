export interface SendMessageModelDTO {
  from: FromMessage;
  to?: ToMessage;
  to_id: string;
  to_name: string;
  message: string;
  attachments?: Attachments;
  post_id?: string;
  parent_id?: string;
  comment_id?: string;
  created_time: string;
}

export interface FromMessage {
  id?: string;
  name?: string;
}

export interface ToMessage {
  id: string;
  name: string;
}

export interface Attachments {
  data: ImageData[]
}

export interface ImageData {
  image_data: Object;
}
