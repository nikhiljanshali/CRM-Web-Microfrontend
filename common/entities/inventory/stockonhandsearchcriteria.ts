export class Stockonhandsearchcriteria {
    stoneId!: string
    kapan: string[]
    minSize!: number
    maxSize!: number
    shape: string[]
    color: string[]
    clarity: string[]
    cut: string[]
    polish: string[]
    symmetry: string[]
    fluorescence: string[]
    from!: Date
    to!: Date
    isHold!: boolean
    isRapnetHold!: boolean
    employeeId!: string
    status: string[];
    location: string[];

    isCertificate!: boolean
    isLabReturn!: boolean

    constructor() {
        this.kapan = [];
        this.shape = [];
        this.color = [];
        this.clarity = [];
        this.cut = [];
        this.polish = [];
        this.symmetry = [];
        this.fluorescence = [];
        this.status = [];
        this.location = [];
    }

}