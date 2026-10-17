import { UserRights } from "./userrights";

export class UserRightItem {
    group!: string
    items: UserRights[]
    isChecked!: boolean

    constructor() {
        this.items = [];
    }
}