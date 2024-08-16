export class Bank {
    id: number;
    name: string;
    description: string;
    headquarters: string;
    bankCode: string;
    isActive: boolean;
    isDelete: boolean;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: number;
    modifiedBy: number;
    minAge: number
    maxAge: number
    companyCategoryTypes = [];
    bankLogo:string
    constructor() { }
}