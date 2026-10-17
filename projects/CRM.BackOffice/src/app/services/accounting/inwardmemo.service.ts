import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { keys } from "shared/auth";
import { MemoSearchCriteria } from "../../businessobjects";
import { InventoryItems, InWardMemo } from "../../entities";

@Injectable({
    providedIn: 'root'
})

export class InwardMemoService {
    private baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = keys.apiUrl + 'InwardMemo/'
    }

    public async getbyId(memoId: string): Promise<InWardMemo> {
        return await this.http.get(this.baseUrl + "GetbyId/" + memoId)
            .toPromise() as InWardMemo;
    }

    public async getAll(): Promise<InWardMemo[]> {
        return await this.http.get(this.baseUrl + "GetAll")
            .toPromise() as InWardMemo[];
    }

    public async getCount(includeReceived: boolean): Promise<number> {
        return await this.http.get(this.baseUrl + "GetCount/" + includeReceived)
            .toPromise() as number;
    }

    public async getPaginated(skip: number, take: number): Promise<InWardMemo[]> {
        return await this.http.get(this.baseUrl + "GetPaginated/" + skip + "/" + take)
            .toPromise() as InWardMemo[];
    }

    public async getFiltered(criteria: MemoSearchCriteria): Promise<InWardMemo[]> {
        return await this.http.post(this.baseUrl + "GetFiltered", criteria)
            .toPromise() as InWardMemo[];
    }

    public async insert(inwardMemo: InWardMemo): Promise<string> {
        return await this.http.post(this.baseUrl + "Insert", inwardMemo, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    public async insertInwardMemoInventory(invItems: InventoryItems[]): Promise<boolean> {
        return await this.http.post(this.baseUrl + "InsertMemoInvs", invItems)
            .toPromise() as boolean;
    }

    public async update(inwardMemo: InWardMemo): Promise<boolean> {
        return await this.http.put(this.baseUrl + "Update", inwardMemo)
            .toPromise() as boolean;
    }

    public async delete(memoId: string): Promise<boolean> {
        return await this.http.delete(this.baseUrl + "Delete/" + memoId)
            .toPromise() as boolean;
    }

}