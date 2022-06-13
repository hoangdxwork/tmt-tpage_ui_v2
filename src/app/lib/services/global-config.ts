import { BehaviorSubject } from 'rxjs';
import { TDSSafeAny } from 'tds-ui/shared/utility';

export class TGlobalConfig {

    static Authen:{
        // isLogin: boolean;
        // token:TTokenDTO | null;
        refreshTokenInProgress:boolean;
        refreshTokenSubject: BehaviorSubject<TDSSafeAny>;
    }
    static cache: {
        timerPermission: number;
        timerApi: number;
        companyid?: string;
        dataPermission?: string;
    }
}
