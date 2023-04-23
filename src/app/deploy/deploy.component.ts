import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

interface Api {
  name: string;
  endpoint: string;
  form: FormGroup;
}
@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.css']
})
export class DeployComponent {
  selectedApi!: Api;
  private apiUrl = 'https://iom-be.onrender.com/api';
  apis: Api[] = [
    {
      name: 'Add Service to Environment',
      endpoint: `${this.apiUrl}/addService/EVD`,
      form: this.fb.group({
        name: ['', Validators.required]
      })
    },
    {
      name: 'Add Branch to a Service',
      endpoint: `${this.apiUrl}/addBranch`,
      form: this.fb.group({
        serviceName: ['', Validators.required],
        name: ['', Validators.required],
        state: ['', Validators.required]
      })
    },
    {
      name: 'Update Branch of a Service',
      endpoint: `${this.apiUrl}/updateBranch`,
      form: this.fb.group({
        serviceName: ['', Validators.required],
        name: ['', Validators.required],
        state: ['', Validators.required]
      })
    },
    {
      name: 'Deploy Branch to a Service',
      endpoint: `${this.apiUrl}/deployService`,
      form: this.fb.group({
        serviceName: ['', Validators.required],
        branchName: ['', Validators.required]
      })
    }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) { }
  token = localStorage.getItem('token');
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };
  openForm(api: Api) {
    // set the selected API to the one passed in
    this.selectedApi = api;
    // reset the form
    this.selectedApi.form.reset();
  }

  onSubmit(api: Api) {
    if (api.form.valid) {
      if (api.name === 'Add Service to Environment') {
        const formData = api.form.value;
        // call the API with the endpoint and formData
        this.http.post(api.endpoint, formData, this.httpOptions).subscribe(response => {
          console.log(response);
          this.router.navigate(['/dashboard']);
        }, error => {
          console.error(error);
        });
        console.log(`API ${api.endpoint} called with data: `, formData);
        // reset the form
        api.form.reset();
        // close the dialog
        // this.selectedApi = null;
      }
      else if(api.name === 'Add Branch to a Service'){
        const branchData = api.form.value;
        const newObject = { ...branchData };
        delete newObject.serviceName;
        // call the API with the endpoint and formData
        this.http.post(`${api.endpoint}/${api.form.value.serviceName}`,newObject, this.httpOptions).subscribe(response => {
          console.log(response);
          this.router.navigate(['/dashboard']);
        }, error => {
          console.error(error);
        });
        console.log(`API ${api.endpoint} called with data: `, newObject);
        // reset the form
        api.form.reset();
        // close the dialog
        this.selectedApi = {
          name: '',
          endpoint: '',
          form: new FormGroup({})
        }
      }
      else if(api.name === 'Update Branch of a Service'){
        const branchData = api.form.value;
        const newObject = { ...branchData };
        delete newObject.name;
        // call the API with the endpoint and formData
        this.http.post(`${api.endpoint}/${api.form.value.name}`,newObject, this.httpOptions).subscribe(response => {
          console.log(response);
          this.router.navigate(['/dashboard']);
        }, error => {
          console.error(error);
        });
        console.log(`API ${api.endpoint} called with data: `, newObject);
        // reset the form
        api.form.reset();
        // close the dialog
        this.selectedApi = {
          name: '',
          endpoint: '',
          form: new FormGroup({})
        }
      }
      else if(api.name === 'Deploy Branch to a Service'){
        const branchData = api.form.value;
        // call the API with the endpoint and formData
        this.http.post(`${api.endpoint}/${api.form.value.serviceName}`,{name:branchData.branchName}, this.httpOptions).subscribe(response => {
          console.log(response);
          this.router.navigate(['/dashboard']);
        }, error => {
          console.error(error);
        });
        console.log(`API ${api.endpoint} called with data: `, branchData);
        // reset the form
        api.form.reset();
        // close the dialog
        this.selectedApi = {
          name: '',
          endpoint: '',
          form: new FormGroup({})
        }
      }

    } else {
      // display validation errors
      console.log('Form is invalid.');
    }
  }
}
