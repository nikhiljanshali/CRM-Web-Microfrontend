import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'common/auth/keys';
import { MemoSearchCriteria, MemoResponse, MemoReceive, MemoReceiveResponse } from 'common/businessobjects';
import { InventoryItems, Memo, TakenBy } from 'common/entities';

@Injectable({
    providedIn: 'root'
})

export class MemoService {

    constructor(private http: HttpClient) { }

    public async getMemoInventoryUpdate(inventoryItems: InventoryItems[]): Promise<boolean> {
        return await this.http.post(keys.apiUrl + "Memo/UpdateInventoryMemo", inventoryItems)
            .toPromise() as boolean;
    }

    public async getMemos(memoSearchCriteria: MemoSearchCriteria, skip: number, take: number): Promise<MemoResponse> {
        return await this.http.post(keys.apiUrl + "Memo/GetPaginated/" + skip + "/" + take, memoSearchCriteria)
            .toPromise() as MemoResponse;
    }

    public async getTakenByName(name: string): Promise<TakenBy[]> {
        return await this.http.get(keys.apiUrl + "Memo/GetTakenByName/" + name)
            .toPromise() as TakenBy[];
    }

    public async insertTakenBy(takenBy: TakenBy): Promise<TakenBy> {
        return await this.http.post(keys.apiUrl + "Memo/InsertTakenBy", takenBy).toPromise() as TakenBy;
    }

    public async insertMemo(memo: Memo): Promise<string> {
        return await this.http.post(keys.apiUrl + "Memo/Insert", memo, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    public async updateMemo(memo: Memo): Promise<string> {
        return await this.http.put(keys.apiUrl + "Memo/Update", memo, {
            observe: "body",
            responseType: "text"
        }).toPromise() as string;
    }

    public async deleteMemo(Id: string): Promise<boolean> {
        return await this.http.delete(keys.apiUrl + "Memo/Delete/" + Id)
            .toPromise() as boolean;
    }

    public async fetchMemoByStone(memoReceiveObj: MemoReceive): Promise<MemoReceiveResponse[]> {
        return await this.http.post(keys.apiUrl + "Memo/MemoStones", memoReceiveObj)
            .toPromise() as MemoReceiveResponse[];
    }

}