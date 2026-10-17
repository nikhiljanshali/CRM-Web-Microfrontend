import { StatusValue } from "common/services"

export class CustomerVerificationSearchCriteria {
    companyName: string
    email: string
    mobileNo: string
    country: string
    status: string

    constructor() {
        this.companyName = "";
        this.email = "";
        this.mobileNo = "";
        this.country = "";
        this.status = StatusValue.InProgress.toString();
    }
}