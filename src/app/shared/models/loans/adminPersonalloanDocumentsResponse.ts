export class AdminPersonalLoanDocumentResponse {
    loanDocumentId!: number;
    documentId!: number;
    documentUrl!: string;
    documentName!: string;
    isPdf!: boolean;
    serviceTypeDocumentId!: number
    documentStatus!: string
    customerLoanId!: number
    documentData!:string
    constructor() { }
}