import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry, map } from 'rxjs/operators';
import { ClientesModel } from '../../../../Models/cliente.model'
import { Cliente_cuentaModel } from '../../../../Models/cliente_cuenta.model'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private _httpClient: HttpClient) { }
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
  public putClientes(cliente:any){
    return this._httpClient.put(`http://localhost:3018/clientes`, cliente).
    pipe(
      retry(1),
      map( (data:any) => {
        return data;
      })
    )
  }
  public deleteclientes(cliente:any){
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        id_cliente: cliente.id_cliente
      }
    }
    return this._httpClient.delete(`http://localhost:3018/clientes`, options)
  }
}
