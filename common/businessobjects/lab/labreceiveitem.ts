import { IdentityDNorm } from "../../entities"

export class LabReceiveItem {
    labIssueID!: string
    stoneId!: string
    isReceived?: boolean  
    identity: IdentityDNorm

    constructor() {            
        this.identity = new IdentityDNorm(); 
    }
}