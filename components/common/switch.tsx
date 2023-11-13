import { FC } from 'react'
import { styled } from '@mui/system'
import { Switch, switchClasses, SwitchInputSlotProps } from '@mui/base'

interface CustomSwitchProps extends SwitchInputSlotProps {

}

const CustomSwitch: FC<Partial<CustomSwitchProps>> = (props) => {
  const label = { slotProps: { input: { 'aria-label': 'cid-switch' } } };

  return (
    <Switch
      slots={{
        root: Root,
      }}
      {...label}
      {...props}
    />
  );
}

export default CustomSwitch

const Root = styled('span')(
  ({ theme }) => `
  font-size: 0;
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  cursor: pointer;

  &.${switchClasses.disabled} {
    opacity: 0.4;
    cursor: not-allowed;
  }

  & .${switchClasses.track} {
    background: #E8E8E8;
    border-radius: 14px;
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  & .${switchClasses.thumb} {
    display: block;
    width: 14px;
    height: 14px;
    top: 3px;
    left: 4px;
    border-radius: 100%;
    background-color: #fff;
    position: relative;
    
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  }

  &.${switchClasses.focusVisible} .${switchClasses.thumb} {
    background-color: #E8E8E8;
    box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  &.${switchClasses.checked} {
    .${switchClasses.thumb} {
      left: 18px;
      top: 3px;
      background-color: #fff;
    }

    .${switchClasses.track} {
      background: #8840FF;
    }
  }

  & .${switchClasses.input} {
    cursor: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    margin: 0;
  }
  `,
);