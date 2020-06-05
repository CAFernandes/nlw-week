import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
  onFileUploaded: (file: File) => void 
}


const Dropzone: React.FC<Props> = ({ onFileUploaded })=> {
  const [selectedUrl, setSelectedUrl] = useState<string>('')

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded])
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input accept='image/*' {...getInputProps()} />

      {
        selectedUrl 
        ? <img src={selectedUrl} alt='Imagem do estabelecimento'/>
        : (<p>
            <FiUpload/>
            Imagem do estabelecimento
          </p>)
      }

    </div>
  )
}
export default Dropzone;