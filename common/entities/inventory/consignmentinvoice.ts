import { LogisticDNorm, OrganizationDNorm } from "common/businessobjects"
import { BaseEntity } from "common/entities/common/baseentity"
import { ConsignmentInvoiceItem, IdentityDNorm } from ".."

export class ConsignmentInvoice extends BaseEntity {
      organization: OrganizationDNorm
      logistic: LogisticDNorm
      isRecheck?: boolean
      recheckReason!: string
      consignmentInvoiceItems: ConsignmentInvoiceItem[]
      identity: IdentityDNorm

      constructor() {
            super();
            this.organization = new OrganizationDNorm();
            this.logistic = new LogisticDNorm();
            this.consignmentInvoiceItems = [];
            this.identity = new IdentityDNorm();
      }
}