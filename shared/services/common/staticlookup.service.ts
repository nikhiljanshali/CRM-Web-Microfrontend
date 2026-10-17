import { SocialMediaProvider } from "common/businessobjects";
import { ExportColumn } from "shared/enitites";

export const listOriginItems: Array<string> = [
      "Admin",
      "Supplier",
      "Customer",
      "Pricing",
      "Seller",
      "Accounts",
      "OPManager",
      "MFG"
];

export const listCustomerOriginItems: Array<string> = [
      "Customer",
      "Channel Partner"
];

export enum OriginValue {
      Admin = "Admin",
      Supplier = "Supplier",
      Customer = "Customer",
      Pricing = "Pricing",
      Seller = "Seller",
      Accounts = "Accounts",
      OPManager = "OPManager",
      MFG = "MFG"
}

export enum StatusValue {
      InProgress = "InProgress",
      Accepted = "Accepted",
      Rejected = "Rejected",
}

export const listAddressTypeItems: Array<string> = [
      "Address1",
      "Address2",
      "Address3",
];

export const listOrgTypeItems: Array<string> = [
      "BLANK",
      "CORP",
      "HUF",
      "INC",
      "L.L.C",
      "LLC",
      "Ltd",
      "Other",
      "Partnership",
      "Proprietorship",
      "PVT LTD",
      "Pvt Ltd."
];

export const listBusinessTypeItems: Array<string> = [
      "BLANK",
      "E - Tailer(B2B)",
      "E - Tailer(B2C)",
      "Investor",
      "Jewellery Manufacturer",
      "Jewellery Retailer",
      "Other",
      "Personal",
      "Retailer",
      "Retailer(100 +)",
      "Retailer(10 - 100)",
      "Retailer(1 - 10)",
      "Watch",
      "Wholesaler",
      "Channel Partner"
];

export const listMembershipItems: Array<string> = [
      "AWDC",
      "BLANK",
      "CIBJO",
      "Diamond Federation of HK Ltd.",
      "GJEPC",
      "GJF",
      "GPT",
      "HKTDC",
      "Idex",
      "Israel Diamond Bource",
      "Other",
      "Rapnet",
      "SDE",
];

export const listBranchItems: Array<string> = [
      "Branch 1",
      "Branch 2",
      "Branch 3"
];

export const listSocialMediaProviderItems: Array<SocialMediaProvider> = [
      { mediaType: 'Networking', providerName: 'Facebook' },
      { mediaType: 'Networking', providerName: 'Twitter' },
      { mediaType: 'Networking', providerName: 'Skype' },
      { mediaType: 'Media_Sharing', providerName: 'Instagram' },
      { mediaType: 'Media_Sharing', providerName: 'Snapchat' },
      { mediaType: 'Discussion_Forum', providerName: 'Reddit' },
      { mediaType: 'Discussion_Forum', providerName: 'Quora' },
      { mediaType: 'Messaging', providerName: 'WhatsApp' },
      { mediaType: 'Messaging', providerName: 'WeChat' }
];

export const listShapeItems: Array<string> = [
      "Round",
      "Fency"
];

export enum StoneStatus {
      Arrival = "Arrival",
      Stock = "Stock",
      // Grading = "Grading",
      Lab = "Lab",
      Pricing = "Pricing",
      // Transit = "Transit",
      Sold = "Sold",
      // InSale = "InSale",
      // Mfg = "Mfg"
}

export enum FrontStoneStatus {
      Proposal = "Proposal",
      InCart = "InCart",
      Order = "Order",
      Approved = "Approved",
      IsDelivered = "IsDelivered",
      Rejected = "Rejected",
}

export enum LeadStatus {
      Qualification = "Qualification",
      Proposal = "Proposal",
      Cart = "Cart",
      Order = "Order",
      Approved = "Approved",
      Delivered = "Delivered",
      Rejected = "Rejected",
}

export const listCustomerStoneStatus: Array<string> = [
      "Available",
      "Hold",
      "New"
];

export const listGrainingItems: Array<string> = [
      "Internal",
      "Surface"
];

export const listPriceRequestFilterTypeItems: Array<{ text: string; value: string }> = [
      { text: 'Inventory', value: 'Inv' },
      // { text: 'Pricing', value: 'Pricing' },
      { text: 'Temp Pricing', value: 'Temp' }
];

