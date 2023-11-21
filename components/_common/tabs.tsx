import { useEffect, CSSProperties, useMemo, useState } from 'react';
import classNames from 'classnames';
import { styled } from '@mui/system';
import { Tabs as BaseTabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList, TabPanel as BaseTabPanel, buttonClasses, Tab as BaseTab, tabClasses } from '@mui/base';

interface Props {
  value: number
  tabs: {
    label: string
    value: number
    renderPanel?: (active: boolean, value: number) => React.ReactNode
    renderIcon?: (active: boolean, value: number) => React.ReactNode
  }[]
  wrapperClassName?: string
  tabsListClassName?: string
  tabClassName?: string
  tabPanelClassName?: string
  onChange?: (value: number) => void
}

export default function UnstyledTabsVertical(props: Props) {
  const { value, tabs, wrapperClassName, tabsListClassName, tabClassName, tabPanelClassName, onChange } = props

  const [tabWidth, setTabWidth] = useState(0)
  const [tabLeft, setTabLeft] = useState(0)

  const tabListStyles = useMemo(() => {
    return {
      '--tab-width': `${tabWidth}px`,
      '--tab-left': `${tabLeft}px`
    } as CSSProperties
  }, [tabWidth, tabLeft])

  return (
    <Tabs
      className={classNames('flex flex-col w-full', wrapperClassName)}
      value={value}
      orientation="vertical"
      onChange={(e, v) => {
        console.log('-- target', (e?.target as HTMLElement).getBoundingClientRect())
        onChange?.(Number(v))
        const target = e?.target as HTMLElement
        setTabWidth(target.offsetWidth)
        setTabLeft(target.offsetLeft)
      }}
    >
      <TabsList
        style={tabListStyles}
        className={classNames('py-[10px] flex gap-[30px] text-md-b', tabsListClassName)}
      >
        {
          tabs.map(({ label, value: v, renderIcon }) => {
            return (
              <Tab
                className={classNames('flex-itmc', tabClassName)}
                value={v}
                key={v}
                disableRipple
                disableFocusRipple
              >
                { renderIcon?.(v === value, value) }
                <span className='min-w-0 flex-1 text-left'>{ label }</span>
              </Tab>
            )
          })
        }
      </TabsList>
      {
        tabs.map(({ renderPanel, value: v }, idx) => {
          return (
            <TabPanel key={idx} className={classNames('flex-1', tabPanelClassName)} value={v}>
              { renderPanel?.(v === value, value) }
            </TabPanel>
          )
        })
      }
    </Tabs>
  );
}

const Tab = styled(BaseTab)`
  cursor: pointer;
  background-color: transparent;
  border: none;
  white-space: nowrap;

  &.${tabClasses.selected} {
    background-color: #fff;
    color: var(--var-brand-color);
  }
`;

const TabPanel = styled(BaseTabPanel)`
`;

const Tabs = styled(BaseTabs)`
  display: flex;
`;

const TabsList = styled(BaseTabsList)`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: var(--tab-left);;
    width: var(--tab-width);
    height: 2px;
    background-color: #8840FF;
    transition: all 0.3s;
    z-index: 1;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #E8E8E8;
    z-index: 0;
  }
`;