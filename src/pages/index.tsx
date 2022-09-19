import type { NextPage } from 'next'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import TonWeb from "tonweb"
import useCopyToClipboard from '../hooks/clipboard'

const Cell = TonWeb.boc.Cell;

function decodeMsgBody(msg: any) {
  console.log(msg['@type'])
  try {
    const bodyBytes = TonWeb.utils.base64ToBytes(msg['body'])
    const bodyCell = Cell.oneFromBoc(bodyBytes)
    console.log(bodyCell)
  } catch (e) {
    console.log(e)
  }
}

function renderTxnBody(txn: any) {
  console.log(txn)

  if (txn['out_msgs'].length) {
    decodeMsgBody(txn['out_msgs'][0]['msg_data'])
  } else {
    decodeMsgBody(txn['in_msg']['msg_data'])
  }

  return (
    <tr key={txn['transaction_id']['hash']}>
      <td>{txn['transaction_id']['lt']}</td>
      {txn['out_msgs'].length ? (
        <>
          <td>{txn['out_msgs'][0]['source']}</td>
          <td><span className='tag is-danger'>Out</span></td>
          <td>{txn['out_msgs'][0]['destination']}</td>
        </>
      ) : (
        <>
          <td>{txn['in_msg']['source']}</td>
          <td><span className='tag is-success'>In</span></td>
          <td>{txn['in_msg']['destination']}</td>
        </>
      )}
    </tr>
  )
}

const Home: NextPage = () => {
  const tonweb = useMemo(() => {
    return new TonWeb(new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", { apiKey: process.env.NEXT_PUBLIC_TON_API_KEY }))
  }, [])

  const [, copy] = useCopyToClipboard()

  const [address, setAddress] = useState<string>()
  const [txns, setTxns] = useState([])

  const handleConnect = useCallback(async () => {
    // Request account access if needed
    const accounts = await window.ton.send('ton_requestAccounts');
    // Accounts now exposed, use them
    const account = accounts[0] // We currently only ever provide a single account,
    // but the array gives us some room to grow.
    setAddress(account)

    console.log(await window.ton.send('ton_requestWallets'));
  }, [])

  useEffect(() => {
    (async () => {
      if (address) {
        setTxns(await tonweb.getTransactions(address))
      }
    })();
  }, [address, tonweb])

  return (
    <>
      <nav className='navbar'>
        <div className='container'>
          <div className='navbar-brand'>
            <a className='navbar-item'>TON dApp demo</a>
          </div>
          <div className='navbar-menu'>
            <div className='navbar-start'>
              <Link href={'/'}>
                <a className='navbar-item'>NFT</a>
              </Link>
            </div>
            <div className='navbar-end'>
              <div className='navbar-item'>
                <div className='buttons'>
                  {address ? (
                    <span className='button' onClick={() => copy(address)}>{address}</span>
                  ) : (
                    <button className='button' onClick={handleConnect}>Connect</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className='columns my-6'>
          <div className='column is-full'>
            <div className='table-container'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Age</th>
                    <th>From</th>
                    <th></th>
                    <th>To</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((txn: any) => renderTxnBody(txn))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
