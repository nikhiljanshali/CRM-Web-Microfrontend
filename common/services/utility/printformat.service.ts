import { Injectable } from '@angular/core';
import { LabIssue, LabIssueItem } from 'common/businessobjects';
import { ConsignmentInvoice, InventoryItems } from 'common/entities';

@Injectable({
  providedIn: 'root'
})

export class PrintFormatService {

  constructor() { }

  public getStonesWithDetail(selectedInventoryItems: InventoryItems[]) {
    var htmlString: string = "";

    htmlString += `
            <html>
            <head>
            <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <style>
            @media print {
              .stone-print {page-break-after: always;}
            }

           .stone-print {
            display    : flex;
            position   : relative;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

            width : 265px;
            }

          .stone-print h2 {
                transform: rotate(-90deg) translateX(15%);
                position : absolute;
                top      : 50%;
                left     : -20px;
                margin   : auto;
          }

          .stone-print table,
          .stone-print th,
          .stone-print td {
                border         : 1px solid black;
                border-collapse: collapse;
                padding        : 2px;
                font-size      : 12px;
          }
           
            </style>
            </head>
            <body onload="window.print(); window.close();">
            `
    for (let index = 0; index <= selectedInventoryItems.length; index++) {
      let obj = selectedInventoryItems[index];
      if (obj) {
        htmlString += `<div class="stone-print">
                <h2>`+ obj.stoneId + `</h2>
                <table style="width:100%;margin-left:60px">
                  <tr>
                    <th colspan="2">`+ obj.stoneId + `</th>
                    <th colspan="3">`+ (obj.lab ? obj.lab : '') + `-` + (obj.certificateNo ? obj.certificateNo : '') + `</th>
                  </tr>
                  <tr>
                    <td><b>COL</b></td>
                    <td>`+ obj.color + `</td>                    
                    <td><b>CUT</b></td>
                    <td>`+ obj.cut + `</td>
                    <td rowspan="3" align="center"><b>`+ obj.shape + `</b></td>
                  </tr>
                  <tr>
                    <td><b>CLA</b></td>
                    <td>`+ obj.clarity + `</td>
                    <td><b>POL</b></td>
                    <td>`+ obj.polish + `</td> 
                  </tr>
                  <tr>
                    <td><b>TD</b></td>
                    <td>`+ obj.measurement.depth + `</td>
                    <td><b>SYM</b></td>
                    <td>`+ obj.symmetry + `</td> 
                  </tr>
                  <tr>
                    <td><b>TA</b></td>
                    <td>`+ obj.measurement.table + `</td>
                    <td><b>FLO</b></td>
                    <td>`+ obj.fluorescence + `</td>  
                    <td rowspan="3" align="center"><b>`+ obj.weight + `</b></td>
                  </tr>
                  <tr>
                    <td><b>MES</b></td>
                    <td colspan="3">`+ obj.measurement.length + `-` + obj.measurement.width + `*` + obj.measurement.height + `</td> 
                  </tr>
                </table>
                </div>`

      }
    }

    htmlString += `
            </body>
            </html>`;

    return htmlString;
  }

