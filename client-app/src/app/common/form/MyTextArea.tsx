import { useField } from "formik";
import { Form, Label } from "semantic-ui-react";

interface Props{
    placeholder: string;
    name: string;
    rows: number;
    lable?: string;
}

export default function MyTextArea(props : Props){
    const [field, mata] = useField(props.name);
    return (
        <Form.Field error={mata.touched && !! mata.error}>
            <label>{props.lable}</label>
            <textarea {...field} {...props}/>
            {mata.touched && mata.error ? (
                <Label basic color="red">{mata.error}</Label>
            ) : null}
        </Form.Field>
    )
}