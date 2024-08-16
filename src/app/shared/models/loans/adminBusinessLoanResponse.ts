import { LoanDetail } from "../loanDetail";
import { Offer } from "../offer";
import { RejectionReason } from "../rejectionReason";
import { BusinessLoanBusinessDetail } from "./adminBusinessLoanBusinessDetail";
import { AdminCustomerResponse } from "./adminCustomerResponse";
import { AdminGroupDetail } from "./AdminGroupDetail";
import { AdminLoanCompleteHistoryResponse } from "./adminLoanCompleteHistoryResponse";
import { AdminLoanStatusResponse } from "./adminLoanStatusResponse";
import { AdminPersonalLoanDocumentResponse } from "./adminPersonalloanDocumentsResponse";

export class AdminBusinessLoanResponse {
    basicDetail: AdminCustomerResponse = new AdminCustomerResponse();
    loanCompleteHistory: AdminLoanCompleteHistoryResponse = new AdminLoanCompleteHistoryResponse();
    loanDocuments: Array<AdminPersonalLoanDocumentResponse> = new Array<AdminPersonalLoanDocumentResponse>();
    loanStatuses: AdminLoanStatusResponse = new AdminLoanStatusResponse();
    offers: Offer[] = new Array<Offer>();
    disbursedData: LoanDetail[] = new Array<LoanDetail>()
    reason: RejectionReason[] = new Array<RejectionReason>();
    businessDetail: BusinessLoanBusinessDetail = new BusinessLoanBusinessDetail();
    moreBasicDetail: any;
    groupDetail: AdminGroupDetail = new AdminGroupDetail();
    bankOffers= [];
    sanctionedApplication = [];
    disbursedApplication = [];
    loanReferences:any[]
    constructor() { }
}