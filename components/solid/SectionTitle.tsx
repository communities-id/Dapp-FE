import { FC } from 'react'
import classnames from 'classnames'

interface Props {
  titleTag?: string
  bgTagColor?: string
  title?: string
  subTitle: string
  bgTitle?: string
  appendSubTitle?: string
  bgTitleColor?: string
  titlePara?: string
  side?: boolean
}

const SectionTitle: FC<Props> = ({ titleTag, title, subTitle, bgTitle, appendSubTitle = '', bgTitleColor, titlePara, side }) => {
  return (
    <>
      {
        title ? (
          titleTag ? (
            <h4 className="mb-4 flex items-center text-black dark:text-white font-medium uppercase">
              <span className="bg-meta text-white text-metatitle inline-flex rounded-full py-1 px-4.5 mr-4">{ titleTag }</span>
              { title }
            </h4>
          ) : (
            <div className="bg-zumthor dark:bg-blacksection dark:border dark:border-strokedark inline-block rounded-full py-1.5 px-4.5 mb-4">
              <h4 className="font-medium text-sectiontitle text-[#6100FF] dark:text-white">
                { title }
              </h4>
            </div>
          )
        ) : null
      }
      <h2 className={classnames("font-bold text-3xl xl:text-sectiontitle3 text-black dark:text-white mx-auto mb-4", {
        "md:w-4/5 xl:w-1/2": !side
      })}>
        { subTitle }
        { bgTitle ? (
          <span className="inline-block relative before:absolute before:bottom-2.5 before:left-0 before:w-full before:h-3 before:bg-titlebg dark:before:bg-titlebgdark before:-z-1">{ bgTitle }</span>
        ) : null }
        { appendSubTitle }
      </h2>
      <p className={classnames("mx-auto", {
        "md:w-4/5 lg:w-3/5 xl:w-[46%]": !side
      })}>{ titlePara }</p>
    </>
  )
}

export default SectionTitle