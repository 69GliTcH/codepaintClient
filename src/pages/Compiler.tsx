import CodeEditor from '@/components/CodeEditor'
import HelperHeader from '@/components/HelperHeader'
import RenderCode from '@/components/RenderCode'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { updateFullCode } from '@/redux/slices/compilerSlice'
import { handleError } from '@/utils/handleError'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

export default function Compiler() {
    const { urlId } = useParams();
    const dispatch = useDispatch();
    const loadCode = async () => {
        try {
            const response = await axios.post("https://newserver-2-1t7c.onrender.com/compiler/load", {
                urlId: urlId,
            })
            dispatch(updateFullCode(response.data.fullCode))
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error?.response?.status === 500) {
                    toast("Invalid URL, Default code loaded.")
                }
            }
            handleError(error)
        }
    }
    useEffect(() => {
        if (urlId) {
            loadCode();
        }
    }, [urlId]);
    return (
        <ResizablePanelGroup direction="horizontal" className="">
            <ResizablePanel defaultSize={50} className='h-[calc(100dvh-60px)] min-w-[350px]'>
                <HelperHeader />
                <CodeEditor />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} className='h-[calc(100dvh-60px)] min-w-[350px]'>
                <RenderCode />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
