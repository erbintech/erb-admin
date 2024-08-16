import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { LayoutService } from '../../services/layout.service';
import { UserPagesService } from '../../services/userPages.service';
import { Pages } from '../../models/users/pages';
import { UserPages } from '../../models/users/userPages';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent {

  public iconSidebar;
  public menuItems: Menu[];
  public url: any;
  public fileurl: any;

  // For Horizontal Menu
  public margin: any = 0;
  public width: any = window.innerWidth;
  public leftArrowNone: boolean = true;
  public rightArrowNone: boolean = false;

  public pageList: Pages[] = new Array<Pages>();
  public userPagePermission: UserPages[] = new Array<UserPages>();
  public userPermissionPages: Pages[] = new Array<Pages>();

  constructor(
    private router: Router,
    public navServices: NavService,
    public layout: LayoutService,
    private userPagesService: UserPagesService
  ) {
    this.pageList = JSON.parse(sessionStorage.getItem("pageList")) as Pages[];
    let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;

    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0)
      this.userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];

    if (roleId == 1) {//ADMINISTRATOR
      this.menuItems = this.pageList;
    } else {

      let pagePer: Pages[] = new Array<Pages>();
      if (this.pageList.length > 0 && this.userPagePermission.length > 0) {
        if (this.userPagePermission && this.userPagePermission.length > 0) {
          for (let i = 0; i < this.userPagePermission.length; i++) {
            for (let j = 0; j < this.pageList.length; j++) {
              if (this.pageList[j].id == this.userPagePermission[i].pageId) {
                let pg = new Pages();
                pg.active = false;
                pg.icon = this.pageList[j].icon;
                pg.id = this.pageList[j].id;
                pg.isActive = this.pageList[j].isActive;
                pg.isChecked = true;
                pg.isDelete = this.pageList[j].isDelete;
                pg.parentId = this.pageList[j].parentId;
                pg.path = this.pageList[j].path;
                pg.title = this.pageList[j].title;
                pg.type = this.pageList[j].type;
                pg.children = [];
                pagePer.push(pg);
                break;
              }
              for (let k = 0; k < this.pageList[j].children.length; k++) {
                if (this.pageList[j].children[k].id == this.userPagePermission[i].pageId) {
                  let pg = new Pages();
                  pg.active = false;
                  pg.icon = this.pageList[j].children[k].icon;
                  pg.id = this.pageList[j].children[k].id;
                  pg.isActive = this.pageList[j].children[k].isActive;
                  pg.isChecked = true;
                  pg.isDelete = this.pageList[j].children[k].isDelete;
                  pg.parentId = this.pageList[j].children[k].parentId;
                  pg.path = this.pageList[j].children[k].path;
                  pg.title = this.pageList[j].children[k].title;
                  pg.type = this.pageList[j].children[k].type;
                  pg.children = [];
                  pagePer.push(pg);
                  break;
                }
              }
            }
          }
        }
        pagePer.sort((a, b) => {
          if (a.parentId > b.parentId) {
            return 1
          } else {
            return -1
          }
        });
        for (let i = 0; i < pagePer.length; i++) {
          if (pagePer[i].parentId) {
            let ind = pagePer.findIndex(c => c.id == pagePer[i].parentId);
            if (ind >= 0) {
              pagePer[ind].children.push(pagePer[i]);
              pagePer.splice(i, 1);
              i--;
            }
          }
        }
        console.log(pagePer);
        this.menuItems = pagePer;
      }
    }
    // this.navServices.items.subscribe(menuItems => {
    //   this.menuItems = menuItems;
    //   this.router.events.subscribe((event) => {
    //     if (event instanceof NavigationEnd) {
    //       menuItems.filter(items => {
    //         if (items.path === event.url) {
    //           this.setNavActive(items);
    //         }
    //         if (!items.children) { return false; }
    //         items.children.filter(subItems => {
    //           if (subItems.path === event.url) {
    //             this.setNavActive(subItems);
    //           }
    //           if (!subItems.children) { return false; }
    //           subItems.children.filter(subSubItems => {
    //             if (subSubItems.path === event.url) {
    //               this.setNavActive(subSubItems);
    //             }
    //           });
    //         });
    //       });
    //     }
    //   });
    // });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.width = event.target.innerWidth - 500;
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  // Active Nave state
  setNavActive(item) {
    this.menuItems.filter(menuItem => {
      if (menuItem !== item) {
        menuItem.active = false;
      }
      if (menuItem.children && menuItem.children.includes(item)) {
        menuItem.active = true;
      }
      if (menuItem.children) {
        menuItem.children.filter(submenuItems => {
          if (submenuItems.children && submenuItems.children.includes(item)) {
            menuItem.active = true;
            submenuItems.active = true;
          }
        });
      }
    });
  }

  // Click Toggle menu
  toggletNavActive(item) {
    debugger
    if (!item.active) {
      this.menuItems.forEach(a => {
        if (this.menuItems.includes(item)) {
          a.active = false;
        }
        if (!a.children) { return false; }
        a.children.forEach(b => {
          if (a.children.includes(item)) {
            b.active = false;
          }
        });
      });
      item.active = !item.active;
    }
   
    this.menuItems = [...this.menuItems];
  }


  // For Horizontal Menu
  scrollToLeft() {
    if (this.margin >= -this.width) {
      this.margin = 0;
      this.leftArrowNone = true;
      this.rightArrowNone = false;
    } else {
      this.margin += this.width;
      this.rightArrowNone = false;
    }
  }

  scrollToRight() {
    if (this.margin <= -3051) {
      this.margin = -3464;
      this.leftArrowNone = false;
      this.rightArrowNone = true;
    } else {
      this.margin += -this.width;
      this.leftArrowNone = false;
    }
  }


}