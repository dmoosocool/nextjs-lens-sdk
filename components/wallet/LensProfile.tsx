'use client'
import { ProfilePictureSet, useActiveProfile, useWalletLogin, useActiveWallet } from '@lens-protocol/react-web'
import { useMemoizedFn } from 'ahooks'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { toast } from '@/components/ui/use-toast'
import { Button } from '../ui/button'
import Image from 'next/image'
import LensPost from './LensPost'


const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const LensProfile = () => {
  const { execute: login, error: loginError, isPending: isLoginPending } = useWalletLogin()

  const { data: wallet, loading: activeWalletLoading } = useActiveWallet()
  const { data, error ,loading } = useActiveProfile()
  const { isConnected, address } = useAccount()

  const avatar = useMemo(()=>{
    if(data?.picture && (data?.picture as ProfilePictureSet).original.url) {
      return (data?.picture as ProfilePictureSet).original.url
    }
    return undefined
  },[data?.picture])

  const autoLoginWithLens = useMemoizedFn(async () => {
    if( address) {
      await login({address})
    }
  })

  useEffect(()=>{
    if(isConnected && wallet === null) {
      autoLoginWithLens()
    }
  },[isConnected, autoLoginWithLens, wallet])

  if(loginError) {
    toast({variant:'destructive', title: 'Something went wrong.', description: loginError.message })
    return(
      <div className='flex flex-row items-center justify-center gap-3 w-full'>
        <Button onClick={autoLoginWithLens}>try again</Button>
      </div>
    )
  }

  if(isLoginPending) {
    return(
      <div className='flex flex-row items-center justify-center gap-3 w-full'>
        <Button disabled>Logging in...</Button>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center gap-3 w-full'>
      {/* <div>Logged in as {address}</div> */}

      {activeWalletLoading || loading  ? (
        <div> loading... </div>
      ) : <div className='flex flex-row items-center justify-center gap-3'>
        {data && (
          <>
            <div className='flex flex-row items-center justify-center gap-3 border border-solid rounded-lg p-3'>
              <div>
                {avatar && <Image src={avatar} alt={data.handle} width={56} height={56} className='rounded-full' priority/>}
              </div>
              <div className='flex flex-col items-start justify-center text-xs'>
                <h3>{data.name}</h3>
                <p>{data.handle} | {formatAddress(data.ownedBy)}</p>
                <p>{data.bio}</p>
              </div>
            </div>

            <LensPost publisher={data}/>
          </>
        )}

        
      </div>}
      
    </div>
  )
}

export default LensProfile
