import { BaseEntity } from "shared/enitites";

export class BusinessConfig extends BaseEntity {

    qcReasons: string[];
    removeStoneReasons: string[];

    constructor() {
        super();
        this.qcReasons = new Array<string>();
        this.removeStoneReasons = new Array<string>();
    }
}