import { SocialMediaProvider } from "common/businessobjects";

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