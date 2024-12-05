import { useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import PhotoWidgetCropper from "./PhotoWidgetCropper";
import 'cropperjs/dist/cropper.css';

interface Props {
    loading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props) {
    const [files, setFiles] = useState<any>([]);
    const [cropper, setCropper] = useState<Cropper>();

    function onCrop() {
        if (cropper) {
           cropper.getCroppedCanvas().toBlob(blob => uploadPhoto(blob!));
        }
    }

    useEffect(() => {
        return () => {
            //if there is an type error, use this
            // files.forEach((file: object & {preview?: string}) => URL.revokeObjectURL(file.preview!)); 
            files.forEach((file: any) => URL.revokeObjectURL(file.preview));
        }
    }, [files])

    return (
        <Grid>
           <Grid.Column width={4}>
                <Header color="teal" content='Step 1 - Add Photo'></Header>
                <PhotoWidgetDropzone setFiles = {setFiles}/>
            </Grid.Column> 
            <Grid.Column width={1} />
           <Grid.Column width={4}>
                <Header color="teal" content='Step 2 - ReSize Image'></Header>
                {files && files.length > 0 && (
                    <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>
                )}
            </Grid.Column> 
            <Grid.Column width={1} />
           <Grid.Column width={4}>
                <Header color="teal" content='Step 3 - Preview and Upload'></Header>
                {files && files.length > 0 && 
                    <>
                        <div className="image-preview" style={{minHeight: 200, overflow: 'hidden'}}></div>
                        <Button.Group widths={2}>
                            <Button loading={loading} onClick={onCrop} positive icon='check'/>
                            <Button disabled={loading} onClick={() => setFiles([])} positive icon='close'/>
                        </Button.Group>
                    </>
                }
            </Grid.Column> 
        </Grid>
    )
}