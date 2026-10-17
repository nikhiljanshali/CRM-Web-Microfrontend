import { CustomerDNorm, SystemUser } from "..";


// extends InventorySearchCriteria
export class CartSearchCriteria {
    stoneId!: string;
    certificateNo!: string;
    minSize!: number
    maxSize!: number
    shapes!: string[]
    colors!: string[]
    clarities!: string[]
    cuts!: string[]
    polishes!: string[]
    symmetries!: string[]
    fluorescences!: string[]
    labs!: string[]
    sellerId!: string
    customerId!: string

    constructor() {}
}