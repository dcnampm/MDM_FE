export interface ServiceDto {
  id?: number;
  name?: string;
  note?: string;
}

export interface GetServicesQueryParam {
  keyword?: string;
}

export interface UpsertServiceForm {
  name?: string;
  note?: string;
}