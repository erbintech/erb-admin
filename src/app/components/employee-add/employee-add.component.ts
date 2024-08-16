import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Bank } from 'src/app/shared/models/bank';
import { Cities } from 'src/app/shared/models/cities';
import { Dsa } from 'src/app/shared/models/dsa';
import { Partners } from 'src/app/shared/models/partner';
import { Users } from 'src/app/shared/models/users/user';
import { BankService } from 'src/app/shared/services/bank.service';
import { DsaService } from 'src/app/shared/services/dsa.service';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.scss']
})
export class EmployeeAddComponent implements OnInit {
  public user: Users = new Users();
  public title: string;
  public url: string;
  public picType: string;
  public modal: any
  private alertMessage: string;
  public dsas: Dsa[] = new Array<Dsa>();
  public dsa:any = new Dsa();
  public token: string;
  public isAlert: boolean;
  public paginate: any;
  public skip: number = 0;
  public take: number = 15;
  public activePage: number = 1;
  public count: number = 0;
  public startIndex: number;
  public fetchRecord: number;
  public alertType: string;
  public searchString: string;
  public selectedCity = [];
  public selectedStatus: string;
  public designations = [];
  public education = [];
  public cities: Cities[] = new Array<Cities>();
  public city = new Cities();
  public selectedDsa = [];
  public partners: Partners[] = new Array<Partners>();
  public partner = new Partners();
  public paramid: any;
  public office: string;
  public subdsas: Dsa[] = new Array<Dsa>();
  public subdsa = new Dsa
  public paramrolename: string;
  public referal: string;
  public documentType: string;
  public pic: boolean;
  public banks: Bank[] = new Array<Bank>();


  constructor(
    private spinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private dsaService: DsaService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private bankService: BankService,
  ) { }

  async ngOnInit() {
    this.token = sessionStorage.getItem("SessionToken");
    this.employeeform.patchValue({ gender: 'Male', jobType: 'FullTime' })

    this.paramid = this.actRoute.snapshot.paramMap.get('id');
    let partnerId = this.paramid;
    this.paramid = partnerId;
    if (partnerId) {
      await this.getPartnerDetailByPartnerId();
    }

    await this.getDesignations();
    await this.getEducationTypes();
    await this.getBanks();
  }

  employeeform = new FormGroup({
    "profilePicUrl": new FormControl(null),
    "fullName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
    "contactNo": new FormControl('', [Validators.required,Validators.minLength(10)]),
    "gender": new FormControl('', Validators.required),
    "aadhaarCardNo": new FormControl(null, [Validators.required, Validators.pattern('^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$')]),
    "panCardNo": new FormControl(null, [Validators.required, Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]),
    "label": new FormControl('', Validators.required),
    "addressLine1": new FormControl('', Validators.required),
    "addressLine2": new FormControl(''),
    "pincode": new FormControl('', Validators.required),
    "cityId": new FormControl(null, Validators.required),
    "districtName": new FormControl('', Validators.required),
    "state": new FormControl('', Validators.required),
    "companyName": new FormControl('', Validators.required),
    "designationId": new FormControl('', Validators.required),
    "workExperience": new FormControl('', Validators.required),
    "resume": new FormControl(null),
    "educationTypeId": new FormControl('', Validators.required),
    "instituteName": new FormControl('', Validators.required),
    "passingYear": new FormControl('', Validators.required),
    "commitment": new FormControl('', Validators.required),
    "accountHolderName": new FormControl(''),
    "accountNo": new FormControl(null),
    "ifscCode": new FormControl(''),
    "bankId": new FormControl(null),
    "jobType": new FormControl('')
  });

