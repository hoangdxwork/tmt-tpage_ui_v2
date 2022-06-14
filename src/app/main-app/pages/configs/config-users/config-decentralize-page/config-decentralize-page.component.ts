import { ConfigDataFacade } from './../../../../services/facades/config-data.facade';
import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { CRMTeamDTO, UpdateGrantPermissionDTO } from 'src/app/main-app/dto/team/team.dto';
import { Observable, Subject } from 'rxjs';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-config-decentralize-page',
  templateUrl: './config-decentralize-page.component.html'
})
export class ConfigDecentralizePageComponent implements OnInit, OnDestroy {

  @Output() getComponent:EventEmitter<number> = new EventEmitter<number>();

  public optionsPermission = [
    { id: 1, name: 'text1' },
    { id: 2, name: 'text2' },
    { id: 3, name: 'text3' },
    { id: 4, name: 'text5' },
    { id: 5, name: 'admin' },
    { id: 6, name: 'nhân viên' },
]
  listOfDataPermission=[
    {urlImg: '../../../assets/imagesv2/config/avatarPermission1.png', name: 'My Team', page: [
      {namePage: 'HiHi House',permission: [1,2]},
      {namePage: `Le's Page`,permission: [1,2]},
      {namePage: 'Test Bot',permission: [1,2]},
      {namePage: 'Wiki Bot' ,permission: [1,2]},
    ]},
    {urlImg: '../../../assets/imagesv2/config/avatarPermission1.png', name: 'Tester', page: [
      {namePage: 'Ralph Edwards',permission: [2,3]},
      {namePage: 'Brooklyn Simmons',permission: [3,4]},
      {namePage: 'Savannah Nguyen'  ,permission: [1,2]},
    ]},
    {urlImg: '../../../assets/imagesv2/config/avatarPermission1.png', name: 'John Designer', page: [
      {namePage: 'Kristin Watson',permission: [5,6]},
      {namePage: 'Cody Fisher',permission: [5,6]},
    ]},
    {urlImg: '../../../assets/imagesv2/config/avatarPermission1.png', name: 'Hòa An Ngô', page: [
      {namePage: 'Floyd Miles',permission: [5,6]},
    ]}
  ]

  data: CRMTeamDTO[] | undefined;
  lstUsers: ApplicationUserDTO[] = [];
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private configDataService: ConfigDataFacade
  ) { }

  ngOnInit(): void {
    this.loadListTeam();
    this.loadUser();
  }

  loadListTeam() {
    this.crmTeamService.onChangeListFaceBook().subscribe(res => {
      this.data = res?.Items;
    });
  }

  loadUser() {
    this.isLoading = true;
    this.configDataService.onLoading$.emit(this.isLoading);
    this.applicationUserService.get()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstUsers = res.value;
        this.configDataService.onLoading$.emit(false);
      });
  }

  backToMain(){
    let returnUrl = '/configs/users/operation'
    this.router.navigate([returnUrl]);
  }

  onSave(){
    if(!TDSHelperArray.hasListValue(this.data)) {
      this.message.info(Message.PageNotExist);
      return;
    }

    this.isLoading = true;
    let result: UpdateGrantPermissionDTO[] = [];
    this.data?.forEach(element => {
      if(TDSHelperArray.hasListValue(element?.Childs)) {
        element?.Childs.forEach(child => {
          if(TDSHelperArray.hasListValue(child?.Users)) {
            result.push({
              CRMTeamId: child.Id,
              UserId: child?.Users.map(x => x.Id).toString()
            });
          }
        })
      }
    });

    this.crmTeamService.updateGrantPermission(result)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.UpdatedSuccess);
        this.crmTeamService.onRefreshListFacebook();
      });

  }

  onModelChangePermission(e: TDSSafeAny) {
    console.log(e);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
