import { BehaviorSubject } from 'rxjs';
import { TDSSafeAny } from 'tmt-tang-ui';
import { TTokenDTO } from '../dto';

export class TGlobalConfig {
       
    static Authen:{
        isLogin: boolean;
        token:TTokenDTO | null;
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