import { SyntheticEvent } from "react";
import { Profile } from "../../app/models/profile";
import { observer } from "mobx-react-lite";
import { Reveal, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

interface Props {
    profile: Profile;
}

export default observer (function FollowButton({profile}: Props) {
    const {profileStore, userStore} = useStore();
    const {updateFollowing, loading} = profileStore;

    //we do not want diplay this button if we are on user's own profile
    if(userStore.user?.username === profile.username) return null;

    function handleFollow(e: SyntheticEvent, username: string) {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }
    
    return(
        <Reveal animated='move'>
            <Reveal.Content visible style={{width: '100%'}}>
                <Button 
                    fluid
                    color='teal'
                    content={profile.following ? 'Following' : 'Not Following'}
                />
            </Reveal.Content>
            <Reveal.Content hidden style={{width: '100%'}}>
                <Button 
                    fluid
                    basic
                    color={ profile.following ? 'red' : 'green'} 
                    content={ profile.following ? 'Unfollow' : 'Follow'}
                    loading={loading}
                    onClick={(e) => handleFollow(e, profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    )
})