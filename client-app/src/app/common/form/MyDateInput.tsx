
import { useField } from "formik";
import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker, {ReactDatePickerProps} from "react-datepicker";



export default function MyDateInput(props : Partial<ReactDatePickerProps>){
    const [field, mata, helpers] = useField(props.name!);
    return (
        <Form.Field error={mata.touched && !! mata.error}>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value=> helpers.setValue(value)}
            />

            {mata.touched && mata.error ? (
                <Label basic color="red">{mata.error}</Label>
            ) : null}
        </Form.Field>
    )
}