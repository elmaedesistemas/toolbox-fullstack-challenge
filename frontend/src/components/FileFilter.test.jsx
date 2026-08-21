import {
  fireEvent,
  render,
  screen
} from '@testing-library/react'
import FileFilter from './FileFilter'

describe('FileFilter', () => {
  it('renders the available file names', () => {
    render(
      <FileFilter
        fileNames={['test1.csv', 'test2.csv']}
        selectedFileName=''
        isLoading={false}
        onChange={jest.fn()}
      />
    )

    expect(
      screen.getByRole('option', {
        name: 'All files'
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', {
        name: 'test1.csv'
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('option', {
        name: 'test2.csv'
      })
    ).toBeInTheDocument()
  })

  it('notifies when the selected file changes', () => {
    const handleChange = jest.fn()

    render(
      <FileFilter
        fileNames={['test1.csv', 'test2.csv']}
        selectedFileName=''
        isLoading={false}
        onChange={handleChange}
      />
    )

    fireEvent.change(
      screen.getByLabelText('Filter by file name'),
      {
        target: {
          value: 'test2.csv'
        }
      }
    )

    expect(handleChange).toHaveBeenCalledWith('test2.csv')
  })

  it('disables the selector while loading', () => {
    render(
      <FileFilter
        fileNames={[]}
        selectedFileName=''
        isLoading
        onChange={jest.fn()}
      />
    )

    expect(
      screen.getByLabelText('Filter by file name')
    ).toBeDisabled()
  })
})
