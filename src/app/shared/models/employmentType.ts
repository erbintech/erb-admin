export class EmploymentType {
    id: number;
    name: string
    parentId: number;
    isActive: boolean;
    isDelete: boolean;
    createdBy: number;
    createdDate: Date;
    modifiedBy: number;
    modifiedDate: Date;
    childEmploymentType = [];
    isSelected: boolean = false;
    parentName: string;
    isParent: boolean = false;
    employmentType: string
    constructor() { }
}