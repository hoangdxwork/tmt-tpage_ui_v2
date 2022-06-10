import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { CrossCheckingDTO, CrossCheckingOrder, ExistedCrossChecking } from './../../../../dto/fastsaleorder/cross-checking.dto';
import { TDSSafeAny, TDSModalRef, TDSMessageService, TDSHelperString } from 'tmt-tang-ui';
import { DeliveryCarrierDTOV2 } from './../../../../dto/delivery-carrier.dto';
import { fromEvent, Observable } from 'rxjs';
import { map, debounceTime, switchMap } from 'rxjs/operators';
import { DeliveryCarrierService } from './../../../../services/delivery-carrier.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-manual-cross-checking-modal',
  templateUrl: './manual-cross-checking-modal.component.html'
})
export class ManualCrossCheckingModalComponent implements OnInit {

  @ViewChild('filterText') filterText!: ElementRef;
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
  currentIndex:number = 0;

  constructor(private fb: FormBuilder,
    private modal: TDSModalRef,
    private deliveryCarrierService: DeliveryCarrierService,
    private fashSaleOrder: FastSaleOrderService,
    private message: TDSMessageService
    ) { 
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
      isNoteOrder:[false],
      datas: this.fb.array([])
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
    return this.deliveryCarrierService.get().pipe(map(res => res.value));
  }

  checkExistTrackingRef(event:TDSSafeAny,index:number){
    this.currentIndex = index;
    let duplicateTrackingRef = this.listOfData.find(f=>f.TrackingRef == event.value);
    if(duplicateTrackingRef){
      if(TDSHelperString.hasValueString(event.value)){
        this.hasTrackingRefError = 'Trùng mã vận đơn';
      }else{
        this.hasTrackingRefError = 'Vui lòng nhập mã vận đơn';
      }
    }else{
      let formModel = this._form.value;
      let status = formModel.shipStatus.text.split(' ').join('+');
      // TODO: Kiểm tra mã vận đơn
      this.fashSaleOrder.checkTrackingRefIsExist(event.value,status,formModel.carrierId).subscribe(
        (res:any)=>{
          delete res['@odata.context'];
          let model = res as ExistedCrossChecking;
          this.listOfData[index].TrackingRef = model.TrackingRef;
          this.listOfData[index].CoDAmount = model.COD;
          this.listOfData[index].Note = model.Message;
          this.listOfData[index].ShipStatus = formModel.shipStatus.text;
          this.hasTrackingRefError = model.Message;
          this.listTempOfData = this.listOfData;
        },
        (err)=>{
          this.message.error(err.error.message || 'Có lỗi xảy ra');
        }
      )
    }
  }

  // pushTrackingRef(data:TDSSafeAny){
  //   let model = this._form.value.datas as FormArray;
  //   model.push(this.fb.group({
  //     TrackingRef: [data.TrackingRef],
  //     CoDAmount: [data.CoDAmount],
  //     Note: [data.Note],
  //     ShipStatus: [data.ShipStatus]
  //   }))
  // }

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
    this.listTempOfData = this.listOfData.filter(f=>f.TrackingRef?.includes(event.value) || 
      f.ShipStatus?.includes(event.value) || 
      f.CoDAmount?.toString().includes(event.value));
  }

  createDetails(){
    let isEmptyTrackingRef = this.listOfData.find(f=>f.TrackingRef == '');
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

  prepareModel(){
    let formModel = this._form.value;

    this.modelData.carrierId = formModel.carrierId ? formModel.carrierId : this.modelData.carrierId;
    this.modelData.note =  formModel.note ? formModel.note : this.modelData.note;
    this.modelData.payment = formModel.payment;
    this.modelData.isNoteOrder = formModel.isNoteOrder;
    this.listOfData.forEach(data => {
      if(data.TrackingRef){
        this.modelData.datas.push(data);
      }
    });
    return this.modelData;
  }

  updateCrossChecking(){
    let model = this.prepareModel();
    if(model.carrierId){
      if(model.datas.length > 0){
        this.fashSaleOrder.postManualCrossChecking(model).subscribe(
          (res:any)=>{
            this.modal.destroy(null);
          },
          (err)=>{
            this.message.error(err.error.message || 'Lỗi dữ liệu. Không thể tạo đối soát thủ công')
          }
        )
      }else{
        this.message.error('Không có đối soát');
      }
    }else{
      this.message.error('Vui lòng chọn đối tác giao hàng');
    }
  }

  save(){
    if(this._form.valid){
      this.updateCrossChecking();
    }
  }

  cancel(){
    this.modal.destroy(null);
  }
}
