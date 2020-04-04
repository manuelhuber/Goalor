import Button from "app/common/buttons/Button";
import ButtonGroup from "app/common/buttons/ButtonGroup";
import {FileInput} from "app/common/input/FileInput";
import Form from "app/common/input/Form";
import Input from "app/common/input/Input";
import TextArea from "app/common/input/TextArea";
import React, {useState} from "react";
import styled from "styled-components";
import {useInput} from "util/inputHook";

type Props = {
    title?: string,
    description?: string,
    date?: Date,
    onSubmit: (title: string, date: Date, description: string, file: File) => void,
    onCancel: () => void
}
const EditGratitude: React.FC<Props> = props => {
    const [selectedFilename, setSelectedFilename] = useState("");
    const [file, setFile] = useState<File>(undefined);
    const [preview, setPreview] = useState("");

    let startingDate = (props.date ?? new Date()).toISOString().split('T')[0];
    const {value: date, bind: bindDate} = useInput(startingDate);
    const {value: title, bind: bindTitle} = useInput(props.title ?? "");
    const {value: description, bind: bindDescription} = useInput(props.description ?? "");

    const submit = () => props.onSubmit(title, new Date(date), description, file);

    function fileSelected(e) {
        let newFile: File = e.target.files[0];
        if (!newFile) return;
        setFile(newFile);
        setSelectedFilename(e.target.value);
        let fileReader = new FileReader();
        fileReader.onload = ev => setPreview(ev.target.result.toString());
        fileReader.readAsDataURL(newFile);
    }

    return <Form onSubmit={submit}>
        <Input type="text" label="Title" {...bindTitle}/>
        <TextArea label="Description" {...bindDescription}/>
        <SplitRow>
            <DateInput>
                <Input type="date" label="Date" {...bindDate} noMargin={true}/>
            </DateInput>
            <FilePicker>
                <FileInput type="file" accept="image/*" value={selectedFilename} onChange={fileSelected}/>
            </FilePicker>
        </SplitRow>
        {preview && <img src={preview} alt=""/>}
        <ButtonGroup align="right">
            <Button design="secondary" onClick={props.onCancel}>Cancel</Button>
            <Button type="submit">Save</Button>
        </ButtonGroup>
    </Form>;
};

const SplitRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: var(--rhythm);
`;
const DateInput = styled.div`
    flex-grow: 1;
`;
const FilePicker = styled.div`
    margin: 0 var(--rhythm);
`;

export default EditGratitude;
