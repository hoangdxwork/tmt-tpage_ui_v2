import { User } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { ChangeDetectorRef, Component, Host, Input, OnChanges, OnInit, Optional, SimpleChanges, SkipSelf } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ActiveMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CheckConversationData } from 'src/app/main-app/dto/partner/check-conversation.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { ConversationOrderFacade } from 'src/app/main-app/services/facades/conversation-order.facade';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSMessageService } from 'tmt-tang-ui';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'conversation-order',
    templateUrl: './conversation-order.component.html',
})

export class ConversationOrderComponent  implements OnInit, OnChanges {

  @Input() data!: ActiveMatchingItem;
  @Input() team!: CRMTeamDTO;

  _form!: FormGroup;
  isLoading: boolean = false;

  cvsData!: CheckConversationData;
  private destroy$ = new Subject();

  // Đơn hàng
  name = new FormControl('', [Validators.required]);
  phoneNumber = new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/i)]);
  email = new FormControl('', [Validators.required, Validators.email]);
  nameSelect = new FormControl('', [Validators.required]);
  note = new FormControl('', [Validators.required]);
  noteProduct = new FormControl('', [Validators.required]);
  soLuongProduct = new FormControl('', [Validators.required]);
  giaBanProduct = new FormControl('', [Validators.required]);
  giamGia = new FormControl('', [Validators.required]);
  thue = new FormControl('', [Validators.required]);
  tienCoc = new FormControl('', [Validators.required]);
  khuyenMai = new FormControl('', [Validators.required]);
  thanhToan = new FormControl('', [Validators.required]);
  DTGH = new FormControl('', [Validators.required]);
  dichVu = new FormControl('', [Validators.required]);
  khoiLuong = new FormControl('', [Validators.required]);
  phiGH = new FormControl('', [Validators.required]);
  tienThuHo = new FormControl('', [Validators.required]);
  notGH = new FormControl('', [Validators.required]);
  // select đối tác giao hàng
  public listDTGiaoHang = [
    { id: 1, name: 'DHL' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    {id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]
  // select dich vu
  public listDichVu = [
    { id: 1, name: 'Giao hàng tiêu chuẩn' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    {id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]

  // select thông tin khách hàng
  public contactCustomer = [
    { id: 1, name: 'Nguyen Binh' },
    { id: 2, name: 'Elvis Presley' },
    { id: 3, name: 'Paul McCartney' },
    { id: 4, name: 'Elton John' },
    { id: 5, name: 'Elvis Presley' },
    { id: 6, name: 'Paul McCartney' },
]
  // select Page QAXK Nhiên Trung
  public contact:number = 1;
  public contactOptions = [
      { id: 1, name: 'Page QAXK Nhiên Trung' },
      { id: 2, name: 'Elvis Presley' },
      { id: 3, name: 'Paul McCartney' },
      { id: 4, name: 'Elton John' },
      { id: 5, name: 'Elvis Presley' },
      { id: 6, name: 'Paul McCartney' }
  ]
  // search
  inputValue?: string;
    // Đơn hàng
  // table đơn hàng
  listOfData = [
    {
      id: '1',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
    {
      id: '2',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-neutral-1-400',
      text: 'Ghi chú sản phẩm',
      icon: 'tdsi-edit-line',
      style:'italic',
    },
    {
      id: '3',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
    {
      id: '4',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
    {
      id: '5',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-neutral-1-400',
      text: 'Ghi chú sản phẩm',
      icon: 'tdsi-edit-line',
      style:'italic',
    },
    {
      id: '6',
      name: '[SP0748] Gạo (Bao)',
      color: 'text-info-500',
      text: 'Ghi chú',
      icon: '',
      style:'not-italic',
    },
  ];

  editNoteProduct: string | null = null;
  startEdit(id: string): void {
    this.editNoteProduct = id;
  }

  stopEdit(): void {
    this.editNoteProduct = null;
  }

  constructor(private message: TDSMessageService,
    private draftMessageService: DraftMessageService,
    private conversationEventFacade: ConversationEventFacade,
    private conversationOrderFacade: ConversationOrderFacade,
    private saleOnline_OrderService: SaleOnline_OrderService,
    public crmService: CRMTeamService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public activatedRoute: ActivatedRoute,
    public router: Router) {
      this.createForm();
  }

  createForm(): void {
    this._form = this.fb.group({
        Id: [null],
        Code: [null],
        LiveCampaignId: [null],
        Facebook_UserId: [null],
        Facebook_ASUserId: [null],
        Facebook_UserName: [null],
        Facebook_CommentId: [null],
        Facebook_PostId: [null],
        PartnerId: [null],
        PartnerName: [null],
        Name: [null],
        Email: [null],
        TotalAmount: [0],
        TotalQuantity: [0],
        Street: [null],
        City: [null],
        District: [null],
        Ward: [null],
        User: [null],
        Telephone: [null],
        Note: [null],
        CRMTeamId: [null],
        PrintCount: [null],
        Session: [null],
        SessionIndex: [null],
        StatusText: [null],
        Details: this.fb.array([]),
    })
  }

  ngOnInit(): void {
    if(this.data ) {debugger
      //TODO: data load lần đầu
      this.loadData(this.data);
    }
    //TODO: load user gán _form User
  }

  loadData(data: any) {
    let id = "";
    this.saleOnline_OrderService.getById(id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      delete res['@odata.context'];
      debugger
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
