import { Component, OnInit } from '@angular/core';
import { PageLoadingService } from '../../services/page-loading.service';

@Component({
  selector: 'app-page-loading',
  templateUrl: './page-loading.component.html',
  styleUrls: ['./page-loading.component.scss']
})
export class PageLoadingComponent implements OnInit {
  isLoading: boolean = false;
  constructor(private loader: PageLoadingService) { }

  ngOnInit(): void {
    this.loader.loading.subscribe((res: boolean) => {
      this.isLoading = res;
    })
  }

}
