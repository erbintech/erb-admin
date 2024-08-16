import { LoanDetail } from "../loanDetail";
import { Offer } from "../offer";
import { RejectionReason } from "../rejectionReason";
import { AdminCustomerResponse } from "./adminCustomerResponse";
import { AdminGroupDetail } from "./AdminGroupDetail";
import { AdminHomeLoanEmploymentDetail } from "./adminHomeLoanEmploymentDetail";
import { adminHomeLoanPermanentAddressDetail } from "./adminHomeLoanPermanentAddressDetail";
import { AdminLoanCompleteHistoryResponse } from "./adminLoanCompleteHistoryResponse";
import { AdminLoanStatusResponse } from "./adminLoanStatusResponse";
import { AdminPersonalLoanDocumentResponse } from "./adminPersonalloanDocumentsResponse";
import { AdminPersonalLoanMoreEmploymentDetailResponse } from "./adminPersonalloanMoreEmploymentDetailResponse";

export class AdminHomeLoanResponse {
    basicDetail: AdminCustomerResponse = new AdminCustomerResponse() ;
    loanCompleteHistory: AdminLoanCompleteHistoryResponse = new AdminLoanCompleteHistoryResponse();
    loanDocuments: Array<AdminPersonalLoanDocumentResponse> = new Array<AdminPersonalLoanDocumentResponse>();
    loanStatuses: AdminLoanStatusResponse = new AdminLoanStatusResponse();
    loanOffer: Offer[] = new Array<Offer>()
    disbursedData: LoanDetail[] = new Array<LoanDetail>();
    reason: RejectionReason = new RejectionReason();
    propertyDetail: any;
    permanentAddressDetail: adminHomeLoanPermanentAddressDetail = new adminHomeLoanPermanentAddressDetail();
    correspondenceAddressDetail: any;
    employmentDetail: AdminHomeLoanEmploymentDetail = new AdminHomeLoanEmploymentDetail();
    residenceDetail: any;
    groupDetail: AdminGroupDetail = new AdminGroupDetail();
    bankOffers = [];
    sanctionedApplication = [];
    disbursedApplication = [];
    offers = [];
    transferPropertyDetail:any;
    loanReferences:any
    constructor() {
    }
}