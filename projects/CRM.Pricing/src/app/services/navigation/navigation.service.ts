import { Injectable } from "@angular/core";
import { NavPanelItem } from "common/businessobjects/navigation/navpanelitem";
import { PermissionItem } from "common/businessobjects/permission/permissionitem";

@Injectable()
export class NavigationService {

    constructor() { }

    getNavPanelItems(): NavPanelItem[] {
        return [
            // {
            //     name: "Organization",
            //     path: "",
            //     icon: "admin.svg",
            //     items: [
            //         { name: "Organizations", path: "/organization", icon: "candidates.svg", items: [] },
            //         { name: "Employee", path: "/employee", icon: "employee.svg", items: [] },
            //         { name: "Inventory", path: "/updateinventory", icon: "inventory.svg", items: [] },
            //         { name: "Inventory Upload", path: "/inventoryupload", icon: "inventory.svg", items: [] },
            //         { name: "User", path: "/user", icon: "admins.svg", items: [] }
            //     ]
            // },
            // {
            //     name: "Configuration",
            //     path: "",
            //     icon: "configuration.svg",
            //     items: [
            //         { name: "Configuration", path: "/configuration", icon: "configuration.svg", items: [] },
            //         { name: "Masterconfig", path: "/masterconfig", icon: "configuration.svg", items: [] }
            //     ]
            // }
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