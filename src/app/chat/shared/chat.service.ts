import { WelcomeDto } from './../welcome.dto';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { ChatClient } from './chat-client.model';
import { ChatMessage } from './chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatClient!:ChatClient;

  constructor(private socket: Socket) {}

  sendMessage(msg: string):void {
    this.socket.emit('message', msg);
  }

  sendTyping(typing: boolean):void {
    this.socket.emit('typing', typing);
  }

  listenForClientTyping():Observable<ChatClient>{
    return this.socket.fromEvent<ChatClient>('clientTyping');
  }

  listenForMessages():Observable<ChatMessage>{
    return this.socket.fromEvent<ChatMessage>('newMessage');
  }

  listenForClients():Observable<ChatClient[]>{
    return this.socket.fromEvent<ChatClient[]>('clients');
  }

  listenForWelcome():Observable<WelcomeDto>{
    return this.socket.fromEvent<WelcomeDto>('welcome');
  }

  listenForErrors():Observable<string>{
    return this.socket.fromEvent<string>('error');
  }

  getAllMessages():Observable<ChatMessage[]>{
    return this.socket.fromEvent<ChatMessage[]>('allMessages');
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
