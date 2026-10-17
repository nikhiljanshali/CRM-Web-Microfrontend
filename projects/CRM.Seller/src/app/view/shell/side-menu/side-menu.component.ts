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
  menuItems: any = [
    {
      menuName: 'Dashboard', menuUrl: "/dashboard", menuImage: "commonAssets/images/svg/dashboard.svg", subMenu: [], expand: false
    },
    // {
    //   menuName: 'Inventory', menuUrl: "/inventory", menuImage: "commonAssets/images/svg/inventory.svg", subMenu: [], expand: false
    // },
    // {
    //   menuName: 'Lead', menuUrl: "/lead", menuImage: "commonAssets/images/svg/dashboard.svg", subMenu: [], expand: false
    // },
    // {
    //   menuName: 'Customer', menuUrl: "/customer", menuImage: "commonAssets/images/svg/customers.svg", subMenu: [], expand: false
    // }
    {
      menuName: 'Organization', menuUrl: "", menuImage: "commonAssets/images/svg/organization.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Customer', subMenuUrl: "/customer", subMenuImage: "commonAssets/images/svg/customers.svg"
        }
      ]
    },
    {
      menuName: 'Inventory', menuUrl: "", menuImage: "commonAssets/images/svg/inventory.svg", expand: false,
      subMenu: [
        {
          subMenuName: 'Inventory', subMenuUrl: "/inventory", subMenuImage: "commonAssets/images/svg/inventory.svg"
        },
        {
          subMenuName: 'Lead', subMenuUrl: "/lead", subMenuImage: "commonAssets/images/svg/lead.svg"
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

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private appPreloadService: AppPreloadService
  ) {
  }

  ngOnInit(): void {
    this.defaultMethodsLoad();
  }

  public defaultMethodsLoad() {
    this.setUserData();
    // this.setMenuByPermission();
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