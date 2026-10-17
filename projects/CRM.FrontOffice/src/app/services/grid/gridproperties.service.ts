import { Injectable } from "@angular/core";
import { GridDetailConfig } from "shared/businessobjects";

@Injectable()

export class GridPropertiesService {

    constructor() { }

    public getSystemUserGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "fullName", title: "Full Name", width: 150, sortOrder: i++, isSelected: true },
            { propertyName: "supplier.name", title: "Supplier", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "origin", title: "Origin", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "email", title: "Email", width: 150, sortOrder: i++, isSelected: true },
            { propertyName: "mobile", title: "Mobile No", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "address.line1", title: "Address", width: 250, sortOrder: i++, isSelected: true },
            { propertyName: "joiningDate", title: "Join Date", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "enrollmentNumber", title: "Enroll Number", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "isManager", title: "Is Manager", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "isActive", title: "Active", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "isAvailable", title: "Available", width: 100, sortOrder: i++, isSelected: true }
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues;
    }

    public getSupplierGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "name", title: "Name", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "incomeTaxNo", title: "IncomeTaxno", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "taxNo", title: "TaxNo", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "membership", title: "Membership", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "address.line1", title: "Address", width: 250, sortOrder: i++, isSelected: true },
            { propertyName: "website", title: "Website", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "person", title: "Person", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "email", title: "Email", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "mobileNo", title: "MobileNo", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "phoneNo", title: "PhoneNo", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "faxNo", title: "FaxNo", width: 100, sortOrder: i++, isSelected: true },
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues;
    }

    public getPendingPriceGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "media", title: "Media", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "stoneId", title: "StoneId", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "kapan", title: "Kapan", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "shape", title: "Shape", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "weight", title: "Weight", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "color", title: "Color", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "clarity", title: "Clarity", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "cut", title: "Cut", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "polish", title: "Polish", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "symmetry", title: "Symmetry", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "fluorescence", title: "Fluorescence", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.rap", title: "Rap", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.discount", title: "Base Disc", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "price.discount", title: "Main Disc", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "tempPrice.discount", title: "T. Main Disc", width: 100, sortOrder: i++, isSelected: true, editor: 'numeric' },
            { propertyName: "discDiff", title: "Disc Diff", width: 100, sortOrder: i++, isSelected: true, editor: 'numeric' },
            { propertyName: "basePrice.netAmount", title: "Base NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.perCarat", title: "Base $/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.netAmount", title: "NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.perCarat", title: "$/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "lab", title: "Lab", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.iGrade", title: "IGrade", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.mGrade", title: "MGrade", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "days", title: "Days", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Diameter", title: "Diameter", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.depth", title: "Depth% / Total Depth", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.table", title: "Table", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Natts", title: "Natts", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "ratio", title: "Ratio", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Girdle", title: "Girdle", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.ktoS", title: "KtoS", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "location", title: "Location", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.brown", title: "Brown", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.green", title: "Green", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.milky", title: "Milky", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.shade", title: "Shade", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "createdDate", title: "Pricing Date", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "comments", title: "Comments", width: 80, sortOrder: i++, isSelected: true }]

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getPriceRequestGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "analytic", title: "Analytic", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "checkbox", title: "Checkbox", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "media", title: "Media", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "stoneId", title: "StoneId", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "kapan", title: "Kapan", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "shape", title: "Shape", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "weight", title: "Weight", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "color", title: "Color", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "clarity", title: "Clarity", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "cut", title: "Cut", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "polish", title: "Polish", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "symmetry", title: "Symmetry", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "fluorescence", title: "Fluorescence", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "status", title: "Status", width: 120, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.rap", title: "Rap", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.discount", title: "Base Disc", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "tempBaseDisc", title: "T. Base Disc", width: 100, sortOrder: i++, isSelected: true, editor: 'numeric' },
            { propertyName: "price.discount", title: "Main Disc", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "tempDisc", title: "T. Main Disc", width: 100, sortOrder: i++, isSelected: true, editor: 'numeric' },
            { propertyName: "discountOne", title: "Discount1", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "discountTwo", title: "Discount2", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "discountThree", title: "Discount3", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.netAmount", title: "Base NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.perCarat", title: "Base $/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.netAmount", title: "NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.perCarat", title: "$/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "lab", title: "Lab", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.iGrade", title: "IGrade", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.mGrade", title: "MGrade", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "days", title: "Days", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Diameter", title: "Diameter", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.depth", title: "Depth% / Total Depth", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.table", title: "Table", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Natts", title: "Natts", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "ratio", title: "Ratio", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Girdle", title: "Girdle", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.ktoS", title: "KtoS", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "location", title: "Location", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.brown", title: "Brown", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.green", title: "Green", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.milky", title: "Milky", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.shade", title: "Shade", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "createdDate", title: "Pricing Date", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "expiryDate", title: "Expiry Date", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "comments", title: "Comments", width: 80, sortOrder: i++, isSelected: true }]

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getInventoryPriceGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "analytic", title: "Analytic", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "checkbox", title: "Checkbox", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "media", title: "Media", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "stoneId", title: "StoneId", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "kapan", title: "Kapan", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "shape", title: "Shape", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "weight", title: "Weight", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "color", title: "Color", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "clarity", title: "Clarity", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "cut", title: "Cut", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "polish", title: "Polish", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "symmetry", title: "Symmetry", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "fluorescence", title: "Fluorescence", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "status", title: "Status", width: 120, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.rap", title: "Rap", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.discount", title: "Base Disc", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "price.discount", title: "Main Disc", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "tempDisc", title: "T. Main Disc", width: 100, sortOrder: i++, isSelected: true, editor: 'numeric' },
            { propertyName: "discDiff", title: "Disc Diff", width: 100, sortOrder: i++, isSelected: true, editor: 'numeric' },
            { propertyName: "discountOne", title: "Discount1", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "discountTwo", title: "Discount2", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "discountThree", title: "Discount3", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.netAmount", title: "Base NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.perCarat", title: "Base $/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.netAmount", title: "NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.perCarat", title: "$/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "lab", title: "Lab", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.iGrade", title: "IGrade", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.mGrade", title: "MGrade", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "days", title: "Days", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Diameter", title: "Diameter", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.depth", title: "Depth% / Total Depth", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "measurement.table", title: "Table", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Natts", title: "Natts", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "ratio", title: "Ratio", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "Girdle", title: "Girdle", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.ktoS", title: "KtoS", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "location", title: "Location", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.brown", title: "Brown", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.green", title: "Green", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.milky", title: "Milky", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "inclusion.shade", title: "Shade", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "createdDate", title: "Pricing Date", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "comments", title: "Comments", width: 80, sortOrder: i++, isSelected: true }]

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getInventoryGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "checkbox", title: "Checkbox", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "media", title: "Media", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "stoneId", title: "StoneId", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "kapan", title: "Kapan", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "rfid", title: "RFID No", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "grade", title: "Grade", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "shape", title: "Shape", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "weight", title: "Weight", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "color", title: "Color", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "clarity", title: "Clarity", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "cut", title: "Cut", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "polish", title: "Polish", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "symmetry", title: "Symmetry", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "fluorescence", title: "Fluorescence", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.rap", title: "Rap", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.discount", title: "Discount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.netAmount", title: "NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "basePrice.perCarat", title: "$/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "location", title: "Location", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "status", title: "Status", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "isHold", title: "Hold", width: 35, sortOrder: i++, isSelected: true },
            { propertyName: "isRapnetHold", title: "Rapnet Hold", width: 35, sortOrder: i++, isSelected: true },
            { propertyName: "isCPBlocked", title: "IsCPBlocked", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "isLabReturn", title: "IsLabReturn", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "isPricingRequest", title: "IsPricingRequest", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "lab", title: "Lab", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "certificateNo", title: "Certificate No", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "inscription", title: "Inscription", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "comments", title: "Comments", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "labSendDate", title: "LabSendDate", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "labReceiveDate", title: "LabRecivedDate", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "marketSheetDate", title: "MarketSheetDate", width: 80, sortOrder: i++, isSelected: true }
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getBrokerGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "name", title: "Name", width: 150, sortOrder: i++, isSelected: true },
            { propertyName: "code", title: "Code", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "brokrage", title: "Brokrage %", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "incomeTaxNo", title: "Income Tax", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "email", title: "Email", width: 120, sortOrder: i++, isSelected: true },
            { propertyName: "mobileNo", title: "Mobile No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "address", title: "Address", width: 200, sortOrder: i++, isSelected: true },
            { propertyName: "refCompanyName", title: "Ref Company", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "refPersonName", title: "Ref Person", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "refemail", title: "Ref Email", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "refmobileNo", title: "Ref Mobile No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "refAddress", title: "Ref Address", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "isActive", title: "Active", width: 70, sortOrder: i++, isSelected: true },
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues;
    }

    public getCustomerGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "fullName", title: "FullName", width: 150, sortOrder: i++, isSelected: true },
            { propertyName: "origin", title: "Origin", width: 150, sortOrder: i++, isSelected: true },
            { propertyName: "birthDate", title: "Birth Date", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "primaryMobile", title: "Mobile No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "email", title: "Email", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "seller.name", title: "Seller", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "phoneNo", title: "Telephone No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "companyName", title: "Company Name", width: 120, sortOrder: i++, isSelected: true },
            { propertyName: "designation", title: "Designation", width: 120, sortOrder: i++, isSelected: true },
            { propertyName: "businessType", title: "Business Type", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "businessEmail", title: "Business Email", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "businessMobileNo", title: "BusinessMobile No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "businessPhoneNo", title: "BusinessPhone No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "address.line1", title: "Address", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "address.country", title: "Country", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "address.zipCode", title: "Postal Code", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "faxNo", title: "Fax", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "referenceName", title: "Reference", width: 130, sortOrder: i++, isSelected: true },
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getLeadInventoryItems(): GridDetailConfig[] {

        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "checkbox", title: "Checkbox", width: 40, sortOrder: i++, isSelected: true },
            // { propertyName: "stoneStatus", title: "Status", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "stoneId", title: "Stone Id", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "isHold", title: "Hold", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "isRejected", title: "Rejected", width: 60, sortOrder: i++, isSelected: true },
            // { propertyName: "status", title: "Inv-Status", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "price.rap", title: "Rap", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.discount", title: "Discount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.netAmount", title: "NetAmount", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "price.perCarat", title: "$/CT", width: 80, sortOrder: i++, isSelected: true },
            { propertyName: "weight", title: "Weight", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "shape", title: "Shape", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "color", title: "Color", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "clarity", title: "Clarity", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "cut", title: "Cut", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "polish", title: "Polish", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "symmetry", title: "Symmetry", width: 85, sortOrder: i++, isSelected: true },
            { propertyName: "fluorescence", title: "Fluorescence", width: 85, sortOrder: i++, isSelected: true },
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getCustomerVerificationGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "fullName", title: "FullName", width: 150, sortOrder: i++, isSelected: true },
            { propertyName: "birthDate", title: "Birth Date", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "primaryMobile", title: "Mobile No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "email", title: "Email", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "phoneNo", title: "Telephone No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "companyName", title: "Company Name", width: 120, sortOrder: i++, isSelected: true },
            { propertyName: "designation", title: "Designation", width: 120, sortOrder: i++, isSelected: true },
            { propertyName: "businessType", title: "Business Type", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "businessEmail", title: "Business Email", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "businessMobileNo", title: "BusinessMobile No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "businessPhoneNo", title: "BusinessPhone No", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "address.line1", title: "Address", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "address.country", title: "Country", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "address.zipCode", title: "Postal Code", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "faxNo", title: "Fax", width: 130, sortOrder: i++, isSelected: true },
            { propertyName: "referenceName", title: "Reference", width: 130, sortOrder: i++, isSelected: true },
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getCartItems(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "checkbox", title: "", width: 15, sortOrder: i++, isSelected: true },
            { propertyName: "stoneId", title: "StoneId", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "customer.name", title: "Customer", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "seller.name", title: "Seller", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.shape", title: "Shape", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.weight", title: "Weight", width: 35, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.color", title: "Color", width: 20, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.clarity", title: "Clarity", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.cut", title: "Cut", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.polish", title: "Polish", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.symmetry", title: "Symtry", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.fluorescence", title: "Fluor", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.lab", title: "Lab", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.certificateNo", title: "Certificate No.", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.location", title: "Location", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.price", title: "Price", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.sDiscount", title: "S.Dis", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.fDiscount", title: "F.Dis", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.fAmount", title: "F.AMt", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "invItem.isDelivered", title: "Deliver", width: 40, sortOrder: i++, isSelected: true },
        ];
        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }

    public getWatclistItems(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "customer.companyName", title: "Company Name", width: 60, sortOrder: i++, isSelected: true },
            { propertyName: "addedAt", title: "Date", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.stoneId", title: "StoneId", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.weight", title: "Weight", width: 35, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.shape", title: "Shape", width: 25, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.color", title: "Color", width: 25, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.clarity", title: "Clarity", width: 25, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.cut", title: "Cut", width: 25, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.polish", title: "Polish", width: 25, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.symmetry", title: "Sym", width: 25, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.fluorescence", title: "Fluo", width: 25, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.lab", title: "Lab", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.price.rap", title: "Rap", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "oldDiscount", title: "Old Discount", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.price.discount", title: "Discount", width: 40, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.price.perCarat", title: "Per Ct", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.price.netAmount", title: "Net Amt", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.location", title: "Location", width: 30, sortOrder: i++, isSelected: true },
            { propertyName: "inventoryDetail.certificateNo", title: "Certificate No", width: 30, sortOrder: i++, isSelected: false }
        ];
        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues
    }
    
    public getSuggestionListGrid(): GridDetailConfig[] {
        let i = 1;
        let gridValues: GridDetailConfig[] = [
            { propertyName: "company", title: "Company", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "email", title: "Email", width: 100, sortOrder: i++, isSelected: true },
            { propertyName: "description", title: "Suggestion", width: 450, sortOrder: i++, isSelected: true },
            { propertyName: "createdDate", title: "Date", width: 100, sortOrder: i++, isSelected: true },
        ];

        gridValues.sort((n1, n2) => n1.sortOrder - n2.sortOrder);
        return gridValues;
    }

}