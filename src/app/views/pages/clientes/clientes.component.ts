import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from './services/cliente.service'
import { ClientesModel } from './../../../Models/cliente.model';
import { Cliente_cuentaModel } from './../../../Models/cliente_cuenta.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2'
import { fromEvent } from 'rxjs';
import { ValidacionesCustom } from "../../../../assets/ValidacionesCustom"


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: Array<object>= [];
  temp: Array<object>= [];
  eliminarCliente: FormGroup = new FormGroup({});
  actualizarCliente: FormGroup = new FormGroup({});
  cliente_cuentas: Array<Cliente_cuentaModel>= [];
  /********PROPPIEDAD PARA LA TABLA******** */
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  columns: Array<object> = [];
  @ViewChild('search', { static: false }) search: any;
  /************PROPIEDADES PARA EL MODAL**********/
  @ViewChild('actualizarModal') actualizarModal: any;
  @ViewChild('cuentasModal') cuentasModal: any;

  
  constructor(
    private _clientesService:ClienteService,
    private modalService:NgbModal,
    private _currentModal:NgbActiveModal,
    public formBuilder:FormBuilder,
    ) { 
  }

  ngOnInit(): void {
    this.columns = [
      {name: "id", prop: "id_cliente"},
      {name: "Nombre", prop: "nombre"},
      {name: "Apellido Paterno", prop: "apellido_paterno"},
      {name: "Apellido Materno", prop: "apellido_materno"},
      {name: "RFC", prop: "rfc"},
      {name: "CURP", prop: "curp"},
      {name: "Fecha de Alta", prop: "fecha_alta"},
    ]
    this.getclientes();
    this.actualizarCliente = this.initForm();
    this.eliminarCliente = this.initForm();
  }
  initForm(): FormGroup{
    return this.formBuilder.group({
      id_cliente: [""],
      nombre: ["", Validators.required],
      apellido_paterno: ["", Validators.required],
      apellido_materno: ["", Validators.required],
      rfc: ["", [Validators.required, ValidacionesCustom.validarRFC]],
      curp: ["", [Validators.required, ValidacionesCustom.validarCURP]],
      fecha_alta: ["", ],
    })
  }

  public getclientes(){
    this._clientesService.getClientes().subscribe((clientes: Array<ClientesModel>) => {
      this.clientes = clientes;
      this.temp = clientes;
    })
  }
  private _cerrar(): void {
    this._currentModal.close();
  }
  public Actualizar_Modal(cliente:any): void {
    this.actualizarCliente.patchValue(cliente);
    this._currentModal = this.modalService.open(this.actualizarModal, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }
  public actualizar(): void {
    this.actualizarCliente.value.rfc = this.actualizarCliente.value.rfc.toUpperCase();
    this.actualizarCliente.value.curp = this.actualizarCliente.value.curp.toUpperCase();
    this._clientesService.putClientes(this.actualizarCliente.value).pipe(
      take(1),
      map((dato:any) => {
        if(dato.status == 200){
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'Cliente editado con exito'
          })
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al editar cliente'
          })
        }
      })
    )
    .subscribe(() => {
      this.getclientes();
    })
    this._cerrar();
  }
  public eliminar_modal(clientes:any): void {
    Swal.fire({
      title: 'Estas seguro de eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result:any) => {
      if (result.value) {
        this.eliminarCliente.patchValue(clientes)
        this._clientesService.deleteclientes(this.eliminarCliente.value).
        pipe(
          take(1)
        ).
        subscribe(() => {
          this.getclientes();
          Swal.fire(
            'Eliminado!',
            '',
            'success'
          )
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          '',
          'error'
        )
      }
    })
  }
  public Cuentas_Modal(cliente:any): void {
    this._clientesService.getCliente_Cuentas(cliente).subscribe((cuentas: Array<Cliente_cuentaModel>) => {
      this.cliente_cuentas = cuentas;
    })
    console.log(this.cliente_cuentas)
    this._currentModal = this.modalService.open(this.cuentasModal, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }
  /**********Busqueda************/
  ngAfterViewInit(): void {
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(550),
        map((x:any) => x['target']['value'])
      )
      .subscribe((value) => {
        this.updateFilter(value);
      });
  }
  updateFilter(val: any) {
    const value = val.toString().toLowerCase().trim();
    const count = this.columns.length;
    const keys = Object.keys(this.temp[0]);
    this.clientes = this.temp.filter((item:any) => {
      for (let i = 0; i < count; i++) {
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(value) !== -1) || !value) {
          return true;
        }
      }
    });
  }
}