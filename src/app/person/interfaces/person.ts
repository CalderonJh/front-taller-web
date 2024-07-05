import { City } from './city';
import { Document } from './document';

export interface Person {
  id: number;
  name: string;
  lastName: string;
  document: Document;
  city: City;
  birthDate: Date | string;
  email: string;
  phone: string;
  username: string;
  password: string;
}
