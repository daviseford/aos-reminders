import { HERO_PHASE } from "types/meta";
import { IEffects } from "types/army";

// General Allegiance Abilities (always active regardless of army composition)
 const Abilities: IEffects[] = [
    {
        name: 'Lords of Space and Time',
        desc: 'In your hero phase, you can pick a friendly SERAPHON unit anywhere on the battlefield to be transported through space and time. If you do so, roll a dice for the unit and look up the result on the table on the right.',
        when: [HERO_PHASE]
    },

]

export default Abilities