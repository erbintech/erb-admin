export class SystemFlags {
    id: number
    name: string
    value: string
    defaultValue: string
    valueList: string
    description: string
    lable: string
    isActive: boolean
    isDelete: boolean
    createdAt?: Date
    updatedAt?: Date
    autoRender: boolean
    displayName: string
    flagGroupId: number
    flagGroupName: string
    valueTypeId: number
    valueTypeName: string
    group = [];
    //extendedProperty
    displayValueList: string[]
    checked: boolean
    inputType:string

    constructor() {
        this.displayValueList = new Array<string>();
    }

}