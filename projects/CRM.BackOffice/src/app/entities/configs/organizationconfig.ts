import { BaseEntity } from "shared/enitites/common/baseentity"
import { OrganizationDNorm } from "../../businessobjects"

export class OrgConfig extends BaseEntity {
      organizationDNorm: OrganizationDNorm
      apiPath!: string
      imageUrl!: string
      videoUrl!: string
      certificateUrl!: string

      constructor() {
            super();
            this.organizationDNorm = new OrganizationDNorm();
      }
}