import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CryptoService } from '../crypto.service';


@Component({
    selector: 'crypto-create-cmp',
    moduleId: module.id,
    templateUrl: 'crypto-create.component.html'
})

export class CryptoCreateComponent implements OnInit{

    formGroup: FormGroup;
    entity: CryptoModel;
    cryptos = [
      
    ];

    constructor(private service: CryptoService, private modalService: NgbModal, private fb: FormBuilder, public modal: NgbActiveModal){

    }

    ngOnInit(){
      this.loadForm();

      this.createListCrypto();

    }

    createListCrypto(){

      this.service.getAllCryptos().subscribe(
        (data: any) => {
          this.cryptos = [];
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

    loadForm(){

      if(!this.entity){
        this.entity = {id: 0, crypto: {id: '', name:''}, higherTargetPrice: 0, lowerTargetPrice: 0}
      }

      this.formGroup = this.fb.group({
        cryptoId: [this.entity.crypto.id],
        higherTargetPrice: [this.entity.higherTargetPrice],
        lowerTargetPrice:[this.entity.lowerTargetPrice]
      });
    }

    save(){
      this.prepareEntity();
      this.modal.close(this.entity);
    }

    prepareEntity(){
      const formData = this.formGroup.value;
      
      this.entity.higherTargetPrice = formData.higherTargetPrice;
      this.entity.lowerTargetPrice = formData.lowerTargetPrice;

      let cryptoId = formData.cryptoId;

      console.log(cryptoId);

      for(let i = 0; i < this.cryptos.length; i++){
        console.log(cryptoId + ' = ' + this.cryptos[i].id);
        if(cryptoId == this.cryptos[i].id){
          
          this.entity.crypto = this.cryptos[i];
        }
      }

      console.log(this.entity)

    }

}
