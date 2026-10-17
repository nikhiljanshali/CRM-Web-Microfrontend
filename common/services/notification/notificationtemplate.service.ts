import { fxCredential, Notifications } from "common/entities";

export function PriceRequestTemplate(fxCredentials: fxCredential, receiverId: string): Notifications {
    let notification = new Notifications();
    notification.icon = "icon-info";
    notification.title = "New Pricing Request";
    notification.categoryType = "information";
    notification.description = "You got new request for pricing stones from " + fxCredentials.fullName;
    notification.action = "/requestprice";
    notification.senderId = fxCredentials.id;
    notification.receiverId = receiverId;
    return notification;
}

export function ApplyPriceRequestTemplate(fxCredentials: fxCredential, receiverId: string, stoneIds: string[]): Notifications {
    let notification = new Notifications();
    notification.icon = "icon-info";
    notification.title = "Price Request Done";
    notification.categoryType = "information";
    notification.description = "Pricing for stone(s) " + stoneIds.join(", ") + " has been completed by " + fxCredentials.fullName;
    notification.senderId = fxCredentials.id;
    notification.receiverId = receiverId;
    return notification;
}