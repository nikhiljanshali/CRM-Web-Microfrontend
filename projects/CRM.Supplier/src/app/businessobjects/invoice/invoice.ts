import { Broker, OrganizationDNorm, Party } from "common/businessobjects";
import { IdentityDNorm, Logistic, PriceDNorm } from "common/entities";
import { BaseEntity } from "common/entities/common/baseentity"
import { Bank } from "../bank/bank";
import { InvoiceDetail } from "./invoicedetail";

export class Invoice extends BaseEntity {

  invoiceNo!: string;
  invoiceType!: string;
  terms!: string;
  expense!: string;
  currencyType!: string;
  currencyRate!: number;
  convCurrencyType!: string;
  convCurrencyRate!: number;
  dueDate!: Date | null;
  soldLocation !: string;
  shippingCharge!: number;

  party: Party;
  broker: Broker;
  isCOD!: boolean;
  bank: Bank;
  logistic: Logistic;  
  cif !: string;

  invoicePrice: PriceDNorm;
  sDiscount!: number | null;
  ngDiscount!: number | null;
  totalStone!: number;
  totalWeight!: number;

  taxNameOne!: string;
  taxPerOne!: number | null;    
  taxNameTwo!: string;
  taxPerTwo!: number | null;  

  organization: OrganizationDNorm
  invoiceItems: InvoiceDetail[];
  identity: IdentityDNorm;

  constructor() {
    super();
    this.party = new Party();
    this.broker = new Broker();
    this.bank = new Bank();
    this.logistic = new Logistic();
    this.identity = new IdentityDNorm();
    this.invoiceItems = [];
    this.invoicePrice = new PriceDNorm();
    this.organization = new OrganizationDNorm();
  }
}