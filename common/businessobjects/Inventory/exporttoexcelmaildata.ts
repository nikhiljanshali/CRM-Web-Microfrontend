export class ExportToExcelMailData {
    empId!: string;
    toEmail!: string;
    cC!: string;
    bcc!: string;
    subject!: string
    excelFileName!: string;
    excelBase64String!: string;
    excelMediaType!: string;

    constructor() { }
}