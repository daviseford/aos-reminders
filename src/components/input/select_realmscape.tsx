import React from 'react'
import { SelectOne, TSelectOneSetValueFn } from './select_one'

interface ISelectRealmscapeProps {
  setValue: TSelectOneSetValueFn
  items: string[]
}

export const SelectRealmscape = (props: ISelectRealmscapeProps) => {
  return (
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 mx-auto mt-3">
      <div className="card">
        <div className="card-body">
          <h4 className="text-center">Realmscape Feature</h4>
          <SelectOne {...props} isClearable={true} />
        </div>
      </div>
    </div>
  )
}

// const Select = (props: ISelectRealmscapeProps) => {
//   const { value, setValue, items } = props
//   return (
//     <Fragment>
//       <select value={value} className="custom-select" onChange={e => setValue(e.target.value)}>
//         {value === 'None' ? null : (
//           <option value={'None'} key={`realmscape-None`}>
//             None
//           </option>
//         )}
//         <option value={value} key={`realmscape-${value}`}>
//           {value}
//         </option>
//         {items.map((name, i) => {
//           if (value === name) return null // Prevent showing duplicates
//           return (
//             <option value={name} key={`realmscape-${i}`}>
//               {name}
//             </option>
//           )
//         })}
//       </select>
//     </Fragment>
//   )
// }
