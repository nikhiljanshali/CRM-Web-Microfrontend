import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../websocket/websocket.service';
import { environment } from 'environments/environment';
import { Notifications } from 'common/entities';
import { NotificationResponse, NotificationSearchCriteria } from 'common/businessobjects';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    public messages: Subject<any>;
    public messageResponse: BehaviorSubject<string> = new BehaviorSubject<string>("");

    constructor(public wsService: WebsocketService, public http: HttpClient) {
        this.messages = new Subject<any>();
    }

    public getMessage() {
        this.messages.subscribe(msg => {
            return JSON.parse(msg);
        });
    }

    public WindowNotification(data: any) {
        let msg = JSON.parse(data) as Notifications;
        if (('Notification' in window)) {
            Notification.requestPermission(function () {
                var notification = new Notification(msg.title, { body: msg.description, dir: 'auto' });
                setTimeout(function () {
                    notification.close();
                }, 5000);
            });
        }
    }

    public connectWebsocket(ident: string) {
        let Socket_URL = environment.notificationSocketUrl + "ws/" + ident;
        this.messages = <Subject<any>>this.wsService
            .connect(Socket_URL)
            .pipe(map((response: MessageEvent) => {
                let data = response.data;
                this.messageResponse.next(data);
                this.WindowNotification(data);
                return data;
            }));
    }

    public async getMessgeByReceiver(id: string): Promise<NotificationResponse> {
        return await this.http.get(environment.notificationBaseUrl + "GetReceiverMessage/" + id)
            .toPromise() as NotificationResponse;
    }

    public async deleteMessage(id: string): Promise<any> {
        return await this.http.delete(environment.notificationBaseUrl + "DeleteMessage/" + id)
            .toPromise() as any;
    }

    public async deleteConnectionSocket(id: string): Promise<boolean> {
        return await this.http.delete(environment.notificationBaseUrl + "DeleteWebSocket/" + id)
            .toPromise() as boolean;
    }

    public async getHistoryMessage(id: string): Promise<Notifications[]> {
        return await this.http.get(environment.notificationBaseUrl + "GetHistoryMessage/" + id)
            .toPromise() as Notifications[];
    }

    public async getNotifications(notificationCriteria: NotificationSearchCriteria, skip: number, take: number): Promise<NotificationResponse> {
        return await this.http.post(environment.notificationBaseUrl + "GetPaginated/" + skip + "/" + take, notificationCriteria)
            .toPromise() as NotificationResponse;
    }

}
