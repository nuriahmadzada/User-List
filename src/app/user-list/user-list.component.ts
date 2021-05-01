import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserListService } from './user-list.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class UserListComponent implements OnInit {
  userInfos: any;
  page = +window.location.pathname.split('/').pop();
  onFirstPage = false;
  itemCount: number = 0;
  modalRef: BsModalRef;
  createForm: FormGroup;
  editForm: FormGroup;
  show: false;
  form: FormGroup;
  userId: number;
  fullName: string;
  userName: string;

  constructor(
    private userListService: UserListService,
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
  ) { }

  initLoginForm() {
    this.createForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),
      job: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    });

    this.editForm = new FormGroup({
      id: new FormControl(null, 
      ),
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ]),
      job: new FormControl(null, [
        Validators.required,
        Validators.maxLength(100),
      ])
    });
  }

  ngOnInit() {
    this.getUsers();
    this.initLoginForm();
    this.fullName = localStorage.getItem("name");
    this.userName = this.fullName.substring(0, this.fullName.lastIndexOf("@"));
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  getUsers() {
    this.userListService.getUserList(this.page).subscribe(
      (response) => {
        this.userInfos = response.body.data;
        this.itemCount = response.body.total;
        if(this.userInfos == ""){
          this.router.navigate(['/not-found']);
        }
      },
      (error) => {}
    )
  }

  create(){
    this.userListService.createUser(this.createForm.value).subscribe(
      (response) => {
        console.log(response);
        if(response.status == 201){
          this.modalService.hide();
          Swal.fire({
            title: 'Success',  
            icon: 'success',  
          });  
        }
      }
    )    
  }

  openEditModal(editModal, item){
    this.modalService.show(editModal);
    this.userId = item.id;
  }

  // Can not patch the current values of user to the modal
  // Because, PUT method requires "Name", "Job" values from selected User,
  // But i could not get Single-Name and Single-Job from URLs. 
  editUser(id){
    id = this.userId;
    this.editForm.removeControl("id");
    console.log(this.editForm.value);
    this.userListService.editUser(id, this.editForm.value).subscribe(
      (resp)=>{
        console.log(resp);
      }
    )
  }

  deleteUser(id: number){
    Swal.fire({
      title: 'Do you want to delete this user?',
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.userListService.deleteUser(id).subscribe(
          (resp) => {
            console.log(resp);
            Swal.fire('Deleted!', '', 'success')
          }
        )
      }
    })
    
  }
}
