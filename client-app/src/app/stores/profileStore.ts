import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import UserStore from "./userStore";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activityTab = 0;

    constructor() {
        makeAutoObservable(this);

        //mobx
        reaction(
            () => this.activityTab,
            activityTab => {
                if (activityTab === 3 || activityTab === 4) {
                    const predicate = activityTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    setActivityTab = (activityTab: number) => {
         this.activityTab = activityTab;
    }

    get isCurrentUser() {
        if(store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        else {
            return false;
        }
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const respose = await agent.Profiles.uploadPhoto(file);
            const photo = respose.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id == photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if(this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id != photo.id);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;

        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.udpateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followerCount++ : this.profile.followerCount--;
                    this.profile.following = !this.profile.following;
                }

                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }

                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.following ? profile.followerCount-- : profile.followerCount++;
                        profile.following = !profile.following;
                    }
                })

                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predciate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predciate);

            followings.forEach(profile => {
                console.log(profile.username);
            })

            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }
}