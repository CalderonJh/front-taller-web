import { City } from './city';
import { Document } from './document';

export interface Person {
  id: number;
  name: string;
  lastName: string;
  document: Document;
  city: City;
  dob: Date | string;
  email: string;
  phone: string;
  username: string;
  password: string;
}
