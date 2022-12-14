import React from "react";
import { Button, ButtonOr, Card, Icon, Image } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";

/* 改用 MobX 存在 activityStore 裡面
interface Props{
    activity:Activity; 
    cancelSelectActivity:() =>void;
    openForm:(id:string) => void;
}
*/

export default function ActivityDatails() {
    const {activityStore} = useStore();
    const {selectedActivity : activity, openForm, cancelSelectedActivity} = activityStore;

    if(!activity) 
        return <LoadingComponent></LoadingComponent>;

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
            <Card.Header>{activity.title}</Card.Header>
            <Card.Meta>
                <span>{activity.date}</span>
            </Card.Meta>
            <Card.Description>{activity.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button onClick={() => openForm(activity.id)} basic color="blue" content='Edit' />
                    <Button onClick={cancelSelectedActivity} basic color="grey" content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}