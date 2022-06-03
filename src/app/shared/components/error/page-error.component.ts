import { Component, OnInit } from '@angular/core';
import { PageLoadingService } from '../../services/page-loading.service';

@Component({
  selector: 'app-page-error',
  templateUrl: './page-error.component.html',
})

export class PageErrorComponent implements OnInit {


  constructor(private loader: PageLoadingService) { }

  ngOnInit(): void {

  }

}
