export class IndustryType {
    id: number;
    name: string
    parentId: number;
    isActive: boolean;
    isDelete: boolean;
    createdBy: number;
    createdDate: Date;
    modifiedBy: number;
    modifiedDate: Date;
    childIndustryType = [];
    parentName: string
    isParent: boolean
    constructor() { }
}