  public async onKeyUpEvent(event: any, isChagneCityId) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChagneCityId);
      }
    } catch (error) {
    }
  }

  public async getCityByPincode(n, isChangeCityId) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        this.cities = res.recordList;
        if (this.cities && this.cities.length > 0) {
          this.employeeform.get("districtName").setValue(this.cities[0].districtName)
          this.employeeform.get("state").setValue(this.cities[0].stateName)
          if (isChangeCityId)
            this.employeeform.get("cityId").setValue(this.cities[0].id)
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
      this.toastrService.error(error)
    }
  }

  public async getDesignations() {
    try {
      let res = await this.dsaService.getDesignations(this.fetchRecord, this.token,);
      if (res && res.status == 200) {
        this.designations = res.recordList;
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

  public async getEducationTypes() {
    try {
      let res = await this.dsaService.getEducationTypes(this.fetchRecord, this.token,);
      if (res && res.status == 200) {
        this.education = res.recordList;
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

  public async getBanks() {
    try {
      this.spinnerService.show();
      let searchString = this.searchString ? this.searchString : null;
      let res = await this.bankService.getBanks(this.startIndex, this.fetchRecord, searchString, this.token);
      if (res && res.status == 200) {
        this.banks = res.recordList;
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

  public async getPartnerDetailByPartnerId() {
    try {
      this.paramid = this.actRoute.snapshot.paramMap.get('id');
      let partnerId = this.paramid;
      this.paramid = partnerId;
      let res = await this.dsaService.getPartnerDetailByPartnerId(partnerId, this.token);
      if (res && res.status == 200) {
        this.partners = res.recordList;

        this.dsa.profilePicUrl = (this.partners[0].basicDetail.profilePicUrl && this.partners[0].basicDetail.profilePicUrl != "") ? this.partners[0].basicDetail.profilePicUrl : null;
        this.employeeform.get('profilePicUrl').setValue(this.partners[0].basicDetail.profilePicUrl);

        this.dsa.resume = (this.partners[0].basicDetail.resume && this.partners[0].basicDetail.resume != "") ? this.partners[0].basicDetail.resume : null;
        this.employeeform.get('resume').setValue(this.partners[0].basicDetail.resume);

        await this.getCityByPincode(this.partners[0].basicDetail.partnerPincode, false)
        if (this.partners[0].basicDetail.cityId) {
          this.employeeform.get('districtName').setValue(this.cities[0].districtName)
          this.employeeform.get('state').setValue(this.cities[0].stateName)
        }

        this.employeeform.get('fullName').setValue(this.partners[0].basicDetail.fullName)
        this.employeeform.get('contactNo').setValue(this.partners[0].basicDetail.contactNo)
        this.employeeform.get('gender').setValue(this.partners[0].basicDetail.gender)
        this.employeeform.get('aadhaarCardNo').setValue(this.partners[0].basicDetail.aadhaarCardNo.replace(/\s/g, ""))
        this.employeeform.get('panCardNo').setValue(this.partners[0].basicDetail.panCardNo)
        this.employeeform.get('label').setValue(this.partners[0].basicDetail.label)
        this.employeeform.get('addressLine1').setValue(this.partners[0].basicDetail.partnerAddressLine1)
        this.employeeform.get('addressLine2').setValue(this.partners[0].basicDetail && this.partners[0].basicDetail.partnerAddressLine2 ? this.partners[0].basicDetail.partnerAddressLine2 : null)
        this.employeeform.get('pincode').setValue(this.partners[0].basicDetail.partnerPincode)
        this.employeeform.get('cityId').setValue(this.partners[0].basicDetail.cityId)
        this.employeeform.get('companyName').setValue(this.partners[0].basicDetail.companyName)
        this.employeeform.get('designationId').setValue(this.partners[0].basicDetail.designationId)
        this.employeeform.get('workExperience').setValue(this.partners[0].basicDetail.workExperience)
        this.employeeform.get('educationTypeId').setValue(this.partners[0].basicDetail.educationTypeId)
        this.employeeform.get('instituteName').setValue(this.partners[0].educations[0].instituteName)
        this.employeeform.get('passingYear').setValue(this.partners[0].basicDetail.passingYear)
        this.employeeform.get('commitment').setValue(this.partners[0].basicDetail.commitment)
        this.employeeform.get('bankId').setValue(this.partners[0].partnerBankDetail?.bankId ? this.partners[0].partnerBankDetail.bankId : null)
        this.employeeform.get('accountHolderName').setValue(this.partners[0].partnerBankDetail?.accountHolderName ? this.partners[0].partnerBankDetail.accountHolderName : null)
        this.employeeform.get('accountNo').setValue(this.partners[0].partnerBankDetail?.accountNo ? this.partners[0].partnerBankDetail.accountNo : null)
        this.employeeform.get('ifscCode').setValue(this.partners[0].partnerBankDetail?.ifscCode ? this.partners[0].partnerBankDetail.ifscCode : null)
        this.employeeform.get('jobType').setValue(this.partners[0].basicDetail.jobType ? this.partners[0].basicDetail.jobType : null)
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

  public async insertEmployee() {
    try {
      if (this.employeeform.valid) {
        this.spinnerService.show();
        this.paramid = this.actRoute.snapshot.paramMap.get('id');
        this.dsa.id = this.paramid;
        this.paramid = this.dsa.id;
        let currentBadgeId = this.dsa.currentBadgeId;
        if (this.dsa.id) {
          this.dsa = this.employeeform.value;
          this.dsa.accountHolderName = this.employeeform.get('accountHolderName').value ? this.employeeform.get('accountHolderName').value : null;
          this.dsa.accountNo = this.employeeform.get('accountNo').value ? this.employeeform.get('accountNo').value : null;
          this.dsa.ifscCode = this.employeeform.get('ifscCode').value ? this.employeeform.get('ifscCode').value : null;
          this.dsa.bankId= this.employeeform.get('bankId').value ? this.employeeform.get('bankId').value : null;
          this.dsa.addressLine2 = this.employeeform.get('addressLine2').value ? this.employeeform.get('addressLine2').value : null;
          this.dsa.currentBadgeId = currentBadgeId;
          this.dsa.partnerId = this.paramid;
          this.paramid = this.dsa.partnerId;
          this.dsa.userId = this.partners[0].basicDetail.userId;
          this.dsa.partnerAddressId = this.partners[0].basicDetail.partnerAddressId;
          this.dsa.partnerEducationId = this.partners[0].basicDetail.partnerEducationId;
          if (this.dsa.profilePicUrl && !this.dsa.profilePicUrl.includes("https:")) {
            let profile = this.dsa.profilePicUrl.split(',')[1];
            this.dsa.profilePicUrl = profile
          }
          else
            this.dsa.profilePicUrl = this.partners[0].basicDetail.profilePicUrl
          this.dsa.roleId = 5;
          this.dsa.roleName = "employee";
          this.dsa.partnerBankDetailId = this.partners[0].partnerBankDetail?.partnerBankDetailId ? this.partners[0].partnerBankDetail.partnerBankDetailId : null;
          let res = await this.dsaService.updatePartner(this.dsa, this.token);
          if (res && res.status == 200) {
            this.spinnerService.hide();
            this.router.navigate(['/employee']);
          }
        }
        else {
          this.dsa = this.employeeform.value;
          this.dsa.accountNo = this.employeeform.get('accountNo').value ? this.employeeform.get('accountNo').value : null;
          this.dsa.ifscCode = this.employeeform.get('ifscCode').value ? this.employeeform.get('ifscCode').value : null;
          this.dsa.bankId= this.employeeform.get('bankId').value ? this.employeeform.get('bankId').value : null;
          this.dsa.addressLine2 = this.employeeform.get('addressLine2').value ? this.employeeform.get('addressLine2').value : null;
          this.dsa.businessAddressLine2 = this.employeeform.get('businessAddressLine2').value ? this.employeeform.get('businessAddressLine2').value : null;
          this.dsa.documents = [];
          if (this.dsa.profilePicUrl) {
            let data = {
              "documentId": 3,
              "fileData": this.dsa.profilePicUrl.split(',')[1],
              "fileName": 'photo',
              "contentType": this.picType
            }
            this.dsa.documents[0] = data;
          }

          this.dsa.roleId = 5;
          this.dsa.roleName = "employee";
          this.dsa.currentBadgeId = 1;
          this.dsa.profilePicUrl = null;
          let res = await this.dsaService.insertPartner(this.dsa, this.token);
          if (res && res.status == 200) {
            this.router.navigate(['/employee']);
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.employeeform.controls).forEach(key => {
          this.employeeform.controls[key].markAsTouched();
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

  public async selectedImage(e: any, element) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        let photoType = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
        this.picType = photoType;
        this.url = image;

        if (this.url) {
          if (element == 'profilePicUrl') {
            this.dsa.profilePicUrl = this.url;
          } else {
            if (element == 'resume') {
              this.dsa.resume = this.url;
              this.dsa.fileName = e.target.files[0].name;
            }
          }
        }

        this.employeeform.patchValue({
          profilePicUrl: reader.result,
          resume: reader.result
        });

      }
    }
  }

  public removeImage() {
    this.dsa.profilePicUrl = null;
  }

  public async openCv() {

  }

  public async cancelUser() {
    if (this.dsa.id) {
      this.router.navigate(['/employee', this.dsa.id]);
    } else {
      this.router.navigateByUrl('/employee');
    }
  }

  public async keyPressAlphanumeric(event) {
    let inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9 ]/.test(inp)) {
      // only alphabet a-z A-Z
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}

