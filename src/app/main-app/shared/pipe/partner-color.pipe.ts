import { Pipe, PipeTransform } from "@angular/core";
import { TDSSafeAny } from "tmt-tang-ui";
import { TagDTO } from "../../dto/tag/tag.dto";

@Pipe({
  name: 'partnercolor'
})
export class PartnerColorPipe implements PipeTransform {

    transform(arr: Array<TagDTO>, textStatus: string): any {
        let exits = arr.find(x => x.Name.toLowerCase() == textStatus.toLowerCase());
        if(exits) {
            return exits.Color;
        }
    }

}
