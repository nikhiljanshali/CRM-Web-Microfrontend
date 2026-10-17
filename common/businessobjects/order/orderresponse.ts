import { Order } from "..";

export class OrderResponse {
      orders: Order[];
      totalCount: number;

      constructor() {
            this.orders = [];
            this.totalCount = 0;
      }
}