import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { CryptoService } from '../crypto/crypto.service';


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})

export class DashboardComponent implements OnInit{

    cryptoId = 'BTC';

    cryptos = []

    listIntraday15min = []

    constructor(private service: CryptoService){

    }

  public canvas : any;
  public ctx;
  public chartColor;
  public chartSpeed;
  public chartHours;

    ngOnInit(){

      this.getCryptos();

      this.searchIntraday(this.cryptoId)
      this.searchMonth(this.cryptoId)

      this.chartColor = "#FFFFFF";
      this.canvas = document.getElementById("chartHours");
      this.ctx = this.canvas.getContext("2d");

      
    
    }

    getCryptos(){
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

    onOptionsSelected(){
      console.log(this.cryptoId)
      this.searchMonth(this.cryptoId);
      this.searchIntraday(this.cryptoId);
    }

    searchMonth(crypto){
      this.service.getCryptoMonth(crypto).subscribe(
        (data: any) => {

          console.log(data);

          if(!data){
            alert("Nenhuma Informação Encontrada");
            return;
          }else if((data && (data.Note || data["Error Message"]))){
            alert(data.Note?data.Note:data["Error Message"]);
            return;
          }

          let keys = Object.keys(data["Time Series (Digital Currency Monthly)"])
          let arrayKeys30min = [];
          let arrayValues30Min = [];
          for(var i = 0; i < keys.length;i++){
            arrayKeys30min.push(keys[i]);
            let valueEntity = data["Time Series (Digital Currency Monthly)"][keys[i]];
            arrayValues30Min.push(valueEntity["4a. close (BRL)"]);
          }

          arrayKeys30min.reverse();
          arrayValues30Min.reverse();
          this.createChartMonth(arrayKeys30min, arrayValues30Min);

        },
        error => {
          alert(error.error);
          console.log((error.error.message?error.error.message:error));
        });
    }

    createChartMonth(arrayKeys30min, arrayValues30Min){

      var speedCanvas = document.getElementById("speedChart");

      var dataFirst = {
        data: arrayValues30Min,
        fill: false,
        borderColor: '#fbc658',
        backgroundColor: 'transparent',
        pointBorderColor: '#fbc658',
        pointRadius: 4,
        pointHoverRadius: 4,
        pointBorderWidth: 8,
      };

      var speedData = {
        labels: arrayKeys30min,
        datasets: [dataFirst]
      };

      var chartOptions = {
        legend: {
          display: false,
          position: 'top'
        }
      };

      var lineChart = new Chart(speedCanvas, {
        type: 'line',
        hover: false,
        data: speedData,
        options: chartOptions
      });
    }

    searchIntraday(crypto){

      this.service.getCryptoIntraday(crypto).subscribe(
        (data: any) => {

          console.log(data);

          if(!data){
            alert("Nenhuma Informação Encontrada");
            return;
          }else if((data && (data.Note || data["Error Message"]))){
            alert(data.Note?data.Note:data["Error Message"]);
            return;
          }

          let keys = Object.keys(data["Time Series Crypto (15min)"])
          let arrayKeys15min = [];
          let arrayValues15Min = [];
          for(var i = 0; i < keys.length;i++){
            arrayKeys15min.push(keys[i]);
            let valueEntity = data["Time Series Crypto (15min)"][keys[i]];
            arrayValues15Min.push(valueEntity["4. close"]);
          }

          arrayKeys15min.reverse();
          arrayValues15Min.reverse();
          this.createChart15Min(arrayKeys15min, arrayValues15Min);

        },
        error => {
          alert(error.error);
          console.log((error.error.message?error.error.message:error));
        });
    }

    createChart15Min(arrayKeys15min, arrayValues15Min){

      this.chartHours = new Chart(this.ctx, {
        type: 'line',
        data: {
          labels: arrayKeys15min,
          datasets: [{
              borderColor: "#6bd098",
              backgroundColor: "#6bd098",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: arrayValues15Min
            }
          ]
        },
        options: {
          legend: {
            display: false
          },

          tooltips: {
            enabled: false
          },

          scales: {
            yAxes: [{

              ticks: {
                fontColor: "#9f9f9f",
                beginAtZero: false,
                maxTicksLimit: 5,
                //padding: 20
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#ccc",
                color: 'rgba(255,255,255,0.05)'
              }

            }],

            xAxes: [{
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: 'rgba(255,255,255,0.1)',
                zeroLineColor: "transparent",
                display: false,
              },
              ticks: {
                padding: 20,
                fontColor: "#9f9f9f"
              }
            }]
          },
        }
      });
    }
}
