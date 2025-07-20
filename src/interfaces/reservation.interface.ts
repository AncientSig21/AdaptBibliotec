export interface ReservationInput {
	libro_id: string;
	usuario_id: string;
	tipo_de_libro: 'virtual' | 'fisico';
	fecha_inicio: string;
	fecha_fin: string;
}

export interface Reservation {
	id_reservas: number;
	libro_id: string;
	usuario_id: string;
	tipo_de_libro: string;
	fecha_pedido: string;
	fecha_inicio: string;
	fecha_fin: string;
	estado: 'pendiente' | 'activa' | 'completada' | 'cancelada';
}

export interface ReservationWithBook {
	id_reservas: number;
	libro_id: string;
	usuario_id: string;
	tipo_de_libro: string;
	fecha_pedido: string;
	fecha_inicio: string;
	fecha_fin: string;
	estado: string;
	libro: {
		titulo: string;
		autores: { nombre: string }[];
	};
}

export interface ReservationWithUser {
	id_reservas: number;
	libro_id: string;
	usuario_id: string;
	tipo_de_libro: string;
	fecha_pedido: string;
	fecha_inicio: string;
	fecha_fin: string;
	estado: string;
	usuario: {
		nombre: string;
		correo: string;
	};
} 