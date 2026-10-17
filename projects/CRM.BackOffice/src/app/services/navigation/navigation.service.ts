import { Injectable } from "@angular/core";
import { NavPanelItem, PermissionItem } from "shared/businessobjects";


@Injectable()
export class NavigationService {

    constructor() { }

    getNavPanelItems(): NavPanelItem[] {
        return [
            {
                name: "Organization",
                path: "",
                icon: "organization.svg",
                items: [
                    { name: "Organizations", path: "/organization", icon: "candidates.svg", items: [] },
                    { name: "Employee", path: "/employee", icon: "employee.svg", items: [] },
                    { name: "User", path: "/user", icon: "admins.svg", items: [] }
                ]
            },
            {
                name: "Inventory",
                path: "",
                icon: "inventory.svg",
                items: [
                    { name: "Inventory Upload", path: "/inventoryupload", icon: "inventory.svg", items: [] },
                    { name: "Inclusion Upload", path: "/inclusionupload", icon: "inclusionupload.svg", items: [] },
                    { name: "Grading", path: "/grading", icon: "grading.svg", items: [] },
                    { name: "Inventory", path: "/inventory", icon: "inventory.svg", items: [] },
                    { name: "Memo", path: "/memomaster", icon: "memo.svg", items: [] },
                    { name: "Order", path: "/order", icon: "order.svg", items: [] }
                ]
            },
            {
                name: "RFID",
                path: "",
                icon: "rfidstock.svg",
                items: [
                    { name: "RFID Stock", path: "/rfid", icon: "stock-rfid.svg", items: [] },
                    { name: "RFID StockTally", path: "/rfid/rfidstocktally", icon: "stocktally.svg", items: [] }
                ]
            },
            {
                name: "Account",
                path: "",
                icon: "accounting.svg",
                items: [
                    { name: "Logistic Master", path: "/logisticsmaster", icon: "logisticsmaster.svg", items: [] },
                    { name: "Ledger", path: "/ledger", icon: "party.svg", items: [] },
                    { name: "Balance Sheet", path: "/balancesheet", icon: "balancesheet.svg", items: [] },
                    { name: "Profit & Loss", path: "/profitloss", icon: "profitloss.svg", items: [] },
                    { name: "Transactions", path: "/transactions", icon: "purchase.svg", items: [] },
                    { name: "Inward Memo", path: "/inwardmemo", icon: "inward.svg", items: [] }
                ]
            },
            {
                name: "Lab",
                path: "",
                icon: "lab.svg",
                items: [
                    { name: "Lab Master", path: "/lab", icon: "labresult.svg", items: [] },
                    { name: "Lab Expense", path: "/labexpense", icon: "labresult.svg", items: [] },
                    { name: "Lab Issue Receive", path: "/labissuemaster", icon: "lab.svg", items: [] },
                    { name: "Lab Service Type Master", path: "/labservice", icon: "labconfig.svg", items: [] },
                    { name: "Lab Result Upload", path: "/labreconsiliation", icon: "labresult.svg", items: [] }
                ]
            },
            {
                name: "Configuration",
                path: "",
                icon: "mainconfig.svg",
                items: [
                    { name: "OriginConfiguration", path: "/configuration", icon: "configuration.svg", items: [] },
                    { name: "Masterconfig", path: "/masterconfig", icon: "masterconfig.svg", items: [] },
                    { name: "Accountconfig", path: "/accountconfig", icon: "accountconfig.svg", items: [] },
                    { name: "SchemeConfiguration", path: "/schememaster", icon: "scheme.svg", items: [] },
                    { name: "Transact Item", path: "/transactitem", icon: "transact-master.svg", items: [] }
                ]
            },
        ]
    }

    getPermissionItem(): PermissionItem[] {
        return [
            {
                name: "Employee",
                items: [
                    { name: "CanAddEmployee", items: [] },
                    { name: "CanEditEmployee", items: [] },
                    { name: "CanDeleteEmployee", items: [] },
                ]
            },
            {
                name: "Organization",
                items: [
                    { name: "CanAddOrganization", items: [] },
                    { name: "CanEditOrganization", items: [] },
                    { name: "CanDeleteOrganization", items: [] },
                ]
            }
        ]
    }

}