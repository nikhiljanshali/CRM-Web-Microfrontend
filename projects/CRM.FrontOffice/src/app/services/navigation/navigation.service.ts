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
                    { name: "Supplier", path: "/supplier", icon: "candidates.svg", items: [] },
                    { name: "System User", path: "/systemuser", icon: "candidates.svg", items: [] },
                    { name: "Customer Verification", path: "/customerverification", icon: "candidates.svg", items: [] },
                    { name: "Broker", path: "/broker", icon: "broker.svg", items: [] },
                    { name: "Customer", path: "/customer", icon: "candidates.svg", items: [] },
                ]
            },
            {
                name: "Inventory",
                path: "",
                icon: "inventory.svg",
                items: [
                    { name: "Inventory", path: "/inventory", icon: "inventory.svg", items: [] },
                    { name: "Lead", path: "/lead", icon: "lead.svg", items: [] },
                ]
            },
            { name: "Watchlist", path: "/watchlist", icon: "wishlist.svg", items: [] },
            {
                name: "Configuration",
                path: "",
                icon: "mainconfig.svg",
                items: [
                    { name: "Configuration", path: "/configuration", icon: "mainconfig.svg", items: [] },
                    { name: "Masterconfig", path: "/masterconfig", icon: "masterconfig.svg", items: [] },
                    { name: "Rap Upload", path: "/rapupload", icon: "rapprice.svg", items: [] },
                    { name: "SchemeConfiguration", path: "/schememaster", icon: "accountconfig.svg", items: [] },
                    { name: "BusinessConfiguration", path: "/businessconfig", icon: "accountconfig.svg", items: [] }
                ]
            },
            {
                name: "Pricing",
                path: "",
                icon: "mainconfig.svg",
                items: [
                    { name: "Pricing Request", path: "/requestprice", icon: "pricingrequest.svg", items: [] },
                    { name: "Inventory Price", path: "/inventoryprice", icon: "inventory.svg", items: [] },
                    { name: "Pricing Config", path: "/pricingconfig", icon: "mainconfig.svg", items: [] },
                    { name: "Special Stone", path: "/specialstone", icon: "stone.svg", items: [] },
                    { name: "Pending Pricing", path: "/pendingpricing", icon: "pending-pricing.svg", items: [] },
                ]
            },
            { name: "Cart", path: "/cart", icon: "cart.svg", items: [] },
            { name: "Suggestion", path: "/suggestionlist", icon: "suggestions.svg", items: [] },
            { name: "Geo Tracking", path: "/geotracking", icon: "gpslabour.svg", items: [] }
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