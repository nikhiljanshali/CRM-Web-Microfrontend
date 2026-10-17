import { Address, Badge, BranchDNorm, CreditLimit, Name, OrganizationDNorm, SellerDNorm, SocialMedia } from "common/businessobjects"
import { BaseEntity } from "common/entities/common/baseentity"
import { OriginValue } from "common/services"

export class Customer extends BaseEntity {
      // PersonalInfo
      name: Name
      fullName: string
      origin: string
      birthDate!: Date
      badge: Badge
      email: string
      countryCode: string
      mobile1!: string
      mobile2!: string
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
      socialMedias: SocialMedia[]
      incomeTaxNo: string
      creditLimit: CreditLimit
      organization: OrganizationDNorm
      branch: BranchDNorm
      seller: SellerDNorm
      discount: number

      constructor() {
            super();
            this.name = new Name();
            this.fullName = "";
            this.email = "";
            this.origin = OriginValue.Customer.toString();
            this.badge = new Badge();
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
            this.socialMedias = [];
            this.incomeTaxNo = "";
            this.creditLimit = new CreditLimit();
            this.organization = new OrganizationDNorm();
            this.branch = new BranchDNorm();
            this.seller = new SellerDNorm();
            this.discount = 0
      }
}