import { Address, Name, SocialMedia } from "common/businessobjects"
import { StatusValue } from "common/services"
import { BaseEntity } from "../common/baseentity"

export class RegisterCustomer extends BaseEntity {
    // PersonalInfo
    name: Name
    fullName: string
    birthDate!: Date
    email: string
    countryCode: string
    primaryMobile!: string
    secondaryMobile!: string
    phoneNo: string
    // BusinessInfo
    companyName: string
    designation: string
    businessType: string
    businessEmail: string
    businessMobileNo!: string
    businessPhoneNo!: string
    address: Address
    faxNo: string
    referenceName: string
    // Documents
    // profileImage: string
    // photoIdentity: string
    // businessIdentity: string
    // SocailMedias List
    socialMedias: SocialMedia[]
    status: string;

    constructor() {
        super();
        this.name = new Name();
        this.fullName = "";
        this.email = "";
        this.countryCode = "";
        this.phoneNo = "";
        this.companyName = "";
        this.designation = "";
        this.businessType = "";
        this.businessEmail = "";
        this.businessMobileNo = "";
        this.address = new Address();
        this.faxNo = "";
        this.referenceName = "";
        // this.profileImage = "";
        // this.photoIdentity = "";
        // this.businessIdentity = "";
        this.socialMedias = []
        this.status = StatusValue.InProgress.toString();
    }
}