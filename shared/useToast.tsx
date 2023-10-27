import React from "react";

export const ToastContext = React.createContext({})

function reducer(state: any, action: any) {
  const { type, payload } = action;
  switch (type) {
    case 'SHOW_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, payload],
      };
    case 'HIDE_TOAST':
      const toasts = state.toasts.filter((toast: any) => toast.id !== payload.id);
      return {
        ...state,
        toasts
      }
    default:
      return state;
  }
}

export function ToastContextProvider(props: any) {
  const [state, dispatch] = React.useReducer(reducer, {
    showToast: false,
    toasts: []
  });

  const context = {
    state,
    dispatch,
  };

  const toastEl = <div className="toast z-10">
    {
      state.toasts.map((toast: any) => (
        <div key={toast.id} className={`alert alert-${toast.type}`}>
          <div>
            <span className="text-white">{toast.content}</span>
          </div>
        </div>
      ))
    }
  </div>

  return (
    <ToastContext.Provider value={context}>
      {props.children}
      {toastEl}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context: any = React.useContext(ToastContext);
  const [id, setId] = React.useState(0);

  function showToast(content: string, type: string, duration = 2000) {
    context.dispatch({ type: 'SHOW_TOAST', payload: { id, content, type } });
    setTimeout(() => {
      context.dispatch({ type: 'HIDE_TOAST', payload: { id } });
    }, duration)
    setId(id + 1);
  }

  return {
    showToast
  }
}