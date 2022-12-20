export interface Cliente_cuenta{
    id_cliente_cuenta : number,
    nombre: String,
    nombre_cuenta: String,
    saldo_actual: number,
    fecha_contratacion: Date,
    fecha_ultimo_movimiento: Date
}

export class Cliente_cuentaModel implements Cliente_cuenta{
    id_cliente_cuenta : number;
    nombre: String;
    nombre_cuenta: String;
    saldo_actual: number;
    fecha_contratacion: Date;
    fecha_ultimo_movimiento: Date;
    constructor(item: any){
        this.id_cliente_cuenta = item.id_cliente_cuenta
        this.nombre = item.nombre
        this.nombre_cuenta = item.nombre_cuenta;
        this.saldo_actual = item.saldo_actual;
        this.fecha_contratacion = item.fecha_contratacion;
        this.fecha_ultimo_movimiento = item.fecha_ultimo_movimiento;
    }
}