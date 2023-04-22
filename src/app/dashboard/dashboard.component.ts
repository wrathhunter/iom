import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserServiceService } from '../user-service.service';

export interface PeriodicElement {
  position: number;
  service: Service;
  branch: ServiceBranch[];
  deployed: ServiceBranch;
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
      this.env = data[0]._id;
      this.userService
        .fetchAllServicesOfaEnvironment(this.env)
        .subscribe((data) => {
          console.log(data);
          data.environment.services.forEach((service: { branches: ServiceBranch[] ,name: string,_id: string;}) => {
            const deployed = service.branches.find(branch => branch.deployed);
            const deployedBranchName = deployed ? deployed : {_id: '',name: '',state: '',deployed: false,};
              this.ELEMENT_DATA.push({
                position: this.ELEMENT_DATA.length + 1,
                service: service,
                branch:service.branches,
                deployed: deployedBranchName,
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
