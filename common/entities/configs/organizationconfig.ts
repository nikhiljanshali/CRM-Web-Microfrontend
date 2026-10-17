import { OrganizationDNorm } from "common/businessobjects";
import { BaseEntity } from "../common/baseentity";

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