import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMemoizedFn } from 'ahooks'
import { useEffect, useState } from 'react'
import { upload } from '@/lib/upload'
import { CollectPolicyType, ContentFocus, ProfileOwnedByMe, ReferencePolicyType, useCreatePost } from '@lens-protocol/react-web'
import { toast } from '@/components/ui/use-toast'

interface LensPostProps {
  publisher: ProfileOwnedByMe
}

const LensPost = ({publisher}: LensPostProps) => {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const { execute: create, error: createError, isPending: createPending } = useCreatePost({publisher, upload})

  const handlePostSubmit = useMemoizedFn(async ()=>{
    
    create({
      content,
      contentFocus: ContentFocus.TEXT_ONLY,
      locale: 'en',
      collect: {
        type: CollectPolicyType.NO_COLLECT,
      },
      reference: {
        type: ReferencePolicyType.ANYONE
      }
    }).catch((e)=>{
      console.log(e)
      toast({
        variant:'destructive',
        title: 'Something went wrong.',
        description: e.message
      })
    })
  })

  useEffect(()=>{
    if(createError){
      toast({
        variant: 'destructive',
        title: 'Something went wrong.',
        description: createError.message
      })
    }
  },[createError])



  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button>post</Button>
    </DialogTrigger>
    
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create post</DialogTitle>
      </DialogHeader>

      <div className='grid w-full gap-2'>
        <Textarea placeholder='Type your message here.' className='w-full h-24' value={content} onChange={(e)=>setContent(e.currentTarget.value)}/>
        <div className='flex flex-row items-center justify-end gap-2'>
          {
            createPending ? (
              <Button disabled>Publishing...</Button>
            ) : (
              <Button onClick={handlePostSubmit}>Post</Button>
            )
          }
        </div>
      </div>
    </DialogContent>
  </Dialog>
  )
}

export default LensPost
