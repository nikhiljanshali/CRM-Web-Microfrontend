import { RFIDClass } from "./rfidclass";

export class StockTally {
    kapan!: string;
    boxSerialNo!: string;
    count: number = 0;
    weight: number = 0;
    stockOnHandList: Array<RFIDClass>;
    stockOnHandCount: number = 0;
    stockOnHandWeight: number = 0;
    memoList: Array<RFIDClass>;
    memoCount: number = 0;
    memoWeight: number = 0;
    stockTallyList: Array<RFIDClass>;
    stockTallyCount: number = 0;
    stockTallyWeight: number = 0;
    constructor() {
        this.stockOnHandList = new Array<RFIDClass>();
        this.memoList = new Array<RFIDClass>();
        this.stockTallyList = new Array<RFIDClass>();
    }
}