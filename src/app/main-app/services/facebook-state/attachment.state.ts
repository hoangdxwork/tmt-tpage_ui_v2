import { TDSHelperString, TDSHelperArray } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";
import { InnerAttachmentDTO, MDBAttachmentDTO, MDBCollectionDTO } from '../../dto/attachment/attachment.dto';
import { PagedList2 } from '../../dto/pagedlist2.dto';

@Injectable()
export class AttachmentState {
  private dataAttachment!: PagedList2<MDBAttachmentDTO> | undefined;
  private dataCollection: MDBCollectionDTO[] = [];

  constructor( ) { }

  addItemAttachment(data: Array<any>) {
    if(!this.dataAttachment) {
      this.dataAttachment = {} as PagedList2<MDBAttachmentDTO>;
    }
    this.dataAttachment["Items"] = this.dataAttachment["Items"] || [];
    this.dataAttachment["Items"] = [...this.dataAttachment["Items"], ...data];
  }

  pushItemAttachment(data: Array<MDBAttachmentDTO>) {
    if(!this.dataAttachment) {
      this.dataAttachment = {} as PagedList2<MDBAttachmentDTO>;
    }
    this.dataAttachment["Items"] = this.dataAttachment["Items"] || [];
    this.dataAttachment["Items"] = [...data, ...this.dataAttachment["Items"]];
  }

  addInner(collectionId: string, inner: Array<any>) {
    let exist = this.dataCollection.find(x => x.id == collectionId);

    if(exist) {
      exist["Attachments"] = [...inner, ...exist["Attachments"]];

      let lastInner = inner[inner.length - 1];
      exist["LastUrl"] = lastInner.Url;
      exist["LastUrlId"] = lastInner.id;
    }
  }

  setAttachment(data: PagedList2<MDBAttachmentDTO>) {
    this.dataAttachment = undefined;
    this.dataAttachment = data;

    return this.dataAttachment;
  }

  setCollection(data: Array<any>) {
    this.dataCollection.length = 0;
    this.dataCollection = [...this.dataCollection, ...data];

    return this.dataCollection;
  }

  setInner(id: string, data: Array<InnerAttachmentDTO>, lastUrl?: string, lastUrlId?: string) {
    let exist = this.getInner(id);

    if(exist) {
      exist.Attachments = data;

      if(TDSHelperString.hasValueString(lastUrl) && TDSHelperString.hasValueString(lastUrlId)) {
        exist.LastUrl = lastUrl;
        exist.LastUrlId = lastUrlId;
      }
    }

    return exist;
  }

  getAttachment() {
    return this.dataAttachment;
  }

  getCollection() {
    return this.dataCollection;
  }

  getInner(id: string) {
    let exist = this.dataCollection.find(x => x.id == id);
    return exist;
  }

  addCollection(collection: any) {
    this.dataCollection.push(collection);
  }

  updateNameAttachment(id: string, name: string) {
    if(this.dataAttachment) {
      let exist = this.dataAttachment.Items.find((x: any) => x.id == id);

      if(exist) {
        exist["Name"] = name;
      }
    }
  }

  updateNameCollection(id: string, name: string) {
    let exist = this.dataCollection.find(x => x.id == id);

    if(exist) {
      exist["Name"] = name;
    }
  }

  updateNameInner(id: string, innerId :string, name: string) {
    let exist = this.dataCollection.find(x => x.id == id);

    if(exist) {
      let inner = exist.Attachments.find((x: any) => x.id == innerId);

      if(inner) {
        inner["Name"] = name;
      }
    }
  }

  removeAttachment(ids: Array<string>) {
    if(this.dataAttachment) {
      this.dataAttachment.Items = this.dataAttachment.Items.filter((x: any) => !ids.includes(x.id));
    }
  }

  removeCollection(id: string) {
    let index = this.dataCollection.findIndex(x => x.id == id);

    if(index || index == 0) {
      this.dataCollection.splice(index, 1);
    }
  }

  removeInner(id: string, idInner: string) {
    let exist = this.dataCollection.find(x => x.id == id);

    if(exist) {
      exist.Attachments = exist.Attachments.filter((x: any) => x.id != idInner);
    }
  }

  removeInners(collectionId: string, collection: any) {
    let exist = this.dataCollection.find(x => x.id == collectionId);

    if(exist) {
      exist.Attachments = collection.Attachments;
    }
  }

}
