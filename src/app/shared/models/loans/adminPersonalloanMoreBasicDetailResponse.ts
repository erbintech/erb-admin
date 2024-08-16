export class AdminPersonalLoanMoreBasicDetailResponse {
    alternativeContactNo!: string;
    gender!: string;
    maritalStatusId!: number;
    spouseName!: string;
    spouseContactNo!: string;
    motherName!: string;
    fatherContactNo!: string;
    fatherName!: string
    customerLoanSpouseId!: number;
    loanAmountTakenExisting!: number
    approxDate!: Date
    approxCurrentEMI!: number
    bankId!: number
    topupAmount!: number
    loanType!: string
    maritalStatus:string
    bank:any
    constructor() { }
}