export class GridDetailConfig {
    propertyName!: string
    title!: string
    width!: number
    sortOrder!: number
    isSelected?: boolean
    editor?: "boolean" | "text" | "numeric" | "date"

    constructor() {
        this.editor = 'text'
     }

}