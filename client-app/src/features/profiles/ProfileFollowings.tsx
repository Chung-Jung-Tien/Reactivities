import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Tab, TabPane } from "semantic-ui-react";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowings, activityTab} = profileStore;

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header 
                        floated="left" 
                        icon='user' 
                        content={activityTab === 3 ? `People following ${profile?.displayName}` : `People ${profile?.username} is following`}></Header>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile}/>
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}) 