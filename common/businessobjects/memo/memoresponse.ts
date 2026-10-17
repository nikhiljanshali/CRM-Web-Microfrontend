import { Memo } from "common/entities";

export class MemoResponse {

    memos: Memo[] = [];
    totalCount!: number;
    constructor() {
    }
}