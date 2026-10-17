import { BaseEntity } from "common/entities/common/baseentity";

export class VolumeDiscount extends BaseEntity {

    discount!: number;
    fromAmount!: number;
    toAmount!: number;
    isOnline:boolean = false;

    constructor() {
        super();
    }
}