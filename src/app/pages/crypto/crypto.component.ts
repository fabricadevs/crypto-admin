import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CryptoCreateComponent } from './create/crypto-create.component';
import { CryptoService } from './crypto.service';


@Component({
    selector: 'crypto-cmp',
    moduleId: module.id,
    templateUrl: 'crypto.component.html'
})

export class CryptoComponent implements OnInit{

    private cryptos: CryptoModel[] = [
    ];

    constructor(private service: CryptoService,private modalService: NgbModal){

    }

    ngOnInit(){
        this.searchFollows();
    }

    createModal(){
        this.openModal(undefined);
    }

    editModal(c){
        this.openModal(c);
    }

    public openModal(entity){

        const modalRef = this.modalService.open(CryptoCreateComponent, {
            size: 'xl', backdrop: 'static',
            keyboard: false
        });
      
        modalRef.componentInstance.entity = entity;
        modalRef.result.then((entityToSave) => {
            if(entityToSave && entityToSave.id && entityToSave.id > 0){
                this.editEntity(entityToSave);
            }else{
                this.createEntity(entityToSave);
            }
        }, (reason) => {
            console.log('fechou 2')
        });

    }

    editEntity(entityToSave){
        this.service.saveOrUpdate(entityToSave).subscribe(
            (data: any) => {
              this.searchFollows();
            },
            error => {
              alert(error.error);
            });
    }

    createEntity(entityToSave){
        this.service.saveOrUpdate(entityToSave).subscribe(
            (data: any) => {
              this.searchFollows();
            },
            error => {
              alert(error.error);
            });
    }

    getId(): number{
        
        let temp = 0;

        this.cryptos.forEach((element) => {
            if (temp < element.id) {
                temp = element.id;
            }
        });

        return temp + 1;
    }

    searchFollows(){

      this.service.getCryptoFollows().subscribe(
        (data: any) => {
          this.cryptos = [];
          console.log(data);
          if(data && data.length > 0){
            data.forEach(element => {
              this.cryptos.push(element);
            });
          }
        },
        error => {
          alert(error.error);
          console.log((error.error.message?error.error.message:error));
        });

    }
}
