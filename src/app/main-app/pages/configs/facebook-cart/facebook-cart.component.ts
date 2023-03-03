import { CRMTeamService } from './../../../services/crm-team.service';
import { TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil, finalize } from 'rxjs';
import { GeneralConfigService } from 'src/app/main-app/services/general-config.service';
import { ConfigFacebookCartDTO } from 'src/app/main-app/dto/configs/facebook-cart/config-facebook-cart.dto';
import { ProductShopCartService } from '@app/services/shopcart/product-shopcart.service';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';

@Component({
  selector: 'facebook-cart',
  templateUrl: './facebook-cart.component.html',
  host: {
    class: 'w-full h-full flex'
  },
  providers: [TDSDestroyService]
})

export class FacebookCartComponent implements OnInit {

  _form!: FormGroup;
  isLoading: boolean = false;
  dataModel!: ConfigFacebookCartDTO;
  teamShopCart!: CRMTeamDTO;

  lstTeamFacebook: CRMTeamDTO[] = [];

  lstAccountJournal: any[] = [];
  accountJournalItem: any;

  constructor(private fb: FormBuilder,
    private generalConfigService: GeneralConfigService,
    private message: TDSMessageService,
    private productShopCartService: ProductShopCartService,
    private destroy$: TDSDestroyService,
    private crmTeamService: CRMTeamService) {
      this.createForm();
  }

  ngOnInit(): void {
    this.loadListTeam();
    this.loadData();
    this.loadAccountJournal();
  }

  createForm() {
    this._form = this.fb.group({
      IsApplyConfig: [false],// Bật cho phép áp dụng cấu hình giỏ hàng - Chỉ xem

      IsUpdatePartnerInfo: [false],// Cập nhật thông tin khách hàng
      IsUpdateQuantity: [false],// Cập nhật số lượng
      IsCheckout: [false],// Cho phép thanh toán
      IsBuyMore: [false], // Cho phép mua thêm

      IsUpdate: [false],// Cho phép cập nhật giỏ hàng
      IsCancelCheckout: [false],// Cho phép hủy thanh toán (xóa đơn hàng)

      IsUpdateNote: [false],// Cập nhật ghi chú
      IsRemoveProduct: [false],//Cho phép xóa sản phẩm mua được
      IsRemoveProductInValid: [false],// Cho phép xóa sản phẩm không hợp lệ (Không mua được)
      IsDisplayInventory: [false],// Cho phép hiện tồn kho
      IsMergeOrder: [false],// Cho phép khách hàng gộp phiếu bán hàng trên giỏ hàng
      IsShopCart: [false], // hiển thị thông tin giỏ hàng

      AccountJournalId: [null],
      AccountJournal: [null],
      CurrentTeam: [null]
    })
  }

