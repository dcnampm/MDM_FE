import { AxiosResponse } from 'axios';
import axiosClient from './axiosClient';
import { GenericResponse } from '../types/commonResponse.type';
import { FileStorage, FileStorageDto } from '../types/fileStorage.type';
import { forceDownloadFromArrayBuffer } from '../utils/globalFunc.util';
import { toast } from 'react-toastify';

export const fileApi = {
  getImage(imageId: number): Promise<AxiosResponse<GenericResponse<FileStorage>>> {
    const url = `files/image/${imageId}`;
    return axiosClient.get(url);
  }, getDocumentUrlsByIds(documentIds: number[]): string[] {
    let urls: string[] = [];
    documentIds.forEach((documentId) => {
      urls.push(`${process.env.REACT_APP_BASE_API_URL}/files/document/${documentId}`);
    });
    return urls;
  }, getDocument(documentId: number): Promise<AxiosResponse> {
    const url = `files/document/${documentId}`;
    return axiosClient.get(url);
  }, getDocumentsByIdIn(documentIds: number[]): Promise<AxiosResponse<GenericResponse<FileStorage[]>>> {
    let url = `files/document?`;
    documentIds.forEach(documentId => {
      url += `id=${documentId}&`;
    });
    return axiosClient.get(url);
  }, downloadDocumentByListOfFileStorageDto(fileStorageDtoes: FileStorageDto[] | undefined) {
    if (fileStorageDtoes === undefined || fileStorageDtoes.length === 0) {
      toast.warning('Không có tài liệu để tải xuống');
      return;
    }
    const ids: number[] = fileStorageDtoes.map(value => value.id);
    fileApi.downloadDocumentByListOfIds(ids);
  }, downloadDocumentByListOfIds(ids: number[]) {
    fileApi.getDocumentsByIdIn(ids).then((res) => {
      res.data.data.forEach(value => {
        forceDownloadFromArrayBuffer(value.data, `${value.name}.${value.extension}`);
      });
    }).catch(reason => {
      toast.error('Tải xuống tài liệu thất bại');
      console.log('error when fetching  documents: ', reason);
    });
  }, getImagesByIdIn(imageIds: number[]): Promise<AxiosResponse<GenericResponse<FileStorage[]>>> {
    let url = `files/image?`;
    imageIds.forEach(imageId => {
      url += `id=${imageId}&`;
    });
    return axiosClient.get(url);
  },
};