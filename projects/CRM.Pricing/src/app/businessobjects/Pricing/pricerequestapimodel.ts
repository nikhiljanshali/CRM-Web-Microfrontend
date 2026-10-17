import { EmployeeCriteria } from 'common/businessobjects';
import { InventorySearchCriteria } from 'common/entities';

export class PriceRequestApiModel {
    slots: EmployeeCriteria[];
    invFilter: InventorySearchCriteria;
    type!: string;
    employeeId!: string;
    skip!: number | null;
    take!: number | null;

    constructor(){
        this.slots = [];
        this.invFilter = new InventorySearchCriteria();
    }
}