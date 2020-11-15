import GenericButton from 'components/input/generic_button'
import { useAppStatus } from 'context/useAppStatus'
import { useTheme } from 'context/useTheme'
import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { IconContext } from 'react-icons'
import { FaBtc, FaCcPaypal, FaEthereum, FaRegCopy } from 'react-icons/fa'
import { logClick } from 'utils/analytics'

export const DonateComponent = () => {
  const { isOffline } = useAppStatus()
  const { theme } = useTheme()
  const [ethClicked, setEthClicked] = useState(false)
  const [btcClicked, setBtcClicked] = useState(false)

  const handleEthClick = (e: React.MouseEvent) => {
    e.preventDefault()
    logClick('DonateETH')
    setEthClicked(true)
    setBtcClicked(false)
  }

  const handleBtcClick = (e: React.MouseEvent) => {
    e.preventDefault()
    logClick('DonateBTC')
    setBtcClicked(true)
    setEthClicked(false)
  }

  const handlePaypalClick = (e: React.MouseEvent) => {
    e.preventDefault()
    logClick('DonatePayPal')
    window.open('//paypal.me/daviseford')
  }

  if (isOffline) return null

  return (
    <>
      <div className={`container ${theme.bgColor} pt-4`}>
        <div className="row justify-content-center">
          <div
            className={`col-10 col-sm-8 col-md-6 col-lg-4 col-xl-4 card ${theme.bgColor} ${theme.text} py-3`}
          >
            <div className="row justify-content-center d-print-none">
              <div className="col mx-2">
                <DisplayWallet ethActive={ethClicked} btcActive={btcClicked} />
              </div>
            </div>
            <div className="row d-flex justify-content-center d-print-none">
              <div className="btn-group btn-group-lg" role="group" aria-label="Donate">
                <div className="btn-group mr-2" role="group" aria-label="Donate options">
                  <IconContext.Provider value={{ size: '2.2em' }}>
                    <PayPalButton handleClick={handlePaypalClick} />
                    <EthButton handleClick={handleEthClick} />
                    <BtcButton handleClick={handleBtcClick} />
                  </IconContext.Provider>
                </div>
              </div>
            </div>

            <small className="text-center mt-3">
              Creating this took a lot of time and effort.
              <br />
              If you'd like to thank me, buy me a beer!
            </small>
          </div>
        </div>
      </div>
    </>
  )
}

const DisplayWallet = ({ ethActive, btcActive }: { ethActive: boolean; btcActive: boolean }) => {
  const [copied, setCopied] = useState(false)
  const handleSetCopied = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }
  const ethWallet = '0x0656E46AA9dFbB379887dD371e6f078AcE472E33'
  const btcWallet = '3JqXcy5qdoNq4DDRsJRfsFeozuhkapgBR4'
  const currentWallet = ethActive ? ethWallet : btcWallet
  const isHidden = !ethActive && !btcActive

  return (
    <div className={`row ${isHidden ? `d-none` : `d-flex mt-1 mb-3`} justify-content-center`}>
      <small className="text-muted">{ethActive ? `ETH` : `BTC`} Wallet Address</small>
      <WalletCopyInput currentWallet={currentWallet} setCopied={handleSetCopied} />
      {copied && <small className="text-success">Copied to clipboard.</small>}
    </div>
  )
}

const WalletCopyInput = ({ currentWallet, setCopied }: { currentWallet: string; setCopied: () => void }) => (
  <div className="input-group">
    <input
      type="text"
      className="form-control"
      aria-label="Copy to clipboard"
      value={currentWallet}
      disabled
    />
    <div className="input-group-append">
      <CopyToClipboard text={currentWallet} onCopy={setCopied}>
        <GenericButton className="btn btn-light">
          <FaRegCopy />
        </GenericButton>
      </CopyToClipboard>
    </div>
  </div>
)

type TBtnProps = React.FC<{ handleClick: (e: React.MouseEvent) => void }>

const BtcButton: TBtnProps = props => <FaBtc onClick={props.handleClick} className={'mx-2'} />
const EthButton: TBtnProps = props => <FaEthereum onClick={props.handleClick} className={'mx-2'} />
const PayPalButton: TBtnProps = props => <FaCcPaypal onClick={props.handleClick} className={'mx-2'} />
