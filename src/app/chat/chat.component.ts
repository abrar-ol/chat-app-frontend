import { ChatMessage } from './shared/chat-message.model';
import { ChatService } from './shared/chat.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription, take, takeUntil, Observable } from 'rxjs';
import { ChatClient } from './shared/chat-client.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit ,OnDestroy{

  message = new FormControl();
  nicknameFc = new FormControl();
  messages:ChatMessage[]=[];
  unsubscriber$=new Subject<void>();
  clients$!:Observable<ChatClient[]>;
  nickname!:string;


  constructor(private chatService:ChatService) { }


  ngOnDestroy(): void {
    // if(this.sub)
    //   this.sub.unsubscribe();
   console.log("unsubscribe");
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.chatService.disconnect();

  }

  ngOnInit(): void {
    this.clients$ =this.chatService.listenForClients();
    this.chatService.listenForMessages()
    .pipe(
      takeUntil(this.unsubscriber$)
    )
    .subscribe(
      message=>{
      console.log("push M .. lestening");
        this.messages.push(message);
      }
    );

    this.chatService.getAllMessages()
    .pipe(
      take(1)
    )
    .subscribe(
      messages=>{
      console.log("push Array .. lestening");
        this.messages=messages;
      }
    );
    this.chatService.connect();

  }

  sendMessage(){
    console.log(this.message.value);
    this.chatService.sendMessage(this.message.value);
  }

  sendNickname(){
    if(this.nicknameFc.value){
      this.nickname=this.nicknameFc.value;
      this.chatService.sendNickname(this.nicknameFc.value);
    }
  }

}
