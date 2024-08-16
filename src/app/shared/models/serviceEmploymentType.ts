export class ServiceEmploymentType {
    id: number
    serviceId: number
    employmentTypeId: any
    serviceName: string
    employmentType: string;
    isActive: boolean;
    isDelete: boolean;
    createdBy: number;
    createdDate: Date;
    modifiedBy: number;
    modifiedDate: Date;

    constructor() { }
}