
import { BaseEntity } from "shared/enitites/common/baseentity";
import { SupplierDNorm } from "../supplier/dnorm/supplierdnorm";

export class SuppConfig extends BaseEntity {
      supplierDNorm: SupplierDNorm
      apiPath!: string
      imageUrl!: string
      videoUrl!: string
      certificateUrl!: string

      constructor() {
            super();
            this.supplierDNorm = new SupplierDNorm();
      }
}