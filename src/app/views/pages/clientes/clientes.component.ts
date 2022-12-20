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
  /* Iniciando las variables necesarias */
  clientes: Array<object>= [];
  temp: Array<object>= [];
  eliminarCliente: FormGroup = new FormGroup({});
  actualizarCliente: FormGroup = new FormGroup({});
  cliente_cuentas: Array<Cliente_cuentaModel>= [];
  /* Propiedades de la tabla */
  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  columns: Array<object> = [];
  /* Referencia al buscador */
  @ViewChild('search', { static: false }) search: any;
  /* Referencias a los modales */
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
    this.columns = [ //las columnas de la tabla, para realizar la busqueda
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
  initForm(): FormGroup{ // Datos que tendra el form y sus validaciones
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
  /* Metodo para obtener los clientes usando el servicio */
  public getclientes(){
    this._clientesService.getClientes().subscribe((clientes: Array<ClientesModel>) => {
      this.clientes = clientes;
      this.temp = clientes;
    })
  }
  /* Metodo para cerrar el modal */
  private _cerrar(): void {
    this._currentModal.close();
  }
  /* Metodo para abrir el modal de actualizar, recibe el cliente a editar */
  public Actualizar_Modal(cliente:any): void {
    this.actualizarCliente.patchValue(cliente);
    this._currentModal = this.modalService.open(this.actualizarModal, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }
  /* Metodo para actualizar el cliente */
  public actualizar(): void {
    //Poniendo el rfc y la curp en mayusculas
    this.actualizarCliente.value.rfc = this.actualizarCliente.value.rfc.toUpperCase();
    this.actualizarCliente.value.curp = this.actualizarCliente.value.curp.toUpperCase();
    this._clientesService.putClientes(this.actualizarCliente.value).pipe(
      take(1),
      map((dato:any) => {
        if(dato.status == 200){ //Mostrar alerta de exito
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'Cliente editado con exito'
          })
        }
        else {
          Swal.fire({ //Mostrar alerta de error
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
  /* Modal/alerta de eliminar */
  public eliminar_modal(clientes:any): void {
    Swal.fire({
      title: 'Estas seguro de eliminar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result:any) => { 
      if (result.value) { //si la respuesta es si, procede a eliminar
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
      } else if (result.dismiss === Swal.DismissReason.cancel) { //si la respuesta es no, muestra modal de cancelacion
        Swal.fire(
          'Cancelado',
          '',
          'error'
        )
      }
    })
  }
  /* Abrir modal de cuentas del cliente */
  public Cuentas_Modal(cliente:any): void {
    //Obteniendo las cuentas desde el servicio, enviando el cliente
    this._clientesService.getCliente_Cuentas(cliente).subscribe((cuentas: Array<Cliente_cuentaModel>) => {
      this.cliente_cuentas = cuentas;
    })
    //abriendo el modal
    this._currentModal = this.modalService.open(this.cuentasModal, {
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }
  /* Metodo para realizar la busqueda en la tabla */
  ngAfterViewInit(): void {
    //Si existe un evento de soltar tecla en el objeto search, extrear los valores y mandarlo al metodo updateFilter
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(550),
        map((x:any) => x['target']['value'])
      )
      .subscribe((value) => {
        this.updateFilter(value);
      });
  }
  /* Metodo para realizar el filtro de la palabra buscada (Se hace en todas las columnas) */
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