'use client'
import { useAccount, useNetwork } from "wagmi"
import ChooseConnector from "./ChooseConnector"
import UnsupportedChainButton from "./UnsupportedChainButton"
import LensProfile from "./LensProfile"
const Profile = () => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()
  return (
    <div className="w-full">
      {!isConnected && <ChooseConnector />}
      {isConnected && chain && chain.unsupported && <UnsupportedChainButton chain={chain}/>}
      {isConnected && chain && !chain.unsupported && <LensProfile/>}
    </div>
  )
}

export default Profile
