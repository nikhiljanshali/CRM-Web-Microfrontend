import { StatusValue } from "common/services"

export class CustomerVerificationSearchCriteria {
    companyName: string
    email: string
    mobileNo: string
    country: string
    sellerId?: string

    constructor() {
        this.companyName = "";
        this.email = "";
        this.mobileNo = "";
        this.country = "";
    }
}