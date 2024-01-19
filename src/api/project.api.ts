import { GetProjectsQueryParam, ProjectDto, UpsertProjectForm } from '../types/project.type';
import { PageableRequest } from '../types/commonRequest.type';
import { AxiosResponse } from 'axios';
import { GenericResponse, PageResponse } from '../types/commonResponse.type';
import axiosClient from './axiosClient';
import { createUrlWithQueryString } from '../utils/globalFunc.util';

export const projectApi = {
  createProject(form: UpsertProjectForm): Promise<AxiosResponse<GenericResponse<ProjectDto>>> {
    return axiosClient.post('projects', form);
  }, updateProject(unitId: number, form: UpsertProjectForm): Promise<AxiosResponse<GenericResponse<ProjectDto>>> {
    return axiosClient.put(`projects/${unitId}`, form);
  }, getProjects(params: GetProjectsQueryParam, pageable: PageableRequest): Promise<AxiosResponse<GenericResponse<PageResponse<ProjectDto>>>> {
    const url = createUrlWithQueryString('projects', params, pageable);
    return axiosClient.get(url);
  }, deleteProjects(unitId: number) {
    return axiosClient.delete(`projects/${unitId}`);
  },
};