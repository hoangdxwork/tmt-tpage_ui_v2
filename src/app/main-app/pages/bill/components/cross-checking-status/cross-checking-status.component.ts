import { TDSDestroyService } from 'tds-ui/core/services';
import { Message } from './../../../../../lib/consts/message.const';
import { TDSNotificationService } from 'tds-ui/notification';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CrossCheckingDTO, CrossCheckingOrder, ExistedCrossChecking } from '../../../../dto/fastsaleorder/cross-checking.dto';
import { DeliveryCarrierDTOV2 } from '../../../../dto/delivery-carrier.dto';
import { Observable, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, HostListener, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
import { DeliveryCarrierV2Service } from '@app/services/delivery-carrier-v2.service';

@Component({
  selector: 'cross-checking-status',
  templateUrl: './cross-checking-status.component.html',
  providers: [TDSDestroyService]
})
export class CrossCheckingStatusComponent implements OnInit {
  @ViewChild('listenerArea') ele!: ElementRef;

  listOfData:CrossCheckingOrder[] = [];
  listTempOfData:CrossCheckingOrder[] = [];
  modelData!:CrossCheckingDTO;
  lstCarriers!: DeliveryCarrierDTOV2[];
  isInput: boolean = false;
  listenerValue: string = '';
  tabIndex: number = 0;

  public lstShipStatus: any[] = [
    {value:'refund', text:'Hàng trả về'},
    {value:'sent', text:'Đã tiếp nhận'},
    {value:'done', text:'Đã thu tiền'}
  ]

  _form!: FormGroup;
  hasTrackingRefError:string = '';

  numberWithCommas =(value:TDSSafeAny) => {
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;

  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private deliveryCarrierService: DeliveryCarrierV2Service,
    private fashSaleOrder: FastSaleOrderService,
    private notification: TDSNotificationService,
    private render: Renderer2,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadDefaultData();
    this.loadDeliveryCarrier();
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

  loadDeliveryCarrier(){
    this.deliveryCarrierService.setDeliveryCarrier();
    this.deliveryCarrierService.getDeliveryCarrier().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        this.lstCarriers = [...res.value];
      },
      error: error =>{
        this.message.error(error?.error?.message || Message.CanNotLoadData);
      }
    })
  }

  changeStatusForAll(){
    let status = this._form.controls['shipStatus'].value;

    this.listTempOfData.map((item)=>{
      item.ShipStatus = status.text;
    })
  }

  checkExistTrackingRef(event: string, index: number){

    if(!TDSHelperString.hasValueString(event)){
      this.listTempOfData[index].hasError = 'Vui lòng nhập mã vận đơn';
      return;
    }

    let duplicateTrackingRef = this.listOfData.filter(f=>f.TrackingRef == event);

    if(duplicateTrackingRef.length > 1){
      this.message.warning('Trùng mã vận đơn');
    }

    let formModel = this._form.value;
    let status = '';

    if(formModel.shipStatus && TDSHelperString.hasValueString(formModel.shipStatus.text)){
      status = formModel.shipStatus.text.replace(' ', '+');
    }
    
    // TODO: Kiểm tra mã vận đơn
    this.fashSaleOrder.checkTrackingRefIsExist(event, status, formModel.carrierId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res:any) => {
          delete res['@odata.context'];
          let model = res as ExistedCrossChecking;

          if(this.listOfData[index]){
            // TODO: trường hợp chỉnh sửa mã vận đơn
            this.listOfData[index].TrackingRef = model.TrackingRef || event;
            this.listOfData[index].CoDAmount = model.COD;
            this.listOfData[index].ShipStatus = formModel.shipStatus.text;
            this.listTempOfData = [...this.listOfData];
            // TODO: show lỗi
            this.listTempOfData[index].hasError = model.Message;
          }else{
            // TODO: trường hợp thêm mới mã vận đơn
            this.listOfData.push({
              TrackingRef: model.TrackingRef || event,
              CoDAmount: model.COD,
              Note: model.Message,
              ShipStatus: formModel.shipStatus.text
            })

            this.listTempOfData = [...this.listOfData];
            // TODO: show lỗi
            this.listTempOfData[index].hasError = model.Message;
          }
        },
        error: (err)=>{
          this.message.error(err.error.message || 'Có lỗi xảy ra');
        }
      })
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
      f.ShipStatus?.includes(event.value) || f.CoDAmount?.toString().includes(event.value));
    }
  }

  createDetails(trackingRef?: string){
    let detail = {
      TrackingRef: trackingRef || '',
      CoDAmount: 0,
      Note: '',
      ShipStatus: 'Đã tiếp nhận'
    };

    this.listOfData = [...this.listOfData,...[detail]];
    this.listTempOfData = this.listOfData;

    this.checkExistTrackingRef(detail.TrackingRef, this.listOfData.length - 1);
  }

  @HostListener('document:keyup.F2', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.createDetails();
  }

  // @HostListener('click', ['$event'])
  // handleClickEvent(event: PointerEvent) {
  //   this.isInput = (event.target as Element).nodeName == 'INPUT';

  //   this.render.listen(this.ele.nativeElement, 'click', (e1: PointerEvent) => {
  //     this.tabIndex += 1;
  //     this.render.listen(this.ele.nativeElement, 'keydown', (e2: KeyboardEvent) => {
        
  //       if(!this.isInput && e2.which <= 90 && e2.which >= 48){
  //         this.listenerValue += e2.key;

  //         setTimeout(()=>{
  //           if(TDSHelperString.hasValueString(this.listenerValue)) {
  //             this.createDetails(this.listenerValue);
  //           }

  //           this.listenerValue = '';
  //         }, 300);
  //       }

  //       e2.stopImmediatePropagation();
  //     });

  //     e1.preventDefault();
  //   })

  //   event.preventDefault();
  //   event.stopImmediatePropagation();
  // }

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

  checkErrorOrderList(model: CrossCheckingDTO){
    if(!model.carrierId){
      this.message.error('Vui lòng chọn đối tác giao hàng');
      return false;
    }

    if(TDSHelperArray.hasListValue(model.datas)){
      let isPass = true;
      
      model.datas.forEach((order,i) => {
        if(order.Note === 'Không tìm thấy vận đơn'){
          this.message.error(`Không tìm thấy vận đơn [${order.TrackingRef}]`);
          isPass = false;
        }

        if(!TDSHelperString.hasValueString(order.TrackingRef)) {
          this.message.error(`Vui lòng nhập mã vận đơn, dòng thứ ${i}`);
          isPass = false;
        }
      });
      return isPass;
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

      this.fashSaleOrder.postManualCrossChecking(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res:any)=>{
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
        error: (err)=>{
          this.message.error(err?.error?.message || 'Lỗi dữ liệu. Không thể tạo đối soát thủ công');
        }
      })
    }
  }

  save(){
    this.updateCrossChecking();
  }

  cancel(){
    this.modal.destroy(null);
  }
}
