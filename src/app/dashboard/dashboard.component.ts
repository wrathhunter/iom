import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserServiceService } from '../user-service.service';

export interface PeriodicElement {
  position: number;
  service: string;
  branch: string[];
  deployed: string;
  status:string
}

export interface ServiceBranch {
  _id: string;
  name: string;
  state: string;
  deployed: boolean;
}

export interface Service {
  _id: string;
  name: string;
  branches: ServiceBranch[];
}

export interface Data {
  _id: string;
  name: string;
  services: Service[];
  __v: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'service', 'branch', 'deployed', 'status'];
  dataSource!: MatTableDataSource<PeriodicElement>;
  env: any;
  selectedBranch:any

  constructor(private userService: UserServiceService) { }

  ngOnInit(): void {
    this.userService.fetchEnvironment().subscribe((data) => {
      console.log(data[0]);
      this.env = data[0].name;
      this.userService
        .fetchAllServicesOfaEnvironment(this.env)
        .subscribe((data) => {
          console.log(data);
          data.services.forEach((service: { branches: ServiceBranch[] ,name: string,_id: string;}) => {
            const deployed = service.branches.find(branch => branch.deployed);
            const deployedBranchName = deployed ? deployed : {_id: '',name: '',state: '',deployed: false,};
              this.ELEMENT_DATA.push({
                position: this.ELEMENT_DATA.length + 1,
                service: service.name,
                branch:service.branches.map(branch => branch.name),
                deployed: deployedBranchName.name,
                status: deployedBranchName.state 
              });
            
          });
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        });
    }, error => {
      console.log(error);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