export const listExcelTypeItems: Array<string> = [
      "GIA-India",
      "GIA-HK",
      "GIA-Tokyo",
      "GIA-BangKok",
      "GIA-NewYork",
      "GIA-Carlsbad",
      "HRD",
];

export const listLabResultItems: Array<string> = [
      "GIA",
      "IGI",
      "HRD"
];

export enum FileStoreTypes {
      CustomerProfile = "CustomerProfile",
      CustomerPhotoIdent = "CustomerPhotoIdent",
      CustomerBussinessIdent = "CustomerBussinessIdent"
}

export const stockOnHandExcelFormat: Array<{ text: string; value: string }> = [
      { text: 'NO', value: 'no' },
      { text: 'DATE', value: 'createdDate' },
      { text: 'STOCKID', value: 'stoneId' },
      { text: 'SHAPE', value: 'shape' },
      { text: 'WEIGHT', value: 'weight' },
      { text: 'COLOR', value: 'color' },
      { text: 'CLARITY', value: 'clarity' },
      { text: 'CUT', value: 'cut' },
      { text: 'POLISH', value: 'polish' },
      { text: 'SYMMETRY', value: 'symmetry' },
      { text: 'FLO', value: 'fluorescence' },
      { text: 'CertificateNo', value: 'certificateNo' },
      { text: 'COMMENT', value: 'comments' },
      { text: 'SHADE', value: 'inclusion.shade' },
      { text: 'WIDTH', value: 'measurement.width' },
      { text: 'HEIGHT', value: 'measurement.height' },
      { text: 'RAP', value: 'basePrice.rap' },
      { text: 'DISCOUNT', value: 'basePrice.discount' },
      { text: 'PAR CR $', value: 'basePrice.netAmount' },
      { text: 'PRICE $', value: 'basePrice.perCarat' }
];

export enum listCurrencyType {
      USD = "USD",
      HKD = "HKD",
      EURO = "EURO",
      JPY = "JPY",
      BHAT = "BHAT",
      INR = "INR"
}

export enum listExportType {
      FOB = "FOB",
      CIF = "CIF",
      CFR = "CFR",
      CandI = "C&I"     
}

export enum listInvoiceType {
      DIAMARTLOCAL = "DIAMARTLOCAL",
      DIAMARTOVERSEAS = "DIAMARTOVERSEAS",
      CGLOCAL = "CGLOCAL",
      CGOVERSEAS = "CGOVERSEAS"
}

export const listColorMarkItems: Array<string> = [
      "Yellow",
      "Red",
      "Blue",
      "Green",
      "Brown",
      "None"
];

export const listPartyTypeItems: Array<string> = [
      "Customer",
      "Boiler",
      "Photography",
];

export enum TextEnum {
      LedgerGroup = 'LedgerGroup',
      TaxType = 'TaxType',
      TransactGroup = 'TransactGroup'
}


export const listDesignationItems: Array<string> = [
      "It",
      "Manager",
      "Other"
];

export const listExportFormat: Array<string> = [
      "Excel",
      "Csv",
      "Json"
];

export const listCustomerFilterLocation: Array<string> = [
      "HK",
      "INDIA",
      "BELGIUM",
      "SHENZHEN"
];

export const listBasicExportColumns: ExportColumn[] = [
      { title: 'StoneId', custTitle: '', value: 'stoneId', index: 0 },
      { title: 'Shape', custTitle: '', value: 'shape', index: 0 },
      { title: 'Weight', custTitle: '', value: 'weight', index: 0 },
      { title: 'Color', custTitle: '', value: 'color', index: 0 },
      { title: 'Clarity', custTitle: '', value: 'clarity', index: 0 },
      { title: 'Cut', custTitle: '', value: 'cut', index: 0 },
      { title: 'Polish', custTitle: '', value: 'polish', index: 0 },
      { title: 'Symmertry', custTitle: '', value: 'symmetry', index: 0 },
      { title: 'Fluorescence', custTitle: '', value: 'fluorescence', index: 0 },
      { title: 'Lab', custTitle: '', value: 'lab', index: 0 },
      { title: 'Certificate No', custTitle: '', value: 'certificateNo', index: 0 },
      { title: 'Price', custTitle: '', value: 'price.rap', index: 0 },
      { title: 'Discount', custTitle: '', value: 'price.discount', index: 0 }
];

