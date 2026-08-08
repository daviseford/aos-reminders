import { LinkButton } from 'components/helpers/link'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import { FaDiscord, FaEnvelopeOpenText, FaGithub } from 'react-icons/fa'
import { GITHUB_URL } from 'utils/env'

const Contact = ({ size = 'normal' }: { size?: 'normal' | 'small' | 'large' }) => {
  const { isOffline } = useAppStatus()
  const { isDark } = useTheme()
  const btnSize = size === 'small' ? 'btn-sm' : size === 'large' ? 'btn-lg' : ''
  /*
   * TapTarget: `btn-sm` renders these at 31px tall, and `small` is the size the account routes
   * and the footer use — so the product's contact links were below the 44px target everywhere they
   * actually appear. The class sets a floor rather than a height, so the `large` variant is
   * unaffected and nothing gets narrower.
   */
  const btnClass = `btn ${btnSize} btn-outline-${isDark ? 'light' : 'dark'} mx-1 TapTarget`

  if (isOffline) return null

  return (
    <>
      <LinkButton href={GITHUB_URL} btnClass={btnClass} Icon={FaGithub} text="Github" />
      <LinkButton
        href="mailto:aosreminders@gmail.com"
        btnClass={btnClass}
        Icon={FaEnvelopeOpenText}
        text="Email"
      />
      <LinkButton href="//discord.gg/2nt9Fxp" btnClass={btnClass} Icon={FaDiscord} text="Discord" />
    </>
  )
}

export default Contact
