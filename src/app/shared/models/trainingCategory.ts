export class TrainingCategory {
    id: number;
    name: string
    parentId: number;
    isActive: boolean;
    isDelete: boolean;
    createdBy: number;
    createdDate: Date;
    modifiedBy: number;
    modifiedDate: Date;
    childTrainingCategory =[];
    constructor() { }
}