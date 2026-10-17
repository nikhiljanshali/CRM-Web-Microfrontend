export class WatchListSearchCriteria{
    stoneId!: string
    certificateNo!: string
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
    customerId!:string

    constructor(){
        this.shapes = new Array<string>();
        this.colors = new Array<string>();
        this.clarities = new Array<string>();
        this.cuts = new Array<string>();
        this.polishes = new Array<string>();
        this.symmetries = new Array<string>();
        this.fluorescences = new Array<string>();
        this.labs = new Array<string>();
    }
}