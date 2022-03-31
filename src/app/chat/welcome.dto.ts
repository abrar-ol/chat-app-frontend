import { ChatClient } from "./shared/chat-client.model";
import { ChatMessage } from "./shared/chat-message.model";

export interface WelcomeDto {
  clients: ChatClient[];
  client:ChatClient;
  messages:ChatMessage[];
}
