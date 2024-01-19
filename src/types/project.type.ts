import { Moment } from 'moment';

export interface ProjectDto {

  id: number;
  name: string;
  fundingSource: string;
  startDate: string;
  endDate: string;
}

export interface GetProjectsQueryParam {
  keyword?: string;
}

export interface UpsertProjectForm {
  name?: string;
  fundingSource?: string;
  startDate?: Moment | string;
  endDate?: Moment | string;
}
