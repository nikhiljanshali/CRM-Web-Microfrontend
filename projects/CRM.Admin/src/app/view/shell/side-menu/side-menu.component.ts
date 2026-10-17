import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavPanelItem } from 'common/businessobjects/navigation/navpanelitem';
import { EmpPermission, fxCredential } from 'common/entities';
import { AppPreloadService } from 'common/services';
import { NavigationService } from '../../../services';

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
      menuName: 'Organization', menuUrl: "", menuImage: "commonAssets/images/svg/admin.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Organizations', subMenuUrl: "/organization", subMenuImage: "commonAssets/images/svg/candidates.svg"
        },
        {
          subMenuName: 'Employee', subMenuUrl: "/employee", subMenuImage: "commonAssets/images/svg/employee.svg"
        },
        {
          subMenuName: 'Inventory', subMenuUrl: "/updateinventory", subMenuImage: "commonAssets/images/svg/inventory.svg"
        },
        {
          subMenuName: 'Inventory Upload', subMenuUrl: "/inventoryupload", subMenuImage: "commonAssets/images/svg/inventoryupload.svg"
        },
      ]
    },
    {
      menuName: 'Configuration', menuUrl: "", menuImage: "commonAssets/images/svg/configuration.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Configuration', subMenuUrl: "/configuration", subMenuImage: "commonAssets/images/svg/configuration.svg"
        },
        {
          subMenuName: 'Masterconfig', subMenuUrl: "/masterconfig", subMenuImage: "commonAssets/images/svg/configuration.svg"
        },
      ]
    },
    // {
    //   menuName: 'Employees', menuUrl: "", menuImage: "commonAssets/images/svg/employee.svg", subMenu: [], expand: false
    // },
    {
      menuName: 'Users', menuUrl: "", menuImage: "commonAssets/images/svg/admins.svg", subMenu: [], expand: false
    },
    // {
    //   menuName: 'Party', menuUrl: "dashboard", menuImage: "commonAssets/images/svg/admins.svg", subMenu: [], expand: false
    // },
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

  constructor(private navigationService: NavigationService, private router: Router, private appPreloadService: AppPreloadService) {
  }

  ngOnInit(): void {
    this.defaultMethodsLoad();
  }

  public defaultMethodsLoad() {
    this.setUserData();
    this.setMenuByPermission();
    this.loadScripts();
  }

  public setUserData() {
    this.fxCredentials = JSON.parse(sessionStorage.getItem("fxCredentials") ?? '') as fxCredential;
  }

  setMenuByPermission() {
    let permissions = sessionStorage.getItem("userPermission");
    if (permissions) {
      this.navList = this.navigationService.getNavPanelItems();
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
    if (windowlight < 991) {
      document.body.classList.add('active')
    }
    else {
      document.body.classList.remove('active')
    }
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