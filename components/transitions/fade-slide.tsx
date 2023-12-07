import { forwardRef } from 'react'
import { useTransition, useSpring, useChain, useSpringRef, animated } from '@react-spring/web';

export interface FadeSlideProps {
  children: React.ReactElement;
  in?: boolean;
  offset?: number;
  disabled?: boolean
  className?: string;
  onClick?: any;
  direction?: 'X' | 'Y'
  duration?: number | [number, number] // ms
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
}

const FadeSlide = forwardRef<HTMLDivElement, FadeSlideProps>(function Fade(props, ref) {
  const { in: open, offset = -30, duration = [], direction = 'Y', disabled, children, onEnter, onExited, ...other } = props;

  const _duration = typeof duration === 'number' ? [duration, duration] : duration

  const springApi = useSpringRef();
  const style = useSpring({
    ref: springApi,
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    config: {
      duration: _duration[0] ?? 300
    },
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

  const transApi = useSpringRef();
  const transition = useTransition(open, {
    ref: transApi,
    config: {
      duration: _duration[1] ?? 300
    },
    from : { transform: `translate${direction}(${offset}px)` },
    enter: { transform: `translate${direction}(0px)` },
    leave: { transform: `translate${direction}(${offset}px)` },
  });

  const delays = open ? [0, 0] : [(_duration[0] ?? 300) / 1000, 0]
  useChain([springApi, transApi], delays)

  return disabled ? (
    <div className={props.className}>
      { children }
    </div>
  ) : (
    <animated.div ref={ref} style={style} {...other}>
      {
        transition((style, item) => {
          return item ? (
            <animated.div style={style} className={props.className}>
              {children}
            </animated.div>
          ) : null
        
        })
      }
    </animated.div>
  );
});

export default FadeSlide