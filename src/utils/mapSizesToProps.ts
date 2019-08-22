import withSizes from 'react-sizes'

const mapSizesToProps = ({ width }) => ({
  isMobile: width < 480,
})

export const componentWithSize = withSizes(mapSizesToProps)
