import { IdentityDNorm, InventoryItemInclusion, InventoryItemMeasurement, PriceDNorm, StoneOrgDNorm } from '../';
import { BaseEntity } from "shared/enitites";

export class TempPricing extends BaseEntity {
    stoneId!: string;
    kapan!: string;
    article!: string;
    grade!: string;
    shape!: string;
    weight!: number;
    color!: string;
    clarity!: string;
    cut!: string;
    polish!: string;
    symmetry!: string;
    fluorescence!: string;
    lab!: string;
    location!: string;
    comments!: string;
    certificateUrl!: string
    imageUrl!: string
    videoUrl!: string
    basePrice: PriceDNorm;
    price: PriceDNorm;
    tempBasePrice: PriceDNorm;
    tempPrice: PriceDNorm;
    inclusion: InventoryItemInclusion;
    measurement: InventoryItemMeasurement;
    stoneOrg: StoneOrgDNorm;
    identity: IdentityDNorm;
    discountOne!: number;
    discountTwo!: number;
    discountThree!: number;
    isValid!: boolean;
    marketSheetDate!: Date | null

    isHold!: boolean;
    isRapnetHold!: boolean;
    discColorMark!: string;
    
    holdDate!: Date | null
    holdDays!: number

    //Extra
    isHighLight!: boolean
    days!: number | null

    constructor() {
        super();
        this.inclusion = new InventoryItemInclusion();
        this.measurement = new InventoryItemMeasurement();
        this.basePrice = new PriceDNorm();
        this.price = new PriceDNorm();
        this.tempBasePrice = new PriceDNorm();
        this.tempPrice = new PriceDNorm();
        this.stoneOrg = new StoneOrgDNorm();
        this.identity = new IdentityDNorm();
    }
}