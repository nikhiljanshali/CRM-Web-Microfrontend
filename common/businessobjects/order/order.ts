import { Customer } from "common/businessobjects";
import { PriceDNorm } from "common/entities"
import { IdentityDNorm } from "common/entities";
import { BaseEntity } from "common/entities/common/baseentity"
import { Broker, OrderInventoryItems } from '../../businessobjects';

export class Order extends BaseEntity {

  orderNo!: number;
  leadId!: string;
  leadNo!: number;
  invoiceNo!: string;
  orderInventoryItem!: OrderInventoryItems;
  customer: Customer;
  broker: Broker;
  orderPrice: PriceDNorm;
  sDiscount!: number | null;
  ngDiscount!: number | null;
  avgDays!: number;
  identity: IdentityDNorm;
  ecomOrderId:number = 0;
  isEcom: boolean = false;

  
  //Extra 
  orderAmount!: number | null;  
  companyName!: string;
  weight!: number;
  stoneId!: string;

  constructor() {
    super();
    this.orderNo = 1;
    this.orderPrice = new PriceDNorm();
    this.customer = new Customer();
    this.broker = new Broker();
    this.identity = new IdentityDNorm();
    this.orderInventoryItem = new OrderInventoryItems();
  }
}