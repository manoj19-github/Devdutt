import {RefObject, useEffect, useState} from "react"
type ChatScrollProps={
    ChatRef:RefObject<HTMLDivElement>;
    BottomRef:RefObject<HTMLDivElement>;
    shouldLoadMore:boolean;
    loadMore:()=>void;
    count:number;
}

export const useChatScroll=({ChatRef,BottomRef,count,loadMore,shouldLoadMore}:ChatScrollProps)=>{
    const [hasIntialized,setHasInitialized] = useState<boolean>(false);
    useEffect(()=>{
        const topDiv = ChatRef?.current;
        const handleScroll = ()=>{
            const scrollTop = topDiv?.scrollTop;
            if(scrollTop===0 && shouldLoadMore) loadMore();

        }
        topDiv?.addEventListener("scroll",handleScroll)
        return()=>{
            topDiv?.removeEventListener("scroll",handleScroll)
        }

    },[shouldLoadMore,loadMore,ChatRef])
    useEffect(()=>{
        const bottomDiv = BottomRef?.current;
        const topDiv = ChatRef?.current;
        const shouldAutoScroll=()=>{
            if(!hasIntialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }
            if(!topDiv) return false;
            const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
            return distanceFromBottom <=100;

        }
        if(shouldAutoScroll()){
            setTimeout(()=>{
                BottomRef.current?.scrollIntoView({
                    behavior:"smooth"
                })

            },100)
        }

    },[BottomRef,ChatRef,count,hasIntialized])
    

}