  public getConsignmentInvoicePrintFormat(consignmentInvoice: ConsignmentInvoice) {
    return `
            <style>
            @page {
              size  : A4 portrait;
            } 
            @media print {
              html, body { 
                margin: 7px;
              }
            }
            </style>
            </head>
            <body onload="window.print(); window.close();">
            <div>
            <div class="chal-wrap con-inv">
              <div class="chal-head">
                <div class="logo">
                  <img src="commonAssets/images/glowstar.png" alt="logo">
                </div>
              </div>
              <div class="chal-body">
                <span class="c-st border-left-2 border-right-2">INVOICE</span>
                <div class="body-top pl-1 border-bottom-0">
                  <div class="bo-left w-50">
                    <span class="c-st text-left">Exporter:</span>
                    <img src="commonAssets/images/glowstar.png" class="w-25" alt="logo">
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
                          <td>CON-47 2021-22</td>
                        </tr>
                        <tr>
                          <td><b>DATE:</b></td>
                          <td>12 Nov 2021</td>
                        </tr>
                        <tr>
                          <td><b>TERMS:</b></td>
                          <td>ON CONSIGNMENT BASIS</td>
                        </tr>
                        <tr>
                          <td colspan="2"><b>BUYER (IF OTHER THAN CONSIGNEE)</b></td>
                        </tr>
                        <tr>
                          <td>CHINTAN GEMS BV</td>
                          <td>ORIGIN : INDIA </td>
                        </tr>
                        <tr>
                          <td>HOVENIERSSTRAAT 30</td>
                          <td>HSCODE : 71023910</td>
                        </tr>
                        <tr>
                          <td>OFFICE 625, BOX 196</td>
                          <td>HSCODE : 71023920</td>
                        </tr>
                        <tr>
                          <td colspan="2">ANTWERP, BELGIUM 2018</td>
                        </tr>
                        <tr>
                          <td colspan="2">TEL : 3232312335,VAT : BE 0478.554.943</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="body-middle">
                  <table>
                    <thead>
                      <th>No</th>
                      <th>STONE ID</th>
                      <th>DESCRIPTION</th>
                      <th>CARATS</th>
                      <th>RATE USD PER CT</th>
                      <th>TOTAL AMOUNT USD</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>DX-50</td>
                        <td>TOTAL 463 PIC OF GIA CERTIFIED AS PER PACKING LIST </td>
                        <td>243.30</td>
                        <td>2285.46</td>
                        <td>556053.47</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="3">Gross Total</td>
                        <td>243.30</td>
                        <td></td>
                        <td>556053.47</td>
                      </tr>
                      <tr>
                        <td colspan="2" class="text-left pl-1">Amount in Words:</td>
                        <td colspan="4" class="text-left pl-1">FIVE HUNDRED FIFTY SIX THOUSAND FIFTY THREE & CENT FORTY
                          SEVEN ONLY.</td>
                      </tr>
                      <tr>
                        <td colspan="6" class="text-left pl-1">"The diamonds herein invoiced have been purchased from
                          legitimate sources not involved in funding conflict and in compliance with United Nations
                          Resolution. The Seller hereby guarantees that these diamonds are conflicts free, based on
                          personal knowledge and/or written guarantees provided by the supplier of these diamond."</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div class="body-footer">
                  <div class="body-top border-top-0 pl-1">
                    <div class="bo-left w-50">
                      <span class="c-st text-left">Bankers:</span>
                      <table>
                        <tbody>
                          <tr>
                            <td>A/C NAME.:</td>
                            <td><b>GLOWSTAR</b></td>
                          </tr>
                          <tr>
                            <td>ACCOUNT No.:</td>
                            <td><b>012-791-0-802344-4(USD)</b></td>
                          </tr>
                          <tr>
                            <td>BANK NAME.:</td>
                            <td><b>BANK OF CHINA(HONGKONG) LIMITED</b></td>
                          </tr>
                          <tr>
                            <td>ADDRESS:</td>
                            <td><b>BANK OF CHINA TOWER, 1 GARDEN ROAD,CENTRAL,HONG KONG</b></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="bo-right w-50 p-2">
                      <span class="c-st text-left">Signature & Date:</span>
                      <img src="commonAssets/images/glowstar.png" class="w-25" alt="logo">
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            </body>
            </html>`
  }

  public bindStones(labIssueItems: LabIssueItem[], indx: number, count: number): string {
    let html = '';
    let pNo: number = (count * indx);
    let myNo: number = pNo;
    for (let i = pNo; i < pNo + count; i++) {
      var obj = labIssueItems[i];
      if (obj) {
        html += `<tr>
      <td>`+ (myNo + 1) + `</td>
      <td>`+ obj.stoneId + `</td>
      <td>`+ (obj.shape ? obj.shape : "-") + `</td>
      <td></td>
      <td>`+ obj.weight.toFixed(3) + `</td>
      <td>`+ obj.length.toFixed(2) + `-` + obj.width.toFixed(2) + `</td>
      <td>`+ obj.height + `</td>
      <td>`+ (obj.color ? obj.color : "-") + `</td>
      <td>`+ (obj.clarity ? obj.clarity : "-") + `</td>
      <td>`+ (obj.basePrice.perCarat ? obj.basePrice.perCarat.toFixed(2) : "-") + `</td>
      <td>`+ (obj.basePrice.netAmount ? obj.basePrice.netAmount.toFixed(2) : "-") + `</td>
      <td></td>
      </tr>`;
        myNo += 1;
      }

    }

    return html;
  }

}