import { FC, ReactNode } from 'react'
import InfiniteScroll from "react-infinite-scroll-component"

import Empty from '@/components/search/empty'

import LoadingIcon from '~@/icons/loading.svg'

interface InfiniteListProps<T = unknown> {
  renderItem: (item: T) => JSX.Element
  loadMore: () => void
  items: T[]
  hasMore: boolean
  empty: boolean
  firstLoading: boolean
  renderEmpty?: JSX.Element
  renderLoading?: JSX.Element
  renderLoaded?: JSX.Element
  renderFirstLoading?: JSX.Element
  className?: string
}

const defaultRenderEmpty = <Empty text='No data.'/>
const defaultRenderLoading = <div className='h-20 flex items-center justify-center'><LoadingIcon width="32" height="32" className="text-loading-icon"/></div>
// const defaultRenderLoaded = <p className="h-20 leading-[80px] text-center text-no-more text-loading-icon">No more data</p>
const defaultRenderLoaded = <p></p>

function InfiniteList<T>(props: InfiniteListProps<T>) {
  const { renderItem, loadMore, items, hasMore, empty, firstLoading, renderEmpty, renderFirstLoading, renderLoading, renderLoaded, className } = props

  if (empty) {
    return renderEmpty ? renderEmpty : defaultRenderEmpty
  }

  if (firstLoading) {
    return renderFirstLoading ? renderFirstLoading : <h4 className="text-center">Loading...</h4>
  }

  return (
    <InfiniteScroll
      style={{ overflow: 'visible' }}
      dataLength={items.length}
      next={loadMore}
      hasMore={hasMore}
      loader={renderLoading ? renderLoading : defaultRenderLoading}
      endMessage={items.length > 0 && (renderLoaded ? renderLoaded : defaultRenderLoaded)}
    >
      <ul className={className}>
        { items.map((item, idx) => (
          <li key={idx}>
            { renderItem(item) }
          </li>
        )) }
      </ul>
    </InfiniteScroll>
  )
}

export default InfiniteList