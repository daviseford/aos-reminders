export const cleanWarscrollText = (pdfText: string[]) => {
  return pdfText
    .map(
      txt =>
        txt
          .replace(/\\\(/g, '(') // Fix parentheses i.e. "\(value\)"
          .replace(/\\\)/g, ')') // Fix parentheses i.e. "\(value\)"
          .replace(/^[0-9]{1,2}"$/g, '') // Remove '12"' entries
          .replace(/^[0-9]{1,2}"\*$/g, '') // Remove '10"*' entries
          .replace(/^[0-9]{1,2}[D|d]6"/g, '') // Remove '2D6"' entries
          .replace(/^[0-9]{1,2}\*\+/g, '') // Remove '3*+' entries
    )
    .filter(
      txt =>
        !!txt &&
        txt.length > 2 &&
        txt !== 'Warscroll Builder on www.warhammer-community.com' &&
        txt !== '* See Warscroll'
    )
    .join('¬')
    .replace(
      /[^¬]*?\([0-9]+\)¬(?!(LEADERS|UNITS|ARTILLERY|BEHEMOTHS|WAR MACHINES|ENDLESS SPELLS & INVOCATIONS|ENDLESS SPELLS|CORE BATTALIONS|BATTALIONS|BATTLELINE|TOTAL|Spearhead|Main Body|Rearguard|Extra Command Point|-|[^¬]*?\([0-9]+\)))(.*?)¬/gi,
      '$2¬'
    ) // Remove custom unit names
    .split('¬')
    .map(txt =>
      txt
        .replace(/ \([0-9]+\)/g, '') // Remove point values e.g. "Slann Starmaster (360)"
        .replace(/[0-9]+ x /g, '') // Remove quantity from units e.g. "3 x Razordons"
        .replace(/ x [0-9]{1,3}( \([0-9]{1,4}\))?/g, '') // Remove quantity from units e.g. "Knights of the Empty Throne Varanguard x 6 (560)"
        .trim()
    )
}
