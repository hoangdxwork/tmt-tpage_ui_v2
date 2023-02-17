import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Message } from 'src/app/lib/consts/message.const';
import { AutoReplyConfigDTO } from 'src/app/main-app/dto/configs/page-config.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'config-auto-reply',
  templateUrl: './config-auto-reply.component.html',
  providers: [TDSDestroyService]
})
export class ConfigAutoReplyComponent implements OnInit, OnChanges {

  @Input() eventOnSave: boolean = false;
  @Output() onSaveSuccess = new EventEmitter();

  _form!: FormGroup;

  currentTab: number = 0;
  currentTeam!: CRMTeamDTO | null;
  isLoading: boolean = false;

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) => {
    if(value != null) {
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
    { id: "Bình luận Facebook của khách hàng", value: "{facebook.comment}" }
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

  team!: CRMTeamDTO | any;

  constructor(private fb: FormBuilder,
    private crmTeamService: CRMTeamService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) {
    this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
      IsEnableAutoReplyComment: [false],
      IsEnableAutoReplyMultiple: [false],
      MaxForAutoReplyMultiple: [1],
      IsEnableAutoReplyAllComment: [false],
      IsEnableAutoReplyCommentWithPhone: [false],
      IsEnableAutoNotReplyCommentWithPhone: [false],
      IsEnableAutoReplyCommentWithEmail: [false],
      ContentOfCommentForAutoReply: [null],
      ContentOfCommentForNotAutoReply: [null],
      IsEnableAutoReplyCommentInMessage: [false],
      ContentForAutoReplyWithComment: [null],
      ContentForAutoReplyWithMessage: [null],
      selectedWord1s: [null],
      selectedWord2s: [null],
      selectedWord3s: [null],

      // Cho phép phản hồi tự động khi bình luận tạo đơn tự động không hợp lệ
      IsEnableAutoReplyCommentInNotIsValidToOrder: [false],
      ContentForAutoReplyCommentInNotIsValidToOrder : [null],

      //  Cho phép phản hồi tự động khi bình luận tạo đơn thành công
      IsEnableAutoReplyCommentOrderCreated: [false],
      ContentForAutoReplyCommentOrderCreated: [null]
    });
  }

  ngOnInit(): void {
    this.team = {};
    this.isLoading = true;

    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.team = res;
          let channelId = this.team.ChannelId;
          if(channelId) {
              this.loadAutoReplyConfig(channelId);
          }
          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['eventOnSave'] && !changes['eventOnSave'].firstChange) {
        let exist = changes['eventOnSave'].currentValue == true;
        if(exist) {
            let currentTeam = this.crmTeamService.getCurrentTeam();
            if(currentTeam?.ChannelId != this.team?.ChannelId) {
                this.message.error('Vui lòng F5 để cập nhật TeamId');
            } else {
                this.onSave(this.team.ChannelId);
            }
        }
    }
  }

  loadAutoReplyConfig(channelId: string) {
    this.isLoading = true;
    this.crmTeamService.getChannelAutoReplyConfig(channelId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.updateForm(res);
          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message);
      }
    })
  }

  updateForm(data: any) {
    const formControls = this._form.controls;

    formControls["IsEnableAutoReplyComment"].setValue(data.IsEnableAutoReplyComment);
    formControls["IsEnableAutoReplyMultiple"].setValue(data.IsEnableAutoReplyMultiple);
    formControls["MaxForAutoReplyMultiple"].setValue(data.MaxForAutoReplyMultiple);
    formControls["IsEnableAutoReplyAllComment"].setValue(data.IsEnableAutoReplyAllComment);
    formControls["IsEnableAutoReplyCommentWithPhone"].setValue(data.IsEnableAutoReplyCommentWithPhone);
    formControls["IsEnableAutoNotReplyCommentWithPhone"].setValue(data.IsEnableAutoNotReplyCommentWithPhone);
    formControls["IsEnableAutoReplyCommentWithEmail"].setValue(data.IsEnableAutoReplyCommentWithEmail);
    formControls["ContentOfCommentForAutoReply"].setValue(data.ContentOfCommentForAutoReply);
    formControls["IsEnableAutoReplyCommentInMessage"].setValue(data.IsEnableAutoReplyCommentInMessage);
    formControls["ContentForAutoReplyWithComment"].setValue(data.ContentForAutoReplyWithComment);
    formControls["ContentForAutoReplyWithMessage"].setValue(data.ContentForAutoReplyWithMessage);

    if (data.ContentOfCommentForAutoReply) {
      formControls['selectedWord2s'].setValue(data.ContentOfCommentForAutoReply.split(','));
    }

    if (data.ContentOfCommentForNotAutoReply) {
      formControls['selectedWord3s'].setValue(data.ContentOfCommentForNotAutoReply.split(','));
    }

    formControls['IsEnableAutoReplyCommentInNotIsValidToOrder'].setValue(data.IsEnableAutoReplyCommentInNotIsValidToOrder);
    formControls['ContentForAutoReplyCommentInNotIsValidToOrder'].setValue(data.ContentForAutoReplyCommentInNotIsValidToOrder);

    formControls['IsEnableAutoReplyCommentOrderCreated'].setValue(data.IsEnableAutoReplyCommentOrderCreated );
    formControls['ContentForAutoReplyCommentOrderCreated'].setValue(data.ContentForAutoReplyCommentOrderCreated );
  }

  onSave(channelId: string) {
    let model = this.prepareModelAutoReply();
    this.isLoading = true;

    this.crmTeamService.insertOrUpdateChannelAutoReplyConfig(channelId, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.onSaveSuccess.emit(true);
        this.message.success('Cập nhật cấu hình thành công');
      },
      error: (error: any) => {
        this.isLoading = false;
        this.onSaveSuccess.emit(false);
        this.message.error(error?.error?.message);
      }
    })
  }

  prepareModelAutoReply(): AutoReplyConfigDTO {
    let formValue = this._form.value;

    let model: AutoReplyConfigDTO = {
      IsEnableAutoReplyComment: formValue["IsEnableAutoReplyComment"],
      IsEnableAutoReplyMultiple: formValue["IsEnableAutoReplyMultiple"],
      MaxForAutoReplyMultiple: formValue["MaxForAutoReplyMultiple"],
      IsEnableAutoReplyAllComment: formValue["IsEnableAutoReplyAllComment"],
      IsEnableAutoReplyCommentWithPhone: formValue["IsEnableAutoReplyCommentWithPhone"],
      IsEnableAutoNotReplyCommentWithPhone: formValue["IsEnableAutoNotReplyCommentWithPhone"],
      IsEnableAutoReplyCommentWithEmail: formValue["IsEnableAutoReplyCommentWithEmail"],
      ContentOfCommentForAutoReply: formValue["ContentOfCommentForAutoReply"],
      ContentOfCommentForNotAutoReply: formValue["ContentOfCommentForAutoReply"],
      IsEnableAutoReplyCommentInMessage: formValue["IsEnableAutoReplyCommentInMessage"],
      ContentForAutoReplyWithComment: formValue["ContentForAutoReplyWithComment"],
      ContentForAutoReplyWithMessage: formValue["ContentForAutoReplyWithMessage"],

      IsEnableAutoReplyCommentInNotIsValidToOrder: formValue["IsEnableAutoReplyCommentInNotIsValidToOrder"],
      ContentForAutoReplyCommentInNotIsValidToOrder: formValue["ContentForAutoReplyCommentInNotIsValidToOrder"],

      IsEnableAutoReplyCommentOrderCreated: formValue["IsEnableAutoReplyCommentOrderCreated"],
      ContentForAutoReplyCommentOrderCreated: formValue["ContentForAutoReplyCommentOrderCreated"]
    };

    if (formValue["selectedWord2s"]) {
      model.ContentOfCommentForAutoReply = formValue["selectedWord2s"].join(",");
    }

    if (formValue["selectedWord3s"]) {
      model.ContentOfCommentForNotAutoReply = formValue["selectedWord3s"].join(",");
    }

    return model;
  }

}
