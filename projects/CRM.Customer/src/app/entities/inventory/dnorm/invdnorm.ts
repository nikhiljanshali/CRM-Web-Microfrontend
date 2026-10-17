import { PriceDNorm } from "../..";
import { InventoryItemMeasurement } from "../inventoryitemmeasurement";

export class InvDNorm {

    invId: string;
    stoneId: string;
    kapan: string;
    rfid: string;
    shape: string;
    weight: number;
    color: string;
    clarity: string;
    cut: string;
    polish: string;
    symmetry: string;
    fluorescence: string;
    measurement:InventoryItemMeasurement
    location: string;
    lab: string;
    certificateNo: string;
    price: PriceDNorm;
    sDiscount: number;
    fDiscount: number;
    fAmount: number;
    certificateUrl:string;
    imageUrl:string;
    videoUrl:string;
    isDelivered: boolean;

    constructor() {
        this.price = new PriceDNorm();
        this.isDelivered = false;
        this.invId = "";
        this.stoneId = "";
        this.kapan = ""
        this.rfid = ""
        this.shape = ""
        this.weight = 0
        this.color = ""
        this.clarity = ""
        this.cut = ""
        this.polish = ""
        this.symmetry = ""
        this.fluorescence = ""
        this.measurement = new InventoryItemMeasurement();
        this.location = ""
        this.lab = ""
        this.certificateNo = ""
        this.sDiscount = 0
        this.fDiscount = 0
        this.fAmount = 0
        this.certificateUrl = ""
        this.imageUrl = ""
        this.videoUrl = ""
        this.isDelivered = false
    }
}