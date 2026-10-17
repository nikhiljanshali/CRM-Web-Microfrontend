import { BaseEntity } from "shared/enitites";
import { InclusionCriteria } from "./inclusioncriteria";
import { MeasurementCriteria } from "./measurementcriteria";

export class SpecialStoneCriteria extends BaseEntity {
    shape: string[];
    lab: string[];
    minWeight!: number;
    maxWeight!: number;
    color: string[];
    clarity: string[];
    cut: string[];
    polish: string[];
    symmetry: string[];
    fluorescence: string[];
    inclusion: InclusionCriteria;
    measurement: MeasurementCriteria;
    isHighlight: boolean;
    discount!: number | null;
    fromLimit!: number | null;
    toLimit!: number | null;

    constructor() {
        super();
        this.shape = [];
        this.lab = [];
        this.color = [];
        this.clarity = [];
        this.cut = [];
        this.polish = [];
        this.symmetry = [];
        this.fluorescence = [];
        this.isHighlight = false;
        this.inclusion = new InclusionCriteria();
        this.measurement = new MeasurementCriteria();
     }
}