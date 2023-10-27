import { forwardRef } from 'react'
import { useSpring, animated } from '@react-spring/web';

interface FadeSlideProps {
  children: React.ReactElement;
  in?: boolean;
  offset?: number;
  disabled?: boolean
  className?: string;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
}

const FadeSlide = forwardRef<HTMLDivElement, FadeSlideProps>(function Fade(props, ref) {
  const { in: open, offset = -30, disabled, children, onEnter, onExited, ...other } = props;

  const style = useSpring({
    from: { opacity: 0, transform: `translateY(${offset}px)` },
    to: { opacity: open ? 1 : 0, transform: `translateY(0px)` },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true);
      }
    },
  });

  return disabled ? (
    <div className={props.className}>
      { children }
    </div>
  ) : (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

export default FadeSlide