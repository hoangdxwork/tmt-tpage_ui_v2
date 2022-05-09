import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from "tmt-tang-ui";
import { CRMTeamDTO } from "../dto/team/team.dto";
import { CRMTeamService } from "./crm-team.service";

// @dynamic
export class TPageHelperService {

    static findTeamById(dataTeam: Array<CRMTeamDTO>, teamId: TDSSafeAny, getFirstItem: boolean = false) {
        let team: CRMTeamDTO | null = null;
        if (!TDSHelperArray.hasListValue(dataTeam)) {
            return team;
        }
        for (let index = 0; index < dataTeam?.length; index++) {
            const item = dataTeam[index];
            for (let index = 0; index < item.Childs.length; index++) {
                const child = item.Childs[index];
                if (teamId == child.Id) {
                    team = child;
                    break;
                }
            }
            if (TDSHelperObject.hasValue(team)) {
                break
            }
        }
        if (!TDSHelperObject.hasValue(team) && getFirstItem) {
            const firstItem = dataTeam.find(res => {
                return res.Childs.length > 0
            });
            team = firstItem?.Childs[0] || null;
        }
        return team;
    }


}
