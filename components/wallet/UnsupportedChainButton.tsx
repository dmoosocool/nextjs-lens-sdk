import { type Chain, useSwitchNetwork } from 'wagmi'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

import { useEffect } from 'react'
import { ReloadIcon } from '@radix-ui/react-icons'

interface UnsupportedChainProps {
  chain: Chain,
  onSuccess?: () => void
}
const UnsupportedChainButton = ({chain, onSuccess}: UnsupportedChainProps) => {
  const { chains, error, isLoading, pendingChainId, switchNetwork, isSuccess } = useSwitchNetwork()
  const { toast } = useToast()
  useEffect(()=>{
    if(error){
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message
      })
    }
  },[error, toast])


  if(isSuccess) {
    onSuccess?.()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>Unsupported Chain ({chain.name})</Button>
      </DialogTrigger>

      <DialogContent  className='max-w-[460px]'>
        <DialogHeader>
          <DialogTitle>Switch Networks</DialogTitle>
          <DialogDescription>Wrong network detected, switch or disconnect to continue.</DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center justify-center'>
          {chains.map((x)=>{
            return (
              <Button 
                key={x.id} 
                disabled={isLoading} 
                onClick={()=> switchNetwork?.(x.id)}
              >
                {(isLoading && x.id === pendingChainId) ? 
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </> 
                  :
                  <>
                    <span>Switch to {x.name}</span>
                  </>
                }
              </Button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UnsupportedChainButton
