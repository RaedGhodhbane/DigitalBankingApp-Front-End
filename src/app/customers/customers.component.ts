import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customers!: Observable<Array<Customer>>;
  searchFormGroup!: FormGroup | undefined;
  errorMessage: string | undefined;

  constructor(private customersService : CustomerService, private fb: FormBuilder, private router: Router) { }


  // Cette méthode est utilisée lors de l'éxécution de la partie logique qui concerne le traitement
  // du component customer, il y'aura la logique métier selon le besoin de notre api

  // Chargement de la liste des customers à travers un api web
  ngOnInit(): void {
    this.searchFormGroup=this.fb.group({
      keyword : this.fb.control("")
    });

    // On va préparer la logique de la recherche à travers un keyword
    //this.searchFormGroup = this.fb.group({})
    //subscribe permet de charger la liste des customers à travers l'url
    // pipe on l'utilise pour la gestion des exceptions
    this.customers = this.customersService.getCustomers().pipe(
      catchError(err => {
        console.log(this.errorMessage = err.message);
        return throwError(err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Do you want to delete this customer ?");
    if(!conf) return;
    this.customersService.deleteCustomer(c.id).subscribe({
      next : (resp) => {
        this.customers=this.customers.pipe(
          map(data=>{ // map pour ouvrir la liste data chargée par Observable (à partir de subscribe(Design parttern d'Observable càd de chargement
            // d'un flux à travers du back-end))
            let index=data.indexOf(c); // le numéro de ligne à supprimer
            data.slice(index,1) // c'est une méthode qui va supprimer la ligne selon l'index qu'on a trouvé au dessus
            return data;
          })
        );
      },
      error : err => {
        console.log(err);
      }
    })
  }

  handleSearchCustomers() {
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customersService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage=err.message;
        return throwError(err);
      })
    );
  }
}