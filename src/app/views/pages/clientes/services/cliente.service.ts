import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, map } from 'rxjs/operators';
import { ClientesModel } from '../../../../Models/cliente.model'

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
    return cliente;
  }
}
