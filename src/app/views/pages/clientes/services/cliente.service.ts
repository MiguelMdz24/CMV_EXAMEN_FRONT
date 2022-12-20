/* Servicios para los clientes, obtener, editar y eliminar cliente */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, map } from 'rxjs/operators';
//Modelos necesarios
import { ClientesModel } from '../../../../Models/cliente.model'
import { Cliente_cuentaModel } from '../../../../Models/cliente_cuenta.model'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private _httpClient: HttpClient) { }
  /*metodo para obtener los clientes de la api. 
    No recibe nada.
    Regresa todos los clientes (ClientesModel)
  */
  public getClientes(){
    return this._httpClient.get(`http://localhost:3018/clientes`)
    .pipe(
      retry(1),
      map( (data: any) => {
        let clientes: Array<ClientesModel> = new Array<ClientesModel>();
        data.forEach((element:any) => {
          clientes.push(new ClientesModel(element))
        });
        return clientes;
      })
    )
  }
  /*metodo para obtener las cuentas del cliente de la api.
    Recibe el id del cliente (number).
    Regresa todas las cuentas del cliente (Cliente_cuentaModel)
  */
  public getCliente_Cuentas(id_cliente:number){
    return this._httpClient.post(`http://localhost:3018/cliente_cuenta`,{id_cliente: id_cliente})
    .pipe(
      retry(1),
      map( (data: any) => {
        let clientes: Array<Cliente_cuentaModel> = new Array<Cliente_cuentaModel>();
        data.forEach((element:any) => {
          clientes.push(new Cliente_cuentaModel(element))
        });
        return clientes;
      })
    )
  }
  /*metodo para editar el cliente de la api.
    Recibe todos los datos del cliente (any).
    Regresa la respuesta de la api (any)
  */
  public putClientes(cliente:any){
    return this._httpClient.put(`http://localhost:3018/clientes`, cliente).
    pipe(
      retry(1),
      map( (data:any) => {
        return data;
      })
    )
  }
  /*metodo para eliminar el cliente de la api.
    Recibe todos los datos del cliente (any).
    Regresa la respuesta de la api (any)
  */
  public deleteclientes(cliente:any){
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id_cliente: cliente.id_cliente //sacar el id_cliente del cliente, para enviarlo en el doby
      }
    }
    return this._httpClient.delete(`http://localhost:3018/clientes`, options)
  }
}
