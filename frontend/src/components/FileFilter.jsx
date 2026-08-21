import { Form } from 'react-bootstrap'

function FileFilter ({
  fileNames,
  selectedFileName,
  isLoading,
  onChange
}) {
  return (
    <Form.Group
      className='mb-4 file-filter'
      controlId='fileName'
    >
      <Form.Label>Filter by file name</Form.Label>

      <Form.Select
        value={selectedFileName}
        disabled={isLoading}
        onChange={event => onChange(event.target.value)}
      >
        <option value=''>
          {isLoading ? 'Loading files...' : 'All files'}
        </option>

        {fileNames.map(fileName => (
          <option key={fileName} value={fileName}>
            {fileName}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}

export default FileFilter
