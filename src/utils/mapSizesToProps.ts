import withSizes from 'react-sizes'

const mapSizesToProps = ({ width }) => ({
  isTinyMobile: width <= 320,
  isMobile: width < 480,
})

export const componentWithSize = withSizes(mapSizesToProps)
