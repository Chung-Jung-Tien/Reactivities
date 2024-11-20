import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { Header, Icon } from 'semantic-ui-react'
import { object } from 'yup'

interface Props {
  setFiles: (files: any) => void
}

export default function PhotoWidgetDropzone({setFiles}: Props) {
  const dzsStyle = {
    border: 'dashed 2px #eee',
    borderColor: '#eee',
    borderRadius: '5px',
    paddingYop: '30px',
    textAlign: 'center' as 'center',
    height: 200
  }

  const dzActivity = {
    borderColor: 'green'
  }

  const onDrop = useCallback((acceptedFiles: object[]) => {
    // Do something with the files
    setFiles(acceptedFiles.map((file: any) => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))) 
  }, [setFiles])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} style={isDragActive ? {...dzsStyle, ...dzActivity} : dzsStyle}>
      <input {...getInputProps()} />
      <Icon name='upload' size='huge'/>
      <Header content='Drop image here'/>
    </div>
  )
}