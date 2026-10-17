import { Injectable } from "@angular/core";
import { GridDetailConfig } from "shared/businessobjects";

@Injectable()

export class GridPropertiesService {

    constructor() { }

    public getSearchResultInventoryGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "checkbox", title: "Checkbox", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "lab", title: "Lab", width: 45, sortOrder: i++, isSelected: true },
            { propertyName: "status", title: "Status", width: 45, sortOrder: i++, isSelected: true },
            { propertyName: "media", title: "Media", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "stoneId", title: "StoneId", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "kapan", title: "Kapan", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "rfid", title: "RFID No", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "shape", title: "Shape", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "weight", title: "Weight", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "color", title: "Color", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "clarity", title: "Clarity", width: 50, sortOrder: i++, isSelected: true },
            { propertyName: "cut", title: "Cut", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "polish", title: "Polish", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "symmetry", title: "Symmetry", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "fluorescence", title: "Fluorescence", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "price.rap", title: "Rap", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.discount", title: "Discount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.netAmount", title: "NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.perCarat", title: "$/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "location", title: "Location", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "certificateNo", title: "Certificate No", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "inscription", title: "Inscription", width: 80, sortOrder: i++, isSelected: true },
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }
}