import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { RewardCoin } from 'src/app/shared/models/reward-coin';
import { Users } from 'src/app/shared/models/users/user';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { RewardCoinService } from 'src/app/shared/services/reward-Coin.server';
import { TrainingService } from 'src/app/shared/services/training.service';

declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-reward-coin',
  templateUrl: './reward-coin.component.html',
  styleUrls: ['./reward-coin.component.scss']
})

export class RewardCoinComponent implements OnInit {
  private token: string
  private fetchRecord: number;
  private alertMessage: string;
  public rewardCoins: RewardCoin[] = new Array<RewardCoin>();
  public rewardCoin: any;
  public isShowRewardCoinSelection: boolean = true;
  public selectedRewardCoin = [];
  public displayColumns = ["id", "rewardCoin", "rewardType", "assignRole", "isScratchCard", "createdDate", "status", "Action"];
  public title: string;
  public user: Users = new Users();
  public rewardTypes = [];
  public roles = [];

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  private startIndex: number;
  private skip: number = 0;
  private take: number = 15;
  private activePage: number = 1;
  private count: number = 0;
  public paginate: any;
  public isFlag: boolean = true;

  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private rewardCoinService: RewardCoinService,
    private paginationService: PaginationService,
    private trainingService: TrainingService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'rewardCoin');
      if (ind >= 0) {
        let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
        this.isReadPermission = (roleId == 1) ? true : this._userPagePermission[ind].readPermission;
        this.isWritePermission = (roleId == 1) ? true : this._userPagePermission[ind].writePermission;
        this.isEditPermission = (roleId == 1) ? true : this._userPagePermission[ind].editPermission;
        this.isDeletePermission = (roleId == 1) ? true : this._userPagePermission[ind].deletePermission;
      }
    } else {
      let roleId = JSON.parse(sessionStorage.getItem("Credential")).userRole.roleId;
      this.isReadPermission = (roleId == 1) ? true : false;
      this.isWritePermission = (roleId == 1) ? true : false;
      this.isEditPermission = (roleId == 1) ? true : false;
      this.isDeletePermission = (roleId == 1) ? true : false;
    }
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.getRoles();
    await this.setPage(1);
    await this.getRewardType();

  }

  rewardCoinform = new FormGroup({
    'rewardCoin': new FormControl('', Validators.required),
    'rewardTypeId': new FormControl('', Validators.required),
    'minLoanFile': new FormControl(''),
    'maxLoanFile': new FormControl(''),
    'isScratchCard': new FormControl(''),
    'roleIds': new FormControl('', Validators.required)
  })

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getRewardCoin();
    }
  }

  public async getRoles() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getRoles(this.token);
      if (res && res.status == 200) {
        this.roles = res.recordList;
        if (this.roles && this.roles.length > 0) {
          this.roles = this.roles.filter(c => c.name == "CUSTOMERS" || c.name == "DSA" || c.name == "SUBDSA" || c.name == "CONNECTOR" || c.name == "EMPLOYEE")
        }
      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage);
    }
  }

  public async getRewardCoin() {
    try {
      this.spinnerService.show();
      let res = await this.rewardCoinService.getRewardCoin(this.startIndex, this.fetchRecord, this.token);
      if (res && res.status == 200) {
        this.rewardCoins = res.recordList;
        this.rewardCoins.forEach(ele => {
          if (ele.roleIds) {
            let roleIds = ele.roleIds.split(',');
            roleIds = roleIds.map(c => parseInt(c))
            ele.roleIds = roleIds;
            ele.roleName = null;
            ele.roleIds.forEach(roleele => {
              if (ele.roleName == null) {
                ele.roleName = this.roles.find(c => c.id == roleele).name;
              }
              else
                ele.roleName = ele.roleName + ',' + this.roles.find(c => c.id == roleele).name
            })
          }
          ele.isScratchCard = ele.isScratchCard ? true : false
        })

        this.count = res.totalRecords;
        this.paginate = this.paginationService.getPager(res.totalRecords, +this.activePage, this.take);
      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage)
    }
  }

  public async getRewardType() {
    try {
      this.spinnerService.show();
      let res = await this.rewardCoinService.getRewardType(this.token);
      if (res && res.status == 200) {
        this.rewardTypes = res.recordList;
      }
      if (this.rewardTypes.length > 0) {
        this.isFlag = true;
      } else {
        this.isFlag = false;
      }
      this.spinnerService.hide();
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage)
    }
  }

  public modalOpen(basicmodal: any) {
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Reward Coin";
    this.rewardCoin = new RewardCoin();
    this.isShowRewardCoinSelection = true;
    this.selectedRewardCoin = this.rewardCoins;
    this.rewardCoinform.reset();
  }


  public async insertRewardCoin() {
    try {
      if (this.rewardCoinform.valid) {
        this.spinnerService.show();
        let id = this.rewardCoin.id;
        this.rewardCoin = this.rewardCoinform.value;
        this.rewardCoin.id = id;
        let coin = this.rewardCoin.id ? this.rewardCoin.id : null;
        this.rewardCoin.id = coin;
        let res = await this.rewardCoinService.insertUpdateRewardCoin(this.rewardCoin, this.token);
        if (res && res.status == 200) {
          this.modalService.dismissAll();
          this.spinnerService.hide();
          await this.getRewardCoin();
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.rewardCoinform.controls).forEach(key => {
          this.rewardCoinform.controls[key].markAsTouched();
        });
      }
    } catch (error) {
      this.spinnerService.hide();
      this.alertMessage = error;
      if (error?.message) {
        this.alertMessage = error.message
      }
      if (error?.error && error.error.message) {
        this.alertMessage = error.error.message
      }
      if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
        this.alertMessage = error.error.error.functionErrorMessage
      }
      this.toastrService.error(this.alertMessage);
    }
  }

  public editDialog(element: RewardCoin, basicmodal) {
    this.title = "Edit Reward Coin"
    this.rewardCoin = new RewardCoin();
    this.rewardCoin = element;
    this.rewardCoinform.setValue({
      "rewardCoin": this.rewardCoin.rewardCoin,
      "rewardTypeId": this.rewardCoin.rewardTypeId,
      "maxLoanFile": this.rewardCoin.maxLoanFile ? this.rewardCoin.maxLoanFile : null,
      "minLoanFile": this.rewardCoin.minLoanFile ? this.rewardCoin.maxLoanFile : null,
      "isScratchCard": this.rewardCoin.isScratchCard ? this.rewardCoin.isScratchCard : null,
      "roleIds": this.rewardCoin.roleIds ? this.rewardCoin.roleIds : null
    })
    // this.modalService.open(basicmodal);
    this.modalService.open(basicmodal, { windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.selectedRewardCoin = this.rewardCoins.filter(c => c.id != element.id);
  }

  public cancelUser() {
    this.user = new Users();
    this.modalService.dismissAll();
  }

  public changeStatus(maritalStatus: RewardCoin) {
    let active = maritalStatus.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't " + active + " this Marital Status",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.rewardCoinService.activeInactiveRewardCoin(maritalStatus.id, maritalStatus.isActive, this.token);
          if (res && res.status == 200) {
            this.getRewardCoin();
            Swal.fire(
              active,
              'Successfully ' + active + ' Marital Status',
              'success'
            )
            const modalContent = document.querySelector('.swal2-container');
            sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
          }
          this.spinnerService.hide();
        } catch (error) {
          this.spinnerService.hide();
          this.alertMessage = error;
          if (error?.message) {
            this.alertMessage = error.message
          }
          if (error?.error && error.error.message) {
            this.alertMessage = error.error.message
          }
          if (error?.error && error.error.error && error.error.error.functionErrorMessage) {
            this.alertMessage = error.error.error.functionErrorMessage
          }
          this.toastrService.error(this.alertMessage);
        }
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

}