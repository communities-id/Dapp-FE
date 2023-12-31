import { FC, ReactNode, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'

interface Props {
  children?: ReactNode
  className?: string
  lineHeight?: number
  collapsedLine?: number
  collapsedClass?: string
}

const ExpandableDescription: FC<Props> = ({ className, children, lineHeight = 24, collapsedLine = 3, collapsedClass = 'h-[72px]' }) => {
  const [showExpandBtn, setShowExpandBtn] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const textElement = useRef<HTMLParagraphElement | null>(null)

  useEffect(() => {
    if (!textElement.current) return
    const height = textElement.current?.scrollHeight || 0
    if (height > lineHeight * collapsedLine) {
      setShowExpandBtn(true)
      setExpanded(false)
    } else {
      setShowExpandBtn(false)
      setExpanded(true)
    }
  }, [textElement.current])


  return (
    <div>
      <div ref={textElement} className={classnames(className, 'overflow-hidden whitespace-pre-wrap', expanded ? 'h-auto' : [collapsedClass, 'text-ellipsis'])}>
        {children}
      </div>
      { showExpandBtn && <a role='button' className="var-brand-textcolor " onClick={() => setExpanded(!expanded)}>{expanded ? 'Show less' : 'Show more'}</a>}
    </div>
  )
}

export default ExpandableDescription