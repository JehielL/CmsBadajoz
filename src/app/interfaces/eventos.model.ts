import { User } from "./user.model";

export interface Evento {
    id: number;
    titulo: string;
    contenido: string;
    imgEvento: string;
    fechaCreado: Date;
    user: User;
    fechaEvento: Date;
}