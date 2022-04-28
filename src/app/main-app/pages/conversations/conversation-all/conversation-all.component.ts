import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActiveMatchingItem, CRMMatchingMappingDTO } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMMatchingDTO, CRMMatchingItem } from 'src/app/main-app/dto/conversation-all/crm-matching.dto';
import { CRMActivityDTO } from 'src/app/main-app/dto/conversation/activity.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationDataFacade } from 'src/app/main-app/services/facades/conversation-data.facade';
import { ConversationFacebookState } from 'src/app/main-app/services/facebook-state/conversation-fb.state';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperObject, TDSMessageService, TDSSafeAny, TDSHelperArray } from 'tmt-tang-ui';

@Component({
    selector: 'app-conversation-all',
    templateUrl: './conversation-all.component.html',
    styleUrls: ['./conversation-all.component.scss']
})

export class ConversationAllComponent extends TpageBaseComponent implements OnInit, AfterViewInit {

  isLoading: boolean = false;
  dataSource$!: Observable<any>;
  lstMatchingItem!: ActiveMatchingItem[];
  destroy$ = new Subject();
  psid!: string;
  activeMatchingItem!: ActiveMatchingItem;
  isFastSend: boolean = false;
  currentConversation: any;

  constructor(private message: TDSMessageService,
      private fbState: ConversationFacebookState,
      private conversationDataFacade: ConversationDataFacade,
      public crmService: CRMTeamService,
      private conversationService: ConversationService,
      public activatedRoute: ActivatedRoute,
      public router: Router) {
        super(crmService, activatedRoute, router);
  }

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
  //
  listData: Array<TDSSafeAny> = []
  // onInit(): void {
  //   this.listData = this.getData();
  // }

// dropdown-customer
  log(str: any){
    console.log(str)
  }

  onInit() {
    this.type = this.paramsUrl?.type;
    let team = this.currentTeam || {} as CRMTeamDTO;
    if((TDSHelperObject.hasValue(team) && team?.Id && team?.Facebook_PageId)) {
        this.onChangeConversation(team);
    }
  }

  onChangeConversation(team: CRMTeamDTO) {
    this.dataSource$ = this.conversationDataFacade.makeDataSource(team.Facebook_PageId, this.type);
    this.loadConversations((this.dataSource$));
  }

  makeDataSource(pageId: any, type: string) {
    this.fbState.createEventData(pageId);
    const query = this.conversationService.createQuery(pageId, type);

    this.conversationService.get(query).pipe(takeUntil(this.destroy$)).subscribe((res: CRMMatchingDTO) => {
        if(res && TDSHelperArray.hasListValue(res.Items)) {
          let datas = this.conversationDataFacade.createConversation(res, query, type) as CRMMatchingMappingDTO;
          if(datas) {
              this.fbState.setConversation(pageId, type, datas);
          }
        }
    });
  }

  loadConversations(dataSource$: Observable<any>) {
    if(dataSource$) {
      dataSource$.pipe(takeUntil(this.destroy$)).subscribe((res: CRMMatchingMappingDTO) => {
        if(res && TDSHelperArray.hasListValue(res.items)) {
            this.lstMatchingItem = [...res.items];
            //TODO: khi load lần đầu tiên psid = null, load dữ liệu sẽ gán lại giá trị tại items[0]
            let psid: string = this.paramsUrl?.psid || null;
            //TODO: check psid khi load lần 2,3,4...
            let exits = this.lstMatchingItem.filter(x => x.psid == psid)[0];
            if(exits) {
                this.activeConversations(exits);
            } else {
                this.activeConversations(this.lstMatchingItem[0]);
            }
        }
      }, error => {
          this.message.error('Load thông tin CRMMatching đã xảy ra lỗi');
      })
    }
  }

  activeConversations(item: ActiveMatchingItem) {
    if(TDSHelperObject.hasValue(item)) {
      if(this.isFastSend == true) {
          this.conversationDataFacade.checkSendMessage(item.page_id, this.type, item.psid);
      } else {
          //TODO: lần đầu tiên sẽ lấy items[0] từ danh sách matching
          this.psid = item.psid;
          this.addQueryParams({ psid: this.psid });
          this.activeMatchingItem = item;
      }
    }
  }

  ngAfterViewInit(): void {
  }

  onClickTeam(data: CRMTeamDTO):any {
    if (this.paramsUrl?.teamId ) {
        let url = this.router.url.split("?")[0];
        const params = { ...this.paramsUrl };
        params.teamId = data.Id;

        this.onChangeConversation(data);
        return this.router.navigate([url], { queryParams: params });
    } else {
        this.crmService.onUpdateTeam(data);
    }
  }

  onLoadMiniChat(event: any): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
