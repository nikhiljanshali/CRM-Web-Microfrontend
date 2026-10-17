import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LabIssue } from 'common/businessobjects'; // TODO : Need to Change Ref
import { FileStore } from 'common/entities'; // TODO : Need to Change Ref
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
      providedIn: 'root'
})

export class FileStoreService {

      constructor(private http: HttpClient) { }

      public async getFileByIdent(ident: string): Promise<FileStore[]> {
            return await this.http.get(environment.apiFileUploadUrl + "fileupload/FileStoreByIdent/" + ident)
                  .toPromise() as FileStore[];
      }

      public async getPathToBase64(id: string, type: string): Promise<string> {
            return await this.http.get(environment.apiFileUploadUrl + "fileupload/PathToBase64/" + id + "/" + type, {
                  observe: "body",
                  responseType: "text"
            }).toPromise() as string;
      }

      public async updateFileStore(file: FileStore): Promise<boolean> {
            return await this.http.put(environment.apiFileUploadUrl + "fileupload/Update", file)
                  .toPromise() as boolean;
      }

      public postUploadFileDocument(file: File, type: string, ident: string, folderName: string): Observable<HttpEvent<any>> {
            const formData: FormData = new FormData();
            formData.append('files', file);
            formData.append('type', type);
            formData.append('ident', ident);
            formData.append('folderName', folderName);

            const req = new HttpRequest('POST', `${environment.apiFileUploadUrl}fileupload/uploadfile`, formData, {
                  reportProgress: true,
                  responseType: 'json'
            });
            return this.http.request(req);
      }

      public async downloadFile(id: string): Promise<any> {
            const url = environment.apiFileUploadUrl + "fileupload/DownloadFile/" + id;
            let res = await this.http.get(url, { responseType: 'text' })
                  .toPromise() as any;
            if (res)
                  this.openFile(url);
      }

      public openFile(urlString: string) {
            window.location.href = urlString;
      }

      public async downloadExcel(organizationId: string, labIssue: LabIssue): Promise<any> {
            const url = environment.apiFileUploadUrl + "fileupload/DownloadExcelFile/" + organizationId;
            return await this.http.post(url, labIssue, { responseType: 'blob' })
                  .toPromise() as any;
      }

      public async exportGiaCsvData(organizationId: string, labIssue: LabIssue): Promise<any> {
            const url = environment.apiFileUploadUrl + "fileupload/DownloadGiaCsv/" + organizationId;
            return await this.http.post(url, labIssue, { responseType: 'blob' })
                  .toPromise() as any;
      }

      public async downloadBarcodeExcel(inventoryItems: string[]): Promise<any> {
            const url = environment.apiFileUploadUrl + "fileupload/ExportExcelBarcode";
            return await this.http.post(url, inventoryItems, { responseType: 'blob' })
                  .toPromise() as any;
      }
}
