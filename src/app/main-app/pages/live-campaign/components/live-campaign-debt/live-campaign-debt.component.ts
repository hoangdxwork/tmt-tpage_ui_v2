import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { SaleOnlineLiveCampaignDetailDTO, SaleOnline_LiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Message } from 'src/app/lib/consts/message.const';
import { FacebookMappingPostDTO } from 'src/app/main-app/dto/conversation/post/post.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TdsSwitchChange } from 'tds-ui/switch';

@Component({
  selector: 'live-campaign-debt',
  templateUrl: './live-campaign-debt.component.html'
})
export class LiveCampaignDebtComponent implements OnInit {

  @Input() liveCampaignId!: string | undefined;

  isLoading: boolean = false;
  data!: SaleOnline_LiveCampaignDTO;

  lstPost: FacebookMappingPostDTO[] = [];

  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    },
    {
      id: 4,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 5,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 6,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    },
  ];

  constructor(
    private message: TDSMessageService,
    private liveCampaignService: LiveCampaignService
  ) { }

  ngOnInit(): void {
    this.loadLiveCampaign(this.liveCampaignId);
    this.loadFacebookPost(this.liveCampaignId);
  }

  loadLiveCampaign(id: string | undefined) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data = res;
      });
  }

  loadFacebookPost(id: string | undefined) {
    this.isLoading = true;
    this.liveCampaignService.getAllFacebookPost(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstPost = res;
      });
  }

  onChangeActive(event: TdsSwitchChange, data: SaleOnlineLiveCampaignDetailDTO) {
    this.isLoading = true;
    this.liveCampaignService.updateActiveDetail(data.Id, event.checked)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        data.IsActive = event.checked;
        this.message.success(Message.UpdatedActiveSuccess);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

}
