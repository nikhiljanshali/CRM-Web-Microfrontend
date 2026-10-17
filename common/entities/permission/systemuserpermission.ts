import { IssueRight } from "common/businessobjects/permission/issueright";
import { PermissionGroup } from "./permissiongroup";

export class SystemUserPermission extends PermissionGroup {
    systemUserId!: string
    systemUserName!: string
    origin!: string
    issueRights: IssueRight[]

    constructor() {
        super();
        this.issueRights = [];
    }

}