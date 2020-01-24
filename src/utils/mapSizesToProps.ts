import withSizes from 'react-sizes'

const mapSizesToProps = ({ width }) => ({
  isTinyMobile: width <= 335,
  isMobile: width <= 480,
  width,
})

export const componentWithSize = withSizes(mapSizesToProps)
