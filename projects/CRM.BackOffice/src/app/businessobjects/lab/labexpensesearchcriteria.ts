export class LabexpenseSearchCriteria {   
    stoneId!: string;
    certificateNo!: string;
    invoiceNo!: string;
    jobNo!: string;
    controlNo!: string;
    service!: string;
    labName!: string;
    from?: Date | null;
    to?: Date | null;

    constructor() {       
    }
}