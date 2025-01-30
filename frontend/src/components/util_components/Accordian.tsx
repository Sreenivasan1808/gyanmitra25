import { createContext, useContext, useRef, useEffect, useState } from "react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
interface AccordianContextType {
  selected: any
  setSelected: (value: any) => void
}

const AccordianContext = createContext<AccordianContextType | null>(null)

export default function Accordian({ children, value, onChange, ...props }: any) {
  const [selected, setSelected] = useState(value)

  useEffect(() => {
    onChange?.(selected)
  }, [selected])

  return (
    <ul {...props}>
      <AccordianContext.Provider value={{ selected, setSelected }}>
        {children}
      </AccordianContext.Provider>
    </ul>
  )
}

export function AccordianItem({ children, value, trigger, ...props }: any) {
  const { selected, setSelected }: any = useContext(AccordianContext)
  const open = selected === value

  const ref:any = useRef(null)

  return (
    <li className="border-b bg-white" {...props}>
      <header
        role="button"
        onClick={() => setSelected(open ? null : value)}
        className="flex justify-between items-center p-4 font-medium"
      >
        {trigger}
        <ChevronDownIcon
          className={`size-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </header>
      <div
        className="overflow-y-hidden transition-all"
        style={{ height: open ? ref.current?.offsetHeight || 0 : 0 }}
      >
        <div className="pt-2 p-4" ref={ref}>
          {children}
        </div>
      </div>
    </li>
  )
}