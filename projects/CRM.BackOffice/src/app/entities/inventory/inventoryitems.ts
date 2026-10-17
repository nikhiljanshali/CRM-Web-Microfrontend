import { InventoryItemInclusion } from "./inventoryiteminclusion"
import { InventoryItemMeasurement } from "./inventoryitemmeasurement"
import { PriceDNorm } from "./priceDNorm"
import { StoneOrgDNorm } from "./stoneOrgDNorm"
import { IdentityDNorm } from "./identityDNorm"
import { BaseEntity } from "shared/enitites/common/baseentity"
import { Media } from "./media"

export class InventoryItems extends BaseEntity {
    stoneId!: string
    kapan!: string
    article!: string
    rfid!: string
    grade!: string
    shape!: string
    weight!: number
    color!: string
    clarity!: string
    cut!: string
    polish!: string
    symmetry!: string
    fluorescence!: string
    strLn!: string
    lrHalf!: string
    location!: string
    status!: string //Stock,Grading,Lab,Pricing,Transit,Sold,InSale,Mfg,Memo
    isCPBlocked!: boolean //Other Platform Block
    blockedClients!: string[] //Specific Customer Block (Block By Customer or Block For Customer By Admin)
    lab!: string
    certificateNo!: string
    inscription!: string
    certificateUrl!: string
    imageUrl!: string
    videoUrl!: string
    comments!: string
    reasonToRemove!: string
    heldBy!: string
    isHold: boolean
    isRapnetHold: boolean
    isPricingRequest: boolean
    isMemo: boolean
    isLabReturn: boolean
    hasTask: boolean = false;
    inclusion: InventoryItemInclusion
    measurement: InventoryItemMeasurement
    labSendDate!: Date | null
    labReceiveDate!: Date | null
    marketSheetDate!: Date | null
    holdDate!: Date | null
    basePrice: PriceDNorm
    price: PriceDNorm
    stoneOrg: StoneOrgDNorm
    identity: IdentityDNorm
    availableDays!: number
    holdDays!: number
    media: Media
    boxSerialNo!: string

    constructor() {
        super();
        this.inclusion = new InventoryItemInclusion();
        this.measurement = new InventoryItemMeasurement();
        this.basePrice = new PriceDNorm();
        this.price = new PriceDNorm();
        this.stoneOrg = new StoneOrgDNorm();
        this.identity = new IdentityDNorm();
        this.blockedClients = [];
        this.isHold = false;
        this.isRapnetHold = false;
        this.isPricingRequest = false;
        this.isMemo = false;
        this.isCPBlocked = false;
        this.isLabReturn = true;
        this.media = new Media();
    }
}