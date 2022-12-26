import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { AutoOrderConfigDTO } from '@app/dto/configs/post/post-order-config.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'post-order-interaction-config',
  templateUrl: './post-order-interaction-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})
export class PostOrderInteractionConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;

  dataModel!:AutoOrderConfigDTO;
  isLoading: boolean = false;
  isEditReply: boolean = false;

  tagHelpers = [
    { id: "Bài live", value: "{order.live_title}" },
    { id: "Tên KH", value: "{partner.name}" },
    { id: "Mã KH", value: "{partner.code}" },
    { id: "Điện thoại KH", value: "{partner.phone}" },
    { id: "Địa chỉ KH", value: "{partner.address}" },
    { id: "Đơn hàng", value: "{order}" },
    { id: "Mã đơn hàng", value: "{order.code}" },
    { id: "Ghi chú đơn hàng", value: "{order.note}" },
    { id: "Chi tiết đơn hàng", value: "{order.details}" },
    { id: "Tổng tiền đơn hàng", value: "{order.total_amount}" },
    { id: "Bình luận chốt đơn", value: "{order.comment}" },
    { id: "Sản phẩm chốt đơn", value: "{order.product}" },
    { id: "Tên Facebook KH", value: "{facebook.name}" },
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

  constructor( private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
    private crmTeamService: CRMTeamService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    let objectId = this.data?.ObjectId;
    let currentTeam = this.crmTeamService.getCurrentTeam();

    if(!objectId || !currentTeam) return;
    this.isLoading = true;

    this.facebookPostService.getOrderConfig(currentTeam.Id, objectId).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {

        if(TDSHelperString.hasValueString(res?.OrderReplyTemplate)) {
          res.OrderReplyTemplate = res.OrderReplyTemplate?.replace(/\n/g, '<p><br></p>');
        }

        this.dataModel = {...res};
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error:(err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message);
        this.cdRef.detectChanges();
      }
    });
  }

  prepareModel() {
    return {
      IsEnableOrderReplyAuto: this.dataModel.IsEnableOrderReplyAuto,
      IsEnableShopLink: this.dataModel.IsEnableShopLink,
      IsOrderAutoReplyOnlyOnce: this.dataModel.IsOrderAutoReplyOnlyOnce,
      OrderReplyTemplate: this.dataModel.OrderReplyTemplate,
      ShopLabel: this.dataModel.ShopLabel,
      ShopLabel2: this.dataModel.ShopLabel2
    } as AutoOrderConfigDTO;
  }

  onSave() {
    let objectId = this.data?.ObjectId;
    if(!objectId) {
      this.message.error('Không tìm thấy id bài viết');
      return;
    }

    let model = this.prepareModel();
    this.isLoading = true;
    this.facebookPostService.onChangeDisable$.emit(true);

    this.facebookPostService.updateInteractionConfig(objectId, model).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.isLoading = false;
          this.message.success('Cập nhật cấu hình tương tác chốt đơn thành công');

          this.facebookPostService.onChangeDisable$.emit(false);
          this.cdRef.detectChanges();
        },
        error:(error) => {
          this.isLoading = false;
          this.facebookPostService.onChangeDisable$.emit(false);
          this.message.error(error?.error?.message);
          this.cdRef.detectChanges();
        }
      });
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
