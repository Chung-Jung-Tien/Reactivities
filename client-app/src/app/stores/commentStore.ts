import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            
            //create connection
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(
                    'http://localhost:5000/chat?activityId=' + activityId
                    , {accessTokenFactory: () => store.userStore.user?.token!})
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            //start connection
            this.hubConnection.start().catch(error => console.log('Error establishing the connection: ', error));
            
            //receive all the comments for that activity that connected to
            this.hubConnection
                .on(
                    'LoadComments' //spelling is important this 'methold name' must match then name in 'API.SignalR.ChatHub'
                    , (comments: ChatComment[]) => { runInAction(() => {
                        comments.forEach(comment => {
                            comment.createdAt = new Date(comment.createdAt + 'Z');
                        })
                        this.comments = comments
                    });
                });

            //when recieve comment
            this.hubConnection
                .on(
                    'ReceiveComment' //spelling is important this 'methold name' must match then name in 'API.SignalR.ChatHub'
                    , (comment: ChatComment) => {runInAction(() => {
                        comment.createdAt = new Date(comment.createdAt);
                        this.comments.unshift(comment)
                    })
                });
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error establishing connection: ' + error));
    }

    //clear the comments when the user dis-connect from the activity their looking at
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            //'SendComment' must match the name in 'ChatHub'
            await this.hubConnection?.invoke('SendComment', values);
        } catch (error) {
            console.log(error);
        }
    }
}