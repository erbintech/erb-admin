export class Order {
    "id": number
    "userId": number
    "productId": number
    "quantity": number
    "unitCoin": number
    "totalCoin": number
    "transactionDate": Date
    "orderStatusId": number
    "remark": string
    "isActive": boolean
    "isDelete": boolean
    "createdDate": Date
    "modifiedDate": Date
    "createdBy": number
    "modifiedBy": number
    "fullName": string
    "contactNo": number
    "orderAddressId": number
    "addressTypeId": number
    "label": number
    "addressLine1": string
    "addressLine2": string
    "pincode": number
    "cityId": number
    "city": string
    "district": string
    "state": string
    "orderStatus": string
    "productName": string
    "imageUrl": string
    "coin": string
    "status": string
    "statusIds" = []
    constructor() { }
}
