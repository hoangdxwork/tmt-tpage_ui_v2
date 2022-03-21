import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'tds-conversations',
  templateUrl: './tds-conversations.component.html',
  host: {
    class: "w-full h-full overflow-hidden flex flex-col"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TDSConversationsComponent implements OnInit {
  @Input() tdsHeader?: string | TemplateRef<void>;
  
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      
    }, 2000);
  }

}
