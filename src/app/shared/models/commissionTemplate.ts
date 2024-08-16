export class commissionTemplate {
    id: number
    commissionTypeId: number
    commissionType: string
    commission: number
    isActive: boolean
    isDelete: boolean
    createdDate: Date
    modifiedDate: Date
    createdBy: number
    modifiedBy: number
    isSelected: boolean
    name: string
    bankId: number;
    serviceId: number;
    bankLoanCommissionId: number;
    templates = [];
    constructor() { }
}