import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-dsa-add',
  templateUrl: './dsa-add.component.html',
  styleUrls: ['./dsa-add.component.scss']
})

export class DsaAddComponent implements OnInit {
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
  public fetchRecord: number;
  public alertType: string;
  public searchString: string;
  public selectedCity = [];
  public selectedStatus: string;
  public professions = [];
  public cities: Cities[] = new Array<Cities>();
  public selectedDsa = [];
  public partners: Partners[] = new Array<Partners>();
  public partner = new Partners();
  public paramid: any;
  public office: string;
  public subdsas: Dsa[] = new Array<Dsa>();
  public subdsa = new Dsa
  public paramrolename: string;
  public referal: string;
  public banks: Bank[] = new Array<Bank>();
  private startIndex: number;
  public businessAddressCities = [];

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
    this.dsaform.patchValue({ gender: 'Male', haveOffice: '1', jobType: 'FullTime' })

    await this.getProfessions();
    await this.getBanks();

    this.paramid = this.actRoute.snapshot.paramMap.get('id');
    let partnerId = this.paramid;
    this.paramid = partnerId;
    if (partnerId) {
      await this.getPartnerDetailByPartnerId();
    }

    this.paramrolename = this.actRoute.snapshot.paramMap.get('roleName');
    this.dsa.roleName = this.paramrolename;
    this.paramrolename = this.dsa.roleName;
  }

  dsaform = new FormGroup({
    "profilePicUrl": new FormControl(null),
    "fullName": new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]),
    "contactNo": new FormControl('', [Validators.required,Validators.minLength(10)]),
    "gender": new FormControl('', Validators.required),
    "referralCode": new FormControl(''),
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
    "professionTypeId": new FormControl('', Validators.required),
    "workExperience": new FormControl('', Validators.required),
    "haveOffice": new FormControl('', Validators.required),
    "businessName": new FormControl('', Validators.required),
    "businessAddress": new FormControl(''),
    "gstNo": new FormControl(null, [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]),
    "commitment": new FormControl('', Validators.required),
    "accountHolderName": new FormControl(''),
    "accountNo": new FormControl(null),
    "ifscCode": new FormControl(''),
    "bankId": new FormControl(null),
    "businessAddressLine1": new FormControl('', Validators.required),
    "businessAddressLine2": new FormControl(''),
    "businessAddressPincode": new FormControl('', Validators.required),
    "workAddressCityId": new FormControl(null, Validators.required),
    "jobType": new FormControl('', Validators.required)
  });

  public async onKeyUpEvent(event: any, isChagneCityId, ele?: string) {
    try {
      if (event.target.value && event.target.value.length == 6) {
        await this.getCityByPincode(event.target.value, isChagneCityId, ele);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async getCityByPincode(n, isChangeCityId, permanenet?: any) {
    try {
      this.spinnerService.show();
      let res = await this.dsaService.getCityByPincode(null, n, this.token);
      if (res && res.status == 200) {
        if (!permanenet) {
          this.cities = res.recordList;
          if (this.cities && this.cities.length > 0) {
            this.dsaform.get("districtName").setValue(this.cities[0].districtName)
            this.dsaform.get("state").setValue(this.cities[0].stateName)
            if (isChangeCityId)
              this.dsaform.get("cityId").setValue(this.cities[0].id)
          }
        }
        else {
          this.businessAddressCities = res.recordList;
          if (this.cities && this.cities.length > 0) {
            if (isChangeCityId)
              this.dsaform.get("workAddressCityId").setValue(this.businessAddressCities[0].id)
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
      this.toastrService.error(error)
    }
  }

  public async getProfessions() {
    try {
      let res = await this.dsaService.getProfessions(this.fetchRecord, this.token,);
      if (res && res.status == 200) {
        this.professions = res.recordList;
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

        this.url = (this.partners[0].basicDetail.profilePicUrl != "") ? this.partners[0].basicDetail.profilePicUrl : null;
        this.dsaform.get('profilePicUrl').patchValue(this.url);

        await this.getCityByPincode(this.partners[0].basicDetail.partnerPincode, false)
        await this.getCityByPincode(this.partners[0].basicDetail.pincode, false, 'business')
        if (this.partners[0].basicDetail.cityId) {
          this.dsaform.get('districtName').setValue(this.cities[0].districtName)
          this.dsaform.get('state').setValue(this.cities[0].stateName)
        }

        this.office = (this.partners[0].basicDetail.haveOffice == '1') ? '1' : '2';
        this.dsaform.get('haveOffice').setValue(this.office);

        this.dsaform.get('fullName').setValue(this.partners[0].basicDetail.fullName)
        this.dsaform.get('contactNo').setValue(this.partners[0].basicDetail.contactNo)
        this.dsaform.get('gender').setValue(this.partners[0].basicDetail.gender)
        this.dsaform.get('referralCode').setValue(this.partners[0].basicDetail.referralCode)
        this.dsaform.get('aadhaarCardNo').setValue(this.partners[0].basicDetail.aadhaarCardNo.replace(/\s/g, ""))
        this.dsaform.get('panCardNo').setValue(this.partners[0].basicDetail.panCardNo)
        this.dsaform.get('label').setValue(this.partners[0].basicDetail.label)
        this.dsaform.get('addressLine1').setValue(this.partners[0].basicDetail.partnerAddressLine1)
        this.dsaform.get('addressLine2').setValue(this.partners[0].basicDetail?.partnerAddressLine2 ? this.partners[0].basicDetail.partnerAddressLine2 : null)
        this.dsaform.get('pincode').setValue(this.partners[0].basicDetail.partnerPincode)
        this.dsaform.get('cityId').setValue(this.partners[0].basicDetail.cityId)
        this.dsaform.get('companyName').setValue(this.partners[0].basicDetail.companyName)
        this.dsaform.get('professionTypeId').setValue(this.partners[0].basicDetail.professionTypeId)
        this.dsaform.get('workExperience').setValue(this.partners[0].basicDetail.workExperience)
        this.dsaform.get('businessName').setValue(this.partners[0].basicDetail.businessName)
        this.dsaform.get('businessAddress').setValue(this.partners[0].basicDetail.businessAddress)
        this.dsaform.get('businessAddressLine1').setValue(this.partners[0].basicDetail.addressLine1 ? this.partners[0].basicDetail.addressLine1 : null)
        this.dsaform.get('businessAddressLine2').setValue(this.partners[0].basicDetail?.addressLine2 ? this.partners[0].basicDetail.addressLine2 : null)
        this.dsaform.get('businessAddressPincode').setValue(this.partners[0].basicDetail.pincode ? this.partners[0].basicDetail.pincode : null)
        this.dsaform.get('workAddressCityId').setValue(this.partners[0].basicDetail.workAddressCityId ? this.partners[0].basicDetail.workAddressCityId : null)
        this.dsaform.get('gstNo').setValue(this.partners[0].basicDetail.gstNo)
        this.dsaform.get('commitment').setValue(this.partners[0].basicDetail.commitment)
        this.dsaform.get('bankId').setValue(this.partners[0].partnerBankDetail?.bankId ? this.partners[0].partnerBankDetail.bankId : null)
        this.dsaform.get('accountHolderName').setValue(this.partners[0].partnerBankDetail?.accountHolderName ? this.partners[0].partnerBankDetail.accountHolderName : null)
        this.dsaform.get('accountNo').setValue(this.partners[0].partnerBankDetail?.accountNo ? this.partners[0].partnerBankDetail.accountNo : null)
        this.dsaform.get('ifscCode').setValue(this.partners[0].partnerBankDetail?.ifscCode ? this.partners[0].partnerBankDetail.ifscCode : null)
        this.dsaform.get('jobType').setValue(this.partners[0].basicDetail?.jobType ? this.partners[0].basicDetail.jobType : null)

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

  public async insertDsa() {
    try {
      if (this.dsaform.valid) {
        this.spinnerService.show();
        this.paramid = this.actRoute.snapshot.paramMap.get('id');
        this.dsa.id = this.paramid;
        this.paramid = this.dsa.id;
        let currentBadgeId = this.dsa.currentBadgeId
        if (this.paramrolename == 'dsa') {
          this.referal = (this.dsa.referralCode && this.dsa.referralCode != "") ? this.dsa.referralCode : null;
          this.dsaform.get('referralCode').setValue(this.referal);
        }
        if (this.dsa.id) {
          this.dsa = this.dsaform.value;
          this.dsa.accountHolderName = this.dsaform.get('accountHolderName').value ? this.dsaform.get('accountHolderName').value : null;
          this.dsa.accountNo = this.dsaform.get('accountNo').value ? this.dsaform.get('accountNo').value : null;
          this.dsa.ifscCode = this.dsaform.get('ifscCode').value ? this.dsaform.get('ifscCode').value : null;
          this.dsa.bankId= this.dsaform.get('bankId').value ? this.dsaform.get('bankId').value : null;
          this.dsa.addressLine2 = this.dsaform.get('addressLine2').value ? this.dsaform.get('addressLine2').value : null;
          this.dsa.referralCode = this.dsaform.get('referralCode').value ? this.dsaform.get('referralCode').value : null;
          this.dsa.gstNo = this.dsaform.get('gstNo').value ? this.dsaform.get('gstNo').value : null;
          this.dsa.businessAddressLine1 = this.dsaform.get('businessAddressLine1').value;
          this.dsa.businessAddressLine2 = this.dsaform.get('businessAddressLine2').value ? this.dsaform.get('businessAddressLine2').value : null;
          this.dsa.businessPincode = this.dsaform.get('businessAddressPincode').value;
          this.dsa.workAddressCityId = this.dsaform.get('workAddressCityId').value;
          this.dsa.currentBadgeId = currentBadgeId
          this.dsa.partnerId = this.paramid;
          this.paramid = this.dsa.partnerId;
          this.dsa.userId = this.partners[0].basicDetail.userId;
          let accountHolderName = this.dsaform.get('accountHolderName').value ? this.dsaform.get('accountHolderName').value : null;
          this.dsa.accountHolderName = accountHolderName;
          let accountNo = this.dsaform.get('accountNo').value ? this.dsaform.get('accountNo').value : null;
          this.dsa.accountNo = accountNo;
          let ifscCode = this.dsaform.get('ifscCode').value ? this.dsaform.get('ifscCode').value : null;
          this.dsa.ifscCode = ifscCode;
          let bankId = this.dsaform.get('bankId').value ? this.dsaform.get('bankId').value : null;
          this.dsa.bankId = bankId;
          let partnerAddressId = this.partners[0].basicDetail.partnerAddressId ? this.partners[0].basicDetail.partnerAddressId : null;
          this.dsa.partnerAddressId = partnerAddressId;
          let partnerEducationId = this.partners[0].basicDetail.partnerEducationId ? this.partners[0].basicDetail.partnerEducationId : null;
          this.dsa.partnerEducationId = partnerEducationId;
          this.dsa.partnerBankDetailId = this.partners[0].partnerBankDetail?.partnerBankDetailId ? this.partners[0].partnerBankDetail.partnerBankDetailId : null;
          if (this.dsa.profilePicUrl && !this.dsa.profilePicUrl.includes("https:")) {
            let profile = this.dsa.profilePicUrl.split(',')[1];
            this.dsa.profilePicUrl = profile
          }
          else
          this.dsa.profilePicUrl = this.url
          this.dsa.roleId = this.paramrolename == "dsa" ? 3 : 4
          this.dsa.roleName = this.paramrolename;
          let res = await this.dsaService.updatePartner(this.dsa, this.token);
          if (res && res.status == 200) {
            this.spinnerService.hide();
            this.router.navigate(['/' + this.paramrolename]);
          }
        }
        else {
          this.dsa = this.dsaform.value;
          this.dsa.accountHolderName = this.dsaform.get('accountHolderName').value ? this.dsaform.get('accountHolderName').value : null;
          this.dsa.accountNo = this.dsaform.get('accountNo').value ? this.dsaform.get('accountNo').value : null;
          this.dsa.ifscCode = this.dsaform.get('ifscCode').value ? this.dsaform.get('ifscCode').value : null;
          this.dsa.bankId= this.dsaform.get('bankId').value ? this.dsaform.get('bankId').value : null;
          this.dsa.addressLine2 = this.dsaform.get('addressLine2').value ? this.dsaform.get('addressLine2').value : null;
          this.dsa.businessAddressLine2 = this.dsaform.get('businessAddressLine2').value ? this.dsaform.get('businessAddressLine2').value : null;
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
          this.dsa.roleId = this.paramrolename == "dsa" ? 3 : 4
          this.dsa.roleName = this.paramrolename;
          this.dsa.currentBadgeId = 1;
          this.dsa.profilePicUrl = null
          let res = await this.dsaService.insertPartner(this.dsa, this.token);
          if (res && res.status == 200) {
            this.router.navigate(['/' + this.paramrolename]);
          }
        }
        this.spinnerService.hide();
      } else {
        Object.keys(this.dsaform.controls).forEach(key => {
          this.dsaform.controls[key].markAsTouched();
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

  public async selectedImage(e: any) {
    const reader = new FileReader();
    if (e.target.files?.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        let image = reader.result as string;
        let photoType = e.target.files[0].name.substring(e.target.files[0].name.lastIndexOf(".") + 1);
        this.picType = photoType;
        this.url = image;
        this.dsaform.patchValue({
          profilePicUrl: reader.result
        });
      }
    }
  }

  public removeImage() {
    this.url = null;
  }

  public cancelUser() {
    if (this.dsa.roleName == 'dsa') {
      if (this.dsa.id) {
        this.router.navigate(['/dsa', this.dsa.id]);
      } else {
        this.router.navigateByUrl('/dsa');
      }
    }
    else {
      if (this.dsa.id) {
        this.router.navigate(['/subdsa', this.dsa.id]);
      } else {
        this.router.navigateByUrl('/subdsa');
      }
    }
  }

  keyPressNumbers(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  keyPressAlpha(event) {
    let inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z ,]/.test(inp)) {
      // only alphabet a-z A-Z
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressAlphanumeric(event) {
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
