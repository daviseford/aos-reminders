export type TObjWithEffects = Record<string, object & { effects: unknown[] }>

export type TSubFaction = Record<
  string,
  {
    units?: TObjWithEffects[]
    battalions?: TObjWithEffects[]
    traits?: TObjWithEffects[]
    spells?: TObjWithEffects[]
    battle_traits?: TObjWithEffects[]
    command_traits?: TObjWithEffects[]
    flavors?: TObjWithEffects[]
    artifacts?: TObjWithEffects[]
    endless_spells?: TObjWithEffects[]
    scenery?: TObjWithEffects[]
  }
>
