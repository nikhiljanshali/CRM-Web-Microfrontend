import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavPanelItem } from 'common/businessobjects/navigation/navpanelitem';
import { EmpPermission, fxCredential } from 'common/entities';
import { AppPreloadService } from 'common/services';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
})

export class SideMenuComponent implements OnInit {
  @Input() user: any;
  public navList!: NavPanelItem[];
  menuItems = [
    {
      menuName: 'Dashboard', menuUrl: "/dashboard", menuImage: "commonAssets/images/svg/dashboard.svg", subMenu: [], expand: false
    },
    {
      menuName: 'Organization', menuUrl: "", menuImage: "commonAssets/images/svg/organization.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Organizations', subMenuUrl: "/organization", subMenuImage: "commonAssets/images/svg/candidates.svg"
        },
        {
          subMenuName: 'Configuration', subMenuUrl: "/organization/configurations", subMenuImage: "commonAssets/images/svg/configuration.svg"
        },
        {
          subMenuName: 'Employee', subMenuUrl: "/employee", subMenuImage: "commonAssets/images/svg/employee.svg"
        },
        {
          subMenuName: 'Party', subMenuUrl: "/party", subMenuImage: "commonAssets/images/svg/party.svg"
        },
        {
          subMenuName: 'Broker', subMenuUrl: "/broker", subMenuImage: "commonAssets/images/svg/broker.svg"
        },
        {
          subMenuName: 'Customer', subMenuUrl: "/customer", subMenuImage: "commonAssets/images/svg/customers.svg"
        }
      ]
    },
    {
      menuName: 'Inventory', menuUrl: "", menuImage: "commonAssets/images/svg/inventory.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Inventory', subMenuUrl: "/updateinventory", subMenuImage: "commonAssets/images/svg/inventory.svg"
        },
        {
          subMenuName: 'Inventory Upload', subMenuUrl: "/inventoryupload", subMenuImage: "commonAssets/images/svg/inventoryupload.svg"
        },
        {
          subMenuName: 'Inclusion Upload', subMenuUrl: "/inclusionupload", subMenuImage: "commonAssets/images/svg/inclusionupload.svg"
        },
        {
          subMenuName: 'Stock On Hand', subMenuUrl: "/stockonhand", subMenuImage: "commonAssets/images/svg/stockonhand.svg"
        },
        {
          subMenuName: 'Stone Media', subMenuUrl: "/stonemedia", subMenuImage: "commonAssets/images/svg/stonemedia.svg"
        },
        {
          subMenuName: 'Grading', subMenuUrl: "/grading", subMenuImage: "commonAssets/images/svg/grading.svg"
        },
        {
          subMenuName: 'Lead', subMenuUrl: "/lead", subMenuImage: "commonAssets/images/svg/lead.svg"
        },
        {
          subMenuName: 'Memo', subMenuUrl: "/memomaster", subMenuImage: "commonAssets/images/svg/memo.svg"
        },
      ]
    },
    {
      menuName: 'RFID', menuUrl: "", menuImage: "commonAssets/images/svg/rfidstock.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'RFID Stock', subMenuUrl: "/rfid", subMenuImage: "commonAssets/images/svg/stock-rfid.svg"
        },
        {
          subMenuName: 'RFID StockTally', subMenuUrl: "/rfid/rfidstocktally", subMenuImage: "commonAssets/images/svg/stocktally.svg"
        },
      ]
    },
    {
      menuName: 'Lab', menuUrl: "", menuImage: "commonAssets/images/svg/lab.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Lab Issue Receive', subMenuUrl: "/labissuemaster", subMenuImage: "commonAssets/images/svg/lab.svg"
        },
        {
          subMenuName: 'Lab Result Upload', subMenuUrl: "/labreconsiliation", subMenuImage: "commonAssets/images/svg/labresult.svg"
        },
        {
          subMenuName: 'Lab Expense', subMenuUrl: "/labexpense", subMenuImage: "commonAssets/images/svg/labresult.svg"
        }
      ]
    },
    {
      menuName: 'Accounting', menuUrl: "", menuImage: "commonAssets/images/svg/accounting.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Accounting Information', subMenuUrl: "/accountingInformation", subMenuImage: "commonAssets/images/svg/accounting.svg"
        },
        {
          subMenuName: 'Services Master', subMenuUrl: "/invoiceservice", subMenuImage: "commonAssets/images/svg/servicesmaster.svg"
        }
      ]
    },
    {
      menuName: 'Order', menuUrl: "", menuImage: "commonAssets/images/svg/order.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Order', subMenuUrl: "/order", subMenuImage: "commonAssets/images/svg/order.svg"
        }
      ]
    },
    {
      menuName: 'Invoice', menuUrl: "", menuImage: "commonAssets/images/svg/order.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Invoice', subMenuUrl: "/invoice", subMenuImage: "commonAssets/images/svg/order.svg"
        }
      ]
    },
    {
      menuName: 'Configuration', menuUrl: "", menuImage: "commonAssets/images/svg/configuration.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Account Config', subMenuUrl: "/accountconfiguration", subMenuImage: "commonAssets/images/svg/accountconfig.svg"
        },
      ]
    },
  ];

  public fxCredentials!: fxCredential;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    let windowlight = event.target.innerWidth;
    this.functionForListeners(windowlight)
  }

  @HostListener('window:load', ['$event'])
  onLoad(event: any) {
    let windowBandwidth = event.currentTarget.innerWidth;
    this.functionForListeners(windowBandwidth)

  }

  constructor(private router: Router, private appPreloadService: AppPreloadService) {
  }

  ngOnInit(): void {
    this.defaultMethodsLoad();
  }

  public defaultMethodsLoad() {
    this.setUserData();
    //this.setMenuByPermission();
    this.loadScripts();
  }

  public setUserData() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
  }

  setMenuByPermission() {
    let permissions = sessionStorage.getItem("userPermission");
    if (permissions) {
      // this.navList = this.navigationService.getNavPanelItems();
      let data = JSON.parse(permissions) as EmpPermission;
      if (data && data.navGroups && data.navItems)
        this.bindMenuByPermission(data);
    }
  }

  public bindMenuByPermission(data: EmpPermission) {
    this.menuItems = [];

    //Init Dashboard
    this.menuItems.push({ menuName: 'Dashboard', menuUrl: "/dashboard", menuImage: "commonAssets/images/svg/dashboard.svg", subMenu: [], expand: false });

    this.navList.forEach(nav => {
      let menuGroup: any;

      let userRight = data.navGroups.find((c: any) => c.name == nav.name);
      if (userRight) {
        menuGroup = { menuName: userRight.name, menuUrl: nav.path, menuImage: "commonAssets/images/svg/" + nav.icon, expand: false, subMenu: [] };

        if (nav.items && nav.items.length > 0) {
          nav.items.forEach(subNav => {
            let userRightItems = data.navItems.find((c: any) => c.name == subNav.name);

            if (userRightItems) {
              let menuItem: any;
              menuItem = { subMenuName: userRightItems.name, subMenuUrl: subNav.path, subMenuImage: "commonAssets/images/svg/" + subNav.icon, expand: false };

              menuGroup.subMenu.push(menuItem);
            }
          });
        }

        this.menuItems.push(menuGroup);
      }
    });
    this.activeRouteCollapse();
  }

  public activeRouteCollapse() {
    let activePage = this.router.url;
    let index = this.menuItems.findIndex((c: any) => c.subMenu.map((d: any) => d.subMenuUrl.split("/")[1]).includes(activePage.split("/")[1]))
    if (index > -1) {
      this.menuItems[index].expand = true;
    }
  }

  loadScripts() {
    let documentSideBar: any = document;

    // left panel open-close
    documentSideBar.querySelector(".l-click").addEventListener("click", function () {
      documentSideBar.body.classList.toggle("active");
    });

    // Mobile top menu navigation
    documentSideBar.querySelector(".hum-menu").addEventListener("click", function () {
      if (documentSideBar.querySelector(".nav-right").classList.contains("active")) {
        documentSideBar.querySelector(".nav-right").classList.remove("active");
        documentSideBar.querySelector(".hum-menu").classList.remove("active");
      } else {
        documentSideBar.querySelector(".nav-right").classList.add("active");
        documentSideBar.querySelector(".hum-menu").classList.add("active");
      }
    });

  }

  functionForListeners(windowlight: any) {
    if (windowlight < 991)
      document.body.classList.add('active')
    else
      document.body.classList.remove('active')
  }

  toggleClass(i: any) {

    for (let index = 0; index < this.menuItems.length; index++) {
      const element = this.menuItems[index];
      if (index != i)
        element.expand = false;
    }
    this.menuItems[i].expand = !this.menuItems[i].expand;
    return false;
  }

  onRightClick(item: any) {
    this.router.navigate([item.menuUrl])
    return false;
  }

  onSubRightClick(item: any) {
    this.router.navigate([item.subMenuUrl])
    return false;
  }

}