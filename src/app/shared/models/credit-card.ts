import { Customer } from "./customer"

export class CreditCard {
    id: number
    fullName: string
    birthdate: Date
    emailId: string
    panCardNo: string
    gender: boolean
    maritalStatus: boolean
    employmentType: string
    bankName: string
    bankAccountNumber: number
    itrLast: string
    highestEducation: string
    officeContactNumber: number
    workPlaceName: string
    communicationAddressId
    fileName: string
    otherBank: string
    permanentAddress: string
    customerWorkAddresses: any
    customerAddresses = [];
    customerId: number
    permanentAddressDetail
    correspondenceAddressDetail
    isAlreadyCreditCard: boolean
    userId: number
    statusId: number
    status: string
    rejectionReason
    customerDetail: Customer
    employmentDetail
    maxCreditLimit: number
    otherCreditCardBankId: number
    availableCreditLimit: number
    workAddressDetail
    creditCardEmploymentDetailId: number
    creditCardOffer:any
    constructor() { }
}