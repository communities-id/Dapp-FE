import { FC, ReactNode, forwardRef } from 'react'

import { styled } from '@mui/system'
import Select, { SelectProps, SelectRootSlotProps, selectClasses } from '@mui/base/Select'
import Option, { optionClasses } from '@mui/base/Option'
import OptionGroup, { OptionGroupProps } from '@mui/base/OptionGroup'
import Popper from '@mui/base/Popper'
import UnfoldMoreIcon from '~@/icons/unfold-more.svg'

interface Props<T = string> {
  value: T
  placeholder?: string
  menus: {
    group?: string
    label: string
    value: T
    icon: ReactNode
  }[]
  onChange?: (value: T) => void
}

const UnstyledSelectGrouping: FC<Props> = ({ placeholder, value, menus, onChange }) => {
  const groups = Array.from(new Set(menus.map(menu => menu.group)))
  return (
    <CustomSelect
      placeholder={placeholder}
      value={String(value)}
      className='flex items-center py-3 px-[6px] h-[40px] leading-[40px] text-[#757575] text-advance-network-btn rounded-[6px] gap-2 min-w-[164px] border-solid border-network-btn hover:border-network-btn-active'
      renderValue={(item) => {
        const menu = menus.find(menu => String(menu.value) === item?.value)
        if (!menu) return null
        return (
          <div className='flex-1 flex items-center gap-[6px] text-advance-network-btn'>
            { menu.icon }
            { menu.label }
          </div>
        )
      }}
      onChange={(e, value) => {
        onChange?.(String(value))
      }}
      >
      {
        groups.length ? (
          groups.map(group => (
            <CustomOptionGroup key={group} label={group}>
              {
                menus.filter(option => option.group === group).map(menu => (
                  <StyledOption
                    key={menu.value}
                    value={String(menu.value)}
                    className='flex items-center gap-[6px] text-advance-network-btn text-[#757575] hover:text-mintPurple hover:bg-transparent cursor-pointer'>
                    { menu.icon }
                    { menu.label }
                  </StyledOption>
                ))
              }
            </CustomOptionGroup>
          ))
        ) : (
          menus.map(menu => (
            <StyledOption
              key={menu.value}
              value={String(menu.value)}
              className='flex items-center gap-[6px] text-advance-network-btn text-[#757575] hover:text-mintPurple hover:bg-transparent cursor-pointer'>
                { menu.icon }
                { menu.label }
              </StyledOption>
          ))
        )
      }
    </CustomSelect>
  );
}

export default UnstyledSelectGrouping

function CustomSelect(props: SelectProps<string, false>) {
  const slots: SelectProps<string, false>['slots'] = {
    root: StyledButton,
    listbox: StyledListbox,
    popper: StyledPopper,
    ...props.slots,
  };

  return <Select {...props} slots={slots} />;
}

const CustomOptionGroup = forwardRef(function CustomOptionGroup(
  props: OptionGroupProps,
  ref: React.ForwardedRef<any>,
) {
  const slots: OptionGroupProps['slots'] = {
    root: StyledGroupRoot,
    label: StyledGroupHeader,
    list: StyledGroupOptions,
    ...props.slots,
  };

  return <OptionGroup {...props} ref={ref} slots={slots} />;
});

const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const Button = forwardRef(function Button<
  TValue extends {},
  Multiple extends boolean,
>(
  props: SelectRootSlotProps<TValue, Multiple>,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const { ownerState, ...other } = props;
  return (
    <button type="button" {...other} ref={ref}>
      {other.children}
      <span>
        <UnfoldMoreIcon width='16' height='16' />
      </span>
    </button>
  );
});

const StyledButton = styled(Button, { shouldForwardProp: () => true })(
  ({ theme }) => `
  box-sizing: border-box;
  text-align: left;
  position: relative;

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;
  `,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 164px;
  border-radius: 6px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 2px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
  };
  `,
);

const StyledOption = styled(Option)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.highlighted} {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.${optionClasses.highlighted}.${optionClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.${optionClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `,
);

const StyledGroupRoot = styled('li')`
  list-style: none;
`;

const StyledGroupHeader = styled('span')`
  display: block;
  padding: 15px 0 5px 10px;
  font-size: 0.75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  color: ${grey[600]};
`;

const StyledGroupOptions = styled('ul')`
  list-style: none;
  margin-left: 0;
  padding: 0;

  > li {
    padding-left: 20px;
  }
`;

const StyledPopper = styled(Popper)`
  z-index: 1;
`;