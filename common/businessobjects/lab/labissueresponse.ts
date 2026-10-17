import { LabIssue } from "..";

export class LabIssueResponse {
    labIssues: LabIssue[]
    totalCount!: number

    constructor() {
        this.labIssues = [];
    }
}