import { Routes } from '@angular/router';
import { adminGuard, authenticatedGuard, authenticationGuard, customerGuard, employeeGuard } from './guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/index/index.component'),
        canActivate: [authenticatedGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/index/dashboard/dashboard.component'),
                canActivate: [authenticatedGuard]
            },
            {
                path: 'login',
                loadComponent: () => import('./components/index/login/login.component'),
                canActivate: [authenticatedGuard]
            },
            {
                path: 'sign-up',
                loadComponent: () => import('./components/index/sign-up/sign-up.component'),
                canActivate: [authenticatedGuard],
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
        ]
    },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin-layout/admin-layout.component'),
        canActivate: [authenticationGuard, adminGuard],
        children: [
            {
                path: 'home',
                loadComponent: () => import('./components/admin-layout/home/home.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'home/earnings',
                loadComponent: () => import('./components/admin-layout/earnings/earnings.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'home/profile',
                loadComponent: () => import('./components/shared/update-info/update-info.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'customers',
                loadComponent: () => import('./components/admin-layout/customers/customers.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'employees',
                loadComponent: () => import('./components/admin-layout/employees/employees.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'employees/jobTitles',
                loadComponent: () => import('./components/admin-layout/employees/job-title/job-title.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'paymentMethods',
                loadComponent: () => import('./components/admin-layout/payment-method/payment-method.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'services',
                loadComponent: () => import('./components/admin-layout/tourist-services/tourist-services.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'services/purchases/:id',
                loadComponent: () => import('./components/admin-layout/tourist-services/purchases/purchases.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: 'services/packages/purchases/:id',
                loadComponent: () => import('./components/admin-layout/tourist-services/tour-packages/purchases/purchases.component'),
                canActivate: [authenticationGuard, adminGuard]
            },
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'home',
        loadComponent: () => import('./components/customer-layout/customer-layout.component'),
        canActivate: [authenticationGuard, customerGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/customer-layout/home/home.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: 'dashboard/profile',
                loadComponent: () => import('./components/shared/update-info/update-info.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: 'dashboard/packages',
                loadComponent: () => import('./components/customer-layout/home/see-packages/see-packages.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: 'buyService',
                loadComponent: () => import('./components/customer-layout/buy-service/buy-service.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: 'buyService/:id',
                loadComponent: () => import('./components/customer-layout/buy-service/buy-service.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: 'buyPackage',
                loadComponent: () => import('./components/customer-layout/buy-package/buy-package.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: 'buyPackage/:id',
                loadComponent: () => import('./components/customer-layout/buy-package/buy-package.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: 'purchases',
                loadComponent: () => import('./components/customer-layout/purchases/purchases.component'),
                canActivate: [authenticationGuard, customerGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'employee',
        loadComponent: () => import('./components/employee-layout/employee-layout.component'),
        canActivate: [authenticationGuard, employeeGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./components/employee-layout/dashboard/dashboard.component'),
                canActivate: [authenticationGuard, employeeGuard]
            },
            {
                path: 'dashboard/profile',
                loadComponent: () => import('./components/shared/update-info/update-info.component'),
                canActivate: [authenticationGuard, employeeGuard]
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
