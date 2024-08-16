import { LoanDetail } from "../loanDetail";
import { Offer } from "../offer";
import { RejectionReason } from "../rejectionReason";
import { AdminCustomerResponse } from "./adminCustomerResponse";
import { AdminGroupDetail } from "./AdminGroupDetail";
import { AdminLoanCompleteHistoryResponse } from "./adminLoanCompleteHistoryResponse";
import { AdminLoanStatusResponse } from "./adminLoanStatusResponse";
import { AdminPersonalLoanDocumentResponse } from "./adminPersonalloanDocumentsResponse";
import { AdminPersonalLoanMoreBasicDetailResponse } from "./adminPersonalloanMoreBasicDetailResponse";
import { AdminPersonalLoanMoreEmploymentDetailResponse } from "./adminPersonalloanMoreEmploymentDetailResponse";
import { AdminPersonalLoanReferenceResponse } from "./adminPersonalloanReferenceResponse";

export class AdminPersonalLoanResponse {
    basicDetail: AdminCustomerResponse = new AdminCustomerResponse();
    moreBasicDetail: AdminPersonalLoanMoreBasicDetailResponse = new AdminPersonalLoanMoreBasicDetailResponse();
    moreEmploymentDetail: AdminPersonalLoanMoreEmploymentDetailResponse = new AdminPersonalLoanMoreEmploymentDetailResponse();
    loanCompleteHistory: AdminLoanCompleteHistoryResponse = new AdminLoanCompleteHistoryResponse();
    loanDocuments: Array<AdminPersonalLoanDocumentResponse> = new Array<AdminPersonalLoanDocumentResponse>();
    loanReferences: Array<AdminPersonalLoanReferenceResponse> = new Array<AdminPersonalLoanReferenceResponse>();
    loanStatuses: AdminLoanStatusResponse = new AdminLoanStatusResponse();
    offers: Offer[] = new Array<Offer>();
    // offers = []
    disbursedData: LoanDetail[] = new Array<LoanDetail>();
    reason: RejectionReason = new RejectionReason();
    groupDetail: AdminGroupDetail = new AdminGroupDetail();
    bankOffers = [];
    sanctionedApplication = [];
    disbursedApplication = [];
    // customerloanoffersId = []
    constructor() {
    }
}