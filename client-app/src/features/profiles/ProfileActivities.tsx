import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore } from "../../app/stores/store";
import { Card, Grid, Header, Image, Tab, TabPane, TabProps } from "semantic-ui-react";
import { UserActivity } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const panes = [
    {menuItem: 'Future Event', pane: {key: 'future'}},
    {menuItem: 'Past Event', pane: {key: 'past'}},
    {menuItem: 'Hosting', pane: {key: 'hosting'}}
];

export default observer(function ProfileActivities() {
    const {profileStore} = useStore();
    const {loadUserActivities, profile, loadingActivities, userActivityes} = profileStore;

    useEffect(() => 
        { loadUserActivities(profile!.username);},
         [loadUserActivities, profile]
    )

    const handleTabChange = (data: TabProps) => {
        loadUserActivities(profile!.username, panes[data.activeIndex as number].pane.key);
    }

    return (
        <TabPane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='calendar' content={'Activities'}></Header>
                </Grid.Column>

                <Grid.Column width={16}>
                    <Tab panes={panes} menu={{secondart: true, pointing: true}} onTabChange={(data) => handleTabChange(data)}/> 
                    <br/>
                    <Card.Group itemsPerRow={4}>
                        {
                            userActivityes.map((activity: UserActivity) => (
                                <Card as={Link} to={`/activities/${activity.id}`} key={activity.id} >
                                    <Image src={`/assets/categoryImages/${activity.category}.jpg`} style={{ minHeight: 100, objectFit: 'cover' }}/>
                                    <Card.Content>
                                        <Card.Header textAlign="center">{activity.title}</Card.Header>
                                        <Card.Meta textAlign="center">
                                            <div>{format(new Date(activity.date), 'do LLL')}</div>
                                            <div>{format(new Date(activity.date), 'h:mm: a')}</div>
                                        </Card.Meta>
                                    </Card.Content>
                                </Card>
                            ))
                        }
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})