

// extends InventorySearchCriteria
export class CartSearchCriteria {
    stoneId!: string;
    customer!: string[];
    seller!: string[];
    certificateNo!: string;
    from?: Date | null;
    to?: Date | null;

    constructor() {
        // super();
    }
}