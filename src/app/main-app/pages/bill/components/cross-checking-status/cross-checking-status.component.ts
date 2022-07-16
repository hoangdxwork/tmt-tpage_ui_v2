import { Message } from './../../../../../lib/consts/message.const';
import { TDSNotificationService } from 'tds-ui/notification';
import { formatNumber } from '@angular/common';
import { vi_VN } from 'tds-ui/i18n';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CrossCheckingDTO, CrossCheckingOrder, ExistedCrossChecking } from '../../../../dto/fastsaleorder/cross-checking.dto';
import { DeliveryCarrierDTOV2 } from '../../../../dto/delivery-carrier.dto';
import { Observable, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { DeliveryCarrierService } from '../../../../services/delivery-carrier.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'cross-checking-status',
  templateUrl: './cross-checking-status.component.html'
})
export class CrossCheckingStatusComponent implements OnInit, OnDestroy {

  listOfData:CrossCheckingOrder[] = [];
  listTempOfData:CrossCheckingOrder[] = [];
  modelData!:CrossCheckingDTO;
  lstCarriers!: Observable<DeliveryCarrierDTOV2[]>;

  public lstShipStatus: any[] = [
    {value:'refund', text:'Hàng trả về'},
    {value:'sent', text:'Đã tiếp nhận'},
    {value:'done', text:'Đã thu tiền'}
  ]
  _form!: FormGroup;
  hasTrackingRefError:string = '';

  public numberWithCommas = (value: number) => `${formatNumber(value || 0, vi_VN.locale)}`;
  public parserComas = (value: string) => value.replace(',', '');

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private deliveryCarrierService: DeliveryCarrierService,
    private fashSaleOrder: FastSaleOrderService,
    private notification: TDSNotificationService,
    private message: TDSMessageService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDefaultData();
    this.lstCarriers = this.loadCarrier();
  }

  createForm(){
    this._form = this.fb.group({
      carrierId:[null],
      shipStatus:[{value:'sent', text:'Đã tiếp nhận'}],
      note:[null],
      payment:[false],
      isNoteOrder:[false]
    });
  }

  loadDefaultData(){
    this.modelData = {
      datas: [],
      carrierId: 0,
      note: '',
      payment: false,
      isNoteOrder: false,
    };
  }

  loadCarrier() {
    return this.deliveryCarrierService.get().pipe(map(res => res.value),takeUntil(this.destroy$));
  }

  changeStatusForAll(){
    let status = this._form.controls['shipStatus'].value;

    this.listTempOfData.map((item)=>{
      item.ShipStatus = status.text;
    })
  }

  checkExistTrackingRef(event:TDSSafeAny,index:number){
    if(!TDSHelperString.hasValueString(event.value)){
      this.listTempOfData[index].hasError = 'Vui lòng nhập mã vận đơn';
      return;
    }

    let duplicateTrackingRef = this.listOfData.filter(f=>f.TrackingRef == event.value);

    if(duplicateTrackingRef.length > 1){
      this.message.warning('Trùng mã vận đơn');
    }

    let formModel = this._form.value;
    let status = formModel.shipStatus.text.replace(' ','+');
    // TODO: Kiểm tra mã vận đơn
    this.fashSaleOrder.checkTrackingRefIsExist(event.value,status,formModel.carrierId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res:any)=>{
          delete res['@odata.context'];
          let model = res as ExistedCrossChecking;

          if(this.listOfData[index]){
            // TODO: trường hợp chỉnh sửa mã vận đơn
            this.listOfData[index].TrackingRef = model.TrackingRef || event.value;
            this.listOfData[index].CoDAmount = model.COD;
            this.listOfData[index].Note = model.Message;
            this.listOfData[index].ShipStatus = formModel.shipStatus.text;
            this.listTempOfData = [...this.listOfData];
            // TODO: show lỗi
            this.listTempOfData[index].hasError = model.Message;
          }else{
            // TODO: trường hợp thêm mới mã vận đơn
            this.listOfData.push({
              TrackingRef: model.TrackingRef || event.value,
              CoDAmount: model.COD,
              Note: model.Message,
              ShipStatus: formModel.shipStatus.text
            })

            this.listTempOfData = [...this.listOfData];
            // TODO: show lỗi
            this.listTempOfData[index].hasError = model.Message;
          }
        },
        (err)=>{
          this.message.error(err.error.message || 'Có lỗi xảy ra');
        }
    )
  }

  removeCrossChecking(index:number){
    this.listOfData.splice(index,1);
    this.listOfData = [...this.listOfData];
    this.listTempOfData = this.listOfData;
  }

  removeAllCrossChecking(){
    this.listOfData = [];
    this.listTempOfData = this.listOfData;
  }

  onOrderFilter(event:TDSSafeAny){
    if(event.value == ''){
      this.listTempOfData = this.listOfData;
    }else{
      this.listTempOfData = this.listTempOfData.filter(f=>f.TrackingRef?.includes(event.value) ||
      f.ShipStatus?.includes(event.value) ||
      f.CoDAmount?.toString().includes(event.value));
    }
  }

  createDetails(){
    let isEmptyTrackingRef = this.listOfData.some(x=>x.TrackingRef == '');
    
    if(!isEmptyTrackingRef){
      this.listOfData = [...this.listOfData,{
        TrackingRef: '',
        CoDAmount: 0,
        Note: '',
        ShipStatus: 'Đã tiếp nhận'
      }];

      this.listTempOfData = this.listOfData;
    }else{
      this.message.error('Vui lòng nhập mã vận đơn');
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if(event.key === 'F2'){
      this.createDetails();
    }
  }

  prepareModel(){
    let formModel = this._form.value;

    this.modelData.carrierId = formModel.carrierId ? formModel.carrierId : this.modelData.carrierId;
    this.modelData.note =  formModel.note ? formModel.note : this.modelData.note;
    this.modelData.payment = formModel.payment;
    this.modelData.isNoteOrder = formModel.isNoteOrder;
    this.modelData.datas = [];
    this.listOfData.forEach(data => {
      if(data.TrackingRef){
        this.modelData.datas.push(data);
      }
    });
    return this.modelData;
  }

  checkErrorOrderList(model:CrossCheckingDTO){
    if(!model.carrierId){
      this.message.error('Vui lòng chọn đối tác giao hàng');
      return false;
    }

    if(model.datas){
      let hasError = true;
      model.datas.forEach(order => {
        if(order.Note === 'Không tìm thấy vận đơn'){
          this.message.error(`Không tìm thấy vận đơn [${order.TrackingRef}]`);
          hasError = false;
        }
      });
      return hasError;
    }else{
      this.message.error('Danh sách đối soát rỗng');
      return false;
    }
  }

  updateCrossChecking(){
    let model = this.prepareModel();
    // TODO: check validate
    if(this.checkErrorOrderList(model)){
      model.datas.forEach(order => {
        delete order["hasError"];
      });

      this.fashSaleOrder.postManualCrossChecking(model).pipe(takeUntil(this.destroy$)).subscribe(
        (res:any)=>{
          this.message.success(Message.UpdatedSuccess);

          if(TDSHelperString.hasValueString(res.value)){
            res.value.forEach((item:string) => {
              this.notification.error(
                'lỗi',
                item
              );
            });
          }
          this.modal.destroy(null);
        },
        (err)=>{
          this.message.error(err?.error?.message || 'Lỗi dữ liệu. Không thể tạo đối soát thủ công');
        }
      )
    }
  }

  save(){
    this.updateCrossChecking();
  }

  cancel(){
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
