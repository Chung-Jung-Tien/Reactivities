import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

/* 用 MobX 改寫，存在 store 裡面
interface Props{
    activities:Activity[];
    selectActivity:(id: string) => void;
    deleteActivity:(id: string) => void;
    submitting: boolean;
}
*/

export default observer(
    function ActivityList(){
        const {activityStore} = useStore();
        const {deleteActivity, activityByDate, loading} = activityStore;

        const [target, setTarget] = useState('');
    
        function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id:string){
            setTarget(e.currentTarget.name);
            deleteActivity(id);
        }
    
        return(
            <Segment>
                <Item.Group divided>
                    {activityByDate.map(activity =>(
                        <Item key={activity.id}>
                            <Item.Content>
                                <Item.Header as='a'>{activity.title}</Item.Header>
                                <Item.Meta>{activity.date}</Item.Meta>
                                <Item.Description>
                                    <div>{activity.description}</div>
                                    <div>{activity.city}, {activity.venue}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Button onClick={() => activityStore.selectActivity(activity.id)} floated="right" content="View" color="blue" />
                                    <Button 
                                        name={activity.id}
                                        loading={loading && target === activity.id} 
                                        onClick={(e) => handleActivityDelete(e, activity.id)} 
                                        floated="right" 
                                        content="Delete" 
                                        color="red" />
                                    <Label basic content={activity.category} />
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    ))}
                </Item.Group>
            </Segment>
        )
    }
) 
