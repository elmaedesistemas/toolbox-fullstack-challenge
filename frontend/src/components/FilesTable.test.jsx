import { render, screen } from '@testing-library/react'
import FilesTable from './FilesTable'

describe('FilesTable', () => {
  it('renders the formatted file rows', () => {
    const files = [
      {
        file: 'test1.csv',
        lines: [
          {
            text: 'hello',
            number: 123,
            hex: '70ad29aacf0b690b0467fe2b2767f765'
          }
        ]
      }
    ]

    render(<FilesTable files={files} />)

    expect(
      screen.getByRole('columnheader', {
        name: 'File Name'
      })
    ).toBeInTheDocument()

    expect(screen.getByText('test1.csv')).toBeInTheDocument()
    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('123')).toBeInTheDocument()

    expect(
      screen.getByText(
        '70ad29aacf0b690b0467fe2b2767f765'
      )
    ).toBeInTheDocument()
  })

  it('renders an empty-state message when there are no rows', () => {
    render(<FilesTable files={[]} />)

    expect(
      screen.getByText('No valid file data was found.')
    ).toBeInTheDocument()
  })
})
