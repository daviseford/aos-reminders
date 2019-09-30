import { IWithSelectMultipleWithFunctionArrayPayload } from 'utils/withSelect'
import { TEntry } from 'types/data'
import { IArmyBuilderProps } from './army_builder'

export const getSideEffects = (props: IArmyBuilderProps) => (items: TEntry[]) => {
  const add = addToAccum(props.addToSelections)

  const Collection = items.reduce(
    (accum, item) => {
      accum[item.name] = {}
      item.effects.forEach(effect => {
        if (effect.spell) {
          add(accum, item.name, effect.name, 'spells')
        } else if (effect.artifact) {
          add(accum, item.name, effect.name, 'artifacts')
        } else if (effect.command_trait) {
          add(accum, item.name, effect.name, 'traits')
        } else if (effect.command_ability) {
          add(accum, item.name, effect.name, 'commands')
        }
      })
      return accum
    },
    {} as IWithSelectMultipleWithFunctionArrayPayload
  )

  return Collection
}

const addToAccum = (updateFn: IArmyBuilderProps['addToSelections']) => (
  accum: IWithSelectMultipleWithFunctionArrayPayload,
  itemName: string,
  effectName: string,
  type: string
) => {
  const obj = accum[itemName].spell || {}
  const values = obj.values || []
  accum[itemName][type] = { values: values.concat(effectName), updateFn }
}
