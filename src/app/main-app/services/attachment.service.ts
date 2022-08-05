import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "./base.service";
import { MDBAttachmentDTO, MDBCollectionDTO } from '../dto/attachment/attachment.dto';
import { PagedList2 } from '../dto/pagedlist2.dto';



@Injectable()
export class AttachmentService extends BaseSevice {

  prefix: string = "odata";
  table: string = "Attachment";
  baseRestApi: string = "rest/v1.0/attachment";

  private limit: number = 20;

  constructor(private apiService: TCommonService) {
    super(apiService);
  }

  getAll(text?: string): Observable<PagedList2<MDBAttachmentDTO>> {
    let queryString = this.createQuery(0, this.limit);
    text && (queryString += `&keyword=${text}`);

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getall?${queryString}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<PagedList2<MDBAttachmentDTO>>(api, null);
  }

  getNextPage(pageIndex: number, pageSize: number): Observable<PagedList2<MDBAttachmentDTO>> {
    let queryString = this.createQuery(pageIndex, pageSize);

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getall?${queryString}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<PagedList2<MDBAttachmentDTO>>(api, null);
  }

  getListCollection(): Observable<MDBCollectionDTO[]> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getlistcollection`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<MDBCollectionDTO[]>(api, null);
  }

  getCollection(text?: string): Observable<PagedList2<MDBCollectionDTO>> {
    let queryString = this.createQuery(0, this.limit);
    text && (queryString += `&keyword=${text}`);

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getcollection?${queryString}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<PagedList2<MDBCollectionDTO>>(api, null);
  }

  getInner(id: string): Observable<MDBCollectionDTO> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getinner`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<MDBCollectionDTO>(api, null);
  }

  removeAttachments(ids: Array<string>): Observable<undefined> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/deleteattachments`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<undefined>(api, ids);
  }

  removeCollection(id: string): Observable<undefined> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/removecollection?id=${id}`,
      method: CoreApiMethodType.get,
    }

    return this.apiService.getData<undefined>(api, null);
  }

  add(files: Array<File>): Observable<MDBAttachmentDTO[]> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/add`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<MDBAttachmentDTO[]>(api, files);
  }

  createAttachment(name: string, files: Array<File>, attachments: Array<any>): Observable<any> {
    let formData = new FormData();

    for (let file of files) {
      formData.append("files", file, file.name);
    }

    for(let att of attachments) {
      formData.append("attachment", JSON.stringify(att));
    }

    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/createattachment?name=${name}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, formData);
  }

  addInnerByAttachment(id: string, ids: Array<string | undefined>): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/addinnerbyattachment?id=${id}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<any>(api, ids);
  }

  addAttachment(id: string, formData: FormData): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/addattachment?id=${id}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, formData);
  }

  updateName(id: string, name: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updatename?id=${id}&name=${name}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, null);
  }

  updateNameCollection(id: string, name: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updatenamecollection?id=${id}&name=${name}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, null);
  }

  updateNameInner(id: string, innerId: string, name: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/updatenameinner?id=${id}&innerId=${innerId}&name=${name}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, null);
  }

  removeInners(id: string, idInners: Array<string>): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/removeinners?id=${id}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, idInners);
  }

  addInnerByCollection(id: string, collectionId: string, ids: Array<string | undefined>): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/addinnerbycollection?id=${id}&fromId=${collectionId}`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, ids);
  }

  createQuery(page?: any, limit?: any) {
    let obj: any = {
      page: page || 0,
      limit: limit || 20,
    }

    var queryString = Object.keys(obj).map(key => {
      if (obj[key] != undefined) {
        return key + '=' + obj[key];
      } else {
        return null;
      }
    }).filter(x => x != null).join('&');

    return queryString;
  }

}
