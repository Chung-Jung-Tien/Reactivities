import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";

interface Props{
    placeholder: string;
    name: string;
    lable?: string;
}

export default function MyTextInput(props : Props){
    const [field, mata] = useField(props.name);
    return (
        <Form.Field error={mata.touched && !! mata.error}>
            <label>{props.lable}</label>
            <input {...field} {...props}/>
            {mata.touched && mata.error ? (
                <Label basic color="red">{mata.error}</Label>
            ) : null}
        </Form.Field>
    )
}