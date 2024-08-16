export class ServiceDocument {
    id: number = 0
    serviceId: number | undefined
    documentId: number | undefined
    displayName: string | undefined
    documentCount: number | undefined
    isRequired: boolean | undefined
    isPdf: boolean | undefined
    isActive: boolean | undefined;
    isDelete: boolean | undefined;
    createdBy: number | undefined;
    createdDate: Date | undefined;
    modifiedBy: number | undefined;
    modifiedDate: Date | undefined;
    employmentTypeId: number | undefined
    isRequiredForTransfer: boolean | undefined
    isRequiredForNew: boolean | undefined
    constructor() { }
}