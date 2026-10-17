import { InventorySearchCriteria } from '..';
import { UserPricingCriteria } from '../../entities';

export class PriceRequestApiModel {
    slots: UserPricingCriteria[];
    invFilter: InventorySearchCriteria;
    type!: string;
    systemUserId!: string;
    skip!: number | null;
    take!: number | null;

    constructor(){
        this.slots = [];
        this.invFilter = new InventorySearchCriteria();
    }
}