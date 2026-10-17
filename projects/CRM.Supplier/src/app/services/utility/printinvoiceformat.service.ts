import { Injectable } from '@angular/core';
import { Invoice } from '../../businessobjects';
import { UtilityService } from 'common/services';

@Injectable({
  providedIn: 'root'
})

export class PrintInvoiceFormat {
  constructor(
    public utilityService: UtilityService
  ) { }

  public getInvoice(invoice: Invoice) {    
    var htmlString: string = "";
    let sumWeight = 0;
    let sumGrandTotalPlusShip = invoice.invoicePrice.netAmount ?? 0;
    let sumConvGrandTotalPlusShip = 0;
    let contain99Down = false;
    let contain99Up = false;

    for (let index = 0; index <= invoice.invoiceItems.length; index++) {
      let obj = invoice.invoiceItems[index];
      if (obj && contain99Down == false) {
        if (obj.inventoryItem.weight <= 0.99)
          contain99Down = true
      }
      if (obj && contain99Up == false) {
        if (obj.inventoryItem.weight > 0.99)
          contain99Up = true
      }
    }

    if (invoice.shippingCharge > 0)
      sumGrandTotalPlusShip += invoice.shippingCharge ?? 0;

    if (invoice.taxPerOne)
      sumGrandTotalPlusShip += this.utilityService.ConvertToFloatWithTwoDecimal((invoice.taxPerOne * (invoice.invoicePrice.netAmount ?? 0)) / 100);

    if (invoice.taxPerTwo)
      sumGrandTotalPlusShip += this.utilityService.ConvertToFloatWithTwoDecimal((invoice.taxPerTwo * (invoice.invoicePrice.netAmount ?? 0)) / 100);

    sumConvGrandTotalPlusShip = sumGrandTotalPlusShip * invoice.convCurrencyRate

    for (let index = 0; index <= invoice.invoiceItems.length; index++) {
      let obj = invoice.invoiceItems[index];
      if (obj) {
        sumWeight += obj.inventoryItem.weight;
      }
    }

    if (invoice.invoiceType == "DIAMARTLOCAL") {
      htmlString += `  
  <body onload="window.print(); window.close();">
    <!-- Print Chalan for DI Start -->
    <div class="chal-wrap con-inv di-inv">
      <div class="chal-head">
        <div class="logo">
          <img src="http://27.109.6.22:5205/billimage/diamarthk1.png" alt="logo">
        </div>
        <div class="di-info">
          <span>Rm. 1104 11/FL., Chevalier House, 45-51 Chatham Road South, Tsim Sha Tsui. Kowloon. Hongkong.</span>
          <span>本司地址: 尖沙咀, 漆咸道南45-51號 其士大厦1104 室.</span>
          <span>Email: sales@diamarthk.com</span>
        </div>
        <div class="co-details">
          <table>
            <tbody>
              <tr>
                <td><b>Phone:</b></td>
                <td><b>(852) 2330 7799</b></td>
              </tr>
              <tr>
                <td><b>Fax:</b></td>
                <td><b>(852) 2330 7755</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="chal-body">
        <span class="c-st border-left-2 border-right-2">INVOICE</span>
        <div class="body-top pl-1 border-bottom-0">
          <div class="bo-left w-50">
            <span class="c-st text-left">To.: ` + invoice.party.name + `(` + invoice.party.contactPerson + `)</span>
            <span>` + invoice.party.address.line1 + `,` + invoice.party.address.line2 + `</span>            
            <span>` + invoice.party.address.city + `,` + invoice.party.address.state + `,` + invoice.party.address.country + `</span>            
            <span>ZipCode : ` + invoice.party.address.zipCode + `</span>
            <span>Email: ` + invoice.party.email + `</span>
            <span>TEL: ` + invoice.party.mobileNo + `,` + invoice.party.phoneNo + `, FAX: ` + invoice.party.faxNo + `</span>           
          </div>
          <div class="di-bor-0">
            <table>
              <tbody>
                <tr>
                  <td><b>INVOICE NO.</b></td>
                  <td>` + invoice.invoiceNo + `</td>
                </tr>
                <tr>
                  <td><b>DATE:</b></td>
                  <td>` + this.utilityService.getValidDateWithFormate(invoice.createdDate) + `</td>
                </tr>
                <tr>
                  <td><b>TERMS:</b></td>
                  <td>` + invoice.terms + `</td>
                </tr>
                <tr>
                  <td><b>Due Date:</b></td>
                  <td>` + this.utilityService.getValidDateWithFormate(invoice.dueDate) + `</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="body-middle">
          <table>
            <thead>
              <th>No</th>                       
              <th>DESCRIPTION</th>
              <th>PCS</th>
              <th>CARATS</th>
              <th>RATE `+ invoice.currencyType + ` PER CT</th>
              <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
            </thead>
            <tbody>`

      // if (invoice.invoiceItems.length < 23) {
      //   for (let index = 0; index <= invoice.invoiceItems.length; index++) {
      //     let obj = invoice.invoiceItems[index];
      //     if (obj) {
      //       htmlString += `
      //           <tr>
      //           <td>`+ (index + 1) + `</td>
      //           <td>`+ obj.inventoryItem.stoneId + `</td>
      //           <td>`+ obj.inventoryItem.shape + `-` + obj.inventoryItem.color + `-` + obj.inventoryItem.clarity + `-` + obj.inventoryItem.certificateNo + `</td>
      //           <td>&nbsp</td>
      //           <td>`+ obj.inventoryItem.weight + `</td>
      //           <td>`+ obj.invoicePrice.perCarat + `</td>
      //           <td>`+ obj.invoicePrice.netAmount + `</td>
      //           </tr>`
      //     }
      //   }
      //   for (let index = invoice.invoiceItems.length; index <= 22; index++) {
      //     htmlString += `
      //           <tr>
      //           <td>&nbsp</td>
      //           <td></td>
      //           <td></td>
      //           <td></td>
      //           <td></td>
      //           <td></td>
      //           <td></td>
      //           </tr>`
      //   }
      // }

      // else {

      htmlString += `
                <tr>
                <td></td>
                <td>CUT & POLISH DIAMONDS</td>                
                <td>`+ invoice.invoiceItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
                <td>`+ invoice.invoicePrice.netAmount + `</td>
                </tr>`

      htmlString += `
                <tr>
                <td></td>
                <td>AS PER PACKING LIST</td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`

      for (let index = 3; index <= 22; index++) {
        htmlString += `
                <tr>
                <td>&nbsp</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`
      }
      //}

      if (invoice.shippingCharge > 0) {
        htmlString += `
                <tr>
                <td colspan="5" style="text-align:right" >Shipping Charge : </td>       
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.shippingCharge ?? 0) + `</td>
                </tr>`
      }

