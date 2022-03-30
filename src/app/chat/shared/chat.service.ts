import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) {}

  sendMessage(msg: string):void {
    this.socket.emit('message', msg);
  }

  listenForMessages():Observable<string>{
    return this.socket.fromEvent<string>('newMessage');
  }

  listenForClients():Observable<string[]>{
    return this.socket.fromEvent<string[]>('clients');
  }

  getAllMessages():Observable<string[]>{
    return this.socket.fromEvent<string[]>('allMessages');
  }

  disconnect():void{
    this.socket.disconnect();
  }

  connect():void{
    this.socket.connect();
  }

  sendNickname(nickname:string){
    this.socket.emit('nickname',nickname);
  }

}
