export const cleanWarscrollText = (pdfText: string[]) => {
  return pdfText
    .map(txt =>
      txt
        .replace(/\\\(/g, '(') // Fix parentheses i.e. "\(value\)"
        .replace(/\\\)/g, ')') // Fix parentheses i.e. "\(value\)"
        .replace(/^[0-9]{1,2}"$/g, '') // Remove '12"' entries
        .replace(/^[0-9]{1,2}"\*$/g, '') // Remove '10"*' entries
        .replace(/^[0-9]{1,2}D6"/g, '') // Remove '2D6"' entries
        .replace(/ \([0-9]+\)/g, '') // Remove point values e.g. "Slann Starmaster (360)"
        .replace(/[0-9]+ x /g, '') // Remove quantity from units e.g. "3 x Razordons"
        .trim()
    )
    .filter(
      txt =>
        !!txt &&
        txt.length > 2 &&
        txt !== 'Warscroll Builder on www.warhammer-community.com' &&
        txt !== '* See Warscroll'
    )
}