  updateForm(data: ConfigFacebookCartDTO) {
    this._form.patchValue(data);

    if(data.AccountJournal) {
      this._form.controls['AccountJournal'].setValue(data.AccountJournal);
    }

    if(data.AccountJournalId) {
      this._form.controls['AccountJournalId'].setValue(data.AccountJournalId);
      this.generalConfigService.getAccountJournalById(data.AccountJournalId).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data: any) => {
            this.accountJournalItem = data;
          },
          error: (err: any) => {
            this.message.error(err?.error?.message);
          }
      })
    }
    
    if(data.ChannelId) {
      let item = this.lstTeamFacebook.filter((x: CRMTeamDTO) => x.ChannelId == data.ChannelId)[0];

      this._form.controls['CurrentTeam'].setValue(item || null);
    }

    if(data.IsApplyConfig == true) {
      this._form.controls["IsUpdatePartnerInfo"].disable();
      this._form.controls["IsUpdateQuantity"].disable();
      this._form.controls["IsCheckout"].disable();
      this._form.controls["IsCancelCheckout"].disable();
      this._form.controls["IsBuyMore"].disable();
      this._form.controls["IsUpdateNote"].disable();
      this._form.controls["IsRemoveProduct"].disable();
      this._form.controls["IsRemoveProductInValid"].disable();
      this._form.controls["IsDisplayInventory"].disable();
      this._form.controls["IsMergeOrder"].disable();
      this._form.controls["IsShopCart"].disable();
    }
  }

  onChangeAccountJournal(value: any) {
    if(value && value > 0) {
      this.isLoading = true;

      let exist = this.lstAccountJournal.filter(x => x.Id === value)[0];
      if(exist) {
        this._form.controls['AccountJournalId'].setValue(value);
        this.accountJournalItem = null;

        this.generalConfigService.getAccountJournalById(value).pipe(takeUntil(this.destroy$)).subscribe({
          next: (data: any) => {
            this.accountJournalItem = data;
            this.isLoading = false;
          },
          error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message);
          }
        })
      }
    } else {
      this.accountJournalItem = null;
    }
  }

  loadData() {
    let name = "ConfigCart";
    this.isLoading  = true;

    this.generalConfigService.getByName(name).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: any) => {
        this.dataModel = res;
        this.updateForm(res);
        this.isLoading = false;
      },
      error:(err) => {
        this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  loadAccountJournal() {
    this.generalConfigService.getAccountJournal().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.lstAccountJournal = [...(res.value || [])];
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  loadListTeam() {
    this.crmTeamService.onChangeListFaceBook().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: Array<CRMTeamDTO> | null) => {
            if(res && res.length > 0) {
                res.map((x: CRMTeamDTO) => {
                    if(x.Type == CRMTeamType._Facebook) {
                        this.lstTeamFacebook = [...(x.Childs || [])];
                    }
                })
            }
        }
    });
  }

  applyConfig(event: boolean){
    if(event == true) {
      this._form.controls["IsUpdatePartnerInfo"].setValue(false);
      this._form.controls["IsUpdatePartnerInfo"].disable();

      this._form.controls["IsUpdateQuantity"].setValue(false);
      this._form.controls["IsUpdateQuantity"].disable();

      this._form.controls["IsCheckout"].setValue(false);
      this._form.controls["IsCheckout"].disable();

      this._form.controls["IsCancelCheckout"].setValue(false);
      this._form.controls["IsCancelCheckout"].disable();

      this._form.controls["IsBuyMore"].setValue(false);
      this._form.controls["IsBuyMore"].disable();

      this._form.controls["IsUpdateNote"].setValue(false);
      this._form.controls["IsUpdateNote"].disable();

      this._form.controls["IsRemoveProduct"].setValue(false);
      this._form.controls["IsRemoveProduct"].disable();

      this._form.controls["IsRemoveProductInValid"].setValue(false);
      this._form.controls["IsRemoveProductInValid"].disable();

      this._form.controls["IsDisplayInventory"].setValue(false);
      this._form.controls["IsDisplayInventory"].disable();

      this._form.controls["IsMergeOrder"].setValue(false);
      this._form.controls["IsMergeOrder"].disable();

      this._form.controls["IsShopCart"].setValue(false);
      this._form.controls["IsShopCart"].disable();

    } else {

      this._form.controls["IsUpdatePartnerInfo"].setValue(true);
      this._form.controls["IsUpdatePartnerInfo"].enable();

      this._form.controls["IsUpdateQuantity"].setValue(true);
      this._form.controls["IsUpdateQuantity"].enable();

      this._form.controls["IsCheckout"].setValue(true);
      this._form.controls["IsCheckout"].enable();

      this._form.controls["IsCancelCheckout"].setValue(true);
      this._form.controls["IsCancelCheckout"].enable();

      this._form.controls["IsBuyMore"].setValue(true);
      this._form.controls["IsBuyMore"].enable();

      this._form.controls["IsUpdateNote"].setValue(true);
      this._form.controls["IsUpdateNote"].enable();

      this._form.controls["IsRemoveProduct"].setValue(true);
      this._form.controls["IsRemoveProduct"].enable();

      this._form.controls["IsRemoveProductInValid"].setValue(true);
      this._form.controls["IsRemoveProductInValid"].enable();

      this._form.controls["IsDisplayInventory"].setValue(true);
      this._form.controls["IsDisplayInventory"].enable();

      this._form.controls["IsMergeOrder"].setValue(false);
      this._form.controls["IsMergeOrder"].enable();

      this._form.controls["IsShopCart"].setValue(true);
      this._form.controls["IsShopCart"].enable();
    }
  }

  onSave(){
    let name = "ConfigCart";
    let model = this.prepareModel();
    this.isLoading = true;

    this.generalConfigService.update(name, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          this.isLoading = false;
          this.message.success('Cập nhật cấu hình giỏ hàng thành công');
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
      }
    })
  }

  onChangeIsShopCart(event: boolean) {
    if(event == true && !TDSHelperObject.hasValue(this.teamShopCart)) {
        this.loadInitShopCart();
    }
  }

  loadInitShopCart() {
    this.isLoading = true;
    this.productShopCartService.initShopCart().pipe(takeUntil(this.destroy$)).subscribe({
      next: (team: any) => {
          this.teamShopCart = team;
          this.isLoading = false;
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
          this.isLoading = false;
      }
    })
  }

  prepareModel() {
    let formModel = this._form.value;

    let exist = this._form.controls["IsUpdatePartnerInfo"].value == false
        && this._form.controls["IsCheckout"].value == false
        && this._form.controls["IsUpdateQuantity"].value == false
        && this._form.controls["IsBuyMore"].value == false

    if(exist) {
        formModel.IsUpdate = false;
    } else {
        formModel.IsUpdate = true;
    }

    let model = {
        IsApplyConfig: formModel.IsApplyConfig as boolean,

        IsUpdatePartnerInfo: formModel.IsUpdatePartnerInfo as boolean,
        IsUpdateQuantity: formModel.IsUpdateQuantity as boolean,
        IsCheckout: formModel.IsCheckout as boolean,
        IsBuyMore: formModel.IsBuyMore as boolean,

        IsCancelCheckout: formModel.IsCancelCheckout as boolean,
        IsUpdate: formModel.IsUpdate as boolean,
        IsUpdateNote: formModel.IsUpdateNote as boolean,
        IsRemoveProduct: formModel.IsRemoveProduct as boolean,
        IsRemoveProductInValid: formModel.IsRemoveProductInValid as boolean,
        IsDisplayInventory: formModel.IsDisplayInventory as boolean,
        IsMergeOrder: formModel.IsMergeOrder as boolean,
        IsShopCart: formModel.IsShopCart as boolean,
        AccountJournalId: formModel.AccountJournalId,
        AccountJournal: formModel.AccountJournal,
        ChannelId: formModel.CurrentTeam?.ChannelId,
        ChannelName: formModel.CurrentTeam?.Name

    } as ConfigFacebookCartDTO

    return model;
  }
}
