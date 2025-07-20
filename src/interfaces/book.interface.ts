import { JSONContent } from '@tiptap/react';
import { Json } from '../supabase/supabase';

export interface Author {
	id: string;
	nombre: string;
}

export interface VirtualBook {
	id: number;
	libro_id: number | null;
	direccion_del_libro: string;
}

export interface PhysicalBook {
	id: number;
	libro_id: number;
	cantidad: number;
}

export interface Book {
	id_libro: string;
	titulo: string;
	fecha_publicacion: string;
	sinopsis: string;
	url_portada?: string; // URL de la imagen de portada
	created_at: string;
	autores: Author[];
	libro_virtual?: VirtualBook;
	libro_fisico?: PhysicalBook;
}

export interface PreparedBook {
	id_libro: string;
	titulo: string;
	fecha_publicacion: string;
	sinopsis: string;
	created_at: string;
	autores: Author[];
	tipo_libro: 'virtual' | 'fisico' | 'ambos';
	cantidad_disponible?: number;
	direccion_virtual?: string;
}

export interface BookInput {
	titulo: string;
	fecha_publicacion: string;
	sinopsis: string;
	url_portada?: string; // URL de la imagen de portada
	autores: string[]; // IDs de autores
	tipo_libro: 'virtual' | 'fisico' | 'ambos';
	direccion_virtual?: string;
	cantidad_fisica?: number;
	images?: File[];
}

export interface AuthorInput {
	nombre: string;
} 