import { finalize, takeUntil } from 'rxjs/operators';
import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FacebookPostItem } from 'src/app/main-app/dto/facebook-post/facebook-post.dto';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { AutoOrderConfigDTO } from 'src/app/main-app/dto/configs/post/order-config.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { Subject } from 'rxjs';

@Component({
  selector: 'post-order-interaction-config',
  templateUrl: './post-order-interaction-config.component.html'
})
export class PostOrderInteractionConfigComponent implements OnInit, OnChanges {
  @Input() data!: FacebookPostItem;

  isLoading: boolean = false;
  isEditSendMess: boolean = false;
  private destroy$ = new Subject<void>();

  formInteractionConfig!: FormGroup;

  constructor(
    private modalRef: TDSModalRef,
    private formBuilder: FormBuilder,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.data?.firstChange === true) this.createForm();
    else this.resetForm();

    if(changes?.data?.currentValue) {
      this.loadInteractionConfig(this.data.fbid);
    }
  }

  ngOnInit(): void {

  }

  loadInteractionConfig(postId: string) {
    this.isLoading = false;
    this.facebookPostService.getOrderConfig(postId)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.updateForm(res);
      });
  }

  createForm() {
    this.formInteractionConfig = this.formBuilder.group({
      IsEnableOrderReplyAuto: [false],
      OrderReplyTemplate: [null],
      IsEnableShopLink: [false],
      ShopLabel: [null],
      ShopLabel2: [null],
      IsOrderAutoReplyOnlyOnce: [false],
    });
  }

  resetForm() {
    this.formInteractionConfig.reset();
  }

  editSendMess(){
    this.isEditSendMess = true
  }

  updateForm(data: AutoOrderConfigDTO) {
    let temp = document.createElement("div");
    if (TDSHelperString.hasValueString(data?.OrderReplyTemplate)) {
      temp.innerHTML = data?.OrderReplyTemplate
      data.OrderReplyTemplate = temp.textContent || temp.innerText || "";
    }
    this.formInteractionConfig.patchValue(data);
  }

  onSave() {
    let model = this.prepareModel();
    let postId = this.data?.fbid;

    this.isLoading = true;
    this.facebookPostService.updateInteractionConfig(postId, model)
      .pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.UpdatedSuccess);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  prepareModel() {
    let formValue = this.formInteractionConfig.value;

    let model = {} as AutoOrderConfigDTO;

    model.IsEnableOrderReplyAuto = formValue.IsEnableOrderReplyAuto;
    model.OrderReplyTemplate = formValue.OrderReplyTemplate;
    model.IsEnableShopLink = formValue.IsEnableShopLink;
    model.ShopLabel = formValue.ShopLabel;
    model.ShopLabel2 = formValue.ShopLabel2;
    model.IsOrderAutoReplyOnlyOnce = formValue.IsOrderAutoReplyOnlyOnce;
    console.log(formValue.OrderReplyTemplate)
    return model;
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
