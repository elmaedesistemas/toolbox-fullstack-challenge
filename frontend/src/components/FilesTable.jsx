import { Alert, Table } from 'react-bootstrap'

function FilesTable ({ files }) {
  const rows = files.flatMap(file =>
    file.lines.map((line, index) => ({
      ...line,
      file: file.file,
      id: `${file.file}-${line.hex}-${index}`
    }))
  )

  if (rows.length === 0) {
    return (
      <Alert variant='info'>
        No valid file data was found.
      </Alert>
    )
  }

  return (
    <Table
      bordered
      hover
      responsive
      striped
      className='align-middle'
    >
      <thead className='table-dark'>
        <tr>
          <th>File Name</th>
          <th>Text</th>
          <th>Number</th>
          <th>Hex</th>
        </tr>
      </thead>

      <tbody>
        {rows.map(row => (
          <tr key={row.id}>
            <td>{row.file}</td>
            <td>{row.text}</td>
            <td>{row.number}</td>
            <td className='hex-value'>{row.hex}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default FilesTable
