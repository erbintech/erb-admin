export class Pages {
    id: number
    path?: string;
    title?: string;
    icon?: string;
    type?: string;
    isActive?: boolean;
    isDelete?: boolean;
    active?: boolean;
    parentId?: number;
    children?: Pages[];
    readPermission: boolean = false;
    writePermission: boolean = false;
    editPermission: boolean = false;
    deletePermission: boolean = false;
    isAdminVerificationRequired:boolean = false;
    isChecked: boolean
    isSelectAll:boolean
    constructor() { }
}