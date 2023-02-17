import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { ChatomniObjectsItemDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";
import { takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { AutoReplyConfigDTO } from "src/app/main-app/dto/configs/page-config.dto";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalRef } from "tds-ui/modal";
import { TDSSafeAny, TDSHelperString } from "tds-ui/shared/utility";

@Component({
  selector: 'auto-reply-config',
  templateUrl: './auto-reply-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class AutoReplyConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;

  dataModel!: AutoReplyConfigDTO;
  isLoading: boolean = false;

  lstCommentAutoReply: string[] = [];
  lstCommentNotAutoReply: string[] = [];

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  };

  parserComas = (value: TDSSafeAny) =>{
    if(value != null){
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  notIsValidToOrderTagHelpers = [
    { id: "Tên Facebook khách hàng", value: "{facebook.name}" },
    { id: "Tên khách hàng", value: "{partner.name}" },
    { id: "Mã khách hàng", value: "{partner.code}" },
    { id: "Số điện thoại khách hàng", value: "{partner.phone}" },
    { id: "Địa chỉ khách hàng", value: "{partner.address}" },
    { id: "Mã đơn hàng", value: "{order.code}" },
    { id: "Ghi chú đơn hàng", value: "{order.note}" },
    { id: "Tổng tiền đơn hàng", value: "{order.total_amount}" },
    { id: "Sản phẩm hóa đơn", value: "{order.product}" },
    { id: "Chi tiết đơn hàng", value: "{order.details}" }
  ];

  tagHelpers = [
    { id: "Tên Facebook khách hàng", value: "{facebook.name}" },
    { id: "Bình luận Facebook của khách hàng", value: "{facebook.comment}" },
  ];

  quillTagHelpers = {
    toolbar: null,
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      // readOnly: true,
      mentionDenotationChars: ["@"],
      showDenotationChar: false,
      positioningStrategy: "relative",
      defaultMenuOrientation: "bottom",
      mentionContainerClass: "ql-mention-list-container",
      renderItem: (item: { id: any; }, searItem: any) => {
        return item.id;
      },
      source: (searchTerm: string, renderList: (arg0: { id: string; value: string; }[], arg1: any) => void, mentionChar: any) => {
        let values;
        values = this.tagHelpers as any;

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (  ~values[i].id.toLowerCase().indexOf(searchTerm.toLowerCase()))
              matches.push(values[i]);

          renderList(matches, searchTerm);
        }
      },
    } as any
  } as any;

  notIsValidToOrderQuillTagHelpers = {
    toolbar: null,
    mention: {
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      // readOnly: true,
      mentionDenotationChars: ["@"],
      showDenotationChar: false,
      positioningStrategy: "relative",
      defaultMenuOrientation: "bottom",
      mentionContainerClass: "ql-mention-list-container",
      renderItem: (item: { id: any; }, searItem: any) => {
        return item.id;
      },
      source: (searchTerm: string, renderList: (arg0: { id: string; value: string; }[], arg1: any) => void, mentionChar: any) => {
        let values;
        values = this.notIsValidToOrderTagHelpers as any;

        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          for (var i = 0; i < values.length; i++)
            if (  ~values[i].id.toLowerCase().indexOf(searchTerm.toLowerCase()))
              matches.push(values[i]);

          renderList(matches, searchTerm);
        }
      },
    } as any
  } as any;

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(){
    this.loadData();
  }

  loadData() {
    let objectId  = this.data?.ObjectId;
    if(!objectId) return;

    this.isLoading = true;
    this.facebookPostService.getAutoReplyConfigs(objectId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: AutoReplyConfigDTO) => {

          this.dataModel = {...res};
          if(TDSHelperString.hasValueString(res.ContentOfCommentForNotAutoReply)) {
            this.lstCommentNotAutoReply = res.ContentOfCommentForNotAutoReply?.split(",");
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadReplyConfig);
          this.cdRef.detectChanges();
        }
      });
  }

  changeCommentNotAutoReply(event: string[]){
    event.forEach(x => {
      if(x.includes(',')){
        this.message.error('Ký tự không hợp lệ');
        event.pop();
      }
    });

    this.lstCommentNotAutoReply = [...event];
  }

  prepareModel(): any {
    let model = {...this.dataModel} as AutoReplyConfigDTO;

    model.ContentOfCommentForAutoReply = this.lstCommentAutoReply?.join(',');
    model.ContentOfCommentForNotAutoReply = this.lstCommentNotAutoReply?.join(',');

    return model;
  }

  onSave(){
    let objectId = this.data?.ObjectId;
    if(!objectId) {
      this.message.error('Không tìm thấy id bài viết');
      return;
    }

    let model = this.prepareModel();
    this.isLoading = true;
    this.facebookPostService.onChangeDisable$.emit(true);

    this.facebookPostService.updateAutoReplyConfigs(objectId, model).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.isLoading = false;
        this.message.success('Cập nhật phản hồi bình luận thành công');

        this.facebookPostService.onChangeDisable$.emit(false);
        this.cdRef.detectChanges();
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message);

        this.facebookPostService.onChangeDisable$.emit(false);
        this.cdRef.detectChanges();
      }
    });
  }

  onCancel() {
      this.modalRef.destroy(null);
  }
}
