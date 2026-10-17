export class NavPanelItem {
    name!: string
    path!: string
    icon!: string
    items: NavPanelItem[]

    constructor() {
        this.items = [];
    }

}