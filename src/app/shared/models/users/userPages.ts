export class UserPages {
    id: number
    userId: number
    pageId: number
    name:string
    readPermission: boolean
    writePermission: boolean
    editPermission: boolean
    deletePermission: boolean
    isActive: boolean
    isDelete: boolean
    isSelectAll:boolean
    isAdminVerificationRequired:boolean = false;
    constructor() { }

}