import React, {useState} from "react";
import {connect} from 'react-redux'
import {AppState} from "app/Store";
import {notify} from "app/features/notifications/duck";
import {myFetch} from "util/fetch";
import Input from "app/common/input/Input";
import Button from "app/common/buttons/Button";
import {bindActions} from "util/duckUtil";
import {useInput} from "util/inputHook";

const mapStateToProps = (state: AppState) => {
    const map = state.gratitude.gratitude;
    return {gratitudes: state.gratitude.gratitudeSortedByDate.map(id => map[id])}
};

const mapDispatchToProps = bindActions({notify});

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const Journal: React.FC<Props> = props => {
    const [selectedFilename, setSelectedFilename] = useState("");
    const [file, setFile] = useState<File>(undefined);
    const {value: title, bind: bindTitle} = useInput("");
    const {value: date, bind: bindDate} = useInput(new Date().toISOString().split('T')[0]);
    console.log(date);


    // const {value: selectedFile, bind: bindSelectedFile} = useInput();


    function sendRequest(event) {
        const data = new FormData();
        data.append("file", file);
        data.append("title", title);
        data.append("date", date);
        myFetch("gratitude", "POST", data).then(e => {
            console.log(e);
        }).catch(reason => {
            props.notify({message: reason.message})
        });
    }

    function fileSelected(e) {
        let newFile: File = e.target.files[0];
        if (newFile) {
            setFile(newFile);
            setSelectedFilename(e.target.value)
        }
    }

    return <div>
        <Input type="text" label="Title" {...bindTitle}/>
        <Input type="file" label="File" value={selectedFilename} onChange={fileSelected}/>
        <Input type="date" label="Date" {...bindDate}/>
        <Button onClick={sendRequest}>send request</Button>

        <div>
            {props.gratitudes.map(entry =>
                <div key={entry.id}>
                    <div>{entry.title}</div>
                    <img src={`${process.env.REACT_APP_BASE_URL}/image/${entry.image}`} alt=""/>
                </div>)}
        </div>
    </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Journal);