      htmlString += `                        
            </tbody>
            <tfoot>
            <tr>
              <td colspan="2">Grand Total </td>
              <td>`+ invoice.invoiceItems.length + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusShip ?? 0) + `</td>
            </tr>
            <tr>
              <td colspan="4"></td>
              <td>`+ invoice.currencyType + ` @ ` + invoice.currencyRate + `</td>
              <td></td>
            </tr>


            <!-- Commented
            <tr>
              <td colspan="2" class="text-left pl-1">Amount in Words:</td>
              <td colspan="4" class="text-left pl-1">FIVE HUNDRED FIFTY SIX THOUSAND FIFTY THREE & CENT FORTY
              SEVEN ONLY.</td>
            </tr>-->

            </tfoot>
          </table>
        </div>
        <div class="body-fotter">
          <div class="body-top border-top-0 border-bottom-0 pl-1">
            <div class="bo-left w-50">
              <span class="c-st text-left">* Goods once sold are not ruturnable.</span>
              <span class="c-st text-left">* All goods are sold & Delivered in HONG KONG</span>
              <span class="c-st text-left">* This contract is governed by the laws of HKSAR.</span>
              <span class="c-st text-left">Our bank details for payment by tt of by Cheque/Bank draft .:</span>
              <table>
                <tbody>
                  <tr>
                    <td><b>BENEFICIARY BANK : </b></td>
                    <td>`+ invoice.bank.name + `</td>
                  </tr>
                  <tr>
                    <td><b>BANK CODE : </b></td>
                    <td>`+ invoice.bank.code + `</td>
                  </tr>
                  <tr>
                    <td><b>ADDRESS :</b></td>
                    <td>`+ invoice.bank.address + `</td>
                  </tr>
                  <tr>
                    <td><b>ACCOUNT NAME :</b></td>
                    <td>`+ invoice.bank.accountName + `</td>
                  </tr>
                  <tr>
                    <td><b>A/C NO :</b></td>
                    <td>`+ invoice.bank.acNo + `</td>
                  </tr>
                  <tr>
                    <td><b>SWIFT CODE :</b></td>
                    <td>`+ invoice.bank.swiftCode + `</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="w-50 p-2">
              <table>
                <tbody>
                  <tr>
                    <td><b>Payment Received Date .: </b></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><b>Cash / Bank .:</b></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td><b>HKD $ / USD $ .:</b></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="body-f-mid">
            <div class="body-f-left">
              <span class="c-st di">FOR , DiaMart (HK) LTD</span>
              <div class="ch-sig">
              <img src="http://27.109.6.22:5205/billimage/diamarthk2.png">              
              <span>Authorized Signature(S)</span>
              </div>
            </div>
            <div class="body-f-right">
              <span class="c-st di">Purchaser For and on behalf of</span>
              <div class="ch-sig">
              <span>&nbsp</span>
              <span>&nbsp</span>
              <span>&nbsp</span>   
              <span>Chop & Signature</span>
              </div>
            </div>
          </div>

          <div class="body-f-footer">
            <span>
            *The diamonds herein invoiced have been purchased from legitimate sources not invoived in funding conflict and in compliance with united nations resolution. The seller hereby Guarantees that these diamonds are conflict free base on personal knowledge and/or written guarantees provided by the supplier of these diamonds.
            </span>

            <p>* The ownership of the goods set out in this invoice will not pass until payment in full of the purchase price. Before then, the purchaser holds the goods as a bailee and must return the goods immediately to the seller upon demand and shall store them separately and in a manner to enable them to be identified. Until such goods are returned to us and actually received by us, they are at your risk from all hazards. Until such time as title in the goods has passed to the purchaser, the seller shall be entitled to seek a court order against the purchaser for delivery up of the goods and/or an injunction to prevent the purchaser from dealing or otherwise disposing of the goods.</p>

          </div>
        </div>
      </div>
    </div>`

      if (invoice.invoiceItems.length > 23) {
        htmlString += `
      <div class="body-middle">
      <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>SHAPE</th>
          <th>CARATS</th>
          <th>COLOR</th>
          <th>CLARITY</th>
          <th>CERTI. NO</th>          
          <th>RATE `+ invoice.currencyType + ` PER CT</th>
          <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
        </thead>
        <tbody>`

        for (let index = 0; index <= invoice.invoiceItems.length; index++) {
          let obj = invoice.invoiceItems[index];
          if (obj) {
            htmlString += `
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.inventoryItem.stoneId + `</td>
                <td>`+ obj.inventoryItem.shape + `</td>
                <td>`+ obj.inventoryItem.weight + `</td>
                <td>`+ obj.inventoryItem.color + `</td>
                <td>`+ obj.inventoryItem.clarity + `</td>
                <td>`+ obj.inventoryItem.certificateNo + `</td>
                <td>`+ obj.invoicePrice.perCarat + `</td>
                <td>`+ obj.invoicePrice.netAmount + `</td>
                </tr>`
          }
        }

        htmlString += `
        </tbody>
        <tfoot>
                <tr>
                  <td colspan="3">Grand Total Amount</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                  <td colspan="3">&nbsp</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusShip ?? 0) + `</td>
                </tr>
                <tr>
                  <td colspan="3">`+ invoice.currencyType + ` @ ` + invoice.currencyRate + `</td>
                  <td colspan="6"></td>              
                </tr>
        </tfoot>
        </table>
        </div>`
      }

      htmlString += `
    </body>
    </html>
    `;
    }

    /*///////////////////////////////////////////////////////////////*/

    else if (invoice.invoiceType == "DIAMARTOVERSEAS") {
      htmlString += `
  <body onload="window.print(); window.close();">
    <!-- Print Chalan for DI Start -->
    <div class="chal-wrap con-inv di-inv">

      <div class="chal-head">
        <div class="logo">
          <img src="http://27.109.6.22:5205/billimage/diamarthk1.png" alt="logo">
        </div>        
      </div>

      <div class="chal-body">
      <span class="c-st border-left-2 border-right-2 border-bottom-2"> INVOICE </span>        
        <div class="body-top pl-1 border-bottom-0">

        <div class="bo-left w-50">
        <span class="c-st text-left">Exporter:</span>
        <img src="http://27.109.6.22:5205/billimage/diamarthk4.png" alt="logo">
        <span>Rm. 1104 11/FL., Chevalier House,</span>
        <span>45-51 Chatham Road South,</span>
        <span>Tsim Sha Tsui. Kowloon.</span>
        <span>Hongkong.</span>
        <span>Email.:sales@diamarthk.com</span>
        <span>TEL: 2330 7799</span>
        <span>FAX: 2330 7755</span>
        </div>

          <div class="bo-right w-50">
          <table>
            <tbody>
              <tr>
                <td><b>INVOICE NO.</b></td>
                <td>` + invoice.invoiceNo + `</td>
              </tr>
              <tr>
                <td><b>DATE:</b></td>
                <td>` + this.utilityService.getValidDateWithFormate(invoice.createdDate) + `</td>
              </tr>
              <tr>
                <td><b>TERMS:</b></td>
                <td>` + invoice.terms + `</td>
              </tr>
              <tr>
                <td colspan="2"><b>BUYER (IF OTHER THAN CONSIGNEE)</b></td>
              </tr>
              <tr>
                <td>` + invoice.party.name + `(` + invoice.party.contactPerson + `</td>
                <td>ORIGIN : INDIA </td>
              </tr>
              <tr>
                <td>` + invoice.party.address.line1 + `</td>`

      if (contain99Down)
        htmlString += `<td>HSCODE : 71023910</td>`
      else
        htmlString += `<td></td>`

      htmlString += `</tr>
                              <tr>
                                <td>` + invoice.party.address.line2 + `</td>`

      if (contain99Up)
        htmlString += `<td>HSCODE : 71023920</td>`
      else
        htmlString += `<td></td>`

      htmlString += `</tr>
              <tr>
                <td colspan="2">` + invoice.party.address.city + `,` + invoice.party.address.state + `,` + invoice.party.address.country + `, ZipCode : ` + invoice.party.address.zipCode + `</td>
              </tr>
              <tr>
                <td colspan="2">TEL: ` + invoice.party.mobileNo + `,` + invoice.party.phoneNo + `, FAX: ` + invoice.party.faxNo + `,VAT : ` + invoice.party.incomeTaxNo + `,` + invoice.party.taxNo + `</td>
              </tr>
            </tbody>
          </table>
        </div>

        </div>
        <div class="body-middle">
          `

      if (invoice.invoiceItems.length < 34) {

        htmlString += `
        <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ invoice.currencyType + ` PER CT</th>
          <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
        </thead>
        <tbody>`

        for (let index = 0; index <= invoice.invoiceItems.length; index++) {
          let obj = invoice.invoiceItems[index];
          if (obj) {
            htmlString += `            
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.inventoryItem.stoneId + `</td>
                <td>`+ obj.inventoryItem.shape + `-` + obj.inventoryItem.color + `-` + obj.inventoryItem.clarity + `-` + obj.inventoryItem.certificateNo + `</td>
                <td>1</td>
                <td>`+ obj.inventoryItem.weight + `</td>
                <td>`+ obj.invoicePrice.perCarat + `</td>
                <td>`+ obj.invoicePrice.netAmount + `</td>
                </tr>`
          }
        }
        for (let index = invoice.invoiceItems.length; index <= 33; index++) {
          htmlString += `
                <tr>
                <td>&nbsp</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`
        }
      }

      else {
        htmlString += `
        <table>
        <thead>
          <th>No</th>         
          <th colspan="2">DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ invoice.currencyType + ` PER CT</th>
          <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
        </thead>
        <tbody>
                <tr>      
                <td></td>          
                <td colspan="2">CUT & POLISH DIAMONDS</td>                
                <td> `+ invoice.invoiceItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
                <td>`+ invoice.invoicePrice.netAmount + `</td>
                </tr>`

        htmlString += `
                <tr>         
                <td></td>       
                <td colspan="2">AS PER PACKING LIST</td>               
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`

        for (let index = 3; index <= 33; index++) {
          htmlString += `
                <tr>
                <td>&nbsp</td>                
                <td colspan="2"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`
        }
      }

      if (invoice.shippingCharge > 0) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right" >Shipping Charge : </td>       
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.shippingCharge ?? 0) + `</td>
                </tr>`
      }

      htmlString += `                        
            </tbody>
            <tfoot>
            <tr>
              <td colspan="3">Grand Total</td>
              <td>`+ invoice.invoiceItems.length + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusShip ?? 0) + `</td>
            </tr>
            <tr>
              <td colspan="5"></td>
              <td>`+ invoice.currencyType + ` @ ` + invoice.currencyRate + `</td>
              <td></td>
            </tr>
            <tr>
            <td colspan="7" class="text-left pl-1">"The diamonds herein invoiced have been purchased from
              legitimate sources not involved in funding conflict and in compliance with United Nations
              Resolution. The Seller hereby guarantees that these diamonds are conflicts free, based on
              personal knowledge and/or written guarantees provided by the supplier of these diamond."</td>
            </tr>


            <!-- Commented
            <tr>
              <td colspan="2" class="text-left pl-1">Amount in Words:</td>
              <td colspan="4" class="text-left pl-1">FIVE HUNDRED FIFTY SIX THOUSAND FIFTY THREE & CENT FORTY
              SEVEN ONLY.</td>
            </tr>-->

            </tfoot>
          </table>
        </div>
        <div class="body-fotter">  
            <div class="body-top border-top-0 pl-1">
            <div class="bo-left w-50">
              <span class="c-st text-left">Bankers:</span>
              <table>
                <tbody>
                <tr>
                <td><b>BENEFICIARY BANK : </b></td>
                <td>`+ invoice.bank.name + `</td>
              </tr>
              <tr>
                <td><b>BANK CODE : </b></td>
                <td>`+ invoice.bank.code + `</td>
              </tr>
              <tr>
                <td><b>ADDRESS :</b></td>
                <td>`+ invoice.bank.address + `</td>
              </tr>
              <tr>
                <td><b>ACCOUNT NAME :</b></td>
                <td>`+ invoice.bank.accountName + `</td>
              </tr>
              <tr>
                <td><b>A/C NO :</b></td>
                <td>`+ invoice.bank.acNo + `</td>
              </tr>
              <tr>
                <td><b>SWIFT CODE :</b></td>
                <td>`+ invoice.bank.swiftCode + `</td>
              </tr>
                </tbody>
              </table>
            </div>
            <div class="bo-right w-50 p-2">
              <span class="c-st text-left">Signature & Date:</span>
              <img src="http://27.109.6.22:5205/billimage/diamarthk4.png" alt="logo">
            </div>
          </div>

          </div>
        </div>
      </div>
    </div>`

      if (invoice.invoiceItems.length > 34) {
        htmlString += `
      <div class="body-middle">
      <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>SHAPE</th>
          <th>CARATS</th>
          <th>COLOR</th>
          <th>CLARITY</th>
          <th>CERTI. NO</th>          
          <th>RATE `+ invoice.currencyType + ` PER CT</th>
          <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
        </thead>
        <tbody>`

        for (let index = 0; index <= invoice.invoiceItems.length; index++) {
          let obj = invoice.invoiceItems[index];
          if (obj) {
            htmlString += `
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.inventoryItem.stoneId + `</td>
                <td>`+ obj.inventoryItem.shape + `</td>
                <td>`+ obj.inventoryItem.weight + `</td>
                <td>`+ obj.inventoryItem.color + `</td>
                <td>`+ obj.inventoryItem.clarity + `</td>
                <td>`+ obj.inventoryItem.certificateNo + `</td>
                <td>`+ obj.invoicePrice.perCarat + `</td>
                <td>`+ obj.invoicePrice.netAmount + `</td>
                </tr>`
          }
        }

        htmlString += `
        </tbody>
        <tfoot>
                <tr>
                  <td colspan="3">Grand Total Amount</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                  <td colspan="3">&nbsp</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
                  <td>`+ invoice.invoicePrice.netAmount + `</td>
                </tr>
                <tr>
                  <td colspan="3">`+ invoice.currencyType + ` @ ` + invoice.currencyRate + `</td>
                  <td colspan="6"></td>              
                </tr>
        </tfoot>
        </table>
        </div>`
      }

      htmlString += `
    </body>
    </html>
    `;
    }

    /*///////////////////////////////////////////////////////////////*/

    else if (invoice.invoiceType == "CGLOCAL") {
      htmlString += `    
  <body onload="window.print(); window.close();">
    <!-- Print Chalan for DI Start -->
    <div class="chal-wrap con-inv di-inv">
      <div class="chal-head">
        <div class="logo">
          <img src="http://27.109.6.22:5205/billimage/CG1.png" alt="logo">
        </div>
        <div class="di-info">
        <span>Rough & Polished Diamonds - Import & Export</span>
          <span>Hoveniersstraat 30, Office 625, Box 196, 2018 Antwerp,  Belgium.</span>
          <span>Office: +32 3.231.23.35 | Fax: +32 3 231.23.31 | G.sm: +32 4 88.70.55.75</span>
          <span>Email: sales@chintangems.com</span>
        </div>
        <div class="cd-details">
            <p><b>VAT BE: -0478.554.943</b></p>
            <p><b>HRAnt: -351.856</b></p>
		    </div>
      </div>
      <div class="chal-body">
        <span class="c-st border-left-2 border-right-2">DELIVERY INVOICE</span>
        <div class="body-top pl-1 border-bottom-0">
          <div class="bo-left w-50">
          <span class="c-st text-left"><b>Buyer</b>` + `: ` + invoice.party.name + `(` + invoice.party.contactPerson + `)</span>
          <span><b>Address</b>` + `: ` + invoice.party.address.line1 + `</span> 
          <span><b></b> ` + invoice.party.address.line2 + `</span>            
          <span><b></b> ` + invoice.party.address.city + `,` + invoice.party.address.zipCode + `</span>   
          <span><b></b> ` + invoice.party.address.state + `,` + invoice.party.address.country + `</span>                       
          <span><b>Email</b>` + `: ` + invoice.party.email + `</span>
          <span><b>TEL</b>` + `: ` + invoice.party.mobileNo + ` , ` + invoice.party.phoneNo + `</span>  
          <span><b>FAX</b>` + `: ` + invoice.party.faxNo + `</span>
          <span><b></b>` + invoice.party.incomeTaxNo + `   ` + invoice.party.taxNo + `</span>         
          </div>
          <div class="di-bor-0">
            <table>
              <tbody>
                <tr>
                  <td><b>INVOICE NO.</b></td>
                  <td>: ` + invoice.invoiceNo + `</td>
                </tr>
                <tr>
                  <td><b>DATE</b></td>
                  <td>: ` + this.utilityService.getValidDateWithFormate(invoice.createdDate) + `</td>
                </tr>
                <tr>
                  <td><b>TERMS</b></td>
                  <td>: ` + invoice.terms + `</td>
                </tr>
                <tr>
                  <td><b>Due Date</b></td>
                  <td>: ` + this.utilityService.getValidDateWithFormate(invoice.dueDate) + `</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="body-middle">
          <table>
            <thead>
              <th>No</th>                       
              <th>DESCRIPTION</th>
              <th>PCS</th>
              <th>CARATS</th>
              <th>RATE `+ invoice.currencyType + ` PER CT</th>
              <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
            </thead>
            <tbody>`


      htmlString += `
                <tr>
                <td></td>
                <td>CUT & POLISH DIAMONDS</td>                
                <td>`+ invoice.invoiceItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
                <td>`+ invoice.invoicePrice.netAmount + `</td>
                </tr>`

      htmlString += `
                <tr>
                <td></td>
                <td>AS PER PACKING LIST</td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`

      for (let index = 3; index <= 18; index++) {
        htmlString += `
                <tr>
                <td>&nbsp</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`
      }      

      if (invoice.shippingCharge > 0) {
        htmlString += `
                <tr>
                <td colspan="5" style="text-align:right" >Shipping Charge : </td>       
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.shippingCharge ?? 0) + `</td>
                </tr>`
      }
      if (invoice.taxPerOne) {
        htmlString += `
                <tr>
                <td colspan="5" style="text-align:right; padding-right:10px;" >`+ invoice.taxNameOne + ` ( ` + invoice.taxPerOne + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((invoice.taxPerOne * (invoice.invoicePrice.netAmount ?? 0)) / 100) + `</td>
                </tr>`
      }
      if (invoice.taxPerTwo) {
        htmlString += `
                <tr>
                <td colspan="5" style="text-align:right; padding-right:10px;" >`+ invoice.taxNameTwo + ` ( ` + invoice.taxPerTwo + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((invoice.taxPerTwo * (invoice.invoicePrice.netAmount ?? 0)) / 100) + `</td>
                </tr>`
      }

      htmlString += `                        
            </tbody>
            <tfoot>
            <tr>
              <td colspan="2">Grand Total </td>
              <td>`+ invoice.invoiceItems.length + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusShip ?? 0) + ` ( ` + invoice.currencyType + ` )</td>
            </tr>
            <tr>
              <td colspan="4"></td> 
             
              <td>1 `+ invoice.convCurrencyType + ` = ` + this.utilityService.ConvertToFloatWithFourDecimal(invoice.currencyRate / invoice.convCurrencyRate) + ` ` + invoice.currencyType + `</td>
              
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumConvGrandTotalPlusShip ?? 0) + ` ( ` + invoice.convCurrencyType + ` )</td>
            </tr>


            <!-- Commented
            <tr>
              <td colspan="2" class="text-left pl-1">Amount in Words:</td>
              <td colspan="4" class="text-left pl-1">FIVE HUNDRED FIFTY SIX THOUSAND FIFTY THREE & CENT FORTY
              SEVEN ONLY.</td>
            </tr>-->

            </tfoot>
          </table>
        </div>
        <div class="body-fotter">
        <div class="body-top border-top-0 border-bottom-0">
        <div class="bo-left w-70 border-right-2 border-bottom-2 pl-1">       
              <span class="c-st text-left">Payment instructions:</span>
              <table>
                <tbody>
                  <tr>
                    <td><b>BANK : </b></td>
                    <td>`+ invoice.bank.name + `</td>
                  </tr>
                  <tr>
                    <td><b>IBAN NO : </b></td>
                    <td>`+ invoice.bank.code + `</td>
                  </tr>
                  <tr>
                    <td><b>ADDRESS :</b></td>
                    <td>`+ invoice.bank.address + `</td>
                  </tr>
                  <tr>
                    <td><b>ACCOUNT NAME :</b></td>
                    <td>`+ invoice.bank.accountName + `</td>
                  </tr>
                  <tr>
                    <td><b>A/C NO :</b></td>
                    <td>`+ invoice.bank.acNo + `</td>
                  </tr>
                  <tr>
                    <td><b>SWIFT CODE :</b></td>
                    <td>`+ invoice.bank.swiftCode + `</td>
                  </tr>
                  <tr>`

      if (invoice.bank.intermediate) {
        htmlString += `
                  <td><b>INTERMEDIATE :</b></td>
                  <td>`+ invoice.bank.intermediate + `</td>
                  </tr>
                  <tr>
                  <td><b>INTERMEDIATE BANK SWIFT CODE : </b></td>
                  <td>`+ invoice.bank.intermediateSwiftCode + `</td>
                  </tr>
                  `
      }

      htmlString += `
                </tbody>
              </table>
            </div>
            <div class="w-30 p-2 border-bottom-2">
           <div>
           <span>&nbsp</span>
              <div class="ch-sig">
              <span>&nbsp</span>
              <span>&nbsp</span>
              <span>&nbsp</span>   
              <span>&nbsp</span>
              <span>&nbsp</span>
              <span>&nbsp</span>  
              <span>Date & Signature</span>
              </div>
            </div>
            </div>
          </div>

          <div class="body-f-footer">
          <span class="c-st border-bottom-2">GUIDELINES</span>
               <ul>
      <li>Bank Charges On Buyer Only : Payment Must Include All Bank Charges (Including Intermediatary Bank Charges) </li>
      <li>ONLY US$ PAYMENT : Buyer have to pay in USD($) only, As we have USD($) account in related Bank. We will be not
        responsible for payments made in any other currencies.</li>
      <li>This sale is done with retention of title. The buyer will only become owner of the goods after full payment of
        this
        invoice. The buyer acknowledged that this invoice is pledged to ` + invoice.bank.name + ` and that releases can
        only be obtained through payment on the account of the seller at ` + invoice.bank.name + ` as mentioned on this
        invoice. This invoice may never be compensated with claims from the buyer on the seller.</li>
      <li>The diamonds here in invoiced are exclusively of natural origin and untreated based on personal knowledge and/or
        written guarantees provided by the supplier of these diamonds.</li>
      <li>The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and in
        compliance with United Nation resolutions. The seller hereby guarantees that these diamonds are conflict free, based
        on personal knowledge and/or written guarantees provided by the supplier of these diamonds. </li>
      
        <b style="text-decoration: underline;">H.R.A 351 856, BTW BE 0478 554 943 </b>
      
        <li>The Antwerp Tribunal of Commerce is solely competent in case of litigation Vrij
        van B.T.W. Art. 42 van het
        Wetboek.Above mentioned good will be consignment until receipt of the payment of this invoice</li>
    </ul>
              </div>

        </div>
      </div>
    </div>

      <div class="body-middle">
      <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>SHAPE</th>
          <th>CARATS</th>
          <th>COLOR</th>
          <th>CLARITY</th>
          <th>CERTI. NO</th>     
          <th>RAP `+ invoice.currencyType + `</th>
          <th>DISC %</th>           
          <th>RATE `+ invoice.currencyType + ` PER CT</th>
          <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
        </thead>
        <tbody>`

      for (let index = 0; index <= invoice.invoiceItems.length; index++) {
        let obj = invoice.invoiceItems[index];
        if (obj) {
          htmlString += `
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.inventoryItem.stoneId + `</td>
                <td>`+ obj.inventoryItem.shape + `</td>
                <td>`+ obj.inventoryItem.weight + `</td>
                <td>`+ obj.inventoryItem.color + `</td>
                <td>`+ obj.inventoryItem.clarity + `</td>
                <td>`+ obj.inventoryItem.certificateNo + `</td>
                <td>`+ obj.invoicePrice.rap + `</td>
                <td>`+ obj.invoicePrice.discount + `</td>
                <td>`+ obj.invoicePrice.perCarat + `</td>
                <td>`+ obj.invoicePrice.netAmount + `</td>
                </tr>`
        }
      }

      htmlString += `
    </body>
    </html>
    `;
    }

    /*///////////////////////////////////////////////////////////////*/

    else if (invoice.invoiceType == "CGOVERSEAS") {
      htmlString += `    
  <body onload="window.print(); window.close();">
    <!-- Print Chalan for DI Start -->
    <div class="chal-wrap con-inv di-inv">
      <div class="chal-head">
        <div class="logo">
          <img src="http://27.109.6.22:5205/billimage/CG1.png" alt="logo">
        </div>
        <div class="di-info">
        <span>Rough & Polished Diamonds - Import & Export</span>
          <span>Hoveniersstraat 30, Office 625, Box 196, 2018 Antwerp,  Belgium.</span>
          <span>Office: +32 3.231.23.35 | Fax: +32 3 231.23.31 | G.sm: +32 4 88.70.55.75</span>
          <span>Email: sales@chintangems.com</span>
        </div>
        <div class="cd-details">
            <p><b>VAT BE: -0478.554.943</b></p>
            <p><b>HRAnt: -351.856</b></p>
		    </div>
      </div>
      <div class="chal-body">
        <span class="c-st border-left-2 border-right-2">EXPORT INVOICE</span>
        <div class="body-top pl-1 border-bottom-0">
          <div class="bo-left w-50">
          <span class="c-st text-left"><b>Buyer</b>` + `: ` + invoice.party.name + `(` + invoice.party.contactPerson + `)</span>
          <span><b>Address</b>` + `: ` + invoice.party.address.line1 + `</span> 
          <span><b></b> ` + invoice.party.address.line2 + `</span>            
          <span><b></b> ` + invoice.party.address.city + `,` + invoice.party.address.zipCode + `</span>   
          <span><b></b> ` + invoice.party.address.state + `,` + invoice.party.address.country + `</span>                       
          <span><b>Email</b>` + `: ` + invoice.party.email + `</span>
          <span><b>TEL</b>` + `: ` + invoice.party.mobileNo + ` , ` + invoice.party.phoneNo + `</span>  
          <span><b>FAX</b>` + `: ` + invoice.party.faxNo + `</span>
          <span><b></b>` + invoice.party.incomeTaxNo + `   ` + invoice.party.taxNo + `</span> 
          </div>
          <div class="di-bor-0">
            <table>
              <tbody>
                <tr>
                  <td><b>INVOICE NO.</b></td>
                  <td>: ` + invoice.invoiceNo + `</td>
                </tr>
                <tr>
                  <td><b>DATE</b></td>
                  <td>: ` + this.utilityService.getValidDateWithFormate(invoice.createdDate) + `</td>
                </tr>
                <tr>
                  <td><b>TERMS</b></td>
                  <td>: ` + invoice.terms + `</td>
                </tr>
                <tr>
                  <td><b>Due Date</b></td>
                  <td>: ` + this.utilityService.getValidDateWithFormate(invoice.dueDate) + `</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`

      if (invoice.invoiceItems.length < 16) {

        htmlString += `
        <div class="body-middle">
          <table>
          <thead>
            <th>No</th>
            <th>STONE ID</th>
            <th>DESCRIPTION</th>
            <th>PCS</th>
            <th>CARATS</th>
            <th>RATE `+ invoice.currencyType + ` PER CT</th>
            <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
          </thead>
          <tbody>`

        for (let index = 0; index <= invoice.invoiceItems.length; index++) {
          let obj = invoice.invoiceItems[index];
          if (obj) {
            htmlString += `            
                  <tr>
                  <td>`+ (index + 1) + `</td>
                  <td>`+ obj.inventoryItem.stoneId + `</td>
                  <td>`+ obj.inventoryItem.shape + `-` + obj.inventoryItem.color + `-` + obj.inventoryItem.clarity + `-` + obj.inventoryItem.certificateNo + `</td>
                  <td>1</td>
                  <td>`+ obj.inventoryItem.weight + `</td>
                  <td>`+ obj.invoicePrice.perCarat + `</td>
                  <td>`+ obj.invoicePrice.netAmount + `</td>
                  </tr>`
          }
        }
        for (let index = invoice.invoiceItems.length; index <= 20; index++) {
          htmlString += `
                  <tr>
                  <td>&nbsp</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  </tr>`
        }
      }

      else {
        htmlString += `
        <div class="body-middle">
          <table>
            <thead>
              <th>No</th>                       
              <th colspan="2">DESCRIPTION</th>
              <th>PCS</th>
              <th>CARATS</th>
              <th>RATE `+ invoice.currencyType + ` PER CT</th>
              <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
            </thead>
            <tbody>`


        htmlString += `
                <tr>
                <td></td>
                <td colspan="2">CUT & POLISH DIAMONDS</td>                
                <td>`+ invoice.invoiceItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
                <td>`+ invoice.invoicePrice.netAmount + `</td>
                </tr>`

        htmlString += `
                <tr>
                <td></td>
                <td colspan="2">AS PER PACKING LIST</td>                
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`

        for (let index = 3; index <= 15; index++) {
          htmlString += `
                <tr>
                <td>&nbsp</td>
                <td colspan="2"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`
        }
      }

      if (invoice.shippingCharge > 0) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >Shipping Charge</td> 
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.shippingCharge ?? 0) + `</td>
                </tr>`
      }
      if (invoice.taxPerOne) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ invoice.taxNameOne + ` ( ` + invoice.taxPerOne + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((invoice.taxPerOne * (invoice.invoicePrice.netAmount ?? 0)) / 100) + `</td>
                </tr>`
      }
      if (invoice.taxPerTwo) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ invoice.taxNameTwo + ` ( ` + invoice.taxPerTwo + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((invoice.taxPerTwo * (invoice.invoicePrice.netAmount ?? 0)) / 100) + `</td>
                </tr>`
      }

      htmlString += `                        
            </tbody>
            <tfoot>
            <tr>
              <td colspan="3">Grand Total </td>
              <td>`+ invoice.invoiceItems.length + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(invoice.invoicePrice.perCarat ?? 0) + `</td>
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusShip ?? 0) + ` ( ` + invoice.currencyType + ` )</td>
            </tr>
            <tr>
              <td colspan="5"></td>              
              <td>1 `+ invoice.convCurrencyType + ` = ` + this.utilityService.ConvertToFloatWithFourDecimal(invoice.currencyRate / invoice.convCurrencyRate) + ` ` + invoice.currencyType + `</td>              
              <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumConvGrandTotalPlusShip ?? 0) + ` ( ` + invoice.convCurrencyType + ` )</td>
            </tr>             
            </tfoot>
          </table>
          </div>
        
        <div class="body-fotter">
        <div class="body-top border-top-0 border-bottom-0">
        <div class="bo-left w-70 border-right-2 border-bottom-2 pl-1">       
              <span class="c-st text-left">Payment instructions:</span>
              <table>
                <tbody>
                  <tr>
                    <td><b>BANK : </b></td>
                    <td>`+ invoice.bank.name + `</td>
                  </tr>
                  <tr>
                    <td><b>IBAN NO : </b></td>
                    <td>`+ invoice.bank.code + `</td>
                  </tr>
                  <tr>
                    <td><b>ADDRESS :</b></td>
                    <td>`+ invoice.bank.address + `</td>
                  </tr>
                  <tr>
                    <td><b>ACCOUNT NAME :</b></td>
                    <td>`+ invoice.bank.accountName + `</td>
                  </tr>
                  <tr>
                    <td><b>A/C NO :</b></td>
                    <td>`+ invoice.bank.acNo + `</td>
                  </tr>
                  <tr>
                    <td><b>SWIFT CODE :</b></td>
                    <td>`+ invoice.bank.swiftCode + `</td>
                  </tr>
                  <tr>`

      if (invoice.bank.intermediate) {
        htmlString += `
                  <td><b>INTERMEDIATE :</b></td>
                  <td>`+ invoice.bank.intermediate + `</td>
                  </tr>
                  <tr>
                  <td><b>INTERMEDIATE BANK SWIFT CODE : </b></td>
                  <td>`+ invoice.bank.intermediateSwiftCode + `</td>
                  </tr>
                  `
      }

      htmlString += `
                </tbody>
              </table>
            </div>
            <div class="w-30 p-2 border-bottom-2">
           <div>
              <span>&nbsp</span>
              <div class="ch-sig">
              <span>&nbsp</span>
              <span>&nbsp</span>
              <span>&nbsp</span>   
              <span>&nbsp</span>
              <span>&nbsp</span>
              <span>&nbsp</span>  
              <span>Date & Signature</span>
              </div>
            </div>
            </div>
          </div>
          `

      htmlString += ` 
          <div class="body-middle">           
          <table>          
          <tr>
            <td><b>CIF : </b>`+ invoice.cif + `</td>
            <td><b>PORT : </b>`+ invoice.cif + `</td>
            <td><b>SHIPPED VIA : </b>`+ invoice.logistic.name + `</td>
            <td><b>INSURED BY : </b>`+ invoice.logistic.name + `</td>
          </tr>             
          </tfoot>
        </table>
        </div> 

          <div class="body-f-footer">
          <span class="c-st border-bottom-2">GUIDELINES</span>
               <ul>
      <li>Bank Charges On Buyer Only : Payment Must Include All Bank Charges (Including Intermediatary Bank Charges) </li>
      <li>ONLY US$ PAYMENT : Buyer have to pay in USD($) only, As we have USD($) account in related Bank. We will be not
        responsible for payments made in any other currencies.</li>
      <li>This sale is done with retention of title. The buyer will only become owner of the goods after full payment of
        this
        invoice. The buyer acknowledged that this invoice is pledged to ` + invoice.bank.name + ` and that releases can
        only be obtained through payment on the account of the seller at ` + invoice.bank.name + ` as mentioned on this
        invoice. This invoice may never be compensated with claims from the buyer on the seller.</li>
      <li>The diamonds here in invoiced are exclusively of natural origin and untreated based on personal knowledge and/or
        written guarantees provided by the supplier of these diamonds.</li>
      <li>The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and in
        compliance with United Nation resolutions. The seller hereby guarantees that these diamonds are conflict free, based
        on personal knowledge and/or written guarantees provided by the supplier of these diamonds. </li>
      
        <b style="text-decoration: underline;">H.R.A 351 856, BTW BE 0478 554 943 </b>
      
        <li>The Antwerp Tribunal of Commerce is solely competent in case of litigation Vrij
        van B.T.W. Art. 42 van het
        Wetboek.Above mentioned good will be consignment until receipt of the payment of this invoice </li>
    </ul>
              </div>
              </div>
        </div>
      </div>
    </div>
    `

      if (invoice.invoiceItems.length > 15) {
        htmlString += `
      <div class="body-middle">
      <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>SHAPE</th>
          <th>CARATS</th>
          <th>COLOR</th>
          <th>CLARITY</th>
          <th>CERTI. NO</th>     
          <th>RAP `+ invoice.currencyType + `</th>
          <th>DISC %</th>           
          <th>RATE `+ invoice.currencyType + ` PER CT</th>
          <th>TOTAL AMOUNT `+ invoice.currencyType + `</th>
        </thead>
        <tbody>`

        for (let index = 0; index <= invoice.invoiceItems.length; index++) {
          let obj = invoice.invoiceItems[index];
          if (obj) {
            htmlString += `
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.inventoryItem.stoneId + `</td>
                <td>`+ obj.inventoryItem.shape + `</td>
                <td>`+ obj.inventoryItem.weight + `</td>
                <td>`+ obj.inventoryItem.color + `</td>
                <td>`+ obj.inventoryItem.clarity + `</td>
                <td>`+ obj.inventoryItem.certificateNo + `</td>
                <td>`+ obj.invoicePrice.rap + `</td>
                <td>`+ obj.invoicePrice.discount + `</td>
                <td>`+ obj.invoicePrice.perCarat + `</td>
                <td>`+ obj.invoicePrice.netAmount + `</td>
                </tr>`
          }
        }
      }

      htmlString += `
    </body>
    </html>
    `;
    }

    return htmlString;    
  }
}