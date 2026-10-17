import { Address, Badge, BranchDNorm, MarketingEmail, Name, OrganizationDNorm, SocialMedia } from "common/businessobjects"
import { BaseEntity } from 'common/entities/common/baseentity'

export class Employee extends BaseEntity {
  name: Name
  fullName!: string
  organization: OrganizationDNorm;
  branch: BranchDNorm
  departmentId!: string
  department!: string
  origin!: string
  badge: Badge
  email!: string
  mobile!: string
  address: Address
  nativeAddress!: string
  socialMedias: SocialMedia[]
  joiningDate!: Date
  enrollmentNumber!: string
  isManager!: boolean
  isActive!: boolean
  isAvailable!: boolean
  marketingEmail: MarketingEmail

  constructor() {
    super();
    this.name = new Name();
    this.organization = new OrganizationDNorm();
    this.branch = new BranchDNorm();
    this.badge = new Badge();
    this.address = new Address();
    this.socialMedias = [];
    this.marketingEmail = new MarketingEmail();
  }
}