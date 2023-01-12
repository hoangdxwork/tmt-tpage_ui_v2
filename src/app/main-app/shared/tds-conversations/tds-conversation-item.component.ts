import { ChatomniCommentModelDto } from './../../dto/conversation-all/chatomni/chatomni-comment.dto';
import { EnumSendMessageType } from './../../dto/conversation-all/chatomni/chatomini-send-message.dto';
import { ChatomniCommentService } from '@app/services/chatomni-service/chatomni-comment.service';
import { SuggestCitiesDTO, SuggestDistrictsDTO, SuggestWardsDTO } from './../../dto/suggest-address/suggest-address.dto';
import { ChatomniSendMessageModelDto } from '@app/dto/conversation-all/chatomni/chatomini-send-message.dto';
import { ChatomniSendMessageService } from './../../services/chatomni-service/chatomni-send-message.service';
import { ResultCheckAddressDTO } from 'src/app/main-app/dto/address/address.dto';
import { ModalAddAddressV2Component } from './../../pages/conversations/components/modal-add-address-v2/modal-add-address-v2.component';
import { ChatomniEventEmiterService } from './../../app-constants/chatomni-event/chatomni-event-emiter.service';
import { ChatomniMessageFacade } from 'src/app/main-app/services/chatomni-facade/chatomni-message.facade';
import { ResponseAddMessCommentDto, ResponseAddMessCommentDtoV2 } from './../../dto/conversation-all/chatomni/response-mess.dto';
import { ChatomniCommentFacade } from './../../services/chatomni-facade/chatomni-comment.facade';
import { ChatomniDataItemDto, ChatomniStatus, Datum, ChatomniDataDto, ExtrasChildsDto, NlpEntityDto, AttachmentDto, PayloadElementsDto } from './../../dto/conversation-all/chatomni/chatomni-data.dto';
import { CRMTeamType } from './../../dto/team/chatomni-channel.dto';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef, Inject } from "@angular/core";
import { finalize, takeUntil } from "rxjs";
import { CRMTeamDTO } from "../../dto/team/team.dto";
import { ActivityMatchingService } from "../../services/conversation/activity-matching.service";
import { ActivityDataFacade } from "../../services/facades/activity-data.facade";
import { ConversationDataFacade } from "../../services/facades/conversation-data.facade";
import { ConversationOrderFacade } from "../../services/facades/conversation-order.facade";
import { PhoneHelper } from "../helper/phone.helper";
import { ReplaceHelper } from "../helper/replace.helper";
import { eventReplyCommentTrigger } from "../helper/event-animations.helper";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalService } from "tds-ui/modal";
import { ProductPagefbComponent } from "../../pages/conversations/components/product-pagefb/product-pagefb.component";
import { FormatIconLikePipe } from "../pipe/format-icon-like.pipe";
import { TDSDestroyService } from 'tds-ui/core/services';
import { SendMessageModelDTO } from '@app/dto/conversation/send-message.dto';
import { DOCUMENT } from '@angular/common';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: "tds-conversation-item",
  templateUrl:'./tds-conversation-item.component.html',
  styleUrls: ['./tds-conversations.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [eventReplyCommentTrigger],
  providers: [ TDSDestroyService ]
})

export class TDSConversationItemComponent implements OnInit, OnChanges  {

  @Input() dataItem!: ChatomniDataItemDto;
  @Input() csid!: string;
  @Input() partner: any;
  @Input() team!: CRMTeamDTO;
  @Input() children!: ExtrasChildsDto[];
  @Input() type: any;
  @Input() name!: string;
  @Input() dataSource!: ChatomniDataDto;
  @Input() index!: number;
  @Input() companyCurrents: any;
  @Input() searchText!: string;

  @HostBinding("@eventReplyComment") eventAnimation = true;

  messages: any = [];
  message: string = '';
  isReply: boolean = false;
  isPrivateReply: boolean = false;
  messageModel: any
  isLiking: boolean = false;
  isHiding: boolean = false;
  isReplyingComment: boolean = false;
  reloadingImage: boolean = false;
  gallery: ChatomniDataItemDto[] = [];
  listAtts: TDSSafeAny[] = [];
  isShowItemImage: boolean = false;
  imageClick!: number;
  postPictureError: any[] = [];

