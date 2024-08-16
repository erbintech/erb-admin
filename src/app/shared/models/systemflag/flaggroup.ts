import { SystemFlags } from "./systemflags"

export class FlagGroups {
    flagGroupId: number
    flagGroupName: string
    systemFlags: SystemFlags[]
    group = [];
    constructor() {
        this.systemFlags = new Array<SystemFlags>();
    }

}