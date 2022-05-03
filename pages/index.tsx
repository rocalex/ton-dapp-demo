import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [provider, setProvider] = useState(undefined)

  useEffect(() => {
    // @ts-ignore
    if (!window.tonProtocolVersion || window.tonProtocolVersion < 1) {
      alert('Please update your TON Wallet Extension');
      return;
    }
    // @ts-ignore
    setProvider(window.ton)
  }, [])

  const handleConnect = async () => {
    // Request account access if needed
    const accounts = await provider.send('ton_requestAccounts');
    // Accounts now exposed, use them
    const account = accounts[0] // We currently only ever provide a single account,
    // but the array gives us some room to grow.
    console.log(account)

    console.log(await provider.send('ton_requestWallets'));
  }

  const handleSend = async () => {
    // Send TONs
    provider.send(
      'ton_sendTransaction',
      [{
        to: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N', // TON Foundation
        value: '10000', // 10000 nanotons = 0.00001 TONs
        data: 'dapp test',
        dataType: 'text'
      }]
    );
  }

  return (
    <>
      <nav className='navbar'>
        <div className='container'>
          <div className='navbar-brand'>
            <a className='navbar-item'>TON dApp demo</a>
          </div>
          <div className='navbar-menu'>
            <div className='navbar-end'>
              <div className='navbar-item'>
                <div className='buttons'>
                  <button className='button' onClick={handleConnect}>Connect</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className='columns my-6'>
          <div className='column'>
            <button className='button' onClick={handleSend}>Send Toncoins via TON Wallet Plugin</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
