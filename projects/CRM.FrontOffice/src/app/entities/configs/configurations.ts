import { BaseEntity } from "shared/enitites"
import { APIConfiguration } from "./apiConfiguration"
import { EmailConfiguration } from "./emailconfiguration"
import { EmailCredential } from "./emailcredential"

export class Configurations extends BaseEntity {
    allowBidHistory!: boolean | null
    newDiamondsDays!: number
    inActiveAccountMonth!: number
    removeDiamondsCartMinutes!: number
    showVOWDiscount!: boolean | null
    emailCredential: EmailCredential
    emailConfiguration: EmailConfiguration
    apiConfiguration: APIConfiguration

    constructor() {
          super();
          this.allowBidHistory = false;
          this.showVOWDiscount = false;
          this.emailCredential = new EmailCredential();
          this.emailConfiguration = new EmailConfiguration();
          this.apiConfiguration = new APIConfiguration();
    }
}