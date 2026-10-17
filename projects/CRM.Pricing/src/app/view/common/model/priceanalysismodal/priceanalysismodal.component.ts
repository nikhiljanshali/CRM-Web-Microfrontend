import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-priceanalysismodal',
  templateUrl: './priceanalysismodal.component.html',
  styleUrls: ['./priceanalysismodal.component.css']
})
export class PriceanalysismodalComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public isAnalytics:boolean = true;

  // public openAnalyticsDialog(): void {
  //   this.isAnalytics = true;
  // }
  public closeAnalyticsDialog(): void {
    this.isAnalytics = false;
  }

  public series: any[] = [
    {
      name: "Day Wise pricing Discount",
      data: [
        3.907, 7.943, 7.848, 9.284, 9.263, 9.801, 3.89, 8.238, 9.552, 6.855,
      ],
    },
    {
      name: "Weekley Rapnet Data Chart",
      data: [4.743, 7.295, 7.175, 6.376, 8.153, 8.535, 5.247, -7.832, 4.3, 4.3],
    },
    {
      name: "Pcs Wise Chart",
      data: [
        0.01, -0.375, 1.161, 0.684, 3.7, 3.269, 1.083, -5.127, 3.69, 2.995,
      ],
    },
    {
      name: "Range Area Chart",
      data: [
        1.988, 2.733, 3.994, 3.464, 4.001, 3.939, 1.333, -2.245, 4.339, 2.727,
      ],
    },
  ];
  public categories: number[] = [
    2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011,
  ];


  public daywiseData = [
    { day: "16-01-2022", min: 5, max: 13 },
    { day: "17-01-2022", min: 7, max: 15 },
    { day: "18-01-2022", min: 10, max: 19 },
    { day: "19-01-2022", min: 13, max: 23 },
    { day: "20-01-2022", min: 17, max: 28 },
    { day: "21-01-2022", min: 20, max: 30 },
    { day: "22-01-2022", min: 20, max: 30 },
    { day: "23-01-2022", min: 17, max: 26 },
    { day: "24-01-2022", min: 13, max: 22 },
    { day: "18-01-2022", min: 10, max: 19 },
    { day: "19-01-2022", min: 13, max: 23 },
    { day: "20-01-2022", min: 17, max: 28 },
    { day: "21-01-2022", min: 20, max: 30 },
    { day: "22-01-2022", min: 20, max: 30 },
    { day: "23-01-2022", min: 17, max: 26 },
    { day: "24-01-2022", min: 13, max: 22 },
    { day: "25-01-2022", min: 9, max: 16 },
    { day: "26-01-2022", min: 6, max: 13 },
    { day: "27-01-2022", min: 5, max: 11 },
    { day: "28-01-2022", min: 5, max: 13 },
    { day: "29-01-2022", min: 6, max: 13 },
    { day: "30-01-2022", min: 5, max: 11 },
    { day: "31-01-2022", min: 5, max: 13 },
    { day: "01-02-2022", min: 7, max: 15 },
    { day: "02-02-2022", min: 10, max: 19 },
    { day: "03-02-2022", min: 13, max: 23 },
    { day: "04-02-2022", min: 17, max: 28 },
    { day: "05-02-2022", min: 20, max: 30 },
    { day: "06-02-2022", min: 20, max: 30 },
    { day: "07-02-2022", min: 17, max: 26 },
    { day: "08-02-2022", min: 13, max: 22 },
    { day: "09-02-2022", min: 9, max: 16 },
    { day: "10-02-2022", min: 6, max: 13 },
    { day: "14-02-2022", min: 5, max: 11 },
  ];

  public weekwiseData = [
    { week: "24-12-2021", min: 5, max: 13 },
    { week: "31-12-2021", min: 7, max: 15 },
    { week: "07-01-2022", min: 10, max: 19 },
    { week: "14-01-2022", min: 13, max: 23 },
    { week: "21-01-2022", min: 5, max: 13 },
    { week: "28-01-2022", min: 7, max: 15 },
    { week: "04-02-2022", min: 10, max: 19 },
    { week: "11-02-2022", min: 13, max: 23 },
  ];

  public pcswiseData = [
    { pcs: "IF", min: 5, max: 13 },
    { pcs: "VVS1", min: 7, max: 15 },
    { pcs: "VVS2", min: 10, max: 19 },
    { pcs: "VS1", min: 13, max: 23 },
    { pcs: "VS2", min: 5, max: 13 },
    { pcs: "SI1", min: 7, max: 15 },
    { pcs: "SI2", min: 10, max: 19 },
    { pcs: "SI3", min: 13, max: 23 },
    { pcs: "I1", min: 7, max: 15 },
    { pcs: "I2", min: 10, max: 19 },
    { pcs: "I3", min: 13, max: 23 },
  ];

  public rangewiseData = [
    { range: "$ 500", min: 5, max: 13 },
    { range: "$ 1000", min: 7, max: 15 },
    { range: "$ 1500", min: 10, max: 19 },
    { range: "$ 2000", min: 13, max: 23 },
    { range: "$ 5000", min: 5, max: 13 },
    { range: "$ 10000", min: 7, max: 15 },
    { range: "$ 25000", min: 10, max: 19 },
    { range: "$ 25000+", min: 13, max: 23 },
  ];


  public labelContentFrom(e: any): string {
    return `${e.value.from} %`;
  }

  public labelContentTo(e: any): string {
    return `${e.value.to} %`;
  }

}
