'use client'
import { useConnect, useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription,  DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import WalletIcon from './WalletIcon'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'
const ChooseConnector = () => {
  const { connect, connectors, error, isLoading:connectIsLoading, pendingConnector } = useConnect()
  const { toast } = useToast()
  const [ open, setOpen ] = useState(false)
  
  useAccount({
    onConnect: () => setOpen(false),
  })

  useEffect(()=>{
    if(error === null) return
    toast({ variant:'destructive', title: 'Something went wrong.', description: error.message })
  },[error, toast])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Connect Wallet</Button>
      </DialogTrigger>

      <DialogContent className='max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>Connect to a wallet to view your profile.</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center gap-3'>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => connect({ connector })}
              variant='outline'
              className='w-full flex-row items-center justify-between'
              disabled={!connector.ready || connectIsLoading}
            >
              <div>
                {connector.name}{!connector.ready && ' (unsupported)'}
              </div>
              {connectIsLoading && connector.id === pendingConnector?.id ? <ReloadIcon className='w-4 h-4 animate-spin'/>: <WalletIcon name={connector.name} />}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChooseConnector
