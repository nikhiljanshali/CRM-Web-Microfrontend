import { Logistic } from "common/entities";

export class LogisticResponse {
      logistics: Logistic[];
      totalCount: number;

      constructor() {
            this.logistics = [];
            this.totalCount = 0;
      }
}