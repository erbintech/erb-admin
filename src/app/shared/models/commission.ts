export class Commission {
    id: number
    bankId: number
    serviceId: number
    commissionTypeId: number
    commission: number;
    isActive: boolean
    isDelete: boolean
    createdDate: Date
    modifiedDate: Date
    createdBy: number
    modifiedBy: number
    bankName: string
    serviceName: string
    partnerIds = [];
    childCommissionType = [];
    parentId: number;
    bankLoanCommissionId: number;
    commissionTemplateId: number;
    commissionType: string;
    bankLoanId: number
    bankCommissions = [];
    constructor() { }
}