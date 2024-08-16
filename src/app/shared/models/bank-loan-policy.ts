export class BankLoanPolicy {
    id: number
    bankId: number
    serviceId: number
    bankLoanId: number
    employmentTypeId: number
    cibilScore: number
    minAge: number
    maxAge: number
    minIncome: number
    vintage: number
    minTurnOver: number
    maxTurnOver: number
    tenure: string
    ROI: number
    minLoanAmount: number
    maxLoanAmount: number
    minWorkExperience: number
    maxWorkExperience: number
    isActive: boolean;
    isDelete: boolean;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: number;
    modifiedBy: number;
    parentId: number;
    companyCategoryTypeId: number
    itrRequired: number
    policies = [];
    constructor() { }
}