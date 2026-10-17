import { Injectable } from '@angular/core';
import { UtilityService } from 'shared/services';
import { Memo } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class PrintMemoFormat {
  constructor(
    public utilityService: UtilityService
  ) { }

  public getMemoPrint(memoObj: Memo) {
    var htmlString: string = "";
    var memoType: string = "";
    let sumWeight = 0;
    var taxNameOne: string = "";
    var taxPerOne: number = 0;
    var taxNameTwo: string = "";
    var taxPerTwo: number = 0;
    let sumGrandTotalPlusTax = memoObj.totalAmount ?? 0;
    let sumConvGrandTotalPlusTax = 0;

    for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
      let obj = memoObj.inventoryItems[index];
      if (obj) {
        sumWeight += obj.weight;
      }
    }
    if (memoObj.taxTypes.length > 0) {
      if (memoObj.taxTypes.length = 2) {
        taxNameOne = memoObj.taxTypes[0].name;
        taxPerOne = memoObj.taxTypes[0].rate;
        taxNameTwo = memoObj.taxTypes[1].name;
        taxPerTwo = memoObj.taxTypes[1].rate;
      }
      if (memoObj.taxTypes.length = 1) {
        taxNameOne = memoObj.taxTypes[0].name;
        taxPerOne = memoObj.taxTypes[0].rate;
      }
    }

    if (memoObj.shippingCharge > 0)
      sumGrandTotalPlusTax += memoObj.shippingCharge ?? 0;

    if (taxPerOne > 0)
      sumGrandTotalPlusTax += this.utilityService.ConvertToFloatWithTwoDecimal((taxPerOne * (memoObj.totalAmount ?? 0)) / 100);

    if (taxPerTwo > 0)
      sumGrandTotalPlusTax += this.utilityService.ConvertToFloatWithTwoDecimal((taxPerTwo * (memoObj.totalAmount ?? 0)) / 100);

    sumConvGrandTotalPlusTax = sumGrandTotalPlusTax * (memoObj.toCurRate ?? 1)


    if (memoObj.organization.address?.country.toLowerCase() == 'india') {
      if (memoObj.organization.address?.country.toLowerCase() == memoObj.party.address.country.toLowerCase())
        memoType = 'INDIALOCAL';
      else
        memoType = 'INDIAOVERSEAS';
    }
    else if (memoObj.organization.address?.country.toLowerCase() == 'hong kong') {
      if (memoObj.organization.address?.country.toLowerCase() == memoObj.party.address.country.toLowerCase())
        memoType = 'HKLOCAL';
      else
        memoType = 'HKOVERSEAS';
    }
    else if (memoObj.organization.address?.country.toLowerCase() == 'belgium') {
      if (memoObj.organization.address?.country.toLowerCase() == memoObj.party.address.country.toLowerCase())
        memoType = 'BELGIUMLOCAL';
      else
        memoType = 'BELGIUMOVERSEAS';
    }




    if (memoType == "INDIALOCAL") {
      htmlString += `  
      <body onload="window.print(); window.close();">       
        <div class="chal-wrap con-inv di-inv">
          <div class="chal-head">
            <div class="logo">
              <img src="http://27.109.6.22:5205/billimage/Glowstar.png" alt="logo">
            </div>
            <div class="di-info">
            <span>` + memoObj.organization.address?.line1 + `,` + memoObj.organization.address?.line2 + `</span>            
            <span>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</span> 
            <span>Email: ` + memoObj.organization.email + `</span>
            <span>GSTIN: ` + memoObj.organization.taxNo + `</span>            

            </div>
            <div class="co-details">
              <table>
                <tbody>
                  <tr>
                    <td><b>Contact No:</b></td>
                    <td><b>` + memoObj.organization.phoneNo + ` </b></td>
                  </tr>
                  <tr>
                    <td><b>Fax:</b></td>
                    <td><b>` + memoObj.organization.faxNo + `</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="chal-body">
            <span class="c-st border-left-2 border-right-2">MEMO - DELIVERY CHALLAN</span>
            <div class="body-top pl-1 border-bottom-0">
              <div class="bo-left w-50">
                <span class="c-st text-left">To.: ` + memoObj.party.name + `</span>
                <span>` + memoObj.party.address.line1 + `,` + memoObj.party.address.line2 + `</span>            
                <span>` + memoObj.party.address.city + `,` + memoObj.party.address.state + `,` + memoObj.party.address.country + `</span>            
                <span>ZipCode : ` + memoObj.party.address.zipCode + `</span>                
                <span>TEL: ` + memoObj.party.mobileNo + `</span>           
              </div>
              <div class="di-bor-0">
                <table>
                  <tbody>
                    <tr>
                      <td><b>Memo NO.</b></td>
                      <td>` + memoObj.memoNo + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Date:</b></td>
                      <td>` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Expire Days:</b></td>
                      <td>` + memoObj.expiredDays + `</td>
                    </tr>
                    <tr>
                    <td><b>Memo Expire Date:</b></td>
                    <td>` + this.utilityService.getValidDateWithFormate(memoObj.expiredDate) + `</td>                    
                    </tr>
                    <tr>
                      <td><b>Terms:</b></td>
                      <td>` + memoObj.terms + `</td>
                    </tr>
                    <tr>
                      <td><b>Place Of Supply:</b></td>
                      <td>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</td>
                    </tr>                     
                  </tbody>
                </table>
              </div>
            </div>
            <div class="body-middle">
              <table>                
                <tbody>`


      if (memoObj.inventoryItems.length < 22) {

        htmlString += `
        <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>`

        for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
          let obj = memoObj.inventoryItems[index];
          if (obj) {
            htmlString += `            
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.stoneId + `</td>
                <td>`+ obj.shape + `-` + obj.color + `-` + obj.clarity + `-` + obj.certificateNo + `</td>
                <td>1</td>
                <td>`+ obj.weight + `</td>
                <td>`+ obj.price.perCarat + `</td>
                <td>`+ obj.price.netAmount + `</td>
                </tr>`
          }
        }
        for (let index = memoObj.inventoryItems.length; index <= 21; index++) {
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
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>
                <tr>      
                <td></td>          
                <td colspan="2">CUT & POLISH DIAMONDS</td>                
                <td> `+ memoObj.inventoryItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>&nbsp</td>
                <td>`+ memoObj.totalAmount + `</td>
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

        for (let index = 3; index <= 21; index++) {
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

      if (taxPerOne) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ taxNameOne + ` ( ` + taxPerOne + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((taxPerOne * (memoObj.totalAmount ?? 0)) / 100) + `</td>
                </tr>`
      }
      if (taxPerTwo) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ taxNameTwo + ` ( ` + taxPerTwo + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((taxPerTwo * (memoObj.totalAmount ?? 0)) / 100) + `</td>
                </tr>`
      }

      htmlString += `                        
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3">Grand Total </td>
                  <td>`+ memoObj.inventoryItems.length + `</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>          
                  <td>&nbsp</td>    
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusTax ?? 0) + ` (` + memoObj.fromCurrency + `)</td>
                </tr>
 

                <tr>
                <td colspan="5"></td>               
                <td>1 `+ memoObj.fromCurrency + ` = ` + memoObj.toCurRate + ` ` + memoObj.toCurrency + `</td>                
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumConvGrandTotalPlusTax ?? 0) + ` ( ` + memoObj.toCurrency + ` )</td>
                </tr>
    
                </tfoot>
              </table>
            </div>    
              <div class="body-f-footer">
              <span class="c-st border-bottom-2">MEMO OF MERCHANDISE MUST BE REPORTED WITHIN ` + memoObj.expiredDays + ` DAYS</span>
              <span class="c-st border-bottom-2">Terms of Service</span>    
              <ul>                                          
                I HEREBY ACKNOWLEDGE RECEIPT OF THE FOLLOWING GOODS WHICH YOU HAVE ENTRUSTED TO ME AND WHICH CONDITIONS.                
                I HOLD IN TRUST FOR YOU TO THE FOLLOWING PURPOSE AND ON THE FOLLOWING. 
                <li>THE GOODS HAVE BEEN ENTRUSTED TO ME FOR THE SALE PURPOSE BEING SHOW TO INTENDING PURCHASERS OF INSPECTION.</li>
                <li>THE GOODS REMAIN YOUR PROPERTY AND I 
                ACQUIRE NO RIGHT TO PROPERTY OR INTEREST IN THEM TILL A SALE NOTE SIGNED BY YOU IS PASSED OR TILL THE PRICE IS PAID IN RESPECT THERE OF NOT WHITHSTANDING THE FACT THAT MENTION IS MADE OF THE RATE OR PRICE IN THE 
                PARTICULARS OF GOODS HEREIN MENTIONED ON THE REVERSE. </li>
                
                <li>I AGREE NOT TO SELL OR PLEDGE OR MORTGAGE OR HYPOTHECT THE SAID GOODS OR OTHERWISE DEAL WITH THEM IN ANY AMNNER TILL A SALE NOT SIGNED BY YOU IS PASSED OR 
                THE PRICE IS PAID TO YOU. </li>
                
                <li>THE GOODS ARE TO BE RETURNED TO YOU FORTHWITH WHENEVER DEMAND BACK.</li>
                
                <li>THE GOODS WILL BE AT MY RISK IN ALL RESPECT TILL SALE NOTE SIGNED BY YOU IS PASSED IN RESPECT THERE OF OR TILL THE PRICE 
                IS NOT PAID TO YOU FOR THE GOODS ARE RETURNED TO YOU AND I AM RESPONSIBLE TO YOU FOR THE RETURN OF THE SIDE GOODS IN THE SAME CONDITIONS AS I HAVE RECEIVED THE SAME</li>
                
                <li>SUBJECT TO MUMBAI JURISDICTION</li>
                
                </ul>
    
              </div>

              <div class="body-f-mid">
              <div class="body-f-left">
                <span class="c-st">Receiver</span>
                <div class="ch-sig">      
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>    
                <span>Chop & Signature</span>
                </div>
              </div>
              <div class="body-f-right">
                <span class="c-st di">Issue By</span>
                <div class="ch-sig">
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>   
                <span>Chop & Signature</span>
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>`

      if (memoObj.inventoryItems.length > 21) {
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
              <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
              <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
            </thead>
            <tbody>`

        for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
          let obj = memoObj.inventoryItems[index];
          if (obj) {
            htmlString += `
                    <tr>
                    <td>`+ (index + 1) + `</td>
                    <td>`+ obj.stoneId + `</td>
                    <td>`+ obj.shape + `</td>
                    <td>`+ obj.weight + `</td>
                    <td>`+ obj.color + `</td>
                    <td>`+ obj.clarity + `</td>
                    <td>`+ obj.certificateNo + `</td>
                    <td>`+ obj.price.perCarat + `</td>
                    <td>`+ obj.price.netAmount + `</td>
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
                      <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(memoObj.totalAmount ?? 0) + `</td>
                    </tr>
                    <tr>
                      <td colspan="3">`+ memoObj.fromCurrency + ` @ ` + memoObj.fromCurRate + `</td>
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

    else if (memoType == "HKLOCAL") {
      var ratePerCtc: number = 0;
      ratePerCtc = (memoObj.totalAmount ?? 0 / sumWeight);
      htmlString += `  
      <body onload="window.print(); window.close();">       
        <div class="chal-wrap con-inv di-inv">
          <div class="chal-head">
            <div class="logo">
              <img src="http://27.109.6.22:5205/billimage/diamarthk1.png" alt="logo">
            </div>
            <div class="di-info">
            <span>` + memoObj.organization.address?.line1 + `,` + memoObj.organization.address?.line2 + `</span>            
            <span>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</span> 
            <span>Email: ` + memoObj.organization.email + `</span>            
            </div>
            <div class="co-details">
              <table>
                <tbody>
                  <tr>
                    <td><b>Contact No:</b></td>
                    <td>` + memoObj.organization.phoneNo + ` </td>
                  </tr>
                  <tr>
                    <td><b>Fax:</b></td>
                    <td>` + memoObj.organization.faxNo + `</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="chal-body">
            <span class="c-st border-left-2 border-right-2">MEMO - ON APRROVAL</span>
            <div class="body-top pl-1 border-bottom-0">
              <div class="bo-left w-50">
                <span class="c-st text-left">To.: ` + memoObj.party.name + `</span>
                <span>` + memoObj.party.address.line1 + `,` + memoObj.party.address.line2 + `</span>            
                <span>` + memoObj.party.address.city + `,` + memoObj.party.address.state + `,` + memoObj.party.address.country + `</span>            
                <span>ZipCode : ` + memoObj.party.address.zipCode + `</span>                
                <span>TEL: ` + memoObj.party.mobileNo + `</span>           
              </div>
              <div class="di-bor-0">
                <table>
                  <tbody>
                    <tr>
                      <td><b>Memo NO.</b></td>
                      <td>` + memoObj.memoNo + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Date:</b></td>
                      <td>` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Expire Days:</b></td>
                      <td>` + memoObj.expiredDays + `</td>
                    </tr>
                    <tr>
                    <td><b>Memo Expire Date:</b></td>
                    <td>` + this.utilityService.getValidDateWithFormate(memoObj.expiredDate) + `</td>                    
                    </tr>
                    <tr>
                      <td><b>Terms:</b></td>
                      <td>` + memoObj.terms + `</td>
                    </tr>
                    <tr>
                      <td><b>Place Of Supply:</b></td>
                      <td>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</td>
                    </tr>                     
                  </tbody>
                </table>
              </div>
            </div>
            <div class="body-middle">
              <table>                
                <tbody>`

      //HK Local Have Direct PL
      htmlString += `
        <table>
        <thead>
          <th>No</th>         
          <th colspan="2">DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>
                <tr>      
                <td></td>          
                <td colspan="2">CUT & POLISH DIAMONDS</td>                
                <td> `+ memoObj.inventoryItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(ratePerCtc ?? 0) + `</td>
                <td>`+ memoObj.totalAmount + `</td>
                </tr>`

      htmlString += `
                <tr>         
                <td></td>       
                <td colspan="2">AS PER PACKING LIST</td>               
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>                                       
                </tbody>
              </table>
            </div>    
              <div class="body-f-footer">   
              <span class="c-st border-bottom-2">Terms of Service</span>           
              <ul>  
                <li>The goods described and valued as above are delivered to you for examination and inspection for two days only and remain our order and shall be returned to us on demand such merchandise, until retuened are at your risk from all hazards.</li>
                
                <li>No right or power is given to you to take out of hong kong or to sell ,pledge, hypothecate or otherwse dispose of this merchandise regardless of prior transaction.</li>

                <li>A sale of this merchandise can only be affected and title will pass only if as when we the said owner shall agree to such sale and  a bill of sale rendered therefor.</li>                
                </ul>    
              </div>

              <div class="body-f-mid">
              <div class="body-f-left">
                <span class="c-st">Receiver</span>
                <div class="ch-sig">      
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>    
                <span>Chop & Signature</span>
                </div>
              </div>
              <div class="body-f-right">
                <span class="c-st di">Issue By</span>
                <div class="ch-sig">
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>   
                <span>Chop & Signature</span>
                </div>
              </div>
            </div>
            </div>

            
            <div class="chal-wrap con-inv di-inv" style="margin-top:40px">
          <div class="chal-head">
            <div class="logo">
              <img src="http://27.109.6.22:5205/billimage/diamarthk1.png" alt="logo">
            </div>
            <div class="di-info">
            <span>` + memoObj.organization.address?.line1 + `,` + memoObj.organization.address?.line2 + `</span>            
            <span>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</span> 
            <span>Email: ` + memoObj.organization.email + `</span>            
            </div>
            <div class="co-details">
              <table>
                <tbody>
                  <tr>
                    <td><b>Contact No:</b></td>
                    <td>` + memoObj.organization.phoneNo + ` </td>
                  </tr>
                  <tr>
                    <td><b>Fax:</b></td>
                    <td>` + memoObj.organization.faxNo + `</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="chal-body">
            <span class="c-st border-left-2 border-right-2">MEMO - ON APRROVAL</span>
            <div class="body-top pl-1 border-bottom-0">
              <div class="bo-left w-50">
                <span class="c-st text-left">To.: ` + memoObj.party.name + `</span>
                <span>` + memoObj.party.address.line1 + `,` + memoObj.party.address.line2 + `</span>            
                <span>` + memoObj.party.address.city + `,` + memoObj.party.address.state + `,` + memoObj.party.address.country + `</span>            
                <span>ZipCode : ` + memoObj.party.address.zipCode + `</span>                
                <span>TEL: ` + memoObj.party.mobileNo + `</span>           
              </div>
              <div class="di-bor-0">
                <table>
                  <tbody>
                    <tr>
                      <td><b>Memo NO.</b></td>
                      <td>` + memoObj.memoNo + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Date:</b></td>
                      <td>` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Expire Days:</b></td>
                      <td>` + memoObj.expiredDays + `</td>
                    </tr>
                    <tr>
                    <td><b>Memo Expire Date:</b></td>
                    <td>` + this.utilityService.getValidDateWithFormate(memoObj.expiredDate) + `</td>                    
                    </tr>
                    <tr>
                      <td><b>Terms:</b></td>
                      <td>` + memoObj.terms + `</td>
                    </tr>
                    <tr>
                      <td><b>Place Of Supply:</b></td>
                      <td>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</td>
                    </tr>                     
                  </tbody>
                </table>
              </div>
            </div>
            <div class="body-middle">
              <table>                
                <tbody>`

      //HK Local Have Direct PL
      htmlString += `
        <table>
        <thead>
          <th>No</th>         
          <th colspan="2">DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>
                <tr>      
                <td></td>          
                <td colspan="2">CUT & POLISH DIAMONDS</td>                
                <td> `+ memoObj.inventoryItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(ratePerCtc ?? 0) + `</td>
                <td>`+ memoObj.totalAmount + `</td>
                </tr>`

      htmlString += `
                <tr>         
                <td></td>       
                <td colspan="2">AS PER PACKING LIST</td>               
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                </tr>                                       
                </tbody>   
              </table>
            </div>    
              <div class="body-f-footer">   
              <span class="c-st border-bottom-2">Terms of Service</span>           
              <ul>  
                <li>The goods described and valued as above are delivered to you for examination and inspection for two days only and remain our order and shall be returned to us on demand such merchandise, until retuened are at your risk from all hazards.</li>
                
                <li>No right or power is given to you to take out of hong kong or to sell ,pledge, hypothecate or otherwse dispose of this merchandise regardless of prior transaction.</li>

                <li>A sale of this merchandise can only be affected and title will pass only if as when we the said owner shall agree to such sale and  a bill of sale rendered therefor.</li>                
                </ul>    
              </div>

              <div class="body-f-mid">
              <div class="body-f-left">
                <span class="c-st">Receiver</span>
                <div class="ch-sig">      
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>    
                <span>Chop & Signature</span>
                </div>
              </div>
              <div class="body-f-right">
                <span class="c-st di">Issue By</span>
                <div class="ch-sig">
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>   
                <span>Chop & Signature</span>
                </div>
              </div>
            </div>
            </div>
            </div>

          </div>
        `

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
              <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
              <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
            </thead>
            <tbody>`

      for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
        let obj = memoObj.inventoryItems[index];
        if (obj) {
          htmlString += `
                    <tr>
                    <td>`+ (index + 1) + `</td>
                    <td>`+ obj.stoneId + `</td>
                    <td>`+ obj.shape + `</td>
                    <td>`+ obj.weight + `</td>
                    <td>`+ obj.color + `</td>
                    <td>`+ obj.clarity + `</td>
                    <td>`+ obj.certificateNo + `</td>
                    <td>`+ obj.price.perCarat + `</td>
                    <td>`+ obj.price.netAmount + `</td>
                    </tr>`
        }
      }

      htmlString += `
            </tbody>
            <tfoot>
                    <tr>
                      <td colspan="3">Grand Total</td>
                      <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                      <td colspan="4">&nbsp</td>                      
                      <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(memoObj.totalAmount ?? 0) + `</td>
                    </tr>       
            </tfoot>
            </table>
            </div>`


      htmlString += `
        </body>
        </html>
        `;
    }

    else if (memoType == "BELGIUMLOCAL") {
      htmlString += `  
      <body onload="window.print(); window.close();">       
        <div class="chal-wrap con-inv di-inv">
          <div class="chal-head">
            <div class="logo">
              <img src="http://27.109.6.22:5205/billimage/CG1.png" alt="logo">
            </div>
            <div class="di-info">
            <span>` + memoObj.organization.address?.line1 + `,` + memoObj.organization.address?.line2 + `</span>            
            <span>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</span> 
            <span>Email: ` + memoObj.organization.email + `</span>            
            </div>
            <div class="co-details">
              <table>
                <tbody>
                  <tr>
                    <td><b>Contact No:</b></td>
                    <td><b>` + memoObj.organization.phoneNo + ` </b></td>
                  </tr>
                  <tr>
                    <td><b>Fax:</b></td>
                    <td><b>` + memoObj.organization.faxNo + `</b></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="chal-body">
            <span class="c-st border-left-2 border-right-2">MEMO - ON APRROVAL</span>
            <div class="body-top pl-1 border-bottom-0">
              <div class="bo-left w-50">
                <span class="c-st text-left">To.: ` + memoObj.party.name + `</span>
                <span>` + memoObj.party.address.line1 + `,` + memoObj.party.address.line2 + `</span>            
                <span>` + memoObj.party.address.city + `,` + memoObj.party.address.state + `,` + memoObj.party.address.country + `</span>            
                <span>ZipCode : ` + memoObj.party.address.zipCode + `</span>                
                <span>TEL: ` + memoObj.party.mobileNo + `</span>           
              </div>
              <div class="di-bor-0">
                <table>
                  <tbody>
                    <tr>
                      <td><b>Memo NO.</b></td>
                      <td>` + memoObj.memoNo + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Date:</b></td>
                      <td>` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Expire Days:</b></td>
                      <td>` + memoObj.expiredDays + `</td>
                    </tr>
                    <tr>
                    <td><b>Memo Expire Date:</b></td>
                    <td>` + this.utilityService.getValidDateWithFormate(memoObj.expiredDate) + `</td>                    
                    </tr>
                    <tr>
                      <td><b>Terms:</b></td>
                      <td>` + memoObj.terms + `</td>
                    </tr>
                    <tr>
                      <td><b>Place Of Supply:</b></td>
                      <td>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</td>
                    </tr>                     
                  </tbody>
                </table>
              </div>
            </div>
            <div class="body-middle">
              <table>                
                <tbody>`


      if (memoObj.inventoryItems.length < 29) {

        htmlString += `
        <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>`

        for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
          let obj = memoObj.inventoryItems[index];
          if (obj) {
            htmlString += `            
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.stoneId + `</td>
                <td>`+ obj.shape + `-` + obj.color + `-` + obj.clarity + `-` + obj.certificateNo + `</td>
                <td>1</td>
                <td>`+ obj.weight + `</td>
                <td>`+ obj.price.perCarat + `</td>
                <td>`+ obj.price.netAmount + `</td>
                </tr>`
          }
        }
        for (let index = memoObj.inventoryItems.length; index <= 28; index++) {
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
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>
                <tr>      
                <td></td>          
                <td colspan="2">CUT & POLISH DIAMONDS</td>                
                <td> `+ memoObj.inventoryItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>&nbsp</td>
                <td>`+ memoObj.totalAmount + `</td>
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

        for (let index = 3; index <= 28; index++) {
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

      if (taxPerOne) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ taxNameOne + ` ( ` + taxPerOne + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((taxPerOne * (memoObj.totalAmount ?? 0)) / 100) + `</td>
                </tr>`
      }
      if (taxPerTwo) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ taxNameTwo + ` ( ` + taxPerTwo + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((taxPerTwo * (memoObj.totalAmount ?? 0)) / 100) + `</td>
                </tr>`
      }

      htmlString += `                        
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3">Grand Total </td>
                  <td>`+ memoObj.inventoryItems.length + `</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>          
                  <td>&nbsp</td>    
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusTax ?? 0) + ` (` + memoObj.fromCurrency + `)</td>
                </tr>
 

                <tr>
                <td colspan="5"></td>               
                <td>1 `+ memoObj.fromCurrency + ` = ` + memoObj.toCurRate + ` ` + memoObj.toCurrency + `</td>                
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumConvGrandTotalPlusTax ?? 0) + ` ( ` + memoObj.toCurrency + ` )</td>
                </tr>
    
                </tfoot>
              </table>
            </div>    
              <div class="body-f-footer">   
              <span class="c-st border-bottom-2">Terms of Service</span>           
              <ul>  
              
                <li>The goods are entrusted to me for the sole purpose of being shown to intending purchase for inspection / Assortment / Manufacturing.</li>
                
                <li>The goods remain your property and I acquire no right to property or interest in them till a sale note signed by you is passed or till the price is paid in respect thereof notwithstanding the fact that mentioned is made of the rate or price in the particulars or goods herein set forth.
                </li>

                <li>I agree not to sell, pledge, mortgage or hypothecate the said goods or otherwise deal with them in any manner till a sale not signed by you is passed or the price is paid by you.</li>  
                
                <li>The goods are to be returned to you forthwith whenever demanded back.</li>     

                <li>The goods will be at my risk in all respect till a sale note signed by you is passed in respect thereof or till the price is paid to you or till the goods are returned to you and
                I am not responsible to you for the return of the said goods in the same condition as have received the same.</li>     
              
                </ul>    
              </div>

              <div class="body-f-mid">
              <div class="body-f-left">
                <span class="c-st">Receiver</span>
                <div class="ch-sig">      
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>    
                <span>Chop & Signature</span>
                </div>
              </div>
              <div class="body-f-right">
                <span class="c-st di">Issue By</span>
                <div class="ch-sig">
                <span>&nbsp</span>
                <span>&nbsp</span>
                <span>&nbsp</span>   
                <span>Chop & Signature</span>
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>`

      if (memoObj.inventoryItems.length > 28) {
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
              <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
              <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
            </thead>
            <tbody>`

        for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
          let obj = memoObj.inventoryItems[index];
          if (obj) {
            htmlString += `
                    <tr>
                    <td>`+ (index + 1) + `</td>
                    <td>`+ obj.stoneId + `</td>
                    <td>`+ obj.shape + `</td>
                    <td>`+ obj.weight + `</td>
                    <td>`+ obj.color + `</td>
                    <td>`+ obj.clarity + `</td>
                    <td>`+ obj.certificateNo + `</td>
                    <td>`+ obj.price.perCarat + `</td>
                    <td>`+ obj.price.netAmount + `</td>
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
                      <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(memoObj.totalAmount ?? 0) + `</td>
                    </tr>
                    <tr>
                      <td colspan="3">`+ memoObj.fromCurrency + ` @ ` + memoObj.fromCurRate + `</td>
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

    else if (memoType == "INDIAOVERSEASOLD") {
      htmlString += `  
      <body onload="window.print(); window.close();">       
        <div class="chal-wrap con-inv di-inv">
          <div class="chal-head">
          <div class="logo text-left">
              <img src="http://27.109.6.22:5205/billimage/Glowstar.png" alt="logo">
            </div>
            <div class="di-info text-left">
            <span>` + memoObj.organization.address?.line1 + `</span>   
            <span>` + memoObj.organization.address?.line2 + `</span>          
            <span>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</span> 
            <span>Email: ` + memoObj.organization.email + `</span>   
            <span>GSTIN No: ` + memoObj.organization.taxNo + `</span>            
            </div>
            <div class="co-details">
              <table>
                <tbody>
                <tr class="text-left">
                <td><b>Del.Challan NO.</b></td>
                <td>` + memoObj.memoNo + `</td>
              </tr>
              <tr class="text-left">
                <td><b>Del.Challan Date:</b></td>
                <td>` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</td>
              </tr>
              <tr class="text-left">
              <td><b>Exporter's Ref. IEC No:</b></td>
              <td>` + memoObj.iecNo + `</td>
              </tr> 
              <tr class="text-left">
                <td><b>HSN CODE:</b></td>
                <td>71023910</td>
              </tr>
              <tr class="text-left">
                <td><b>Export Type:</b></td>
                <td>` + memoObj.exportType + `</td>
              </tr> 
              <tr class="text-left">
                <td><b>Contact No:</b></td>
                <td>` + memoObj.organization.phoneNo + ` </td>
              </tr>
              <tr class="text-left">
                <td><b>Fax:</b></td>
                <td>` + memoObj.organization.faxNo + `</td>
              </tr>    
                </tbody>
              </table>
            </div>
          </div>
          <div class="chal-body">
            <span class="c-st border-left-2 border-right-2">DELIVERY CHALLAN - MEMO CONSIGNMENT</span>
            <span class="c-st border-top-2 border-left-2 border-right-2">IN LIUE OF INVOICE AS PER PROVISION UNDER RULE 55 CGST RULE 2017</span>
            <div class="di-grid pl-1 border-bottom-0 border-top-2 border-left-2">
              
            <div class="bo-left border-right-2">                
                <span class="c-st text-left">consignee:</span>
                <span> ` + memoObj.consigneeName + `</span>
                <span> ` + memoObj.consigneeAddress + `</span>
                
                <div class="di-bor-0 border-top-2">
                <span class="c-st text-left">Buyer (If other than consignee):</span>
                <span>` + memoObj.party.name + `</span>
                <span>` + memoObj.party.address.line1 + `,` + memoObj.party.address.line2 + `</span>            
                <span>` + memoObj.party.address.city + `,` + memoObj.party.address.state + `,` + memoObj.party.address.country + `</span>            
                <span>ZipCode : ` + memoObj.party.address.zipCode + `</span>                
                <span>TEL: ` + memoObj.party.mobileNo + `</span> 
                </div>
            </div>


              <div class="di-bor-0 border-right-2 p-2">
                <table>
                  <tbody>
 
     
                    <tr>
                      <td><b>Country of Origin of Goods:</b></td>
                      <td>` + memoObj.organization.address?.country + `</td>
                    </tr> 
                    <tr>
                    <td><b>Country of Final Destination:</b></td>
                    <td>` + memoObj.party.address.country + `</td>
                    </tr>          
                    <tr>
                    <td><b>Pre-Carriage by:</b></td>
                    <td>` + memoObj.courierName.name + `</td>
                    </tr>  
                    <tr>
                    <td><b>Port of Loading:</b></td>
                    <td>` + memoObj.portOfLoading + `</td>
                    </tr> 
                    <tr>
                    <td><b>Port of Discharge:</b></td>
                    <td>` + memoObj.party.address.city + `</td>
                    </tr> 
                    <tr>
                    <td><b>Final Destination:</b></td>
                    <td>` + memoObj.party.address.country + `</td>
                    </tr>                         
                                        
                  </tbody>
                </table>
              </div>
              <div class="di-bor-0 border-right-2 p-2">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <p><b>Terms of Delivery and Payment:</b></p>
                        <p>` + memoObj.terms + `</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="body-middle">
              <table>                
                <tbody>`


      htmlString += `
        <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>`

      for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
        let obj = memoObj.inventoryItems[index];
        if (obj) {
          htmlString += `            
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.stoneId + `</td>
                <td>`+ obj.shape + `-` + obj.color + `-` + obj.clarity + `-` + obj.certificateNo + `</td>
                <td>1</td>
                <td>`+ obj.weight + `</td>
                <td>`+ obj.price.perCarat + `</td>
                <td>`+ obj.price.netAmount + `</td>
                </tr>`
        }
      }
      if (taxPerOne) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ taxNameOne + ` ( ` + taxPerOne + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((taxPerOne * (memoObj.totalAmount ?? 0)) / 100) + `</td>
                </tr>`
      }
      if (taxPerTwo) {
        htmlString += `
                <tr>
                <td colspan="6" style="text-align:right; padding-right:10px;" >`+ taxNameTwo + ` ( ` + taxPerTwo + ` % ) </td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal((taxPerTwo * (memoObj.totalAmount ?? 0)) / 100) + `</td>
                </tr>`
      }
      htmlString += `                        
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3">Grand Total </td>
                  <td>`+ memoObj.inventoryItems.length + `</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>          
                  <td>&nbsp</td>    
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusTax ?? 0) + ` (` + memoObj.fromCurrency + `)</td>
                  </tr>
                  <tr>
                  <td colspan="5"></td>               
                  <td>1 `+ memoObj.fromCurrency + ` = ` + memoObj.toCurRate + ` ` + memoObj.toCurrency + `</td>                
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumConvGrandTotalPlusTax ?? 0) + ` ( ` + memoObj.toCurrency + ` )</td>
                  </tr>    
                </tfoot>
              </table>
            </div>    



              <div class="body-f-footer">   
              <span class="c-st border-bottom-2">DOOR TO DOOR INSURANCE COVERED BY ` + memoObj.courierName.name + `</span> 
              <span class="c-st border-bottom-2">Terms of Service & Declaration</span>           
              <ul>  
              
                <li>We undertake to re import the goods & will produce to RBI documentry evidence such as exchange control copy of bill of entry & coustom 
                attested invoice in support there of within 60 days from the date of clearance of the consignment in case the goods are sold , the sale 
                proceeds will be repatriated to India through proper banking channel & will produce to RBI , bank realisation certificate in support there 
                of further we will re-import unsold goods within the prescribed the time limit.</li>
                
                <li>TRANSPORTATION OF THE GOODS FOR THE REASONS OTHER THAN BY WAY OF SUPPLY UNDER RULE 55 CGST READ WITH CIRCULAR No.108/27/2019 CGST DT.18/07/2019</li>

                <li>The Diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict , in compliance with United Nations resolutions and corresponding national laws.</li>  
                
                <li>The Seller hereby guarantees that these diamonds are conflict free and confirms adherence to the WDC SoW Guidelines.</li>     

                <li>The Diamonds herein invoiced are exclusively of natural origin and untreated based on personal knowledge and/or written guarantees provided by the supplier of these diamonds.</li> 
                
                <li>The acceptance of goods herein invoiced will be as per WFDB guidelines.</li> 

                <li>WE DON'T WANT TO CLAIM RoDTEP ON THE EXPORT ITEMS LISTED UNDER THIS INVOICE NO.</li> 

                <li>Details of preferential agreements under which the goods are being exported : NCPTI SQC-CTM On Confirmed outright sale basis</li>
                <li>We declare that this Invoice shows the actual price of the goods described and that all particulars are true and correct.</li>
              
                </ul>    
              </div>


              <div class="body-f-mid">
        <div class="p-2 di-bor-0 border-right-2" style="width: 45%;">      
              <span class="c-st text-left">Payment instructions:</span>
              <table>
                <tbody>
                  <tr>
                    <td><b>BANK : </b></td>
                    <td>`+ memoObj.bank.bankName + `</td>
                  </tr>      
                  <tr>
                    <td><b>ADDRESS :</b></td>  
                    <td>` + memoObj.bank.address?.line1 + `,` + memoObj.bank.address?.line2 + `,
                    ` + memoObj.bank.address?.city + `,` + memoObj.bank.address?.state + `,` + memoObj.bank.address?.country + `</td>
                  </tr>
                  <tr>
                    <td><b>A/C NAME :</b></td>
                    <td>`+ memoObj.bank.accountName + `</td>
                  </tr>
                  <tr>
                    <td><b>A/C NO :</b></td>
                    <td>`+ memoObj.bank.accountNo + `</td>
                  </tr>
                  <tr>
                    <td><b>SWIFT CODE :</b></td>
                    <td>`+ memoObj.bank.swift + `</td>
                  </tr>
                  <tr>
                  <td><b>AD CODE :</b></td>
                  <td>`+ memoObj.bank.adCode + `</td>
                </tr>
                  <tr>
                  <td><b>INTERMEDIATE Bank:</b></td>
                  <td>`+ memoObj.intermediaryBank + `</td>
                  </tr>                   
                </tbody>
              </table>
              </div>


                <div class="body-f-left">
                  <span class="c-st">Receiver's Chop & Signature</span>           
                </div>
                <div class="body-f-right">
                  <span class="c-st di">Issue By's Chop & Signature</span>                  
                </div>
              </div>

            </div>
          </div>
        </div>`

      htmlString += `
        </body>
        </html>
        `;
    }

    else if (memoType == "INDIAOVERSEAS") {

      var perPageCount: number = 26;
      var totalPageCount: number;
      var skip: number = 0;
      totalPageCount = Math.floor(memoObj.inventoryItems.length / perPageCount);

      if (memoObj.inventoryItems.length < 26) {
        totalPageCount = 1;
        perPageCount = 10;
      }

      for (let index = 0; index <= totalPageCount; index++) {

        htmlString += `        
  <body onload="window.print(); window.close();">      
  <p style="margin: 0;font-size: 14px;text-align: center;"><b>DELIVERY CHALLAN -CONSIGNMENT</b></p>
  <p style="margin: 0;font-size: 12px;font-weight: 600;text-align: center;">IN LIUE OF INVOICE AS PER PROVISION UNDER
    RULE 55 CGST RULE 2017</p>

  <div class="challan-new">
    <div class="challan-leftside">
      <div class="lefstside-subgrid">
        <div class="grid-1">
          <small>Exporter</small><span style="margin-left: 10px;"><b></b></span>
          <img src="http://27.109.6.22:5205/billimage/GlowstareG.png"/>
        </div>
        <div class="grid-1">
        <p><b>` + memoObj.organization.name + `</b></p>
        <p>` + memoObj.organization.address?.line1 + `,` + memoObj.organization.address?.line2 + `<br>
        ` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</p>          
          <p>Tele No.` + memoObj.organization.phoneNo + `,` + memoObj.organization.mobileNo + `</p>
          <p>Email.` + memoObj.organization.email + `</p> 
        </div>
      </div>
      `
        if (index == 0)//First Page 
        {
          htmlString += `
        <div class="lefstside-subgrid border-top-2" style="height:254px;">
        <div class="grid-1">
        <p>Consignee</p>     
          <p><b>` + memoObj.consigneeName + `</b></p>          
          <p> ` + memoObj.consigneeAddress + `</p>
        </div>
      </div>
      <div class="box-two border-top-2">
        <div class="box-1 p-1 border-right-2 border-bottom-2">
          <small>Pre-Carriage by</small>
          <p>` + memoObj.courierName.name + `</p>
        </div>
        <div class="box-1 p-1 border-bottom-2">
          <small>Place of Receipt by Pre-carrier</small>
          <p>N.A.</p>
        </div>
        <div class="box-1 p-1 border-right-2 border-bottom-2">
          <small>Vessel/Flight No</small>
          <p>AIR FREIGHT</p>
        </div>
        <div class="box-1 p-1 border-bottom-2">
          <small>Port of Loading</small>
          <p>` + memoObj.organization.address?.city + `</p>
        </div>
        <div class="box-1 p-1 border-right-2">
          <small>Port of Discharge</small>
          <p>` + memoObj.party.address?.city + `</p>
        </div>
        <div class="box-1 p-1">
          <small>Final Destination</small>
          <p>` + memoObj.party.address?.country + `</p>
        </div>
      </div>`
        }
        htmlString += ` 
    </div>

    <div class="challan-rightside">
    <div class="box-two">
    <div class="box-1 p-1 border-bottom-2 border-right-2">
      <small>Del.Challan No.& Dt.</small><span style="margin-left: 10px;">` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</span>
      <p>` + memoObj.memoNo + `</p>
    </div>
    <div class="box-1 p-1 border-bottom-2">
      <small>Exporter's Ref</small>
      <p><b>IEC No :</b> ` + memoObj.iecNo + `</p>
    </div>
    </div>

    <div class="box-full p-1 border-bottom-2" style="padding-bottom: 21px;">
      <small>Buyer's Order no. & Date</small>
    </div>

    <div class="box-full p-1">
      <small>Buyer's Order no. & Date</small><span style="margin-left: 25px;"><b>GST No : ` + memoObj.organization.gstNo + `</b></span>
    </div>`
        if (index == 0)//First Page 
        {
          htmlString += `      
      <div class="box-full p-1">
        <small>Buyer (If other than consignee)</small>
        <p><b>` + memoObj.party.name + `</b></p>
        <p>` + memoObj.party.address.line1 + `,` + memoObj.party.address.line2 + `, <br>
        ` + memoObj.party.address.city + `,` + memoObj.party.address.state + `,` + memoObj.party.address.country + `,
        ZipCode : ` + memoObj.party.address.zipCode + `
        </p>
        <p>TEL: ` + memoObj.party.mobileNo + `, FAX : ` + memoObj.party.faxNo + `</p>
      </div>

      <div class="box-two border-top-2">
        <div class="box-1 p-1 border-right-2 border-bottom-2">
          <small>Country of Origin of Goods</small>
          <p>` + memoObj.organization.address?.country + `</p>
        </div>
        <div class="box-1 p-1 border-bottom-2">
          <small>Country of Final Destination</small>
          <p>` + memoObj.party.address.country + `</p>
        </div>
      </div>

      <div class="box-full p-1">
        <small>Terms of Delivery and Payment</small>
        <p>` + memoObj.terms + `</p>
        <br>
        <p><b>OUR BANKERS :</b></p>
        <p><b>`+ memoObj.bank.bankName + `</b></p>
        <p><small>` + memoObj.bank.address?.line1 + `,` + memoObj.bank.address?.line2 + `,
        ` + memoObj.bank.address?.city + `,` + memoObj.bank.address?.state + `,` + memoObj.bank.address?.country + `</small></p>
        <p>A/C Name: `+ memoObj.bank.accountName + `</p>
        <p>A/C No: `+ memoObj.bank.accountNo + `</p>
        <p>SWIFT Code: `+ memoObj.bank.swift + `</p>        
        <p><b>AD CODE: `+ memoObj.bank.adCode + `</b></p>
      </div>`
        }
        htmlString += `
  </div>
  </div>


  <div class="record">
    <table>
      <tbody>
        <tr>
          <th>No</th>
          <th>STONE ID</th>
          <th>DESCRIPTION</th>
          <th>MEASURMENT</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>` + memoObj.exportType + ` RATE PER CT ` + memoObj.fromCurrency + `  $</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + ` $</th>
        </tr>
        `

        let filterInventoryItems = memoObj.inventoryItems.slice(skip, skip + perPageCount);
        var totweight: number = 0;
        var totnetAmount: number = 0

        for (let indexS = 0; indexS <= filterInventoryItems.length; indexS++) {
          let obj = filterInventoryItems[indexS];
          if (obj) {
            htmlString += `            
                  <tr>
                  <td>`+ (indexS + 1 + skip) + `</td>
                  <td>`+ obj.stoneId + `</td>
                  <td>`+ obj.shape + `-` + obj.color + `-` + obj.clarity + `-` + obj.certificateNo + `</td>
                  <td>`+ obj.measurement.length + `*` + obj.measurement.width + `*` + obj.measurement.height + `</td>
                  <td>1</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(obj.weight) + `</td>
                  <td>`+ obj.price.perCarat + `</td>
                  <td>`+ obj.price.netAmount + `</td>
                  </tr>`
          }
        }
        skip = skip + perPageCount;
        filterInventoryItems.forEach(z => { totweight += z.weight });
        filterInventoryItems.forEach(z => { totnetAmount += z.price.netAmount ?? 0 });

        htmlString += `    

        <tr>
          <th colspan="2">Gross Wgt: ` + memoObj.boxWeight + ` Kgs.</th>          
          <th></th>
          <th>Page Total</th>
          <th>CRTS</th>
          <th>`+ this.utilityService.ConvertToFloatWithTwoDecimal(totweight) + `</th>
          <th>` + memoObj.exportType + ` ` + memoObj.fromCurrency + ` $</th>
          <th>`+ this.utilityService.ConvertToFloatWithTwoDecimal(totnetAmount) + `</th>
        </tr>        
      </tbody>
    </table>
  </div>


  <div class="chargable">`
        if (index == totalPageCount)//Last Page 
        {
          htmlString += `
        <div class="details p-1">
          <p>We undertake to re import the goods & will produce to RBI documentry evidence such as exchange control copy of
            bill of entry & coustom attested invoice in support there of within 60 days from the date of clearance of the
            consignment in case the goods are sold , the sale proceeds will be repatriated to India through proper banking
            channel & will produce to RBI , bank realisation certificate in support there of further we will re-import unsold
            goods within the prescribed the time limit.</p>
          <p><b>Note : TRANSPORTATION OF THE GOODS FOR THE REASONS OTHER THAN BY WAY OF SUPPLY UNDER RULE 55 CGST READ
            WITH <br> CIRCULAR No.108/27/2019 CGST DT.18/07/2019</b></p>
        </div>

        <div class="inv-details">
        <p><small style="margin-left: 10px;">Amount Chargeable(In Words)@:</small><b
        style="margin-right: 20px;">` + memoObj.toCurRate + `</b><b>` + memoObj.toCurrency + `. : ` + sumConvGrandTotalPlusTax + `</b><span><b>` + memoObj.exportType + `  ` + memoObj.fromCurrency + ` $
          Total</b><b>` + sumGrandTotalPlusTax + `</b></span></p>        

        <p class="inv-p">"The Diamonds herein invoiced have been purchased from legitimate sources not involved in funding
          conflict , in compliance with United Nations resolutions and corresponding national laws .</p>
        <p class="inv-p">The Seller hereby guarantees that these diamonds are conflict free and confirms adherence to the
          WDC SoW Guidelines."</p>
        <p class="inv-p">The Diamonds herein invoiced are exclusively of natural origin and untreated based on personal
          knowledge and/or written guarantees provided by the supplier of these diamonds.</p>
        <p class="inv-p">The acceptance of goods herein invoiced will be as per WFDB guidelines.</p>
        <p style="margin-left: 10px;"><b>WE DON'T WANT TO CLAIM RoDTEP ON THE EXPORT ITEMS LISTED UNDER THIS INVOICE NO</b></p>
        <p style="margin-left: 10px;"><b>PAYMENT INSTRUCTION :</b>BENEFICIARY : `+ memoObj.bank.accountName + `</p>
        <p style="margin-left: 10px;">OUR BANK : ` + memoObj.bank.address?.line1 + `,` + memoObj.bank.address?.line2 + `,
        ` + memoObj.bank.address?.city + `,` + memoObj.bank.address?.state + `,` + memoObj.bank.address?.country + `</p>
        <p style="margin-left: 10px;">A/C NO. `+ memoObj.bank.accountNo + `, SWIFT CODE : ` + memoObj.bank.swift + `</p>
        <p style="margin-left: 10px;">INTERMEDIARY BANK : `+ memoObj.intermediaryBank + `</p>
        <p style="margin-left: 10px;margin-top: 15px;""><b>STATE OF ORIGIN : 27, DISTRICT OF ORIGIN : 483</b></p>
        <p style="margin-left: 10px;margin-top: 15px;""><b>DOOR TO DOOR INSURANCE COVERED BY `+ memoObj.courierName.name + `</b></p>
        </div>
        `;
        }

        //style="page-break-after: always" For Break The Page
        htmlString += `
    <div class="inv-details" style="page-break-after: always;">
      <div class="sign-div">
        <div class="grid-1 p-1">
          <p><b>Details of preferential agreements under which the goods are being exported : NCPTI</b></p>
          <p><b>SQC-CTM</b></p>
          <p>
          <h5>On Confirmed outright sale basis</h5>
          </p>
          <p>Declaration :
          <h5>PAN : ` + memoObj.organization.incomeTaxNo + `</h5>
          </p>
          <p><small>We declare that this Invoice shows the actual price of the goods described and that all particulars
              are true and correct.</small></p>
        </div>
        <div class="grid-2">
          <p>Signature & Date<br>` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</p>
          <p><b>For ` + memoObj.organization.name + `<br>Partner/Auth.Sign.</b></p>
        </div>
      </div>
    </div>

  </div>
</body>`

      }//Main Foor Loop End

      htmlString += `
        </body>
        </html>
        `;
    }

    else if (memoType == "HKOVERSEAS") {
      htmlString += `  
      <body onload="window.print(); window.close();">       
        <div class="chal-wrap con-inv di-inv">
          <div class="chal-head">
            <div class="logo">
              <img src="http://27.109.6.22:5205/billimage/diamarthk1.png" alt="logo">
            </div>
            <div class="di-info">
            <span>` + memoObj.organization.address?.line1 + `,` + memoObj.organization.address?.line2 + `</span>            
            <span>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</span> 
            <span>Email: ` + memoObj.organization.email + `</span>            
            </div>
            <div class="co-details">
              <table>
                <tbody>
                  <tr>
                    <td><b>Contact No:</b></td>
                    <td>` + memoObj.organization.phoneNo + `</td>
                  </tr>
                  <tr>
                    <td><b>Fax:</b></td>
                    <td>` + memoObj.organization.faxNo + `</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="chal-body">
      <span class="c-st border-left-2 border-right-2 border-bottom-2">MEMO - ON APRROVAL</span>
      <div class="body-top pl-1 border-bottom-0">


        <div class="bo-left border-right-2" style="flex-basis: 62%;">

          <div class="di-bor-0 border-bottom-2">
                <span class="c-st text-left">Buyer (If other than consignee):</span>
                <span>` + memoObj.party.name + `</span>
                <span>` + memoObj.party.address.line1 + `,` + memoObj.party.address.line2 + `</span>            
                <span>` + memoObj.party.address.city + `,` + memoObj.party.address.state + `,` + memoObj.party.address.country + `</span>            
                <span>ZipCode : ` + memoObj.party.address.zipCode + `</span>                
                <span>TEL: ` + memoObj.party.mobileNo + `</span> 
                </div>
                `

      if (memoObj.consigneeName) {
        htmlString += `
                          <span class="c-st text-left">Ship To:</span>
                          <span> ` + memoObj.consigneeName + `</span>
                          <span> ` + memoObj.consigneeAddress + `</span>
                          `
      }
      htmlString += `
            </div>


            <div class="di-bor-0 p-1">
                <table>
                  <tbody>
                    <tr>
                      <td><b>Memo NO.</b></td>
                      <td>` + memoObj.memoNo + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Date:</b></td>
                      <td>` + this.utilityService.getValidDateWithFormate(memoObj.createdDate) + `</td>
                    </tr>
                    <tr>
                      <td><b>Memo Expire Days:</b></td>
                      <td>` + memoObj.expiredDays + `</td>
                    </tr>
                    <tr>
                    <td><b>Memo Expire Date:</b></td>
                    <td>` + this.utilityService.getValidDateWithFormate(memoObj.expiredDate) + `</td>                    
                    </tr>
                    <tr>
                      <td><b>Terms:</b></td>
                      <td>` + memoObj.terms + `</td>
                    </tr>
                    <tr>
                      <td><b>Place Of Supply:</b></td>
                      <td>` + memoObj.organization.address?.city + `,` + memoObj.organization.address?.state + `,` + memoObj.organization.address?.country + `</td>
                    </tr>      
                    <tr>
                    <td><b>HSCODE:</b></td>
                    <td>71023910</td>
                    </tr>
                    <tr>
                    <td><b>HSCODE:</b></td>
                    <td>71023920</td>
                    </tr>               
                  </tbody>
                </table>
              </div>
            </div>
            
            <div class="body-middle">
              <table>                
                <tbody>`


      if (memoObj.inventoryItems.length < 24) {

        htmlString += `
        <table>
        <thead>
          <th>No</th>
          <th>STONE ID</th>
          <th>DESCRIPTION</th>
          <th>PCS</th>
          <th>CARATS</th>
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>`

        for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
          let obj = memoObj.inventoryItems[index];
          if (obj) {
            htmlString += `            
                <tr>
                <td>`+ (index + 1) + `</td>
                <td>`+ obj.stoneId + `</td>
                <td>`+ obj.shape + `-` + obj.color + `-` + obj.clarity + `-` + obj.certificateNo + `</td>
                <td>1</td>
                <td>`+ obj.weight + `</td>
                <td>`+ obj.price.perCarat + `</td>
                <td>`+ obj.price.netAmount + `</td>
                </tr>`
          }
        }
        for (let index = memoObj.inventoryItems.length; index <= 23; index++) {
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
          <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
          <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
        </thead>
        <tbody>
                <tr>      
                <td></td>          
                <td colspan="2">CUT & POLISH DIAMONDS</td>                
                <td> `+ memoObj.inventoryItems.length + `</td>
                <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>
                <td>&nbsp</td>
                <td>`+ memoObj.totalAmount + `</td>
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

        for (let index = 3; index <= 23; index++) {
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

      if (memoObj.shippingCharge > 0) {
        htmlString += `
                      <tr>
                      <td colspan="6" style="text-align:right" >Shipping Charge : </td>       
                      <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(memoObj.shippingCharge ?? 0) + `</td>
                      </tr>`
      }

      htmlString += `                        
                </tbody>
                <tfoot>
                <tr>
                  <td colspan="3">Grand Total </td>
                  <td>`+ memoObj.inventoryItems.length + `</td>
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumWeight ?? 0) + `</td>          
                  <td>&nbsp</td>    
                  <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(sumGrandTotalPlusTax ?? 0) + ` (` + memoObj.fromCurrency + `)</td>
                </tr>    
                </tfoot>
              </table>
            </div>    
            <span class="c-st border-bottom-2 border-left-2 border-right-2">Terms of Service / Declaration</span>     
              <div class="body-f-footer">                       
              <ul>  
                <li>The diamonds herein invoiced have been purchased from legitimate sources not involved in funding conflict and in compliance with United Nations Resolution.</li> 
                <li>The Seller hereby guarantees that these diamonds are conflicts free, based on personal knowledge and/or written guarantees provided by the supplier of these diamond.</li>
                <li>`+ memoObj.additionalDeclaration + `</li>
              </div>

              <div class="body-f-mid">
              <div class="p-2 di-bor-0" style="width: 50%;"> 
                    <span class="c-st text-left">Payment instructions:</span>
                    <table>
                      <tbody>
                        <tr>
                          <td><b>BANK : </b></td>
                          <td>`+ memoObj.bank.bankName + `</td>
                        </tr>      
                        <tr>
                          <td><b>ADDRESS :</b></td>  
                          <td>` + memoObj.bank.address?.line1 + `,` + memoObj.bank.address?.line2 + `,
                          ` + memoObj.bank.address?.city + `,` + memoObj.bank.address?.state + `,` + memoObj.bank.address?.country + `</td>
                        </tr>
                        <tr>
                          <td><b>A/C NAME :</b></td>
                          <td>`+ memoObj.bank.accountName + `</td>
                        </tr>
                        <tr>
                          <td><b>A/C NO :</b></td>
                          <td>`+ memoObj.bank.accountNo + `</td>
                        </tr>
                        <tr>
                          <td><b>SWIFT CODE :</b></td>
                          <td>`+ memoObj.bank.swift + `</td>
                        </tr>           
                        <tr>
                        <td><b>INTERMEDIATE Bank:</b></td>
                        <td>`+ memoObj.intermediaryBank + `</td>
                        </tr>                   
                      </tbody>
                    </table>
                    </div> 
           
                    <div class="border-left-2" style="width: 50%;">
                    <div class="">
                        <span class="c-st">FOR , ` + memoObj.organization.name + `</span>
                        <div class="ch-sig">
                        <img style="margin: 27px auto;" src="http://27.109.6.22:5205/billimage/diamarthk2.png">              
                        <span>Authorized Signature(S)</span>
                        </div>
                      </div>        
                      </div>

                    </div>
            </div>
          </div>
        </div>`

      if (memoObj.inventoryItems.length > 24) {
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
              <th>RATE `+ memoObj.fromCurrency + ` PER CT</th>
              <th>TOTAL AMOUNT `+ memoObj.fromCurrency + `</th>
            </thead>
            <tbody>`

        for (let index = 0; index <= memoObj.inventoryItems.length; index++) {
          let obj = memoObj.inventoryItems[index];
          if (obj) {
            htmlString += `
                    <tr>
                    <td>`+ (index + 1) + `</td>
                    <td>`+ obj.stoneId + `</td>
                    <td>`+ obj.shape + `</td>
                    <td>`+ obj.weight + `</td>
                    <td>`+ obj.color + `</td>
                    <td>`+ obj.clarity + `</td>
                    <td>`+ obj.certificateNo + `</td>
                    <td>`+ obj.price.perCarat + `</td>
                    <td>`+ obj.price.netAmount + `</td>
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
                      <td>`+ this.utilityService.ConvertToFloatWithTwoDecimal(memoObj.totalAmount ?? 0) + `</td>
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

    return htmlString;
  }
}