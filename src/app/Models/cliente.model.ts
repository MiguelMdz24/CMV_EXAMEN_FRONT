export interface Clientes {
    id_cliente: Number,
    nombre: String,
    apellido_paterno: String,
    apellido_materno: String,
    rfc: String,
    curp: String,
    fecha_alta: Date
}

export class ClientesModel implements Clientes{
    id_cliente: Number;
    nombre: String;
    apellido_paterno: String;
    apellido_materno: String;
    rfc: String;
    curp: String;
    fecha_alta: Date;

    constructor(item: any){
        this.id_cliente = item.id_cliente;
        this.nombre = item.nombre
        this.apellido_paterno = item.apellido_paterno;
        this.apellido_materno = item.apellido_materno;
        this.rfc = item.rfc;
        this.curp = item.curp;
        this.fecha_alta = item.fecha_alta;
    }
}