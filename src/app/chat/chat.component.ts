import { ChatMessage } from './shared/chat-message.model';
import { ChatService } from './shared/chat.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription, take, takeUntil, Observable, debounce, debounceTime } from 'rxjs';
import { ChatClient } from './shared/chat-client.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit ,OnDestroy{

  messageFc = new FormControl();
  nicknameFc = new FormControl();
  messages:ChatMessage[]=[];
  clientsTyping:ChatClient[]=[];
  unsubscriber$=new Subject<void>();
  clients$!:Observable<ChatClient[]>;
  error$!:Observable<string>;
  chatClient!:ChatClient;

  constructor(private chatService:ChatService) { }


  ngOnDestroy(): void {
    // if(this.sub)
    //   this.sub.unsubscribe();
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  ngOnInit(): void {
    this.messageFc.valueChanges.pipe(
      takeUntil(this.unsubscriber$),
      debounceTime(5000)
    ).subscribe((value)=>{
      this.chatService.sendTyping(value.length>0);
    });
    this.clients$ =this.chatService.listenForClients();
    this.error$ = this.chatService.listenForErrors();
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
    this.chatService.listenForClientTyping().pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe(
      (chatClient)=>{
        if(chatClient.typing && !this.clientsTyping.find(c=>c.id===chatClient.id)){
          this.clientsTyping.push(chatClient);
        }else{
          this.clientsTyping = this.clientsTyping.filter(c=>c.id!==chatClient.id);
        }
      }
    );
    //initial data always
    this.chatService.listenForWelcome().pipe(
      takeUntil(this.unsubscriber$)
    ).subscribe(
      welcome=>{
        this.messages = welcome.messages;
        this.chatClient = this.chatService.chatClient = welcome.client;
      }
    );
    if(this.chatService.chatClient){
      this.chatService.sendNickname(this.chatService.chatClient.nickname);
    }
  }

  sendMessage(){
    console.log(this.messageFc.value);
    this.chatService.sendMessage(this.messageFc.value);
  }

  sendNickname(){
    if(this.nicknameFc.value){
      this.chatService.sendNickname(this.nicknameFc.value);
    }
  }

}
