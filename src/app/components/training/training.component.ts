import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Training } from 'src/app/shared/models/training';
import { TrainingCategory } from 'src/app/shared/models/trainingCategory';
import { UserPages } from 'src/app/shared/models/users/userPages';
import { LayoutService } from 'src/app/shared/services/layout.service';
import { PaginationService } from 'src/app/shared/services/pagination.service';
import { TrainingService } from 'src/app/shared/services/training.service';
import { UsersService } from 'src/app/shared/services/users.service';
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  public training = new Training();
  public trainings: Training[] = new Array<Training>();
  public paginate: any;
  public assignUserPaginate: any = {};
  private skip: number = 0;
  private take: number = 12;
  private activePage: number = 1;
  private count: number = 0;
  private startIndex: number;
  private fetchRecord: number;
  private token: string;
  public title: string;
  public trainingCategories: TrainingCategory[] = new Array<TrainingCategory>();
  public trainingSubCategories: TrainingCategory[] = new Array<TrainingCategory>();
  public alertMessage: string;
  public roles = [];
  public url: string;
  public documentType: string;
  public searchString: string;
  public selectedAssignedUsers = [];
  public selectedCategory = [];
  public isUploadedUrl: boolean = false;
  public displayColumns = ['id', 'User', 'ContactNo', 'Role', 'Status', 'completeTime'];
  public assignUserList: boolean = false;
  public selectedRoles = [];
  public users = [];
  public trainingId: number
  public trainingStatus: string
  public trainingCategory = [];

  public _userPagePermission: UserPages[] = new Array<UserPages>();
  public isReadPermission: boolean;
  public isWritePermission: boolean;
  public isEditPermission: boolean;
  public isDeletePermission: boolean;
  public userRoles = [];
  public interval: string
  public intervals = [{
    "name": 'min'
  },
  {
    "name": "sec"
  }
  ]

  constructor(
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private paginationService: PaginationService,
    private trainingService: TrainingService,
    private router: Router,
    public toastrService: ToastrService,
    private userService: UsersService,
    private renderer: Renderer2,
    public layout: LayoutService
  ) {
    if (sessionStorage.getItem("PagePermission") && JSON.parse(sessionStorage.getItem("PagePermission")).length > 0) {
      this._userPagePermission = JSON.parse(sessionStorage.getItem("PagePermission")) as UserPages[];
      let ind = this._userPagePermission.findIndex(c => c.name == 'training');
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
    await this.getTrainigCategory();
    await this.getRoles();
    await this.setPage(1);
  }

  public async setPage(pageNumber: number) {
    if (pageNumber > 0) {
      this.activePage = pageNumber;
      this.startIndex = (this.take * (this.activePage - 1));
      this.fetchRecord = this.take;
      this.skip = this.startIndex;
      await this.getTraining();
    }
  }

  public async getTraining() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let assignRoleIds = this.selectedAssignedUsers ? this.selectedAssignedUsers : [];
      let assignCategoryIds = this.selectedCategory ? this.selectedCategory : [];
      let res = await this.trainingService.getTraining(this.startIndex, this.fetchRecord, searchString, assignRoleIds, assignCategoryIds, this.token);
      if (res && res.status == 200) {
        this.trainings = res.recordList;
        if (this.trainings && this.trainings.length > 0) {
          this.trainings.forEach(element => {
            element.isActive = element.isActive ? true : false;
            element.isDelete = element.isDelete ? true : false;
            let minutes = Math.floor(element.completionTime / 60);
            let seconds = element.completionTime - minutes * 60
            if (seconds == 0)
              element.completionTimeString = minutes + "Min"
            else if (element.completionTime < 60)
              element.completionTimeString = element.completionTime + "sec"
            else
              element.completionTimeString = minutes + "min" + seconds + "sec";
            if (element.trainingSubCategoryId != null) {
              element.subCategoryName = this.trainingCategory.find(c => c.id == element.trainingSubCategoryId).name;
            }
            if (element.assignRole) {
              let roleIds = element.assignRole.split(',');
              roleIds = roleIds.map(c => parseInt(c))
              element.assignRole = roleIds;
              element.assignRole.forEach(roleele => {
                if (element.roleName == null) {
                  element.roleName = this.roles.find(c => c.id == roleele).name;
                }
                else
                  element.roleName = element.roleName + ',' + this.roles.find(c => c.id == roleele).name
              })
            }
          })
        }
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
      this.toastrService.error(this.alertMessage);
    }
  }

  public modalOpen(basicmodal) {
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    if (sessionStorage.getItem('dark-mode') == 'dark-only') {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.add('dark-only-modal')
    }
    else {
      const modalContent = document.querySelector('.custom-modal .modal-content');
      modalContent.classList.remove('dark-only-modal')
    }
    this.title = "Insert Training";
    this.training = new Training();
    this.url = null;
    this.documentType = null;
    this.isUploadedUrl = false;
    this.assignUserList = false;
    this.interval = 'min'
  }

  public async getTrainigCategory() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getTrainingCategory(this.token);
      if (res && res.status == 200) {
        this.trainingCategories = res.recordList;
        this.trainingCategory = this.trainingCategories;
        if (this.trainingCategories && this.trainingCategories.length > 0) {
          this.trainingCategories = this.trainingCategories.filter(c => c.parentId == null);
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
      this.toastrService.error(error);
    }
  }

  public getTrainingSubCategory(id: number) {
    this.trainingSubCategories = this.trainingCategory.filter(c => c.parentId == id);
  }

  public async getRoles() {
    try {
      this.spinnerService.show();
      let res = await this.trainingService.getRoles(this.token);
      if (res && res.status == 200) {
        this.roles = res.recordList;
        if (this.roles && this.roles.length > 0) {
          this.roles = this.roles.filter(c => c.name == "DSA" || c.name == "SUBDSA" || c.name == "CONNECTOR" || c.name == "EMPLOYEE")
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

  public async selectedImage(e: any) {

    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        if (e.target.files[0].type != "") {
          this.documentType = e.target.files[0].type
        }
        else {
          let type = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
          if (type == 'pptx')
            this.documentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          else if (type == 'docx')
            this.documentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          else if (type == 'doc')
            this.documentType = 'application/msword';
          else if (type == 'ppt')
            this.documentType = 'application/vnd.ms-powerpoint';

        }
        this.training.fileName = e.target.files[0].name;
        this.url = image
      }
    }
  }

  public async insertTraining() {
    try {
      this.spinnerService.show();
      if (!this.url) {
        this.toastrService.warning("Please Upload Document");
      }
      else {
        if (this.training.id) {
          if (!this.isUploadedUrl) {
            if (this.url && !this.url.includes("https:")) {
              let url = this.url.split(',')[1];
              this.training.url = url
              this.training.documentType = this.documentType
              this.training.awsDocumentType = this.documentType
            }
            else {
              this.training.url = this.url
              this.training.documentType = this.documentType
            }
          }
          else {
            this.training.documentType = "webLink";
            this.training.fileName = null;
            this.training.url = this.url
          }
          this.trainingStatus = "Pending";
          this.training.trainingStatus = "Pending"

          this.training.completionTime = this.interval == 'min' ? this.training.completionTime * 60 : this.training.completionTime
          let res = await this.trainingService.updateTraining(this.training, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            this.spinnerService.hide();
            await this.getTraining();
          }
        }
        else {
          if (!this.isUploadedUrl) {
            if (this.url) {
              let url = this.url.split(',')[1];
              this.training.url = url
              this.training.documentType = this.documentType
              this.training.awsDocumentType = this.documentType
            }
          }
          else {
            this.training.documentType = "webLink";
            this.training.fileName = null;
            this.training.url = this.url
          }
          this.training.trainingStatus = "Pending"
          this.training.completionTime = this.interval == 'min' ? this.training.completionTime * 60 : this.training.completionTime
          let res = await this.trainingService.insertTraining(this.training, this.token);
          if (res && res.status == 200) {
            this.modalService.dismissAll();
            await this.getTraining();
          }
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

  public changeStatus(training: Training) {
    let active = training.isActive ? "InActive" : "Active"
    Swal.fire({
      title: 'Are you sure?',
      text: "You want " + active + " this Training",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,' + active + ' it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.trainingService.activeInactiveTraining(training.id, this.token);
          if (res && res.status == 200) {
            this.getTraining();
            Swal.fire(
              active,
              'Successfully ' + active + ' Training',
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
      else {
        training.isActive = !training.isActive
      }
    })
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public deleteDialog(training: Training) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You wan't Delete this Training",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.spinnerService.show();
          let res = await this.trainingService.removeTraining(training.id, this.token);
          if (res && res.status == 200) {
            this.getTraining();
            this.toastrService.success("Training Deleted Successfully")
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

  ngForm = new FormGroup({
    'title': new FormControl('', Validators.required),
    'CompletionTime': new FormControl('')
  })

  public editDialog(element: Training, basicmodal) {
    this.users = [];
    this.title = "Edit Training"
    this.assignUserList = false
    this.training = new Training();
    this.training = JSON.parse(JSON.stringify(element));
    this.ngForm.setValue({
      "title": this.training.title,
      "CompletionTime": this.training.completionTime.toString()
    })
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    const modalContent = document.querySelector('.custom-modal .modal-content');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal');
    this.documentType = element.documentType;
    if (this.documentType == "webLink") {
      this.isUploadedUrl = true;
    }
    else
      this.isUploadedUrl = false;
    this.trainingSubCategories = this.trainingCategory.filter(c => c.parentId == this.training.trainingCategoryId)
    if (element.trainingCategoryId) {
      this.trainingSubCategories = this.trainingCategory.filter(c => c.parentId == element.trainingCategoryId)
    }

    this.url = element.url;
    this.interval = 'sec'
    this.url = element.url
  }

  public closeDialog() {
    this.training = new Training();
    this.url = null;
    this.documentType = null;
    this.assignUserList = false;
    this.modalService.dismissAll();

  }

  public clearSearch() {
    this.searchString = null;
    this.selectedAssignedUsers = [];
    this.selectedCategory = [];
    this.getTraining();
  }

  public async getUser(pageNumber: number, roles?: string) {
    try {
      let activePage = pageNumber;
      let startIndex = (this.take * (activePage - 1));
      this.fetchRecord = this.take;
      this.skip = startIndex;
      if (roles) {
        if (this.selectedRoles && this.selectedRoles.length == 0) {
          this.selectedRoles.push(this.roles.find(c => c.name == "DSA").id);
        }
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
      this.toastrService.error(this.alertMessage)
    }
  }

  private getSelectedAssignUsers() {
    if (this.users && this.users.length > 0) {
      if (this.training.assignUsers && this.training.assignUsers.length > 0) {
        this.training.assignUsers.forEach(ele => {
          let index = this.users.findIndex(c => c.id == ele.partnerId);
          if (index >= 0) {
            this.users[index].isSelected = true;
            this.users[index].trainingStatus = ele.trainingStatus;
            let ind = this.selectedAssignedUsers.findIndex(c => c == this.users[index].id);
            if (ind < 0)
              this.selectedAssignedUsers.push(this.users[index].id)
          }
        });

      }
    }
  }

  public assignUsers(ele: Training, basicmodal) {
    this.userRoles = [];
    this.trainingId = ele.id;
    this.training = ele;
    this.assignUserList = true;
    this.selectedRoles = [];
    this.selectedRoles.push(ele.assignRole && ele.assignRole.length > 0 ? ele.assignRole[0] : null)
    if (ele.assignRole) {
      let roles = this.roles.filter((c) => ele.assignRole.indexOf(c.id) !== -1);
      this.userRoles = roles

      this.getTrainingAssignUser(1);
    }
    this.title = "Assign To Partner"
    // this.modalService.open(basicmodal, { size: 'xl' });
    this.modalService.open(basicmodal, { size: 'xl', windowClass: 'custom-modal' });
    const modalContent = document.querySelector('.custom-modal .modal-content');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal');

  }



  public async insertAssignTrainingUser() {
    try {
      this.trainingStatus = "Pending";
      let res = await this.trainingService.insertAssignTraining(this.trainingId, this.selectedAssignedUsers, this.trainingStatus, this.token);
      if (res && res.status == 200) {

        this.toastrService.success("Training Assign Successfully")
        this.assignUserList = false;
        this.modalService.dismissAll();
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


  public toggleCheckAll(values: any) {
    if (values.currentTarget.checked) {
      this.selectedRoles = [];
      this.userRoles.forEach(ele => {
        this.selectedRoles.push(ele.id);

      })
      this.getTrainingAssignUser(1);
    } else {
      this.selectedRoles = [];
    }
  }

  public toggleCheckAllUser(values: any) {
    if (values.currentTarget.checked) {
      this.selectedAssignedUsers = [];
      this.users.forEach(ele => {
        this.selectedAssignedUsers.push(ele.id);
      })

    } else {
      this.selectedAssignedUsers = [];
    }
  }


  public async getTrainingAssignUser(pageNumber) {
    try {
      this.assignUserPaginate.currentpage = pageNumber;
      let activePage = pageNumber;
      let startIndex = (this.take * (activePage - 1));
      this.fetchRecord = this.take;
      this.skip = startIndex;
      let res = await this.trainingService.getTrainingAssingUser(startIndex, this.fetchRecord, this.trainingId, this.selectedRoles, this.token);
      if (res && res.status == 200) {
        this.training.assignUsers = res.recordList;
        if (this.training.assignUsers && this.training.assignUsers.length > 0) {
          this.training.assignUsers.forEach(element => {
            let minutes = Math.floor(element.stayTiming / 60);
            let seconds = element.stayTiming - minutes * 60
            if (seconds == 0)
              element.stayTimingString = minutes + "Min"
            else if (element.stayTiming < 60)
              element.stayTimingString = element.stayTiming + "sec"
            else
              element.stayTimingString = minutes + "min" + seconds + "sec";
          });
          this.assignUserPaginate = this.paginationService.getPager(res.totalRecords, activePage, this.take);
        }
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

  public uploadUrl(e) {
    this.isUploadedUrl = !this.isUploadedUrl;
    if (this.isUploadedUrl) {
      if (this.training.documentType != "webLink")
        this.url = "";
      else
        this.url = this.training.url;
    }
    else {
      if (this.training.documentType == "webLink")
        this.url = "";
      else
        this.url = "this.training.url";
    }

  }

  public assignToPartner(ele) {
    if (ele.isSelected) {
      let index = this.selectedAssignedUsers.findIndex(c => c == ele.id);
      if (index < 0) {
        this.selectedAssignedUsers.push(ele.id);
      }
    }
    else {
      let index = this.selectedAssignedUsers.findIndex(c => c == ele.id);
      if (index >= 0)
        this.selectedAssignedUsers.splice(index, 1);
    }
  }

  public debugBase64(base64URL) {
    let win = window.open();
    win.document.write('<iframe src="' + base64URL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
  }
}