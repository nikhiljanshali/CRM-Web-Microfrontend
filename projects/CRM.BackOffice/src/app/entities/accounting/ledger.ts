import { Address, CreditLimit } from "shared/businessobjects"
import { BaseEntity } from "shared/enitites/common/baseentity"
import { BankDNorm, BrokerDNorm, LedgerGroup } from "../../entities"

export class Ledger extends BaseEntity {
  name!: string
  group: LedgerGroup = new LedgerGroup()
  code!: string
  contactPerson!: string
  partyType!: string
  address: Address = new Address()
  email!: string
  mobileNo!: string
  phoneNo!: string
  faxNo!: string
  incomeTaxNo!: string
  taxNo!: string
  lineOfBusiness!: string
  bank!: BankDNorm
  broker: BrokerDNorm
  isActive!: boolean
  ident!: string
  limit!: CreditLimit
  credit!: number
  debit!: number

  constructor() {
    super();
    this.address = new Address();
    this.group = new LedgerGroup();
    this.broker = new BrokerDNorm();
    this.bank = new BankDNorm();
    this.limit = new CreditLimit();
  }
}