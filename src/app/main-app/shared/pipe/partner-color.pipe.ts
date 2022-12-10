import { Pipe, PipeTransform } from "@angular/core";
import { TagDTO } from "../../dto/tag/tag.dto";

@Pipe({
  name: 'partnercolor'
})

export class PartnerColorPipe implements PipeTransform {

    transform(text: string, partnerStatusReport: any[]): any {
      let exits = partnerStatusReport?.filter(x => x && x.StatusText && x.StatusText.toLowerCase() == text.toLowerCase())[0] as any;
      if (exits) {
        return exits.StatusStyle;
      }
      return '#2C80F8'
    }

}
