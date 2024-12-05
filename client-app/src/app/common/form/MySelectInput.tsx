import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props{
    placeholder: string;
    options: {text: string, value: string}[];
    name: string;
    lable?: string;
}

export default function MySelectInput(props : Props){
    const [field, mata, helpers] = useField(props.name);
    return (
        <Form.Field error={mata.touched && !! mata.error}>
            <label>{props.lable}</label>
            <Select 
                clearable
                options={props.options}
                value={field.value || null}
                onChange={(_, d) => helpers.setValue(d.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {mata.touched && mata.error ? (
                <Label basic color="red">{mata.error}</Label>
            ) : null}
        </Form.Field>
    )
}