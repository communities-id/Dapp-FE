import * as React from 'react';
import classNames from 'classnames';
import { styled } from '@mui/system';
import { Tabs as BaseTabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList, TabPanel as BaseTabPanel, buttonClasses, Tab as BaseTab, tabClasses } from '@mui/base';

interface Props {
  value: number
  tabs: {
    groupId: string | number,
    list: {
      label: string
      value: number
      renderPanel: (active: boolean, value: number) => React.ReactNode
      renderIcon: (active: boolean, value: number) => React.ReactNode
    }[]
  }[]
  wrapperClassName?: string
  tabsListClassName?: string
  tabClassName?: string
  tabPanelClassName?: string
  onChange?: (value: number) => void
}

export default function UnstyledTabsVertical(props: Props) {
  const { value, tabs, wrapperClassName, tabsListClassName, tabClassName, tabPanelClassName, onChange } = props

  return (
    <Tabs
      className={classNames('w-full mds:w-[904px] md:w-[1098px]', wrapperClassName)}
      value={value}
      orientation="vertical"
      onChange={(e, v) => {
        onChange?.(Number(v))
      }}
    >
      <TabsList className={classNames('text-md-b bg-gray-6', tabsListClassName)}>
        {
          tabs.map(({ groupId, list }, idx) => {
            return (
              <div key={idx}>
                {
                  list.map(({ label, value: v, renderIcon }) => {
                    return (
                      <Tab
                        className={classNames('flex items-center w-[80px] md:w-[274px]', {
                          'var-brand-textcolor': v === value,
                          'text-main-black': v !== value
                        }, tabClassName)}
                        value={v}
                        key={v}
                        disableRipple
                        disableFocusRipple
                      >
                        { renderIcon(v === value, value) }
                        <span className='hidden md:inline-block min-w-0 flex-1 text-left'>{ label }</span>
                      </Tab>
                    )
                  })
                }
                {
                  idx < (tabs.length - 1) && (
                    <div className='w-full my-5 pl-5 pr-10'>
                      <div className='w-full h-[1px] bg-gray-3'></div>
                    </div>
                  )
                }
              </div>
            )
          })
        }
      </TabsList>
      {
        tabs.map(({ groupId, list }) => {
          return list.map(({ label, value: v, renderPanel }, idx) => {
            return (
              <TabPanel key={idx} className={classNames('flex-1', tabPanelClassName)} value={v}>
                { renderPanel(v === value, value) }
              </TabPanel>
            )
          })
        })
      }
    </Tabs>
  );
}

const Tab = styled(BaseTab)`
  cursor: pointer;
  background-color: transparent;
  width: 274px;
  height: 60px;
  padding-left: 20px;
  padding-right: 40px;
  border: none;
  border-radius: 10px 0 0 10px;
  display: flex;
  align-items: center;
  gap: 14px;
  white-space: nowrap;

  &:hover {
    background-color: #fff;
  }

  &:focus {
    color: inherit;
  }

  &.${buttonClasses.focusVisible} {
    color: inherit;
  }

  &.${tabClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: var(--var-brand-color);
  }
`;

const TabPanel = styled(BaseTabPanel)`
  height: 100%;
  background-color: #fff;
`;

const Tabs = styled(BaseTabs)`
  display: flex;
`;

const TabsList = styled(BaseTabsList)`
  padding-left: 60px;
  padding-top: 60px;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column;
`;