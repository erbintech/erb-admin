export class AdminPersonalLoanReferenceResponse {
    loanReferenceId: number;
    fullName: string;
    contactNo: string;
    label: string;
    addressLine1: string;
    addressLine2: string;
    pincode: string;
    cityId: number;
    city: string;
    district: string;
    state: string;
    

    constructor(loanReferenceId:number, fullName:string, contactNo:string, label:string, addressLine1:string, addressLine2:string, pincode:string, cityId:number, city:string, district:string, state:string) {
        this.loanReferenceId = loanReferenceId;
        this.fullName = fullName;
        this.contactNo = contactNo;
        this.label = label;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.pincode = pincode;
        this.cityId = cityId;
        this.city = city;
        this.district = district;
        this.state = state;
    }
}