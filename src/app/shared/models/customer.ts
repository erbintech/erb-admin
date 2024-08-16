import { AdminGroupDetail } from "./loans/AdminGroupDetail"

export class Customer {
    aadhaarCardNo: string
    alternativeContactNo: string
    birthdate: Date
    contactNo: string
    createdBy: number
    createdDate: Date
    customerGroup: string
    customerId: number
    fullName: string
    gender: string
    groupId: string
    id: number
    isActive: boolean
    isDelete: boolean
    maritalStatusId: number
    modifiedBy: number
    modifiedDate: Date
    panCardNo: string
    partnerContactNo: string
    partnerName: string
    permanentCode: string
    profilePicUrl: string
    pincode: number
    roleId: number
    temporaryCode: string
    userId: number
    code: string
    customerLoanData
    addressLine1: string
    addressLine2: string
    cityId: number
    customerAddressId: number
    city: string;
    email: string
    state: string
    district: string
    label: string
    birthDate: Date
    tenureId: number
    monthlyincome: number
    addressline1: string
    addressline2: string
    employmentTypeId: number
    groupDetail : AdminGroupDetail;
    cibilScore: number
    orders:any;
    otherLoans:any;
    walletHistory:any;
    leads:any;
    customerLoans:any
    maritalStatus:string
    partnerAddressLine2:string
    constructor() { }
}