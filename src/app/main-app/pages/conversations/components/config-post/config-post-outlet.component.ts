import { Component, Input } from "@angular/core";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";

@Component({
  selector: 'config-post-outlet',
  templateUrl: './config-post-outlet.component.html'
})

export class ConfigPostOutletComponent  {

  selectedIndex: number = 0;

  @Input() data!: FacebookPostItem;
}
