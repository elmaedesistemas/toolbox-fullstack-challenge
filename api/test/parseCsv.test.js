/* eslint-env mocha */
const { expect } = require('chai')
const parseCsv = require('../src/utils/parseCsv')

describe('parseCsv', () => {
  it('formats valid CSV rows', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765',
      'file1.csv,AtjW,6,d33a8ca5d36d3106219f66f939774cf5'
    ].join('\n')

    expect(parseCsv(content, 'file1.csv')).to.deep.equal([
      {
        text: 'RgTya',
        number: 64075909,
        hex: '70ad29aacf0b690b0467fe2b2767f765'
      },
      {
        text: 'AtjW',
        number: 6,
        hex: 'd33a8ca5d36d3106219f66f939774cf5'
      }
    ])
  })

  it('discards rows with missing columns', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,incomplete,10',
      'file1.csv,valid,10,70ad29aacf0b690b0467fe2b2767f765'
    ].join('\n')

    expect(parseCsv(content, 'file1.csv')).to.have.length(1)
  })

  it('discards rows with additional columns', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,text,10,70ad29aacf0b690b0467fe2b2767f765,extra'
    ].join('\n')

    expect(parseCsv(content, 'file1.csv')).to.deep.equal([])
  })

  it('discards rows with invalid values', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,,10,70ad29aacf0b690b0467fe2b2767f765',
      'file1.csv,text,invalid,70ad29aacf0b690b0467fe2b2767f765',
      'file1.csv,text,10,invalid-hex',
      'other.csv,text,10,70ad29aacf0b690b0467fe2b2767f765'
    ].join('\n')

    expect(parseCsv(content, 'file1.csv')).to.deep.equal([])
  })

  it('supports quoted text containing commas', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,"hello, world",10,70ad29aacf0b690b0467fe2b2767f765'
    ].join('\n')

    expect(parseCsv(content, 'file1.csv')).to.deep.equal([
      {
        text: 'hello, world',
        number: 10,
        hex: '70ad29aacf0b690b0467fe2b2767f765'
      }
    ])
  })

  it('returns an empty array for empty content', () => {
    expect(parseCsv('', 'file1.csv')).to.deep.equal([])
  })

  it('returns an empty array for malformed CSV content', () => {
    const content = [
      'file,text,number,hex',
      'file1.csv,"unterminated,10,70ad29aacf0b690b0467fe2b2767f765'
    ].join('\n')

    expect(parseCsv(content, 'file1.csv')).to.deep.equal([])
  })
})
