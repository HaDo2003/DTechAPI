import type { MessageResponse } from "./MessageReponse";

export interface Admin extends MessageResponse {
  avatar?: string;
  userName?: string;
  createDate?: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface AdminForm {
  id: string;
  fullName?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  roleId?: string;
  image?: string;
  imageUpload?: File;
  createdBy?: string;
  createDate?: string;
  updatedBy?: string;
  updateDate?: string;
}