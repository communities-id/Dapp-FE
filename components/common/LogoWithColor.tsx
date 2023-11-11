
import { FC } from 'react'
interface LogoWithColorProps {
  className?: string
  color?: string
  width?: number
  height?: number
}

const LogoWithColor: FC<LogoWithColorProps> = (props) => {
  const { className, color = '#883fff', width, height } = props
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2067 375" className={className} width={width} height={height}>
    <title>Frame-1638</title>
    <path fill={color} d="M220.997 345.685c0.003 6.741 7.301 10.949 13.134 7.574l98.24-56.844c13.518-7.82 21.842-22.254 21.842-37.872v-142.97c0-15.604-8.309-30.027-21.809-37.853l-98.26-56.974c-5.834-3.383-13.141 0.827-13.141 7.571v51.604c0 6.239 3.321 12.007 8.718 15.138l47.432 27.526c6.745 3.914 10.896 11.123 10.897 18.921l0.007 90.749c0.001 7.798-4.15 15.007-10.893 18.922l-47.47 27.56c-5.397 3.133-8.717 8.903-8.715 15.143l0.019 51.806z"></path>
    <path fill="#121314" d="M155.097 345.685c-0.003 6.741-7.301 10.949-13.134 7.574l-98.239-56.844c-13.518-7.82-21.843-22.254-21.843-37.872v-142.97c0-15.604 8.309-30.027 21.808-37.853l98.261-56.974c5.834-3.383 13.141 0.827 13.141 7.571v51.604c0 6.239-3.321 12.007-8.718 15.138l-47.432 27.526c-6.745 3.914-10.896 11.123-10.897 18.921l-0.007 90.749c-0.001 7.798 4.15 15.007 10.893 18.922l47.47 27.56c5.397 3.133 8.717 8.903 8.715 15.143l-0.019 51.806z"></path>
    <path fill={color} d="M193.708 112.924c-3.398-1.976-7.596-1.978-10.995-0.003l-22.169 12.88c-3.37 1.958-5.444 5.561-5.444 9.458v103.874c0 3.902 2.079 7.508 5.454 9.464l22.053 12.78c3.395 1.967 7.583 1.966 10.976-0.004l22.672-13.159c3.374-1.958 5.449-5.564 5.448-9.465l-0.034-103.276c-0.001-3.894-2.073-7.495-5.439-9.452l-22.522-13.099z"></path>
    <path fill="#121314" d="M511.515 276.611h-28.125c-13.592 0-24.086-3.612-31.482-10.838s-11.094-17.633-11.094-31.222v-81.798c0-13.59 3.697-23.997 11.094-31.222s17.891-10.838 31.482-10.838h28.125c13.417 0 23.826 3.699 31.222 11.095 7.568 7.225 11.353 17.547 11.353 30.964v12.128c0 3.784-1.893 5.677-5.675 5.677h-21.676c-3.611 0-5.418-1.892-5.418-5.677v-10.58c0-5.505-1.205-9.375-3.614-11.611-2.235-2.409-6.106-3.613-11.61-3.613h-17.548c-5.333 0-9.201 1.204-11.61 3.613-2.235 2.236-3.354 6.107-3.354 11.611v78.701c0 5.505 1.119 9.461 3.354 11.87 2.409 2.236 6.278 3.354 11.61 3.354h17.548c5.504 0 9.375-1.118 11.61-3.354 2.409-2.408 3.614-6.365 3.614-11.87v-10.579c0-3.784 1.807-5.677 5.418-5.677h21.676c3.783 0 5.675 1.892 5.675 5.677v12.128c0 13.418-3.786 23.825-11.353 31.222-7.397 7.225-17.805 10.838-31.222 10.838z"></path>
    <path fill="#121314" d="M642.62 276.611h-22.967c-13.589 0-24.083-3.612-31.479-10.838s-11.097-17.633-11.097-31.222v-47.479c0-13.59 3.7-23.998 11.097-31.222s17.891-10.838 31.479-10.838h22.967c13.417 0 23.826 3.699 31.222 11.096 7.568 7.225 11.353 17.547 11.353 30.964v47.479c0 13.418-3.786 23.825-11.353 31.222-7.397 7.225-17.805 10.838-31.222 10.838zM624.558 248.485h13.161c5.504 0 9.375-1.118 11.61-3.354 2.409-2.236 3.611-6.107 3.611-11.612v-45.415c0-5.505-1.202-9.375-3.611-11.611-2.235-2.236-6.106-3.354-11.61-3.354h-13.161c-5.507 0-9.375 1.118-11.613 3.354-2.235 2.236-3.354 6.107-3.354 11.611v45.415c0 5.505 1.119 9.375 3.354 11.612 2.238 2.236 6.106 3.354 11.613 3.354z"></path>
    <path fill="#121314" d="M738.298 276.611h-21.933c-3.614 0-5.421-1.806-5.421-5.419v-120.761c0-3.612 1.807-5.419 5.421-5.419h21.933c3.611 0 5.418 1.807 5.418 5.419v8.515h1.031c2.064-4.129 5.507-7.483 10.323-10.063 4.987-2.58 10.666-3.871 17.028-3.871h7.225c14.967 0 25.719 5.505 32.256 16.515 5.849-11.010 15.912-16.515 30.189-16.515h7.485c13.246 0 23.223 3.613 29.932 10.838 6.88 7.225 10.32 17.632 10.32 31.222v84.12c0 3.613-1.804 5.419-5.418 5.419h-21.933c-3.611 0-5.418-1.806-5.418-5.419v-82.572c0-5.505-1.119-9.375-3.354-11.612-2.238-2.408-6.106-3.612-11.613-3.612h-6.449c-11.87 0-17.805 6.623-17.805 19.869v77.927c0 3.613-1.893 5.419-5.678 5.419h-21.673c-3.614 0-5.418-1.806-5.418-5.419v-82.572c0-5.505-1.205-9.375-3.614-11.612-2.235-2.408-6.106-3.612-11.61-3.612h-7.999c-11.87 0-17.805 6.537-17.805 19.611v78.185c0 3.613-1.807 5.419-5.418 5.419z"></path>
    <path fill="#121314" d="M944.173 276.611h-21.933c-3.614 0-5.421-1.806-5.421-5.419v-120.761c0-3.612 1.807-5.419 5.421-5.419h21.933c3.611 0 5.418 1.807 5.418 5.419v8.515h1.031c2.064-4.129 5.507-7.483 10.323-10.063 4.987-2.58 10.666-3.871 17.028-3.871h7.225c14.967 0 25.719 5.505 32.256 16.515 5.849-11.010 15.912-16.515 30.189-16.515h7.485c13.246 0 23.223 3.613 29.932 10.838 6.88 7.225 10.32 17.632 10.32 31.222v84.12c0 3.613-1.804 5.419-5.418 5.419h-21.933c-3.611 0-5.418-1.806-5.418-5.419v-82.572c0-5.505-1.119-9.375-3.354-11.612-2.238-2.408-6.106-3.612-11.613-3.612h-6.449c-11.87 0-17.805 6.623-17.805 19.869v77.927c0 3.613-1.893 5.419-5.678 5.419h-21.673c-3.614 0-5.418-1.806-5.418-5.419v-82.572c0-5.505-1.205-9.375-3.614-11.612-2.235-2.408-6.106-3.612-11.61-3.612h-7.999c-11.87 0-17.805 6.537-17.805 19.611v78.185c0 3.613-1.807 5.419-5.418 5.419z"></path>
    <path fill="#121314" d="M1170.174 276.611h-8.516c-13.246 0-23.309-3.612-30.189-10.838-6.709-7.225-10.066-17.633-10.066-31.222v-84.12c0-3.612 1.807-5.419 5.421-5.419h21.933c3.611 0 5.418 1.807 5.418 5.419v82.572c0 5.505 1.119 9.461 3.354 11.87 2.409 2.236 6.278 3.354 11.61 3.354h9.549c11.87 0 17.805-6.537 17.805-19.611v-78.185c0-3.612 1.804-5.419 5.418-5.419h21.673c3.786 0 5.678 1.807 5.678 5.419v120.761c0 3.613-1.893 5.419-5.678 5.419h-21.673c-3.614 0-5.418-1.806-5.418-5.419v-8.515h-1.033c-1.893 4.645-5.247 8.171-10.063 10.579-4.816 2.236-9.892 3.354-15.224 3.354z"></path>
    <path fill="#121314" d="M1285.113 276.611h-21.933c-3.611 0-5.418-1.806-5.418-5.419v-120.761c0-3.612 1.807-5.419 5.418-5.419h21.933c3.611 0 5.418 1.807 5.418 5.419v8.515h1.033c3.783-9.289 12.213-13.934 25.287-13.934h8.256c27.009 0 40.512 14.020 40.512 42.060v84.12c0 3.613-1.893 5.419-5.675 5.419h-21.676c-3.611 0-5.418-1.806-5.418-5.419v-82.572c0-5.505-1.205-9.375-3.614-11.612-2.235-2.408-6.106-3.612-11.61-3.612h-9.289c-11.87 0-17.805 6.537-17.805 19.611v78.185c0 3.613-1.807 5.419-5.418 5.419z"></path>
    <path fill="#121314" d="M1394.117 122.821v-22.449c0-3.44 1.722-5.161 5.161-5.161h22.45c3.44 0 5.161 1.634 5.161 4.903v22.707c0 3.441-1.722 5.161-5.161 5.161h-22.45c-3.44 0-5.161-1.72-5.161-5.161zM1394.117 271.192v-120.761c0-3.612 1.722-5.419 5.161-5.419h22.19c3.614 0 5.421 1.807 5.421 5.419v120.761c0 2.236-0.431 3.699-1.291 4.386-0.688 0.688-1.978 1.032-3.871 1.032h-22.193c-3.611 0-5.418-1.806-5.418-5.419z"></path>
    <path fill="#121314" d="M1459.42 173.396h-10.323c-2.064 0-3.526-0.344-4.388-1.032-0.688-0.688-1.031-2.064-1.031-4.129v-17.804c0-3.612 1.807-5.419 5.418-5.419h10.323c1.89 0 2.838-0.946 2.838-2.838v-24.513c0-3.613 1.893-5.419 5.675-5.419h21.676c3.611 0 5.418 1.806 5.418 5.419v24.513c0 1.892 1.033 2.838 3.097 2.838h20.126c3.614 0 5.418 1.807 5.418 5.419v17.804c0 1.893-0.428 3.268-1.291 4.129-0.688 0.688-2.064 1.032-4.128 1.032h-20.126c-2.064 0-3.097 0.946-3.097 2.839v57.026c0 5.333 1.205 9.204 3.614 11.612 2.406 2.236 6.363 3.354 11.87 3.354h10.32c3.611 0 5.418 1.806 5.418 5.418v17.804c0 1.893-0.428 3.268-1.291 4.129-0.688 0.688-2.064 1.032-4.128 1.032h-15.741c-13.589 0-24.168-3.612-31.736-10.838-7.4-7.225-11.097-17.547-11.097-30.964v-58.574c0-1.893-0.948-2.839-2.838-2.839z"></path>
    <path fill="#121314" d="M1548.839 122.821v-22.449c0-3.44 1.722-5.161 5.161-5.161h22.45c3.44 0 5.158 1.634 5.158 4.903v22.707c0 3.441-1.719 5.161-5.158 5.161h-22.45c-3.44 0-5.161-1.72-5.161-5.161zM1548.839 271.192v-120.761c0-3.612 1.722-5.419 5.161-5.419h22.19c3.614 0 5.418 1.807 5.418 5.419v120.761c0 2.236-0.428 3.699-1.287 4.386-0.691 0.688-1.978 1.032-3.871 1.032h-22.193c-3.611 0-5.418-1.806-5.418-5.419z"></path>
    <path fill="#121314" d="M1708.323 276.611h-57.027c-13.589 0-24.083-3.612-31.479-10.838s-11.097-17.633-11.097-31.222v-47.479c0-13.59 3.7-23.998 11.097-31.222s17.891-10.838 31.479-10.838h20.386c13.592 0 24.083 3.613 31.482 10.838 7.397 7.225 11.094 17.632 11.094 31.222v32.771c0 3.613-1.804 5.419-5.418 5.419h-64.766c-2.064 0-3.097 0.946-3.097 2.838v5.677c0 5.333 1.119 9.204 3.354 11.612 2.409 2.236 6.366 3.354 11.87 3.354h52.122c3.614 0 5.418 1.893 5.418 5.677v17.030c0 1.893-0.428 3.268-1.287 4.129-0.691 0.688-2.067 1.032-4.131 1.032zM1644.074 203.329h35.091c1.893 0 2.841-0.946 2.841-2.839v-12.386c0-5.505-1.119-9.375-3.354-11.611-2.238-2.236-6.109-3.354-11.613-3.354h-10.837c-5.504 0-9.375 1.118-11.613 3.354-2.235 2.236-3.354 6.107-3.354 11.611v12.386c0 1.892 0.948 2.839 2.841 2.839z"></path>
    <path fill="#121314" d="M1788.608 276.611h-49.025c-3.443 0-5.161-1.806-5.161-5.419v-16.514c0-1.893 0.342-3.182 1.031-3.871 0.688-0.86 2.064-1.29 4.131-1.29h43.089c8.43 0 12.647-2.58 12.647-7.741v-1.29c0-4.129-3.528-8.085-10.58-11.87l-25.547-14.192c-8.773-4.473-15.224-9.289-19.352-14.45s-6.192-11.784-6.192-19.869c0-12.042 3.18-20.901 9.546-26.578s16.344-8.516 29.932-8.516h43.092c3.44 0 5.161 1.807 5.161 5.419v16.772c0 1.892-0.345 3.268-1.033 4.129-0.688 0.688-2.064 1.032-4.128 1.032h-35.867c-8.43 0-12.644 2.15-12.644 6.451v1.291c0 3.784 3.7 7.655 11.097 11.612l26.061 15.482c8.944 4.816 15.224 9.805 18.836 14.966 3.614 4.989 5.418 11.612 5.418 19.869 0 23.051-13.503 34.577-40.512 34.577z"></path>
    <path fill={color} d="M1970.082 241.845c0 2.78 2.12 5.104 4.893 5.31 0.322 0.024 0.65 0.048 0.983 0.071 2.368 0 2.406 0 5.56 0 18.458 0 32.102-4.653 40.934-13.96 8.994-9.307 13.488-22.163 13.488-38.568 0-17.194-4.258-30.208-12.777-39.042s-22.007-13.251-40.462-13.251c-2.525 0-6.121 0.079-5.088 0.237-0.972 0-1.919 0.021-2.847 0.063-2.693 0.121-4.686 2.424-4.686 5.118v94.022zM2066.929 194.698c0 14.197-2.209 26.58-6.626 37.149s-10.724 19.324-18.927 26.265c-8.046 6.941-17.906 12.146-29.578 15.617s-20.073 2.839-34.583 2.839c-6.626 0-1.713 0.001-11.873 0.001-7.341 0-13.993 0-20.652 0-2.97 0-5.377-2.407-5.377-5.376v-152.693c0-2.969 2.403-5.376 5.374-5.376 8.864 0 20.672 0 25.394 0 5.77 0 1.261-0.004 7.887-0.001 15.419 0.008 22.47-0.966 33.83 2.189 11.516 3.155 21.375 8.48 29.578 15.263s14.51 15.459 18.927 26.028c4.417 10.569 6.626 23.268 6.626 38.095z"></path>
    <path fill={color} d="M1915.698 118.406v155.080c0 3.612-1.807 5.418-5.418 5.418h-21.933c-3.614 0-5.421-1.806-5.421-5.418v-155.080c0-3.613 1.807-5.419 5.421-5.419h21.933c3.611 0 5.418 1.806 5.418 5.419z"></path>
    </svg>
  )
}

export default LogoWithColor