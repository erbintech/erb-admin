import { PermissionGroupPages } from "./permissionGroupPages"

export class PermissionGroup {
    id: number
    name: string
    isActive: boolean
    isDelete: boolean
    createdDate: Date
    modifiedDate: Date
    createdBy: number
    modifiedBy: number
    pages: PermissionGroupPages[]
    
    constructor() {
        this.pages = new Array<PermissionGroupPages>();
    }
}