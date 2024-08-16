import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FlagGroups } from 'src/app/shared/models/systemflag/flaggroup';
import { SystemFlags } from 'src/app/shared/models/systemflag/systemflags';
import { SystemFlagService } from 'src/app/shared/services/systemflag.service';
// import 'quill-emoji/dist/quill-emoji.js'
declare let require;
const Swal = require('sweetalert2')

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public token: string;
  public sysFlagsGroup: FlagGroups[];
  private sysFlags: SystemFlags[];
  public steps: string;
  public htmlContent: string = '';

  modules = {
    'emoji-shortname': true,

    'emoji-toolbar': true,
    'toolbar': [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],                                         // remove formatting button
      ['link'],                         // link and image, video
      ['emoji']
    ]
  }

  public activeFlagId: number;

  constructor(
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private systemFlagService: SystemFlagService
  ) {
  }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    await this.getSystemFlag();
  }

  addBindingCreated(quill) { }

  public navChanged1(event) { }

  private async getSystemFlag() {
    try {
      this.spinnerService.show();
      this.sysFlags = [];
      let res = await this.systemFlagService.getSystemFlags(this.token);
      if (res && res.status == 200) {
        this.sysFlagsGroup = res.recordList;
        this.activeFlagId = this.sysFlagsGroup[0].flagGroupId;
        this.sysFlagsGroup.forEach(element => {
          element.systemFlags.forEach(syselement => {
            if (syselement.valueTypeId == 3) {
              let data = syselement.valueList.split(",");
              syselement.displayValueList = [];
              data.forEach(delement => {
                syselement.displayValueList.push(delement);
              });
            }
            else if (syselement.valueTypeId == 7) {
              syselement.checked = syselement.value == "1" ? true : false;
            }
            else if (syselement.valueTypeId == 8) {
              syselement.inputType = "password";
            }
            this.sysFlags.push(syselement);
          });
          element.group.forEach(felement => {
            felement.systemFlags.forEach(syselement => {
              if (syselement.valueTypeId == 3) {
                let data = syselement.valueList.split(",");
                syselement.displayValueList = [];
                data.forEach(delement => {
                  syselement.displayValueList.push(delement);
                });
              }
              else if (syselement.valueTypeId == 7) {
                syselement.checked = syselement.value == "1" ? true : false;
              }
              else if (syselement.valueTypeId == 8) {
                syselement.inputType = "password";
              }
              this.sysFlags.push(syselement);
            });
          });
        });
      }
      this.spinnerService.hide();
    }
    catch (error) {
      this.spinnerService.hide();
      let err = error;
      if (error?.error && error.error.message) {
        err = error.error.message
      }
      this.toastrService.error(err, "Error");
    }
  }

  public async getConfirmation() {
    Swal.fire({
      title: 'SAVE',
      text: "Are you sure you want to save this changes?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save It!'
    }).then(async (result) => {
      if (result.value) {
        await this.saveSystemFlags();
      }
      else {
        await this.getSystemFlag();
      }
    });
    const modalContent = document.querySelector('.swal2-container');
    sessionStorage.getItem('dark-mode') == 'dark-only' ? modalContent.classList.add('dark-only-modal') : modalContent.classList.remove('dark-only-modal')
  }

  public async saveSystemFlags() {
    try {
      this.spinnerService.show();
      let nameList = new Array<string>();
      let valueList = new Array<string>();


      for (let i = 0; i < this.sysFlagsGroup.length; i++) {
        if (this.sysFlagsGroup[i].systemFlags && this.sysFlagsGroup[i].systemFlags.length > 0) {
          for (let index = 0; index < this.sysFlagsGroup[i].systemFlags.length; index++) {
            if (this.sysFlagsGroup[i].systemFlags[index].valueTypeId == 7) {
              nameList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].systemFlags[index].name)));
              valueList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].systemFlags[index].checked ? "1" : "0")));
            } else {
              nameList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].systemFlags[index].name)));
              valueList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].systemFlags[index].value)));
            }

          }
        }
        if (this.sysFlagsGroup[i].group && this.sysFlagsGroup[i].group.length > 0) {
          for (let j = 0; j < this.sysFlagsGroup[i].group.length; j++) {
            if (this.sysFlagsGroup[i].group[j].systemFlags && this.sysFlagsGroup[i].group[j].systemFlags.length > 0) {
              for (let k = 0; k < this.sysFlagsGroup[i].group[j].systemFlags.length; k++) {
                if (this.sysFlagsGroup[i].group[j].systemFlags[k].valueTypeId == 7) {
                  nameList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].group[j].systemFlags[k].name)));
                  valueList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].group[j].systemFlags[k].checked ? "1" : "0")));
                } else {
                  nameList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].group[j].systemFlags[k].name)));
                  valueList.push(JSON.parse(JSON.stringify(this.sysFlagsGroup[i].group[j].systemFlags[k].value)));
                }
              }
            }
          }
        }
      }


      let res = await this.systemFlagService.saveSystemFlags(nameList, valueList, this.token);
      if (res && res.status == 200) {
        await this.getSystemFlag();
        this.toastrService.success("Successfully updated!");
      }
      this.spinnerService.hide();
    }
    catch (error) {
      this.spinnerService.hide();
      let err = error;
      if (error?.error && error.error.message) {
        err = error.error.message
      }
      this.toastrService.error(err, "Error");
    }
  }

  public changeType(sys: SystemFlags) {
    if (sys.inputType == 'password') {
      sys.inputType = 'text';
    }
    else {
      sys.inputType = 'password';
    }
  }

  // public navigateHome() {
  //   this.router.navigate(['dashboard']);
  // }

}