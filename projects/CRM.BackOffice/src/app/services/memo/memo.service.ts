import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { keys } from 'shared/auth';
import { MemoReceive, MemoReceiveResponse, MemoResponse, MemoSearchCriteria } from '../../businessobjects';
import { InventoryItems, Memo, TakenBy} from '../../entities';

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

    public async getInventoriesByIdentId(identId: string): Promise<InventoryItems[]> {
        return await this.http.get(keys.apiUrl + "Memo/GetInventoriesByIdent/" + identId)
            .toPromise() as InventoryItems[];
    }

    public async getInventoriesByStoneID(stoneId: string): Promise<InventoryItems[]> {
        return await this.http.get(keys.apiUrl + "Memo/GetInventoriesByStone/" + stoneId)
            .toPromise() as InventoryItems[];
    }

    public async updateInventoryListData(inventoryItems: InventoryItems[]): Promise<boolean> {
        return await this.http.put(keys.apiUrl + "Memo/UpdateInventoryList", inventoryItems)
            .toPromise() as boolean;
    }

    public async getTakenByName(name: string): Promise<TakenBy[]> {
        return await this.http.get(keys.apiUrl + "Memo/GetTakenByName/" + name)
            .toPromise() as TakenBy[];
    }

    public async insertTakenBy(takenBy: TakenBy): Promise<TakenBy> {
        return await this.http.post(keys.apiUrl + "Memo/InsertTakenBy", takenBy).toPromise() as TakenBy;
    }

    public async getDataByMemoNo(memoNo: string): Promise<Memo> {
        return await this.http.get(keys.apiUrl + "Memo/GetDataByMemoNo/" + memoNo).toPromise() as Memo;
      }

}