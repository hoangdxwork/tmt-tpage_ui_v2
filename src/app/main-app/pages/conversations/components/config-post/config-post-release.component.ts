import { Component, Input } from "@angular/core";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";

@Component({
  selector: 'config-post-release',
  templateUrl: './config-post-release.component.html'
})

export class ConfigPostReleaseComponent  {

  @Input() data!: FacebookPostItem;
}
