import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Customer } from "../model/customer.model";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn:'root'
})
export class CustomerService {
    constructor(private http : HttpClient) {
    }

    public getCustomers(): Observable<Array<Customer>> {
        return this.http.get<Array<Customer>>(`${environment.backendHost}` + "/customers");
    }

    public searchCustomers(keyword : string): Observable<Array<Customer>> {
        return this.http.get<Array<Customer>>(`${environment.backendHost}` + "/customers/search?keyword="+ keyword)
    }

    // Quand on a un objet en paramétre, au niveau du return dans l'api, on utilise un ,
    public saveCustomers(customer : Customer): Observable<Customer> {
        return this.http.post<Customer>(`${environment.backendHost}` + "/customers", customer);
    }

    // Quand on a un attribut en paramétre, au niveau du return dans l'api, on utilise un +
    public deleteCustomer(id: number) {
        return this.http.delete(`${environment.backendHost}`+ "/customers" + id);
    }

    public updateCustomer(id: number, customer: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${environment.backendHost}`+ "/customers" + id, customer);
    }
}