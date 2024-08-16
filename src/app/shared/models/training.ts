export class Training {
    id: number
    assignRoleId: any;
    trainingCategoryId: number
    title: string
    url: string
    isActive: boolean;
    isDelete: boolean;
    createdBy: number;
    createdDate: Date;
    modifiedBy: number;
    modifiedDate: Date;
    roleName: string
    categoryName: string
    documentType: string;
    awsDocumentType:string;
    fileName: string;
    assignUsers = [];
    trainingSubCategoryId: number;
    subCategoryName: string;
    roleIds:any;
    assignRole:any;
    trainingStatus:string;
    completionTime:number
    completionTimeString:string;
    constructor() { }
}