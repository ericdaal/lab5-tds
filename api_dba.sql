use api_dba;
create table registros_busqueda(
	idBusqueda int not null auto_increment,
    fecha_hora timestamp not null default current_timestamp,
    parametro_busqueda text,
    resultado_busqueda text,
    primary key(idBusqueda)
);
select * from registros_busqueda;