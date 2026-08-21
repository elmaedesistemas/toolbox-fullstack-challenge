const { parse } = require('csv-parse/sync')

const HEX_PATTERN = /^[0-9a-fA-F]{32}$/

function isValidNumber (value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return false
  };

  return Number.isFinite(Number(value))
};

function parseCsv (content, expectedFileName) {
  if (typeof content !== 'string' || content.trim() === '') {
    return []
  };

  let records

  try {
    records = parse(content, {
      bom: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true
    })
  } catch (error) {
    return []
  }

  return records
    .slice(1)
    .filter(columns => columns.length === 4)
    .filter(([file, text, number, hex]) => {
      return file === expectedFileName &&
                text !== '' &&
                isValidNumber(number) &&
                HEX_PATTERN.test(hex)
    })
    .map(([, text, number, hex]) => ({
      text,
      number: Number(number),
      hex
    }))
};

module.exports = parseCsv
