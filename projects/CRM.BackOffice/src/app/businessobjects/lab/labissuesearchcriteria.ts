export class LabIssueSearchCriteria {
    stoneId!: string
    public from!: Date;
    public to!: Date

    constructor() {
        this.stoneId = ""
    }
}