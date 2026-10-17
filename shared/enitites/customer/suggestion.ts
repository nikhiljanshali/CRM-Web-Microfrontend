import { BaseEntity } from "shared/enitites";

export class Suggestion extends BaseEntity {

    company!: string;
    customerName!: string;
    email!: string;
    description!: string;

    constructor() {
        super();
    }
}