'use client'
import { useEffect, useMemo, useState } from 'react'
import { useMemoizedFn, useRafState } from 'ahooks'
import { useAccount, useSignMessage } from "wagmi"
import Image from 'next/image'
import { client } from '@/queries/lens/client'
import { useAuthStore } from "@/stories/auth"
import { toast } from "@/components/ui/use-toast"
import { getSignTextQuery, lensLoginMutation, getDefaultProfileQuery } from "@/queries/lens/graghql"
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogHeader } from '../ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import LensPost from './LensPost'

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
type TLensProfile = {
  bio?: string
  avatar?: string
  name: string
  handle: string
  ownerBy: string
}
const LensProfile = () => {
  const { signMessageAsync } = useSignMessage()
  const { setAccessToken, setRefreshToken, accessToken, refreshToken } = useAuthStore()
  const [ needReLogin, setNeedReLogin ] = useState(false)
  const isLogin = useMemo(()=> accessToken && refreshToken,[accessToken, refreshToken])
  const getAccessToken = useMemoizedFn(async () => {
    try{
      const resp = await client.query(getSignTextQuery, { address })
      const signText = resp.data.challenge.text
      const signature = await signMessageAsync({message: signText})
      const { data: loginData } = await client.mutation(lensLoginMutation, { address, signature })
      const { authenticate } = loginData
      setAccessToken(authenticate.accessToken)
      setRefreshToken(authenticate.refreshToken)  
      setNeedReLogin(true)
    } catch(e) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: (e as Error).message
      })
    }
  })
  useEffect(()=> {!isLogin && needReLogin && getAccessToken()} ,[needReLogin, isLogin, getAccessToken])
  const [ profile, setProfile ] = useRafState<TLensProfile|undefined>(undefined)
  const { address } = useAccount({onConnect: getAccessToken})
  useEffect(()=>{
    const getProfile = async () => {
      const {data} = await client.query(getDefaultProfileQuery, {address})
      setProfile({
        bio: data.defaultProfile.bio,
        avatar: data.defaultProfile.picture.original.url,
        name: data.defaultProfile.name,
        handle: data.defaultProfile.handle,
        ownerBy: data.defaultProfile.ownedBy
      })
    }
    if(address && accessToken && refreshToken){
      getProfile()
    }
  },[address, accessToken, refreshToken, setProfile])

  if(!isLogin){
    return (
      <div>access token is valid, please login again.</div>
    )
  }
  if( profile === undefined) {
    return (
      <div> profile is loading... </div>
    )
  }
  return (
    <div className='flex flex-row items-center justify-center gap-3 w-full'>
      <div className='flex flex-row items-center justify-center gap-3 border border-solid rounded-lg p-3'>
        <div>
          {profile.avatar && <Image src={profile.avatar} alt={profile.name} width={56} height={56} className='rounded-full'/>}
        </div>
        <div className='flex flex-col items-start justify-center text-xs'>
          <h3>{profile.name}</h3>
          <p>{profile.handle} | {formatAddress(profile.ownerBy)}</p>
          <p>{profile.bio}</p>
        </div>
      </div>
      <LensPost/>
    </div>

  )
}

export default LensProfile
