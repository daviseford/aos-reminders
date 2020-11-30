- [Top Tier: Factions, Sub-Factions, and Flavors](#top-tier-factions-sub-factions-and-flavors)
  - [Glossary](#glossary)
    - [Faction](#faction)
    - [Sub-Factions](#sub-factions)
      - [Default Sub-Faction](#default-sub-faction)
    - [Flavors](#flavors)
  - [Examples](#examples)

# Top Tier: Factions, Sub-Factions, and Flavors


## Glossary

- A **Faction** must have at least one **Sub-Faction**
- A **Faction** must have a **Default Sub-Faction**
- Any **Sub-Faction** can be extended by other **Sub-Factions**
- Any **Sub-Faction** can mark itself as **Not Visible** if it exists only to be extended by other Sub-Factions; by convention this would have something like "Base" in its name to indicate its purpose

### Faction

First, let's define a **Faction**

- A **Faction** is the highest-level representation of a army/faction in AoS.
- A **Faction** is the aggregate set of rules that govern many **Sub-Factions**. 
- If a **Faction** only has one **Sub-Faction**, that will be considered the **Default Sub-Faction**
 - A **Faction** must have a **Default Sub-Faction** 
- If a **Faction** has multiple **Sub Factions**, 
  - It must assign one as a **Default Sub-Faction**
 - And the user will be allowed to select a variant

### Sub-Factions

Next, **Sub-Factions**.

- A Sub-Faction belongs to a **Faction**
- A **Sub-Faction** can dictate:
  - What **Flavors** it may contain
  - What units it has
  - What battalions it has
- A **Sub-Faction** may also apply certain Abilities or effects, units, spells, etc

#### Default Sub-Faction

A **Sub-Faction** may be a **Default Sub-Faction**

~~A **Base Sub-Faction** can mark itself as **Not Visible**~~

We generally will try to extend other **Sub-Factions** from the **Base Sub-Faction**

  ~~- For example - `Ironjawz` and `Bonesplitterz` (**Sub-Factions**) share a lot of data from the `Orruk Warclans` (**Faction**) book.~~
  ~~- So we would want three **Sub-Factions** in total:~~
    ~~- **Base Sub-Faction** - marked as **Not Visible**~~
    ~~- **`Ironjawz` Sub-Faction**~~
    ~~- **`Bonesplitterz` Sub-Faction**~~

For example, `Stormcast` would probably be the **Default Sub-Faction** for the **STORMCAST** **Faction**, and then `Stormcast Stormkeep` could potentially extend it and modify it.

### Flavors

Lastly in this high-level tier (but at the bottom), **Flavors**

- These are the more "traditional" ways of configuring **Factions**. 
- A **Flavor** may belong to a one or many **Sub-Factions**
- A **Flavor** can dictate:
- What units/battalions it has
- A **Flavor** can also apply Abilities or effects units, spells, etc

- TBD: Can **Flavors** be shared across **Factions**?

## Examples

The new Seraphon book is a good example.


---
> If your army is a COALESCED army, you can give it the KOATL'S CLAW or THUNDER LIZARD keyword.

```
  COALESCED_FLAVORS: [KOATLS_CLAW, THUNDER_LIZARD],
  STARBORNE_FLAVORS: [DRACOTHIONS_TAIL, FANGS_OF_SOTEK],
```

---

|              |                                                                 |                                                                        |
| ------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Faction      | 'SERAPHON'                                                      |                                                                        |
| Sub-Factions | 'COALESCED' or 'STARBORNE'                                      | one would be **Default Sub-Faction**                                      |
| Flavors  | 'KOATLS_CLAW, THUNDER_LIZARD, DRACOTHIONS_TAIL, FANGS_OF_SOTEK' | the **Sub-Factions** will describe which **Flavors** they want to list |

---

 > a Faction has one or many Sub-Factions, and the Sub-Factions describe themselves by pulling in lower-level things like units, battalions, flava, etc
