import { makeAutoObservable, reaction } from "mobx";
import {ServerError} from "../models/serverError";

export default class CommonStore {
    error: ServerError | null=null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded= false;

    constructor() {
        makeAutoObservable(this);

        //[MobX] reaction : only react to observer() 裡面 token 的改變，上面 constructor 裡的預設值，不會做出反應
        reaction(
            () => this.token,
            token => {
                if(token){
                    localStorage.setItem('jwt', token); 
                }
                else{
                    localStorage.removeItem('jwt');
                }
            }
        )
    }

    setServerError(error: ServerError){
        this.error=error;
    }

    setToken = (token:string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}