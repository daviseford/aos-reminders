import type { IconType } from 'react-icons'
import { centerContentClass } from 'theme/helperClasses'
import { logClick } from 'utils/analytics'

interface LinkProps {
  /*
   * Only for links whose contents cannot name them — an icon-only control. Setting it on a link that
   * already has visible text replaces that text as the accessible name, which is how the footer's
   * release-notes link came to announce itself as "GithubLatestRelease" (WCAG 2.5.3 Label in Name).
   */
  ariaLabel?: string
  className?: string
  href: string
  onClick?: (...args: unknown[]) => void
}

export const LinkNewTab = ({ href, children, ariaLabel, ...props }: React.PropsWithChildren<LinkProps>) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    {...props}
  >
    {children}
  </a>
)

interface LinkButtonProps {
  Icon: IconType
  btnClass: string
  href: string
  text: string
}

/*
 * The label stays at every width. Below 575.98px these dropped to icon-only, which left the footer
 * showing three similar dark glyphs with nothing to tell them apart — a sighted-touch problem, since
 * the accessible name survived either way. There are only three, so the row wraps rather than
 * abbreviating.
 */
export const LinkButton = ({ Icon, href, btnClass, text }: LinkButtonProps) => (
  <LinkNewTab href={href} className={`${btnClass} mb-1`} onClick={() => logClick(`Contact-${text}`)}>
    <div className={centerContentClass}>
      <Icon className="me-2" />
      {text}
    </div>
  </LinkNewTab>
)
