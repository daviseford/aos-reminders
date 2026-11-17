import type { Aos4RulesNotice } from '../../aos4/view'

/**
 * Says which of the army's rules are temporarily unavailable (#1757). Deliberately printable: a
 * browser-printed reminder sheet must not read as complete rules either.
 */
const RulesNotice = ({ notice }: { notice?: Aos4RulesNotice }) => {
  if (!notice) return null

  return (
    <div className="container">
      <div className="alert alert-warning" role="alert">
        {notice.message}
        <ul className="mb-0 mt-2">
          {notice.affected.map(line => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default RulesNotice
