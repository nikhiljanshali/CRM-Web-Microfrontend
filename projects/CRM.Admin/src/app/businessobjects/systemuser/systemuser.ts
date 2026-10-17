import { Address, Badge, Name, SocialMedia } from "common/businessobjects"
import { BaseEntity } from 'common/entities/common/baseentity'

export class SystemUser extends BaseEntity {
  name: Name
  fullName!: string
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

  constructor() {
    super();
    this.name = new Name();
    this.badge = new Badge();
    this.address = new Address();
    this.socialMedias = [];
    this.origin = "";
    this.nativeAddress = "";
    this.enrollmentNumber = "";
    this.isActive = false;
    this.isManager = false;
    this.isAvailable = false;

  }
}