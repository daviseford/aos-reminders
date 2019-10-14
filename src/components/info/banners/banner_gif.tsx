import React from 'react'
import { Link } from 'react-router-dom'
import { logClick } from 'utils/analytics'

type TWebmWithFallback = React.FC<{
  webmUrl: string
  gifUrl: string
  linkUrl: string
  label: string
  className?: string
}>

const BannerGif: TWebmWithFallback = props => {
  const { webmUrl, gifUrl, linkUrl, label, className = '' } = props

  return (
    <>
      <Link to={linkUrl} onClick={() => logClick(label)}>
        <video
          preload="auto"
          loop={true}
          poster={gifUrl}
          autoPlay={true}
          style={{ maxHeight: '150px' }}
          className={`figure-img img-fluid rounded img-thumbnail ${className}`}
        >
          <source src={webmUrl} type="video/mp4"></source>
          <source src={webmUrl} type="video/webm"></source>
        </video>
      </Link>
    </>
  )
}

export default BannerGif
