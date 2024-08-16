import { Routes } from '@angular/router';
import { AuthGuard } from '../../shared/auth.guard';

export const Full_Content_Routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]
    },
    {
        path: 'personal-loan',
        loadChildren: () => import('../../components/personal-loan/personal-loan.module').then(m => m.PersonalLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'instant-loan',
        loadChildren: () => import('../../components/instant-loan/instant-loan.module').then(m => m.InstantLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'business-loan',
        loadChildren: () => import('../../components/businessloan/businessloan.module').then(m => m.BusinessLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'home-loan',
        loadChildren: () => import('../../components/homeloan/homeloan.module').then(m => m.HomeLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'LAP',
        loadChildren: () => import('../../components/lap/lap.module').then(m => m.LAPModule), canActivate: [AuthGuard]
    },
    {
        path: 'business-loan/add/:customerId',
        loadChildren: () => import('../../components/add-business-loan/add-business-loan.module').then(m => m.AddBusinessLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'business-loan/edit/:customerId/:customerLoanId',
        loadChildren: () => import('../../components/add-business-loan/add-business-loan.module').then(m => m.AddBusinessLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'home-loan/add/:customerId',
        loadChildren: () => import('../../components/add-home-loan/add-home-loan.module').then(m => m.AddHomeLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'home-loan/edit/:customerId/:customerLoanId',
        loadChildren: () => import('../../components/add-home-loan/add-home-loan.module').then(m => m.AddHomeLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'lap/add/:customerId',
        loadChildren: () => import('../../components/add-lap/add-lap.module').then(m => m.AddLapModule), canActivate: [AuthGuard]
    },
    {
        path: 'lap/edit/:customerId/:customerLoanId',
        loadChildren: () => import('../../components/add-lap/add-lap.module').then(m => m.AddLapModule), canActivate: [AuthGuard]
    },
    {
        path: 'business-loan/view/:id',
        loadChildren: () => import('../../components/business-loan-detail/business-loan-detail.module').then(m => m.BusinessLoanDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'personal-loan/view/:id',
        loadChildren: () => import('../../components/personal-loan-detail/personal-loan-detail.module').then(m => m.PersonalLoanDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'instant-loan/view/:id',
        loadChildren: () => import('../../components/instant-loan-detail/instant-loan-detail.module').then(m => m.InstantLoanDetailModule), canActivate: [AuthGuard]
    },
    // {
    //     path: 'LAP/view/:id',
    //     loadChildren: () => import('../../components/home-loan-detail/home-loan-detail.module').then(m => m.HomeLoanDetailModule), canActivate: [AuthGuard]
    // },
    {
        path: 'relationManager',
        loadChildren: () => import('../../components/relation-manager/relation-manager.module').then(m => m.RelationManagerModule), canActivate: [AuthGuard]
    },
    {
        path: 'employee/add',
        loadChildren: () => import('../../components/employee-add/employee-add.module').then(m => m.EmployeeAddModule), canActivate: [AuthGuard]
    },
    {
        path: 'employee/edit/:id',
        loadChildren: () => import('../../components/employee-add/employee-add.module').then(m => m.EmployeeAddModule), canActivate: [AuthGuard]
    },
    {
        path: 'connector/add',
        loadChildren: () => import('../../components/connector-add/connector-add.module').then(m => m.ConnectorAddModule), canActivate: [AuthGuard]
    },
    {
        path: 'connector/edit/:id',
        loadChildren: () => import('../../components/connector-add/connector-add.module').then(m => m.ConnectorAddModule), canActivate: [AuthGuard]
    },
    {
        path: 'subdsa',
        loadChildren: () => import('../../components/subdsa/subdsa.module').then(m => m.SubDsaModule), canActivate: [AuthGuard]
    },
    {
        path: 'dsa',
        loadChildren: () => import('../../components/dsa/dsa.module').then(m => m.DsaModule), canActivate: [AuthGuard]
    },
    {
        path: 'dsa',
        loadChildren: () => import('../../components/dsa/dsa.module').then(m => m.DsaModule), canActivate: [AuthGuard]
    },
    {
        path: 'connector',
        loadChildren: () => import('../../components/connector/connector.module').then(m => m.ConnectorModule), canActivate: [AuthGuard]
    },
    {
        path: 'employee',
        loadChildren: () => import('../../components/employee/employee.module').then(m => m.EmployeeModule), canActivate: [AuthGuard]
    },
    {
        path: 'trainingCategories',
        loadChildren: () => import('../../components/training-category/training-category.module').then(m => m.TrainingCategoryModule), canActivate: [AuthGuard]
    },
    {
        path: 'training',
        loadChildren: () => import('../../components/training/training.module').then(m => m.TrainingModule), canActivate: [AuthGuard]
    },
    {
        path: 'employmentTypes',
        loadChildren: () => import('../../components/employment-type/employment-type.module').then(m => m.EmploymentTypeModule), canActivate: [AuthGuard]
    },
    {
        path: 'serviceEmploymentTypes',
        loadChildren: () => import('../../components/service-employment-type/service-employment-type.module').then(m => m.ServiceEmploymentTypeModule), canActivate: [AuthGuard]
    },
    {
        path: 'serviceType',
        loadChildren: () => import('../../components/servicetype/servicetype.module').then(m => m.ServicetypeModule), canActivate: [AuthGuard]
    },

    {
        path: 'services',
        loadChildren: () => import('../../components/services/services.module').then(m => m.ServicesModule), canActivate: [AuthGuard]
    },

    {
        path: 'documentMaster',
        loadChildren: () => import('../../components/document-master/document-master.module').then(m => m.DocumentMasterModule), canActivate: [AuthGuard]
    },
    {
        path: 'serviceDocument',
        loadChildren: () => import('../../components/service-wise-documents/service-wise-documents.module').then(m => m.ServiceWiseDocumentsModule), canActivate: [AuthGuard]
    },
    {
        path: 'maritalstatuses',
        loadChildren: () => import('../../components/maritalstatuses/maritalstatuses.module').then(m => m.MaritalstatusesModule), canActivate: [AuthGuard]
    },
    {
        path: 'residencetype',
        loadChildren: () => import('../../components/residence-type/residence-type.module').then(m => m.ResidenceTypeModule), canActivate: [AuthGuard]
    },
    {
        path: 'loanagainstcollteral',
        loadChildren: () => import('../../components/loan-against-collteral/loan-against-collteral.module').then(m => m.LoanAgainstCollteralModule), canActivate: [AuthGuard]
    },
    {
        path: 'businessannualprofit',
        loadChildren: () => import('../../components/business-annual-profit/business-annual-profit.module').then(m => m.BusinessAnnualProfitModule), canActivate: [AuthGuard]
    },
    {
        path: 'bank',
        loadChildren: () => import('../../components/bank/bank.module').then(m => m.BankModule), canActivate: [AuthGuard]
    },
    {
        path: 'businessannualsale',
        loadChildren: () => import('../../components/business-annual-sale/business-annual-sale.module').then(m => m.BusinessannualsaleModule), canActivate: [AuthGuard]
    },
    {
        path: 'businessexperience',
        loadChildren: () => import('../../components/business-experience/business-experience.module').then(m => m.BusinessExperienceModule), canActivate: [AuthGuard]
    },
    {
        path: 'industrytype',
        loadChildren: () => import('../../components/industry-type/industry-type.module').then(m => m.IndustrytypeModule), canActivate: [AuthGuard]
    },
    {
        path: 'loanstatus',
        loadChildren: () => import('../../components/loan-status/loan-status.module').then(m => m.LoanstatusModule), canActivate: [AuthGuard]
    },
    {
        path: 'businessNature',
        loadChildren: () => import('../../components/business-nature/business-nature.module').then(m => m.BusinessNatureModule), canActivate: [AuthGuard]
    },
    {
        path: 'propertyType',
        loadChildren: () => import('../../components/property-type/property-type.module').then(m => m.PropertyTypeModule), canActivate: [AuthGuard]
    },
    {
        path: 'employmentServiceType',
        loadChildren: () => import('../../components/employment-service-type/employment-service-type.module').then(m => m.EmploymentServiceTypeModule), canActivate: [AuthGuard]
    },
    {
        path: 'employmentNature',
        loadChildren: () => import('../../components/employment-nature/employment-nature.module').then(m => m.EmploymentNatureModule), canActivate: [AuthGuard]
    },
    {
        path: 'commission',
        loadChildren: () => import('../../components/commission/commission.module').then(m => m.CommissionModule), canActivate: [AuthGuard]
    },
    {
        path: 'customers',
        loadChildren: () => import('../../components/customer/customer.module').then(m => m.CustomerModule), canActivate: [AuthGuard]
    },
    {
        path: 'customer/add',
        loadChildren: () => import('../../components/customer-add/customer-add.module').then(m => m.CustomerAddModule), canActivate: [AuthGuard]
    },
    {
        path: 'customer/edit/:id',
        loadChildren: () => import('../../components/customer-add/customer-add.module').then(m => m.CustomerAddModule), canActivate: [AuthGuard]
    },
    {
        path: 'customer/view/:id',
        loadChildren: () => import('../../components/customer-detail/customer-detail.module').then(m => m.CustomerDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'addressType',
        loadChildren: () => import('../../components/address-type/address-type.module').then(m => m.AddressTypeModule), canActivate: [AuthGuard]
    },
    {
        path: 'coApplicantRelation',
        loadChildren: () => import('../../components/co-applicant-relation/co-applicant-relation.module').then(m => m.CoApplicantRelationModule), canActivate: [AuthGuard]
    },
    {
        path: 'badges',
        loadChildren: () => import('../../components/badges/badges.module').then(m => m.BadgesModule), canActivate: [AuthGuard]
    },
    {
        path: 'bankLoan',
        loadChildren: () => import('../../components/bank-loan/bank-loan.module').then(m => m.BankLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'visitingCard',
        loadChildren: () => import('../../components/visiting-card/visiting-card.module').then(m => m.VisitingCardModule), canActivate: [AuthGuard]
    },
    {
        path: 'bankLoanPolicy',
        loadChildren: () => import('../../components/bank-loan-policy/bank-loan-policy.module').then(m => m.BankLoanPolicyModule), canActivate: [AuthGuard]
    },
    {
        path: 'bankLoanPolicy/add',
        loadChildren: () => import('../../components/add-bank-loan-policy/add-bank-loan.module').then(m => m.AddBankLoanPolicyModule), canActivate: [AuthGuard]
    },
    {
        path: 'bankLoanPolicy/edit/:id',
        loadChildren: () => import('../../components/add-bank-loan-policy/add-bank-loan.module').then(m => m.AddBankLoanPolicyModule), canActivate: [AuthGuard]
    },
    {
        path: 'creditCard',
        loadChildren: () => import('../../components/credit-card/credit-card.module').then(m => m.CreditCardModule), canActivate: [AuthGuard]
    },
    {
        path: 'credit-card/add/:customerId',
        loadChildren: () => import('../../components/add-credit-card/add-credit-card.module').then(m => m.AddCreditCardnModule), canActivate: [AuthGuard]
    },
    {
        path: 'credit-card/edit/:customerId/:id',
        loadChildren: () => import('../../components/add-credit-card/add-credit-card.module').then(m => m.AddCreditCardnModule), canActivate: [AuthGuard]
    },
    {
        path: 'credit-card/view/:id',
        loadChildren: () => import('../../components/credit-card-detail/credit-card-detail.module').then(m => m.CreditCardDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'bankCreditCard',
        loadChildren: () => import('../../components/bank-credit-card/bank-credit-card.module').then(m => m.BankCreditCardModule), canActivate: [AuthGuard]
    },
    {
        path: 'bankCreditCardPolicy',
        loadChildren: () => import('../../components/bank-credit-card-policy/bank-credit-card-policy.module').then(m => m.BankCreditCardPolicyModule), canActivate: [AuthGuard]
    },
    {
        path: 'rewardCoin',
        loadChildren: () => import('../../components/reward-coin/reward-coin.module').then(m => m.RewardCoinModule), canActivate: [AuthGuard]
    },
    {
        path: 'otherLoan',
        loadChildren: () => import('../../components/other-loan/other-loan.module').then(m => m.OtherLoanModule), canActivate: [AuthGuard]
    },
    {
        path: 'otherService',
        loadChildren: () => import('../../components/other-service/other-service.module').then(m => m.OtherServiceModule), canActivate: [AuthGuard]
    },
    {
        path: 'faqs',
        loadChildren: () => import('../../components/faqs/faqs.module').then(m => m.FaqsModule), canActivate: [AuthGuard]
    },
    {
        path: 'leads',
        loadChildren: () => import('../../components/leads/leads.module').then(m => m.LeadsModule), canActivate: [AuthGuard]
    },
    {
        path: 'leads/add',
        loadChildren: () => import('../../components/add-lead/add-lead.module').then(m => m.AddLeadModule), canActivate: [AuthGuard]
    },
    {
        path: 'leads/edit/:id',
        loadChildren: () => import('../../components/add-lead/add-lead.module').then(m => m.AddLeadModule), canActivate: [AuthGuard]
    },
    {
        path: 'dsa/view/:id',
        loadChildren: () => import('../../components/dsa-detail/dsa-detail.module').then(m => m.DsaDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'subdsa/view/:id',
        loadChildren: () => import('../../components/subdsa-detail/subdsa-detail.module').then(m => m.SubdsaDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'employee/view/:id',
        loadChildren: () => import('../../components/employee-detail/employee-detail.module').then(m => m.EmployeeDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'connector/view/:id',
        loadChildren: () => import('../../components/connector-detail/connector-detail.module').then(m => m.ConnectorDetailModule), canActivate: [AuthGuard]
    },
    {
        path: 'adminUser/add',
        loadChildren: () => import('../../components/add-user/add-user.module').then(m => m.AddUserModule), canActivate: [AuthGuard]
    },
    {
        path: 'adminUser/edit/:id',
        loadChildren: () => import('../../components/add-user/add-user.module').then(m => m.AddUserModule), canActivate: [AuthGuard]
    },
    {
        path: 'adminUser',
        loadChildren: () => import('../../components/admin-user/admin-user.module').then(m => m.AdminUserModule), canActivate: [AuthGuard]
    },
    {
        path: 'permissionGroup',
        loadChildren: () => import('../../components/permission-group/permission-group.module').then(m => m.PermissionGroupModule), canActivate: [AuthGuard]
    },
    {
        path: 'permissionGroup/add',
        loadChildren: () => import('../../components/add-permission-group/add-permission-group.module').then(m => m.AddPermissionGroupModule), canActivate: [AuthGuard]
    },
    {
        path: 'permissionGroup/edit/:id',
        loadChildren: () => import('../../components/add-permission-group/add-permission-group.module').then(m => m.AddPermissionGroupModule), canActivate: [AuthGuard]
    },
    {
        path: ':roleName/add',
        loadChildren: () => import('../../components/dsa-add/dsa-add.module').then(m => m.DsaAddModule), canActivate: [AuthGuard]
    },
    {
        path: ':roleName/edit/:id',
        loadChildren: () => import('../../components/dsa-add/dsa-add.module').then(m => m.DsaAddModule), canActivate: [AuthGuard]
    },

    {
        path: ':serviceName/add/:customerId',
        loadChildren: () => import('../../components/add-personal-loan/add-personal-loan.module').then(m => m.AddPersonalLoanModule), canActivate: [AuthGuard]
    },
    {
        path: ':serviceName/edit/:customerId/:customerLoanId',
        loadChildren: () => import('../../components/add-personal-loan/add-personal-loan.module').then(m => m.AddPersonalLoanModule), canActivate: [AuthGuard]
    },
    {
        path: ':serviceName/view/:id',
        loadChildren: () => import('../../components/home-loan-detail/home-loan-detail.module').then(m => m.HomeLoanDetailModule), canActivate: [AuthGuard]
    },
    {
        path: ':roleName/view/:id',
        loadChildren: () => import('../../components/dsa-add/dsa-add.module').then(m => m.DsaAddModule), canActivate: [AuthGuard]
    },
    {
        path: 'banner',
        loadChildren: () => import('../../components/banner/banner.module').then(m => m.BannerModule), canActivate: [AuthGuard]
    },
    {
        path: 'commissionTemplate',
        loadChildren: () => import('../../components/commission-template/commission-template.module').then(m => m.CommissionTemplateModule), canActivate: [AuthGuard]
    },
    {
        path: 'userScratchCard',
        loadChildren: () => import('../../components/user-scratch-card/user-scratch-card.module').then(m => m.UserScratchCardModule), canActivate: [AuthGuard]
    },
    {
        path: 'settings',
        loadChildren: () => import('../../components/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard]
    },
    {
        path: 'giftProduct',
        loadChildren: () => import('../../components/gift-product/gift-product.module').then(m => m.GiftProductModule), canActivate: [AuthGuard]
    },
    {
        path: 'payout',
        loadChildren: () => import('../../components/payout/payout.module').then(m => m.PayoutModule), canActivate: [AuthGuard]
    },
    {
        path: 'order',
        loadChildren: () => import('../../components/order/order.module').then(m => m.OrderModule), canActivate: [AuthGuard]
    },
    {
        path: 'newsLetterSubscription',
        loadChildren: () => import('../../components/news-letter-subscription/news-letter-subscription.module').then(m => m.NewsLetterSubscriptionModule), canActivate: [AuthGuard]
    },
    {
        path: 'adminCommission',
        loadChildren: () => import('../../components/admin-get-commission/admin-get-commission.module').then(m => m.AdminGetCommissionModule), canActivate: [AuthGuard]
    },
    {
        path: 'itr',
        loadChildren: () => import('../../components/itr/itr.module').then(m => m.ItrModule), canActivate: [AuthGuard]
    },
    {
        path: 'becomePartnerRequest',
        loadChildren: () => import('../../components/become-partner/become-partner.module').then(m => m.BecomePartnerModule), canActivate: [AuthGuard]
    },
    {
        path: 'contactRequest',
        loadChildren: () => import('../../components/contact-request/contact-request.module').then(m => m.ContactRequestModule), canActivate: [AuthGuard]
    },

];