  isLoadingRetryMessage: boolean = false;
  retryMessageTimer: TDSSafeAny;

  @ViewChild('contentReply') contentReply!: ElementRef<any>;
  @ViewChild('contentMessage') contentMessage: any;
  @ViewChildren('contentMessageChild') contentMessageChild: any;
  @ViewChild('itemProduct') itemProduct!: ElementRef<any>;

  constructor(private element: ElementRef,
    private modalService: TDSModalService,
    private tdsMessage: TDSMessageService,
    private cdRef : ChangeDetectorRef,
    private formatIconLike: FormatIconLikePipe,
    private viewContainerRef: ViewContainerRef,
    private activityDataFacade: ActivityDataFacade,
    private conversationDataFacade: ConversationDataFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private activityMatchingService: ActivityMatchingService,
    private destroy$: TDSDestroyService,
    private omniCommentFacade: ChatomniCommentFacade,
    private omniMessageFacade: ChatomniMessageFacade,
    private chatomniEventEmiter: ChatomniEventEmiterService,
    private chatomniSendMessageService: ChatomniSendMessageService,
    private chatomniCommentService: ChatomniCommentService,
    @Inject(DOCUMENT) private document: Document) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['children'] && !changes['children'].firstChange) {
      this.children = changes['children'].currentValue;
    }
  }

  ngOnInit(): void {
    if(this.dataItem && this.dataItem.Data && !this.dataItem.Message) {
        let exist = this.dataItem.Data?.attachments?.data;
        if(exist) {
            this.dataItem.Data!.is_error_attachment = false;
        } else {
            this.dataItem.Data!.is_error_attachment = true;
        }
    }
  }

  selectOrder(type: string, index?: number, nlpEntities?: NlpEntityDto[]): any {
    let model = { type: '', value: '' } as any;
    let value = this.getTextOfContentMessage();

    if(TDSHelperString.hasValueString(value)) {
        switch(type) {
            case "phone":
              let phone = PhoneHelper.getMultiplePhoneFromText(value, this.companyCurrents);
              if (!phone) {
                  return this.tdsMessage.error("Không tìm thấy số điện thoại");
              }
              model.value = phone;
              model.type = 'phone';
              break;

            case "address":
              if(value.length > 200) {
                return this.tdsMessage.error("Tin nhắn hoặc bình luận được chọn không quá 200 ký tự");
              }

              model.type = 'address';
              this.showModalSuggestAddress(model, index);
              return;

            case "note":
                if (Number(index) >=0 && this.contentMessageChild && this.contentMessageChild._results[Number(index)] && this.contentMessageChild._results[Number(index)].nativeElement && this.contentMessageChild._results[Number(index)].nativeElement.outerText){
                  model.value = this.contentMessageChild._results[Number(index)].nativeElement.outerText;
                } else {
                  model.value = value;
                }
                model.type = 'note';
              break;
        }

        //TODO: load sang tab conversation-order paste lại dữ liệu
        this.conversationOrderFacade.onSelectOrderFromMessage$.emit(model);
    } else {
        return false;
    }
  }

  getTextOfContentMessage() {
    let text: string = '';
    //TODO: thêm xử lý với tin nhắn phản hồi
    if (this.contentMessage?.nativeElement?.outerText) {
        text = this.contentMessage.nativeElement.outerText;
    } else if(this.contentMessage?.text) {
        text = this.contentMessage.text;
    } else {
        this.tdsMessage.info("Không thể lấy thông tin");
    }

    return text;
  }

  loadEmojiMart(event: any) {
    if(TDSHelperString.hasValueString(this.messageModel)) {
      this.messageModel = `${this.messageModel}${event?.emoji?.native}`;
    } else {
      this.messageModel = `${event?.emoji?.native}`;
    }
  }

  clickReply() {
    this.isReply = !this.isReply;

    setTimeout(() => {
      if(this.contentReply)
        this.contentReply.nativeElement.focus();
      }, 350);
  }

  addLike() {
    if(this.isLiking){
      return
    }
    this.isLiking = true;

    let model = {
      CommentType: 3,
      Recipients: [this.dataItem.Data?.id as string]
    } as ChatomniCommentModelDto;

    this.chatomniCommentService.commentHandle(this.team.Id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.tdsMessage.success('Thao tác thành công!');
          this.dataItem.Data.user_likes = !this.dataItem.Data.user_likes;
          this.isLiking = false;

          this.cdRef.markForCheck();
        },
      error: error => {
          this.tdsMessage.error(error.error? error.error.message :'đã xảy ra lỗi');
          this.isLiking = false;
          this.cdRef.markForCheck();
      }
    });
  }

  hideComment() {
    if(this.isHiding){
      return
    }
    this.isHiding = true;

    let model = {
      CommentType: this.dataItem.Data?.is_hidden ? 2: 1,
      Recipients: [this.dataItem.Data?.id as string]
    } as ChatomniCommentModelDto

    this.chatomniCommentService.commentHandle(this.team.Id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.tdsMessage.success('Thao tác thành công!');
          this.dataItem.Data.is_hidden = !this.dataItem.Data?.is_hidden;
          this.isHiding = false;

          this.cdRef.markForCheck();
        },
      error: error => {
          this.tdsMessage.error(error.error? error.error.message :'đã xảy ra lỗi');
          this.isHiding = false;
          this.cdRef.markForCheck();
      }
    });
  }

  isErrorAttachment(att: AttachmentDto, dataItem: ChatomniDataItemDto){
    if(dataItem && (dataItem.Status != ChatomniStatus.Error || dataItem.Error?.Message)) {
        this.dataItem.Data['is_error_attachment'] = true;
    }
  }

  //chưa test
  refreshAttachment(item: any) {
    if(this.reloadingImage){
      return
    }

    let model = {
      id: this.team.ChannelId,
      messageId: this.dataItem.Id || this.csid,
      fetchId: this.dataItem.Data?.id || null
    }

    this.reloadingImage = true;
    this.activityMatchingService.refreshAttachmentv2(this.team.ChannelId, model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.reloadingImage = false

            this.tdsMessage.success("Thao tác thành công");
            if (TDSHelperArray.hasListValue(res)) {
              res.forEach((x: ResponseAddMessCommentDtoV2, i: number) => {
                  x["Status"] = ChatomniStatus.Done;
                  let data = this.omniMessageFacade.mappingChatomniDataItemDtoV2(x);
                  this.dataItem  = {...data}
              });
            }

            this.cdRef.detectChanges();
        },
        error: error => {
            this.reloadingImage = false
            this.tdsMessage.error(`${error.Message}` || 'Không thành công');
            this.cdRef.markForCheck();
        }
    });
  }

  checkErrorMessage(message: string): boolean {
    if(message.includes("(#10)")) {
        return true;
    }
    return false;
  }

  //TODO: load lại tin nhắn lỗi
  retryMessage() {
    if(this.isLoadingRetryMessage) return;
    this.destroyTimer();

    let model = {
      MessageType: EnumSendMessageType._RETRY,
      RecipientId: this.dataItem.Id
    }
    this.isLoadingRetryMessage = true;

      this.chatomniSendMessageService.sendMessage(this.team.Id, this.dataItem.UserId, model)
      .pipe(takeUntil(this.destroy$)).subscribe(
        {
          next: (res: any) => {
            if (TDSHelperArray.hasListValue(res)) {
              res.forEach((x: ResponseAddMessCommentDtoV2, i: number) => {
                  x["Status"] = ChatomniStatus.Pending;
                  let data = this.omniMessageFacade.mappingChatomniDataItemDtoV2(x);
                  this.dataItem  = {...data};
              });
            }
            this.retryMessageTimer = setTimeout(() => {
                this.isLoadingRetryMessage = false;
                this.cdRef.detectChanges;
            }, 10 * 1000);

            this.cdRef.detectChanges();
          },
          error: error => {
            this.isLoadingRetryMessage = false;
            this.tdsMessage.error(`${error?.message}` || 'Không thành công');

            this.cdRef.detectChanges();
        }
      }
    )
  }

  // has_admin_required: copy lại tn đẩy qua input tds-conversation để gửi lại
  copyMessage() {
    if(this.contentMessage?.nativeElement?.innerText) {
        let message = this.contentMessage.nativeElement.innerText;
        this.activityMatchingService.onCopyMessageHasAminRequired$.emit(message);
    }
  }

  changeIsPrivateReply() {
    this.isPrivateReply = !this.isPrivateReply;
  }

  onProductsbypageFb() {
    const modal = this.modalService.create({
      title: 'Danh sách sản phẩm',
      content: ProductPagefbComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'xl',
      componentParams: {
        pageId: this.team.ChannelId,
      }
    });

    modal.componentInstance?.onSendProduct.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny)=>{
        if(res){
            this.onProductSelected(res);
            modal.destroy(null);
        }
      }
    })
  }

  //chưa có dữ liệu chưa test lại
  onProductSelected(event :any) {
    if(event && event.Id){
      let model = {
        product: {
          Id: event.Id,
          Name: event.Name,
          Picture: event.Picture,
          Price: event.Price,
        }
      };

      this.activityMatchingService.addTemplateMessageV3(this.team?.Id, this.dataItem?.UserId, model)
        .pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            if(TDSHelperArray.hasListValue(res)){
              res.forEach((x: ResponseAddMessCommentDtoV2, i: number) => {
                x["Status"] = ChatomniStatus.Done;

              let data = this.omniMessageFacade.mappingChatomniDataItemDtoV2(x);

              if(i == res.length - 1){
                let itemLast = {...data}

                let modelLastMessage = this.omniMessageFacade.mappinglLastMessageEmiter(this.csid ,itemLast, x.MessageType);
                //TODO: Đẩy qua conversation-all-v2
                this.chatomniEventEmiter.last_Message_ConversationEmiter$.emit(modelLastMessage);
              }
            });
          }

          this.messageModel = null;
          this.isReply = false;
          this.isReplyingComment = false;
          this.tdsMessage.success('Gửi sản phẩm thành công');

          this.cdRef.markForCheck();
          },
          error: error => {
            this.tdsMessage.error(`${error.error.message}` ? `${error.error.message}`  : 'Gửi sản phẩm thất bại');
            this.cdRef.markForCheck();
          }
      });
    }
  }

  onIconShowButtonSelected(event: any) {
    if (!this.message) {
      this.message = event.emoji.native;
    } else {
      this.message = `${this.message}${event.emoji.native}`;
    }
  }

  onQuickReplySelected(event: any) {
    if(event) {
      let text = event.BodyPlain || event.BodyHtml || event.text;

      text = ReplaceHelper.quickReply(text, this.partner);
      this.messageModel = text;
    }
  }

  open_gallery(att: any) {
    this.isShowItemImage = true;
    let result:TDSSafeAny[]= [];
    this.gallery = this.dataSource.Items.filter((x: ChatomniDataItemDto) => x.Data && x.Data.attachments != null);

    if(this.gallery && this.gallery.length > 0) {

      this.gallery.map(item => {
        if(item.Data?.attachments){

          item.Data?.attachments.data.map((attachment: any) => {
              if(attachment.mime_type != 'audio/mpeg'){

                  let image_url = attachment.image_data?.url ? attachment.image_data?.url : attachment.video_data?.url;
                  result.push({
                      date_time: item.CreatedTime,
                      id: item.Data?.from?.id || item.UserId,
                      url: image_url,
                      type: attachment.mime_type ? attachment.mime_type : null
                  });
              }
          })
        }
      })

      this.listAtts = [...result];
      if(att.image_data && att.image_data.url) this.imageClick = this.listAtts.findIndex(x => x.url == att.image_data.url);
      if(att.video_data && att.video_data.url) this.imageClick = this.listAtts.findIndex(x => x.url == att.video_data.url);
    }
  }

  onCloseShowItemImage(ev: boolean){
    this.isShowItemImage = ev;
  }

  onEnter(event: any): any{
    this.replyComment();

    event.preventDefault();
    event.stopImmediatePropagation();
  }

  clickSendMessage(): any {
    this.replyComment();
  }

  replyComment() {
    if(this.isReplyingComment){
        return;
    }

    let message = this.messageModel;

    if (!TDSHelperString.hasValueString(message)) {
        this.tdsMessage.error('Hãy nhập nội dung cần gửi');
        return
    }

    this.isReplyingComment = true;

    if(this.isPrivateReply) {
      this.addQuickReplyComment(message);
    }

    else {
        let model = this.prepareModel(message);
        model.RecipientId = this.dataItem.ParentId || this.dataItem?.Data?.id as string;
        model.ObjectId =this.dataItem.ObjectId || this.dataItem.Data?.object?.id as string;

        this.chatomniCommentService.replyComment(this.team!.Id, this.dataItem.UserId, model).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: ResponseAddMessCommentDtoV2[]) => {
              res.map((resItem: ResponseAddMessCommentDtoV2)=> {
                let x = resItem as ChatomniDataItemDto;

                  x["Status"] = ChatomniStatus.Done;
                  x.Type = this.team.Type == CRMTeamType._Facebook? 12 : 0;
                  let data = { ...x};

                  let index = (this.children || []).findIndex(x=>x.Id == data.Id);

                  // TODO: Nếu socker trả về trước thì không add item, chưa trả về thì add item
                  if(Number(index) == -1) {
                    this.children = [ ...(this.children || []), data];

                    //TODO: Đẩy qua tds-conversation
                    this.chatomniEventEmiter.childCommentConversationEmiter$.emit(data);

                    //TODO: Đẩy qua conversation-all
                    let itemLast = {...data}
                    let modelLastMessage = this.omniMessageFacade.mappinglLastMessageEmiter(this.csid ,itemLast, x.Type);
                    this.chatomniEventEmiter.last_Message_ConversationEmiter$.emit(modelLastMessage);
                  }

                  this.messageModel = null;

                  this.messageModel = null;
                  this.tdsMessage.success("Trả lời bình luận thành công");

                  this.isReply = false;
                  this.isReplyingComment = false;
              })
                this.cdRef.detectChanges();
            },
            error: error => {

                this.isReply = false;
                this.isReplyingComment = false;
                this.tdsMessage.error(`${error.error?.message}` || "Trả lời bình luận thất bại.");
                this.cdRef.detectChanges();
            }
          })
    }
  }

  addQuickReplyComment(message: string) {
    this.isReply = false;
    const model = this.prepareModel(message);
    model.MessageType = EnumSendMessageType._REPLY;
    model.RecipientId = this.dataItem.Data.id || this.dataItem.Data.Id || null;

    this.chatomniSendMessageService.sendMessage(this.team.Id, this.dataItem.UserId, model)
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ResponseAddMessCommentDtoV2[]) => {

          if(TDSHelperArray.hasListValue(res)){
            res.forEach((x: ResponseAddMessCommentDtoV2, i: number) => {
              x["Status"] = ChatomniStatus.Pending;

              let data = this.omniMessageFacade.mappingChatomniDataItemDtoV2(x);
              let index = (this.dataSource?.Items || []).findIndex(x=> x.Id == data.Id);

              if(index < 0) {
                  this.dataSource.Items = [...this.dataSource.Items, ...[data]];
              } else {
                //TODO: trường hợp socket trả về trước res, gán lại data để Status là Pending
                  this.dataSource.Items[index] = {...data};
                  this.dataSource.Items = [...this.dataSource.Items];
              }

              if(i == res.length - 1){
                let itemLast = {...data}

                let modelLastMessage = this.omniMessageFacade.mappinglLastMessageEmiter(this.csid ,itemLast, x.MessageType);
                //TODO: Đẩy qua conversation-all-v2
                this.chatomniEventEmiter.last_Message_ConversationEmiter$.emit(modelLastMessage);
              }
            });
        }

        this.messageModel = null;
        this.isReply = false;
        this.isReplyingComment = false;
        this.tdsMessage.success('Gửi tin thành công');

        this.cdRef.markForCheck();

      },
      error: error => {
        this.isReplyingComment = false;
        this.tdsMessage.error(`${error?.error?.message}` ? `${error?.error?.message}` : "Gửi tin nhắn thất bại");
        this.cdRef.markForCheck();
      }
    });
  }

  prepareModel(message: string): any {
    const model = {} as ChatomniSendMessageModelDto;
    model.Message = message;

    return model;
  }

  showModalSuggestAddress(model: TDSSafeAny, index?: number, nlpEntities?: NlpEntityDto[]){
    let value: string = '';
    if (Number(index) >= 0 && this.contentMessageChild && this.contentMessageChild._results[Number(index)] && this.contentMessageChild._results[Number(index)].text) {
      value = this.contentMessageChild._results[ Number(index)].text;
    } else {
        value = this.getTextOfContentMessage();
    }

    // if(nlpEntities && nlpEntities.length > 0 && nlpEntities[0] && nlpEntities[0].Name == 'address') {
    //     if(nlpEntities[0].Value){
    //       let data = JSON.parse(nlpEntities[0].Value);

    //       if (data && typeof data === "object") {
    //         let _cities = {code: data.CityCode || null, name: data.CityName || null} as SuggestCitiesDTO;
    //         let _districts = {code: data.DistrictCode || null, name: data.DistrictName || null} as SuggestDistrictsDTO;
    //         let _wards = {code: data.WardCode || null, name: data.WardName || null} as SuggestWardsDTO;

    //           let modal = this.modalService.create({
    //             title: 'Thêm địa chỉ',
    //             content: ModalAddAddressV2Component,
    //             size: "lg",
    //             viewContainerRef: this.viewContainerRef,
    //             componentParams: {
    //               isEntities: true,
    //               innerText: value,
    //               _street: data.FullAddress,
    //               _cities: _cities,
    //               _districts: _districts,
    //               _wards: _wards,
    //             }
    //           });

    //         modal.afterClose.subscribe({
    //           next: (result: ResultCheckAddressDTO) => {
    //             if(result){
    //                 model.value = {...result};
    //                 //TODO: load sang tab conversation-order paste lại dữ liệu
    //                 this.conversationOrderFacade.onSelectOrderFromMessage$.emit(model);
    //             }
    //           }
    //         })
    //         return;
    //       }
    //     }
    // }

    if(TDSHelperArray.hasListValue(value)) {
        let modal = this.modalService.create({
            title: 'Thêm địa chỉ',
            content: ModalAddAddressV2Component,
            size: "lg",
            viewContainerRef: this.viewContainerRef,
            componentParams: {
              _street: value
            }
          });

        modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
          next: (result: ResultCheckAddressDTO) => {
            if(result){
                model.value = {...result};
                //TODO: load sang tab conversation-order paste lại dữ liệu
                this.conversationOrderFacade.onSelectOrderFromMessage$.emit(model);
            }
          }
        })
    }
  }

  @HostListener('click', ['$event']) onClick(e: TDSSafeAny) {
    let className = JSON.stringify(e.target.className);
    if(className.includes('text-copyable')){
      if (e.target.className.indexOf('text-copyable') >= 0) {
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = e.target.getAttribute('data-value') || e.target.innerHTML;

        if(selBox.value) {
          let phoneRegex = /(?:\b|[^0-9])((o|0|84|\+84)(\s?)([2-9]|1[0-9])((\d|o)(\s|\.)?){8})(?:\b|[^0-9])/g;

          let removeDots = selBox.value.toString().replace(/\./g, '');
          let removeSpace = removeDots.toString().replace(/\s/g, '');

          let exec = phoneRegex.exec(removeSpace);
          if(exec && exec[1]) {
              selBox.value = exec[1];
          }
        }

        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.tdsMessage.info('Đã copy số điện thoại');
      }
    }
  }

  next(id: any) {
    let width = this.itemProduct.nativeElement.clientWidth;
    let element = this.document.getElementById(`scroll-product${id}`) as any;

    setTimeout(() => {
      if(element && width) {
        let left = width + element.scrollLeft;
        element?.scroll({
            left: left + width,
            behavior: 'smooth',
        })
      }
    }, 100)
  }

  previous(id: any) {
    let width = this.itemProduct.nativeElement.clientWidth;
    let element = this.document.getElementById(`scroll-product${id}`) as any;

    setTimeout(() => {
      if(element && width) {
        let right = element.scrollLeft - width;
        element?.scroll({
            left: right - width,
            behavior: 'smooth',
        })
      }
    }, 100)
  }

  detail() {
  }

  errorPostPicture(item: PayloadElementsDto) {
    this.postPictureError.push(item?.image_url);
  }

  checkPostPictureError(item: PayloadElementsDto) {
    return this.postPictureError.find(f => f == item?.image_url);
  }

  destroyTimer() {
    if (this.retryMessageTimer) {
      clearTimeout(this.retryMessageTimer);
    }
  }

  ngOnDestroy(): void {
    this.destroyTimer();
  }
}
