export class OrderSearchCriteria {
    stoneId: string;
    partyId: string;
    brokerId: string;
    sellerId: string;

    constructor() { 
        this.stoneId = '';
        this.partyId = '';
        this.brokerId = '';
        this.sellerId = '';
    }
}