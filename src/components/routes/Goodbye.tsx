import { LoadingHeader } from 'components/helpers/suspenseFallbacks'
import Footer from 'components/page/footer'
import { useTheme } from 'context/useTheme'
import { lazy, Suspense, useEffect } from 'react'
import { logPageView } from 'utils/analytics'

const Navbar = lazy(() => import('components/page/navbar'))

const Goodbye = () => {
  const { theme } = useTheme()

  useEffect(() => {
    logPageView()
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={`d-block ${theme.bgColor}`}>
      <div className={`${theme.headerColor} py-2`}>
        <Suspense fallback={<LoadingHeader />}>
          <Navbar />
        </Suspense>
      </div>

      <div className={`container ${theme.bgColor} ${theme.text} py-4`}>
        <div className={`row`}>
          <div className="col pt-4">
            <h1 className="text-center">Farewell, my friends</h1>
            <hr />
            <h3 className="text-center">
              TL;DR: I will not be updating AoS Reminders with AoS 4th Edition. I will no longer actively
              maintain this codebase.
            </h3>
            <hr />
            <h5>Thanks for the Memories</h5>
            <p>
              When I created AoS Reminders as a quick tool for building my armies, way back on Lustria Online,
              I never imagined it would go this far.
            </p>
            <p>
              I have met so many cool people, and I have relied on the contributions of amazing contributors,
              some of whom began working on AoS Reminders and leveraged that experience to become professional
              programmers.
            </p>
            <p>
              In countless job interviews, I have used this site as an example of my ability to create,
              maintain, and improve a site over the long term. To me, it is the most impactful code that I
              have written.
            </p>
            <p>
              I have been fortunate to work on some amazing projects in my professional career. I have written
              code for multi-billion dollar trading platforms, implemented LLMs at the biggest banks in the
              world, written medical software to improve patient outcomes, and created tools that help normal
              people do their jobs better and faster.
            </p>
            <p>But none of the things I&apos;ve worked on have meant so much to me as this website.</p>
            <hr />
            <h5>What now?</h5>
            <p>
              <mark>
                I will continue hosting this website for a long, long time. Subscribers will maintain access
                to their profiles. The codebase will remain frozen in time (at the very end of AoS 3rd
                edition) unless a new maintainer steps forward.
              </mark>
            </p>
            <p>
              It is entirely possible that this project continues. All it would take is a dedicated
              maintainer, who is willing to put in the time and energy.
            </p>
            <p>
              It is not for the faint of heart. You will have to track down every single book, errata, White
              Dwarf, Forge World rules, etc. It is a labor of love (emphasis on <i>labor</i>).
            </p>
            <p>
              If this appeals to you, good news. You can be the hero that keeps this going! I will still be in
              Discord and Github. If you put in the work, I will help you get it live on the site.
            </p>
            <hr />
            <h5>But why?</h5>
            <p>I haven&apos;t played a single game of Age of Sigmar in nearly four years.</p>
            <p>
              Right before COVID struck, I had started to play competitively in tournaments and against local
              skilled players. This had moved my skill level to an uncomfortable level - I wasn&apos;t quite
              good enough to win serious tournament games, but I was too good to play casually with friends.
              This left me chasing incredibly powerful lists and gimmicks that were unfair to my casual
              friends, and mediocre in a competitive environment. And the more I chased the competitive high,
              the more I encountered broken, unfun lists to play against (like Tzeentch gimmick lists with
              endless dice due to a generous rules interpretation, remember those?).
            </p>
            <p>
              I have gotten pretty good at games before. I know what it takes. I have won multiple world
              championships in one video game (Red Orchestra), and traveled the country playing Team Fortress
              2 in ESEA Invite. I have been down this path before. And as I grinded Tabletop Simulator and
              watched tournament games and practiced against whoever would play me at the local game stores,
              the gnawing sensation that I could not escape was - this wasn&apos;t fun. The games were getting
              harder, but they weren&apos;t getting more rewarding. When I won, I felt like I had basically
              cheated and exploited my way to victory. And when I lost, I felt like I was at the mercy of a
              list that relied on an overpowered gimmick to beat my overpowered gimmick.
            </p>
            <p>
              Because I maintain this website, I have read every rule in the game, I have read every iteration
              of every rule in this game, I have read every update to every revision to every errata to every
              addendum to everything that has ever existed in this game.
            </p>
            <p>I&apos;m just tired of it.</p>
            <p>
              I was explaining this to a family member, who pointed out that I was suffering from the
              &#39;astronomer&apos;s dilemma&#39;; the idea that professional astronomers, who spend a
              significant amount of time studying the universe in great detail, might find it difficult to
              simply enjoy the beauty of the night sky without thinking about the complex science behind it.
            </p>
            <p>
              When I looked at an Age of Sigmar game, I no longer saw two armies engaging in battle, heroic
              generals marshalling their hordes of underlings to conquer the table.
            </p>
            <p>
              No, I just saw statlines, erratas, expected values, buffs, nerfs, numbers, numbers, phases, and
              technicalities that I could exploit.
            </p>
            <p>
              The game ceased to be a game. It was instead a collection of rules. And frankly, AoS is not
              something to be played for its ruleset alone.
            </p>
            <p>
              So I ceased playing. It&apos;s been nearly four years. I have moved on to enjoy other games, and
              I still paint miniatures. I have kept updating this website out of a sense of duty to my
              subscribers.
            </p>
            <p>
              But with the news that Tony of Warscroll Builder was moving on, I realized this was my chance,
              too. I can be free of the burden of maintenance of a game that I no longer enjoy.
            </p>
            <hr />
            <h4 className="text-center">
              This project is open source, if you are interested in becoming a maintainer and moving the
              codebase forward, please contact me via email, Github, or Discord.
            </h4>
            <hr />
            <h5>That&apos;s all, folks!</h5>
            <p>Thanks for everything. I hope you enjoyed using this website.</p>
            <p>
              Davis Ford
              <br />
              July 10, 2024
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Goodbye
