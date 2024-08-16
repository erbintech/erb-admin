export class LoanStatuses {
    id: number;
    status: string;
    isDataEditable: boolean;
    isActive: boolean;
    isDelete: boolean;
    createdBy: number;
    createdDate: Date;
    modifiedBy: number;
    modifiedDate: Date;

    constructor() { }
}