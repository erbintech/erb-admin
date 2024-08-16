import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class PaginationService {

    constructor(private http: HttpClient) { }

    public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
        // calculate total pages      
        let totalPages = Math.ceil(totalItems / pageSize);

        // Paginate Range
        let paginateRange = 5;

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage < paginateRange - 1) {
            startPage = 1;
            endPage = startPage + paginateRange - 1;
        } else if (currentPage == totalPages) {
            startPage = currentPage - 4;
            endPage = currentPage;
        }
        else if (currentPage + 2 == totalPages) {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
        else if (currentPage + 1 == totalPages) {
            startPage = currentPage - 3;
            endPage = currentPage + 1;
        }
        else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}