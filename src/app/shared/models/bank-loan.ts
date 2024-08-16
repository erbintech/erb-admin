export class BankLoan {
    id: number;
    bankId : number;
    serviceId : number;
    loanName : string;
    isActive: boolean;
    isDelete: boolean;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: number;
    modifiedBy: number;
    bankName: string;
    serviceName: string;
    constructor() {}
}