import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { SupplierResponse, SupplierSearchCriteria } from '../../businessobjects';
import { Supplier, SupplierDNorm } from '../../entities';

@Injectable({
  providedIn: 'root'
})

export class SupplierService {

  constructor(private http: HttpClient) { }

  async supplierRequest(organizationData: Supplier): Promise<string> {
    return await this.http.post(keys.apiUrl + "Supplier/Insert", organizationData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async supplierUpdate(organizationData: Supplier): Promise<string> {
    return await this.http.put(keys.apiUrl + "Supplier/Update", organizationData, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

  async getsuppliers(supplierCriteria: SupplierSearchCriteria, skip: number, take: number): Promise<SupplierResponse> {
    return await this.http.post(keys.apiUrl + "Supplier/GetPaginated/" + skip + "/" + take, supplierCriteria)
      .toPromise() as SupplierResponse;
  }

  async deleteSupplier(id: string): Promise<boolean> {
    return await this.http.delete(keys.apiUrl + "Supplier/Delete/" + id)
      .toPromise() as boolean;
  }

  async getSupplierDNorm(): Promise<SupplierDNorm[]> {
    return await this.http.get(keys.apiUrl + "Supplier/GetDNorms/")
      .toPromise() as Supplier[];
  }

  async getSupplierById(id: string): Promise<Supplier> {
    return await this.http.get(keys.apiUrl + "Supplier/Get/" + id)
      .toPromise() as Supplier;
  }

  async getSupplierByName(name: string): Promise<Supplier> {
    return await this.http.get(keys.apiUrl + "Supplier/Search/" + name)
      .toPromise() as Supplier;
  }

  async getAllSuppliers(): Promise<Supplier[]> {
    return await this.http.get(keys.apiUrl + "Supplier/GetAll")
      .toPromise() as Supplier[];
  }
}