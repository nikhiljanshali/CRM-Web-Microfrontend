// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:12360/api/',
  apiSupplierUrl: 'http://localhost:27656/api/',
  apiPricingProjectUrl: 'https://localhost:44351/api/',
  apiIdentityUrl: 'http://localhost:4592/api/',
  apiFileUploadUrl: 'http://localhost:26962/api/',
  apiCustomerUrl: 'http://localhost:16322/api/',
  apiSellerUrl: 'http://localhost:38981/api/',

  apiPricingUrl: 'http://172.20.2.53:9897/api/Back/GetMfgAmtForDay',
  apiBasePricingUrl: 'http://172.20.2.53:9897/api/Back/GetKapanDisc',
  apiMarketSheetPricingUrl: 'http://172.20.2.53:9897/api/Back/Glow/GetSalesBestDisc/true',
  apiMeasureGradeUrl: 'http://172.20.2.53:9897/api/MeasureGrade/GetBothGrade',

  invStoneCertiUrl: 'https://diamdna.com/reports/',
  invStoneImageUrl: 'https://diamdna.com/imaged/',
  invStoneVideoUrl: '/video.mp4',
  invStoneArrowBlackImageUrl: '/Arrow_Black_BG.jpg',
  invStoneStillImageUrl: '/still.jpg',
  invStoneHeartBlackImageUrl: '/Heart_Black_BG.jpg',
  invStoneAsetWhiteImageUrl: '/Aset_white_bg.jpg',
  invStoneIdealWhiteImageUrl: '/ideal_white_bg.jpg',
  invStoneOfficeLightBlackImageUrl: '/office_light_black_bg.jpg',

  notificationSocketUrl: 'ws://localhost:2624/',
  notificationBaseUrl: 'http://localhost:2624/',
  proposalUrl: 'http://localhost:9200/',
  backOffliceBaseUrl: "http://localhost:25264/api/",
  frontOfficeBaseUrl: "https://localhost:44363/api/"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
