const content = `

-- This is comment

/* another comment */

select * from aaa; -- asdasdasdas
select * from aaa; # asdasdasdas

delimiter ;
`

function nextIndexOfKeyword(content, startIndex, currentDelimiter) {
  const regex = new RegExp(`(?:${currentDelimiter}|--\\s|#|\\/\\*|DELIMITER)`, 'i');
  const partialContent = content.slice(startIndex)
  const match = partialContent.match(regex)
  let result
  if (match !== null) {
    result = {
      parsed: partialContent.slice(0, match.index),
      keyword: match[0],
      nextStartIndex: startIndex + match.index + match[0].length
    }
  } else {
    result = {
      parsed: partialContent,
      keyword: null,
      nextStartIndex: -1
    }
  }
  return result
}

function parse(content) {
  let nextStartIndex = 0
  let currentDelimiter = ';'
  let lastParsed, lastKeyword
  let result = []
  do {
    // console.log(1, {lastParsed, lastKeyword, nextStartIndex})
    ;({parsed: lastParsed, keyword: lastKeyword, nextStartIndex} = nextIndexOfKeyword(content, nextStartIndex, currentDelimiter))
    // console.log(2, {lastParsed, lastKeyword, nextStartIndex})
    if (lastKeyword !== null) {
      switch (lastKeyword.trim()) {
        case currentDelimiter:
          break;
        case '--':
        case '#':
          break;
        case '/*':
          break;
        case 'DELIMITER':
          break;
        case null:
          break;
        default:
          break;
      }
      result.push(lastParsed)
    }
  } while (lastKeyword !== null)
  return result
}

console.log(parse(content))