export const listIncusionExportColumns: ExportColumn[] = [
      { title: 'Brown', custTitle: '', value: 'inclusion.brown', index: 0 },
      { title: 'Green', custTitle: '', value: 'inclusion.green', index: 0 },
      { title: 'Milky', custTitle: '', value: 'inclusion.milky', index: 0 },
      { title: 'Shade', custTitle: '', value: 'inclusion.shade', index: 0 },
      { title: 'Side Black', custTitle: '', value: 'inclusion.sideBlack', index: 0 },
      { title: 'Center Black', custTitle: '', value: 'inclusion.centerBlack', index: 0 },
      { title: 'Side White', custTitle: '', value: 'inclusion.sideWhite', index: 0 },
      { title: 'Center White', custTitle: '', value: 'inclusion.centerWhite', index: 0 },
      { title: 'Open Crown', custTitle: '', value: 'inclusion.openCrown', index: 0 },
      { title: 'Open Table', custTitle: '', value: 'inclusion.openTable', index: 0 },
      { title: 'Open Pavilion', custTitle: '', value: 'inclusion.openPavilion', index: 0 },
      { title: 'Open Girdle', custTitle: '', value: 'inclusion.openGirdle', index: 0 },
      { title: 'Girdle Condition', custTitle: '', value: 'inclusion.girdleCondition', index: 0 },
      { title: 'EFOC', custTitle: '', value: 'inclusion.efoc', index: 0 },
      { title: 'EFOT', custTitle: '', value: 'inclusion.efot', index: 0 },
      { title: 'EFOG', custTitle: '', value: 'inclusion.efog', index: 0 },
      { title: 'EFOP', custTitle: '', value: 'inclusion.efop', index: 0 },
      { title: 'Culet', custTitle: '', value: 'inclusion.culet', index: 0 },
      { title: 'HNA', custTitle: '', value: 'inclusion.hna', index: 0 },
      { title: 'Eye Clean', custTitle: '', value: 'inclusion.eyeClean', index: 0 },
      { title: 'Key To Symbol', custTitle: '', value: 'inclusion.ktoS', index: 0 },
      { title: 'Natural On Table', custTitle: '', value: 'inclusion.naturalOnTable', index: 0 },
      { title: 'Natural On Girdle', custTitle: '', value: 'inclusion.naturalOnGirdle', index: 0 },
      { title: 'Natural On Crown', custTitle: '', value: 'inclusion.naturalOnCrown', index: 0 },
      { title: 'Natural On Pavillion', custTitle: '', value: 'inclusion.naturalOnPavillion', index: 0 },
      { title: 'Red Spot', custTitle: '', value: 'inclusion.redSpot', index: 0 },
      { title: 'Bow Tie', custTitle: '', value: 'inclusion.bowtie', index: 0 }
];

export const listMeasurementExportColumns: ExportColumn[] = [
      { title: 'Depth', custTitle: '', value: 'measurement.depth', index: 0 },
      { title: 'Table', custTitle: '', value: 'measurement.table', index: 0 },
      { title: 'Length', custTitle: '', value: 'measurement.length', index: 0 },
      { title: 'Width', custTitle: '', value: 'measurement.width', index: 0 },
      { title: 'Height', custTitle: '', value: 'measurement.height', index: 0 },
      { title: 'Crown Height', custTitle: '', value: 'measurement.crownHeight', index: 0 },
      { title: 'Crown Angle', custTitle: '', value: 'measurement.crownAngle', index: 0 },
      { title: 'Pavilion Depth', custTitle: '', value: 'measurement.pavilionDepth', index: 0 },
      { title: 'Pavilion Angle', custTitle: '', value: 'measurement.pavilionAngle', index: 0 },
      { title: 'Girdle Percentage', custTitle: '', value: 'measurement.girdlePer', index: 0 },
      { title: 'Min Girdle', custTitle: '', value: 'measurement.minGirdle', index: 0 },
      { title: 'Max Girdle', custTitle: '', value: 'measurement.maxGirdle', index: 0 },
      { title: 'Ratio', custTitle: '', value: 'measurement.ratio', index: 0 }
];

export const listOthersExportColumns: ExportColumn[] = [
      { title: 'Location', custTitle: '', value: 'location', index: 0 },
      { title: 'Availability', custTitle: '', value: 'isHold', index: 0 }
];