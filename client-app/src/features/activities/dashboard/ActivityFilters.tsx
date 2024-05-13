import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";

export default function ActivityFilers(){
    return (
        <>
            <Menu vertical size="large" style={{width:'100%', marginTop:25}}>
                <Header icon='filer' attached color="teal" content='Filters'/>
                <Menu.Item content='All Activities' />
                <Menu.Item content="I'am going" />
                <Menu.Item content="I'am hosting" />
            </Menu>
            <Header />
            <Calendar />
        </>
    )
}