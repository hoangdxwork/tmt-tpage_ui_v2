import { Pipe, PipeTransform } from "@angular/core";
import { TDSHelperString } from "tds-ui/shared/utility";

@Pipe({
  name: 'getAvatarCarrier'
})
export class GetAvatarCarrier implements PipeTransform {

  transform(type: string): string {
    switch (type) {
      case 'ViettelPost':
        return 'https://statics.tpos.vn/images/beta/220331/103358_partner_43950.png';
      case 'GHN':
        return 'https://statics.tpos.vn/images/beta/220331/104217_partner_43950.png';
      case 'JNT':
        return 'https://statics.tpos.vn/images/beta/220331/105403_partner_43950.png';
      case 'MyVNPost':
        return 'https://statics.tpos.vn/images/beta/220331/111121_partner_43950.jpg';
      case 'NinjaVan':
        return 'https://statics.tpos.vn/images/beta/220331/111840_partner_43950.png';
      case 'BEST':
        return 'https://statics.tpos.vn/images/beta/220331/111643_partner_43950.png';
      case 'SuperShip':
        return 'https://mdl.supership.net/images/SuperShip-Logo.png';
      case 'TinToc':
        return 'https://statics.tpos.vn/images/beta/220331/102642_partner_43950.png';
      case 'EMS':
        return 'https://statics.tpos.vn/images/beta/220331/110527_partner_43950.png';
      case 'ZTO':
        return 'https://statics.tpos.vn/images/beta/220331/111756_partner_43950.png';
      case 'NhatTin':
        return 'https://statics.tpos.vn/images/beta/220331/112159_partner_43950.jpg';
      case 'AhaMove':
        return 'https://statics.tpos.vn/images/beta/220331/112444_partner_43950.png';
      case 'Snappy':
        return 'https://statics.tpos.vn/images/beta/220331/112803_partner_43950.png';
      case 'FlashShip':
        return 'https://statics.tpos.vn/images/beta/220525/091229_product_30165.png';
      case 'HolaShip':
        return 'https://statics.tpos.vn/images/beta/220331/112948_partner_43950.png';
      case 'FastShip':
        return 'https://statics.tpos.vn/images/beta/220609/163831_product_30193.jpg';
      case 'GHSV':
        return 'https://statics.tpos.vn/images/tmt30/220713/115936_product_113696.png';
      case 'SHIP60':
        return 'https://statics.tpos.vn/images/beta/220615/145216_product_30240.jpg';
      case 'Shopee':
        return 'https://statics.tpos.vn/images/beta/220627/134433_product_30260.png';
      case 'OneShip':
        return 'https://statics.tpos.vn/images/beta/220921/162819_product_40537.jpg';
    }
    return '';
  }
}


@Pipe({
  name: 'avatarRandom'
})
export class AvatarRandomPipe implements PipeTransform {
    transform(value: string) {
        if(TDSHelperString.hasValueString(value)) {
            let cavan = value.slice(0, 1);
            cavan = cavan.toUpperCase();
            return cavan;
        }
        return "?";
    }
}

@Pipe({
  name: 'randomColor'
})

export class RandomColorPipe implements PipeTransform {
    transform(value: string) {
      if(!value) return;

      let color = this.colorize(value);
      return color;
    }

    colorize(str: string) {
      for (var i = 0, hash = 0; i < str.length;
        hash = str.charCodeAt(i++) + ((hash << 5) - hash));

      let color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
      return '#' + Array(6 - color.length + 1).join('0') + color;
  }
}
