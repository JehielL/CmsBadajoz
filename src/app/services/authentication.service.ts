import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { DecodedToken } from './decoded.token.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedin = new BehaviorSubject<boolean>(this.existsToken());
  userEmail = new BehaviorSubject<string>(this.getUserEmail());
  isAdmin = new BehaviorSubject<boolean>(this.getIsAdmin());
  userId = new BehaviorSubject<string | null>(this.getUserId());
  firstName = new BehaviorSubject<string>('');
  
  avatarUrl = new BehaviorSubject<string>('');

  constructor() { } 

  saveToken(token: string) {
    localStorage.setItem('jwt_token', token);
    console.log('Token guardado:', token);  // Verifica si el token es válido
    this.isLoggedin.next(true);
    this.userEmail.next(this.getUserEmail());
    this.isAdmin.next(this.getIsAdmin());
    this.userId.next(this.getUserId());
    const userName = this.getUserName();
    console.log('Nombre del usuario:', userName);  // Verifica si el nombre se obtiene correctamente
    this.firstName.next(userName);  // Asegúrate de que 'firstName' se actualiza correctamente
  }
  
  

  existsToken() {
    return localStorage.getItem('jwt_token') !== null;
  }

  removeToken() {
    localStorage.removeItem('jwt_token');
    this.isLoggedin.next(false);
    this.userEmail.next('');
    this.isAdmin.next(false);
    this.userId.next(null);
  }

  getUserEmail() {
    const token =  localStorage.getItem('jwt_token');
    if(!token) return '';
    const decodedToken = jwtDecode(token) as DecodedToken;
    return decodedToken.email;
  }

  getIsAdmin() { 
    const token = localStorage.getItem('jwt_token');
    if(!token) return false;
    const decodedToken = jwtDecode(token) as DecodedToken;
    return decodedToken.role === 'ADMIN'; 
  }

  getUserId() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    const decodedToken = jwtDecode(token) as DecodedToken;
    return decodedToken.sub;
  }


  setUserAvatar(avatar: string) {
    this.avatarUrl.next(avatar);
  }

  getUserName() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return '';
    const decodedToken = jwtDecode(token) as DecodedToken;
    console.log('Decoded token:', decodedToken);  // Verifica que el token contiene 'firstName'
    return decodedToken.firstName || '';  // Asegúrate de que 'firstName' esté en el token
  }
  
  

}