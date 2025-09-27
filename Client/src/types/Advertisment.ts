export interface Advertisement {
  advertisementId: number;
  name: string;
  image: string;
  order: number;
}

export interface AdvertisementForm {
  id: string | number;
  name?: string;
  slug?: string;
  order: number;
  status?: number;
  statusName?: string;
  image?: string;
  imageUpload?: File;
  createDate?: string;
  createdBy?: string;
  updateDate?: string;
  updatedBy?: string;
}