export class RejectionReason {
    id: number
    customerLoanId: number
    reason: string
    reasons: [{
        reason: string,
        description: string
    }
    ]
    constructor() { }
}