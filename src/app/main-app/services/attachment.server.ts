import { TDSSafeAny } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
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

    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getall?${queryString}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<PagedList2<MDBAttachmentDTO>>(api, null);
  }

  getNextPage(pageIndex: number, pageSize: number): Observable<PagedList2<MDBAttachmentDTO>> {
    let queryString = this.createQuery(pageIndex, pageSize);

    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getall?${queryString}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<PagedList2<MDBAttachmentDTO>>(api, null);
  }

  getListCollection(): Observable<MDBCollectionDTO[]> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getlistcollection`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<MDBCollectionDTO[]>(api, null);
  }

  getCollection(text?: string): Observable<PagedList2<MDBCollectionDTO>> {
    let queryString = this.createQuery(0, this.limit);
    text && (queryString += `&keyword=${text}`);

    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/getcollection?${queryString}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<PagedList2<MDBCollectionDTO>>(api, null);
  }

  getInner(id: string): Observable<MDBCollectionDTO> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/getinner`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<MDBCollectionDTO>(api, null);
  }

  removeAttachments(ids: Array<string>): Observable<undefined> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/deleteattachments`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<undefined>(api, ids);
  }

  removeCollection(id: string): Observable<undefined> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/removecollection?id=${id}`,
      method: TApiMethodType.get,
    }

    return this.apiService.getData<undefined>(api, null);
  }

  add(files: Array<File>): Observable<MDBAttachmentDTO[]> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/add`,
      method: TApiMethodType.post,
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

    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/createattachment?name=${name}`,
      method: TApiMethodType.post,
    }

    return this.apiService.getFileUpload<any>(api, formData);
  }

  addInnerByAttachment(id: string, ids: Array<string | undefined>): Observable<any> {
    const api: TAPIDTO = {
      url: `${this._BASE_URL}/${this.baseRestApi}/${id}/addinnerbyattachment?id=${id}`,
      method: TApiMethodType.post,
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
