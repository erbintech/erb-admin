export class LoanDetail {
    id: number
    customerLoanId: number
    refrenceNo: string
    email: string
    amountDisbursed: number
    ROI: number
    bankId: number
    emi: number
    termsCondition: string = null
    tenure: number
    totalInterestPayable: number
    isActive: boolean;
    isDelete: boolean;
    createdDate: Date;
    modifiedDate: Date;
    createdBy: number;
    modifiedBy: number;
    bankName: string;
    isAccept:boolean
    status:string;
    totalPayment:string
    totalInterest:string
    displayemi:string
    serviceId:number
    isShared:boolean
    constructor() {

    }
}