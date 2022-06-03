import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { MDBAttachmentDTO, MDBCollectionDTO } from "../../dto/attachment/attachment.dto";
import { PagedList2 } from "../../dto/pagedlist2.dto";
import { AttachmentService } from "../attachment.server";
import { AttachmentState } from "../facebook-state/attachment.state";


@Injectable()
export class AttachmentDataFacade {

  public dataAttachment$!: Observable<PagedList2<MDBAttachmentDTO>>;
  public dataCollection$!: Observable<MDBCollectionDTO[]>;

  public onSendImages = new EventEmitter<Array<string>>();

  constructor(
    private attachmentService: AttachmentService,
    private attachmentState: AttachmentState,
    // private toaStr: ToastrService,
  ) { }

  makeAttachment(): Observable<PagedList2<MDBAttachmentDTO>> {
    this.dataAttachment$ = this.getAttachment();
    return this.dataAttachment$;
  }

  makeCollection(): Observable<MDBCollectionDTO[]> {
    this.dataCollection$ = this.getCollection();
    return this.dataCollection$;
  }

  makeInner(id: string): Observable<MDBCollectionDTO | undefined> {
    return this.getInner(id);
  }

  getAttachment(): Observable<PagedList2<MDBAttachmentDTO>> {
    let exist = this.attachmentState.getAttachment();

    if (exist) {
      return new Observable(observer => {
        observer.next(exist);
        observer.complete();
      });
    } else {
      return this.attachmentService.getAll().pipe(map((res: any) => {
        return this.attachmentState.setAttachment(res);
      }), shareReplay());
    }
  }

  getNextPage(): Observable<PagedList2<MDBAttachmentDTO>> {

    return new Observable(observer => {
      let exist = this.attachmentState.getAttachment();

      if(exist && exist.HasNextPage) {
        !exist.PageIndex && (exist.PageIndex = 1);

        let pageIndex = exist.PageIndex + 1;
        let pageSize = exist.PageSize;

        this.attachmentService.getNextPage(pageIndex, pageSize).subscribe(res => {

          if(res && res.Items && res.Items.length > 0 && exist) {
            exist.PageIndex += 1;
            exist.HasNextPage = res.HasNextPage;
            this.attachmentState.addItemAttachment(res.Items);
          }

          observer.next();
          observer.complete();
        }, error => {
          observer.error();
        });
      }
    });
  }

  getCollection(): Observable<MDBCollectionDTO[]> {
    let exist = this.attachmentState.getCollection();

    if (exist && exist.length > 0) {
      return new Observable(observer => {
        observer.next(exist);
        observer.complete();
      });
    } else {
      return this.attachmentService.getListCollection().pipe(map((res: any) => {
        return this.attachmentState.setCollection(res);
      }), shareReplay());
    }
  }

  getInner(id: string): Observable<MDBCollectionDTO | undefined> {
    let collection = this.attachmentState.getInner(id);

    if(collection && collection.Attachments && collection.Attachments.length > 3) {
      return new Observable(observer => {
        observer.next(collection);
        observer.complete();
      });
    }
    else {
      return this.attachmentService.getInner(id)
        .pipe(map(x => {
          if(x && x.Attachments && x.Attachments.length > 0) {
            x.Attachments = x.Attachments.sort((a: any, b: any) => {
                return Date.parse(b.DateCreated) - Date.parse(a.DateCreated);
              });
          }
          return this.attachmentState.setInner(id, x.Attachments);
        }), shareReplay());
    }
  }

  // REMOVE
  removeAttachment(ids: Array<string>): Observable<undefined> {
    return new Observable(observer => {
      this.attachmentService.removeAttachments(ids).subscribe(res => {

        this.attachmentState.removeAttachment(ids);

        observer.next();
        observer.complete();

      }, error => observer.error());
    });
  }

  removeCollection(id: string): Observable<undefined> {
    return new Observable(observer => {
      this.attachmentService.removeCollection(id).subscribe(res => {

        this.attachmentState.removeCollection(id);

        observer.next();
        observer.complete();
      }, error => observer.error(error));
    });
  }

  addAttachment(value: MDBAttachmentDTO[]) {
    this.attachmentState.pushItemAttachment(value);
  }

  createAttachment(name: string, files: Array<File>, attachments: Array<any>): Observable<any> {
    return new Observable(observer => {
      this.attachmentService.createAttachment(name, files, attachments).subscribe(res => {
        this.attachmentState.addCollection(res);

        observer.next();
        observer.complete();
      }, error => observer.error(error));
    });
  }

  addInnerByAttachment(collectionId: string, ids: Array<string | undefined>): Observable<any> {
    return new Observable(observer => {
      this.attachmentService.addInnerByAttachment(collectionId, ids).subscribe(res => {
        this.attachmentState.setInner(collectionId, res["Attachments"], res["LastUrl"], res["LastUrlId"]);

        observer.next();
        observer.complete();
      }, error => observer.error(error));
    });
  }

  insertInner(collectionId: string, data: any) {
    this.attachmentState.addInner(collectionId, data);
    this.attachmentState.pushItemAttachment(data);
  }

  removeInners(collectionId: string, ids: Array<string>): Observable<any> {
    return new Observable(observer => {
      this.attachmentService.removeInners(collectionId, ids).subscribe(res => {

        this.attachmentState.removeInners(collectionId, res);

        observer.next();
        observer.complete();
      }, error => observer.error(error));
    });
  }

  addInnerByCollection(collectionId: string, fromCollectionId: string, ids: Array<string | undefined>): Observable<any> {
    return new Observable(observer => {
      this.attachmentService.addInnerByCollection(collectionId, fromCollectionId, ids).subscribe(res => {
        this.attachmentState.setInner(collectionId, res["Attachments"], res["LastUrl"], res["LastUrlId"]);

        observer.next();
        observer.complete();
      }, error => observer.error(error));
    });
  }

}
