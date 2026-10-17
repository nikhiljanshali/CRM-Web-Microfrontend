import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { keys } from 'shared/auth';
import { Suggestion } from 'shared/enitites';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {


  private suggestion$ = new BehaviorSubject<boolean>(false);
  public selectedSuggestion$ = this.suggestion$.asObservable();

  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = keys.apiUrl + "Suggestion/";
  }


  public setSuggestion(data: boolean) {
    this.suggestion$.next(data);
  }

  public async getAllSuggestionLists(): Promise<Suggestion[]> {
    return await this.http.get(this.baseUrl + "GetAll").toPromise() as Suggestion[];
  }

  public async getAllSuggestionPaginated(skip: number, take: number): Promise<Suggestion[]> {
    return await this.http.get(this.baseUrl + "GetPaginated/" + + skip + "/" + take).toPromise() as Suggestion[];
  }

  public async insertSuggestion(suggestion: Suggestion): Promise<string> {
    return await this.http.post(this.baseUrl + "Insert", suggestion, {
      observe: "body",
      responseType: "text"
    }).toPromise() as string;
  }

}
