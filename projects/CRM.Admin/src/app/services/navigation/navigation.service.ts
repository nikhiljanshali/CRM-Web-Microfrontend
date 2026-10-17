import { Injectable } from "@angular/core";
import { NavPanelItem } from "common/businessobjects/navigation/navpanelitem";
import { PermissionItem } from "common/businessobjects/permission/permissionitem";

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
                    { name: "Inventory", path: "/updateinventory", icon: "inventory.svg", items: [] },
                    { name: "User", path: "/user", icon: "admins.svg", items: [] }
                ]
            },
            {
                name: "Customer",
                path: "",
                icon: "customers.svg",
                items: [
                    { name: "CustomerVerification", path: "/customer-verification", icon: "admins.svg", items: [] }
                ]
            },
            {
                name: "SystemUsers",
                path: "/systemuser",
                icon: "user.svg",
                items: []
            },
            {
                name: "Lab",
                path: "",
                icon: "lab.svg",
                items: [
                    { name: "Lab Master", path: "/lab", icon: "labresult.svg", items: [] },
                    { name: "Lab Service Type Master", path: "/labservice", icon: "labconfig.svg", items: [] }
                ]
            },
            {
                name: "Logistic Master",
                path: "/logisticsmaster",
                icon: "logisticsmaster.svg",
                items: []
            },
            {
                name: "Configuration",
                path: "",
                icon: "mainconfig.svg",
                items: [
                    { name: "OriginConfiguration", path: "/configuration", icon: "configuration.svg", items: [] },
                    { name: "Masterconfig", path: "/masterconfig", icon: "masterconfig.svg", items: [] },
                    { name: "Rap Price", path: "/rapprice", icon: "rapprice.svg", items: [] }                    
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