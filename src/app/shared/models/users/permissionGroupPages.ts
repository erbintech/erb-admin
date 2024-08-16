export class PermissionGroupPages {
    id: number
    displayName: string
    permissionGroupId: number
    pageId: number
    readPermission: boolean
    writePermission: boolean
    editPermission: boolean
    deletePermission: boolean
    isAdminVerificationRequired: boolean
    isActive: boolean
    isDelete: boolean
    createdDate: Date
    modifiedDate: Date
    createdBy: number
    modifiedBy: number
    
    isSelectAll:boolean

    constructor() { }
}