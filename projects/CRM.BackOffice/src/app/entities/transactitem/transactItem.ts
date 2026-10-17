import { BaseEntity } from "shared/enitites";
import { TaxType, TransactItemGroup } from "../../entities";

export class TransactItem extends BaseEntity {
  name!: string
  description!: string
  unit!: string
  ident!: string
  taxCode!: string
  group!: TransactItemGroup
  tax!: TaxType

  constructor() {
    super();
  }
}
