const app_version_number = 1.1
const max_tags = 5
const help_text = `
    <p>This is a tool to easily put together and export Break Adversaries. It does the following:</p>
        <ul>
            <li>Aptitude Calculations are completely automated</li>
            <li>All size and speed calculations are factored into Combat values and aptitudes</li>
            <li>Adding traits, items and abilities can manipulate combat values and aptitudes</li>
            <li>You can import and export your adversary list in the form of a JSON file - future enhancements will allow for print-friendly cards, and markdown exports</li>
        </ul>
        <br />
        <p>You can remove any Trait, Inventory item or Ability by clicking on them.</p>
        <p>Ability bound passives will be removed when the bound ability is removed.</p>
        <p class="font-bold">Please report bugs or request features on the <a class="underline text-blue-700" href="https://github.com/hylandpad/break-_adversary_creator/issues" target="_blank">Project Github</a></p>
`
var example_adversaries = {
    "JELLY MONSTER": {
        "name": "JELLY MONSTER",
        "menace": "mook",
        "rank": "0",
        "description": "<p>Jelly Monsters, or Jellies, are caustic amoebas that are largely harmless on their own. However, they can meld themselves together to create massive unicellular organisms that can take up entire corridors in deep, dark dungeons. Do not underestimate Jelly Monsters. If an infestation is left untreated, it grows - literally.</p>",
        "size": "small",
        "hearts": 1,
        "atkbonus": 1,
        "bright_points": 0,
        "dark_points": 0,
        "defense": 11,
        "speed": "average",
        "creature_type": "monster",
        "creature_subtype": "Abberation",
        "tags": [],
        "primary_aptitudes": [
            "grit",
            "deftness",
            "might"
        ],
        "inventory": [
            {
                "id": "inv-1lcmiupo88u",
                "name": "INERT JELLY",
                "category": "Yield",
                "type": "Reagent",
                "subtype": "Byproduct",
                "description": "<p>Jellified remains are useful for salves, machine lubricant or -in some cultures- culinary application</p>",
                "slots": "1",
                "magic": false,
                "denomination": "coins",
                "value": "20",
                "defense": null,
                "atkbonus": null,
                "speed": null,
                "max_speed": null,
                "allegiance": 0
            },
            {
                "id": "inv-kuyyphhkhdb",
                "name": "HALF DISSOLVED REMAINS",
                "category": "Item",
                "type": "Reagent",
                "subtype": "Bones",
                "description": "<p>The still-slimy, partially dissolved bones of a small creature consumed by the Jelly Monster. Usable only as the crudest components for primitive recipes.</p>",
                "slots": "1",
                "magic": false,
                "denomination": "stones",
                "value": "50",
                "defense": null,
                "atkbonus": null,
                "speed": null,
                "max_speed": null,
                "allegiance": 0
            }
        ],
        "passives": [
            {
                "id": "tr-339a59jjmjq",
                "name": "Resilient",
                "type": "trait",
                "modifier": "grit",
                "value": 2
            },
            {
                "id": "tr-a76sm3t58tw",
                "name": "Primitive",
                "type": "trait",
                "modifier": "insight",
                "value": -1
            },
            {
                "id": "ab-passive-l2uazgkmn4i",
                "name": "BLOBLET",
                "modifiers": {
                    "size": "small"
                },
                "type": "ability"
            },
            {
                "id": "ab-passive-tbipu6pwht",
                "name": "STUNNING PSUEDOPOD",
                "modifiers": {
                    "atkbonus": 1
                },
                "type": "ability"
            }
        ],
        "abilities": [
            {
                "id": "ab-8zlevun60rw",
                "name": "BLOBBIFY",
                "description": "<p>A Jelly Monster may spend its action to combine with another Jelly Monster of the same size in the same combat area. Doing so does the following:</p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Increases its Maximum Hearts by 1 (up to a maximum of 4)</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Increases its Attack Bonus by 1 (up to a maximum of 3)</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Increases its Size by 1 size category (up to a maximum of Large)</li></ol>",
                "allegiance": 0,
                "bound_passive": false,
                "type": "Basic",
                "magic": false
            },
            {
                "id": "ab-3siv2n4nvlo",
                "name": "CAUSTIC SLIME",
                "description": "<p>All attacks that hit a character also do Sundering Damage to that character's shield. If they have no usable shield, or their shield has been sundered, the Damage is dealt to their Armor. If they have no armor, or their armor has been sundered, the Damage is dealt to their Weapon. </p>",
                "allegiance": 0,
                "bound_passive": false,
                "type": "Basic",
                "magic": false
            },
            {
                "id": "ab-x9qt6pjd88k",
                "name": "BLOBLET",
                "description": "<p>The Jelly Monster's size is <strong>Small</strong>.</p>",
                "allegiance": 0,
                "bound_passive": true,
                "type": "Basic",
                "magic": false
            },
            {
                "id": "ab-oyygwolruya",
                "name": "STUNNING PSUEDOPOD",
                "description": "<p>The Jelly Monster only has one weapon - a prehensile pseudopod that it can shoot out with great force and precision - especially impressive for a creature lacking any discernible sensory organs.</p><p><br></p><p>On hit:<strong> Deftness Check:</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>On Failure</strong>: Target is Disoriented for one round</li></ol>",
                "allegiance": 0,
                "bound_passive": true,
                "type": "Basic",
                "magic": false
            }
        ],
        "facts": {
            "habitat": {
                "description": "Dank, dark subterranean corridors and old ruins are where Jellies are most likely to be found, but there are a number of subnautical species that live in tidal caves and grottos."
            },
            "communication": {
                "description": "There is no known communication method by which Jelly Monsters can convey any sort of meaningful information"
            },
            "tactics": {
                "description": "Lacking any discernable brainstem or central nervous system, the Jellies are driven by hunger and survival only. They will not endeavor to work together, but they will merge when threatened."
            },
            "indicators": {
                "description": "Slime trails on walls, floors or ceilings - skeletal remains of rodents and small animals still covered in slightly steaming goop."
            },
            "role-playing-notes": {
                "description": "Jelly Monsters do not have any orifices with which to make sounds, save for the sound of them squelching beneath doors or from the crevices of rock formations."
            },
            "customization": {
                "description": "These can be reflavored to be more generic \"Slime Cube\" enemies by putting them in a pit or in a hallway, and upping the lethality of their Caustic Slime ability."
            }
        },
        "moods": [
            {
                "rolls": {
                    "start": 1,
                    "stop": 5
                },
                "mood": "Benign",
                "mood_text": "This creature has taken to dissolving a chunk of organic matter and doesn't seem to care about you."
            },
            {
                "rolls": {
                    "start": 6,
                    "stop": 14
                },
                "mood": "Wary",
                "mood_text": "The eyestalks of this creature are swiveling to keep you in view, but it hasn't made any aggressive moves yet."
            },
            {
                "rolls": {
                    "start": 15,
                    "stop": 20
                },
                "mood": "Hungry",
                "mood_text": "Pseudopods extend and retract as this creature prepares to attack you."
            }
        ],
        "max_speed": "veryfast",
        "aptitudes": {
            "might": 5,
            "deftness": 7,
            "grit": 8,
            "insight": 5,
            "aura": 6
        }
    },
    "WULFOLK": {
        "name": "WULFOLK",
        "menace": "boss",
        "rank": "2",
        "description": "<p>Primal ancestors of both Proudhounds and Mundymutts, Wulfolk are taller, broader and much more savage. Armed with sharp teeth, claws and an excellent sense of smell, Wulfolk are the ultimate predators. They have made a name for themselves as excellent bounty hunters, capable of tracking a single target a great many leagues on scent alone. While many prefer to stay to packs led by powerful alphas, some prefer to stay solitary.</p>",
        "size": "medium",
        "hearts": 2,
        "atkbonus": 2,
        "bright_points": 0,
        "dark_points": 0,
        "defense": 14,
        "speed": "fast",
        "creature_type": "folk",
        "creature_subtype": "Beastfolk",
        "tags": [],
        "primary_aptitudes": [
            "deftness",
            "might",
            "insight"
        ],
        "inventory": [
            {
                "id": "inv-25pusfuyff6",
                "name": "HUNTING LEATHERS",
                "category": "Equipment",
                "type": "Armor",
                "subtype": "Light",
                "description": "<p>Simple leather armor that provides the Wulfolk some protection without impeding their movement</p>",
                "slots": "2",
                "magic": false,
                "denomination": "coins",
                "value": "30",
                "defense": 2,
                "atkbonus": null,
                "speed": null,
                "max_speed": "veryfast",
                "allegiance": 0
            },
            {
                "id": "inv-1dk8928qhbh",
                "name": "BAG OF ORNATE BONE DICE",
                "category": "Item",
                "type": "Curiosity",
                "subtype": "Dice",
                "description": "<p>A velvet bag containing an assortment of dice fashioned from bones. The dice faces vary from bone to bone, with some having dots, others having roughly carved numbers and some having symbols. They are beautiful in a savage way, and would likely fetch a high price from a wealthy collector or travelling gambler.</p>",
                "slots": "1",
                "magic": false,
                "denomination": "coins",
                "value": "70",
                "defense": null,
                "atkbonus": null,
                "speed": null,
                "max_speed": null,
                "allegiance": 0
            },
            {
                "id": "inv-qwsomss2h1",
                "name": "RAZOR TOOTH",
                "category": "Yield",
                "type": "Reagent",
                "subtype": "Bone",
                "description": "<p>An adult  Wulfolk's canines are worth quite a bit on the black market. They are not easily acquired by outsiders. They make for excellent bone knives or tools once refined and sharpened, and keep an edge better than most other bone weaponry.</p>",
                "slots": ".5",
                "magic": false,
                "denomination": "coins",
                "value": "20",
                "defense": null,
                "atkbonus": null,
                "speed": null,
                "max_speed": null,
                "allegiance": 0
            }
        ],
        "passives": [
            {
                "id": "tr-b4x5oqccz9f",
                "name": "Keen Nose",
                "type": "trait",
                "modifier": "insight",
                "value": 1
            },
            {
                "id": "tr-vpd2v9r67x8",
                "name": "Lithe",
                "type": "trait",
                "modifier": "deftness",
                "value": 1
            },
            {
                "id": "tr-08iqlbe0asbr",
                "name": "Savage Demeanor",
                "type": "trait",
                "modifier": "aura",
                "value": -1
            },
            {
                "id": "ab-passive-1qeo2zfummw",
                "name": "WOODSPEED",
                "modifiers": {
                    "speed": "fast"
                },
                "type": "ability"
            }
        ],
        "abilities": [
            {
                "id": "ab-8izs521pv8u",
                "name": "WOODSPEED",
                "description": "<p>The Wulfolk's base speed is <strong>Fast</strong></p>",
                "allegiance": 0,
                "bound_passive": true,
                "type": "Basic",
                "magic": false
            },
            {
                "id": "ab-7jckfy1piqw",
                "name": "HUNTED",
                "description": "<p>At the start of Combat, choose one player character. This player character becomes Hunted as the Wulfolk enter a state of extreme concentration and focus. All Wulfolk Adversaries gain an Edge against any checks or contests imposed on them by that character. However, they suffer a Snag on any checks or contested imposed upon them by other characters. If the Hunted character becomes unable to fight due to loss of consciousness or death, the Hunted status can be assigned to any other Player Character adjacent to any Wulfolk.</p>",
                "allegiance": 0,
                "bound_passive": false,
                "type": "Basic",
                "magic": false
            },
            {
                "id": "ab-tbillek579b",
                "name": "BLOOD CURDLING HOWL",
                "description": "<p>Force all enemies in the same combat zone to make a <strong>Grit Check</strong>:</p><p><strong>On Failure:</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Player becomes <strong>Terrified</strong> for one round</li></ol>",
                "allegiance": 0,
                "bound_passive": false,
                "type": "Basic",
                "magic": false
            }
        ],
        "facts": {
            "habitat": {
                "description": "Wulfolk are native to forested areas, and prefer to live there in packs. However, Lone Wulfolk hunters often find homes in cities where they can put their bounty hunting skills to use for coin."
            },
            "communication": {
                "description": "Wulfolk communicate with each other via barks and snarls in a language that is largely unintelligible to non-canines. They also leave messages via pheromone marking that can be read by other canines for weeks."
            },
            "tactics": {
                "description": "In packs, Wulfolk will corral and harry their prey. They are opportunists rather than brutes, and will attempt to use numbers to subdue one target. Lone Wulfolk will use stealth and subterfuge to get the upper hand on a target they have been stalking"
            },
            "indicators": {
                "description": "Howling in the distance, glowing eyes in the dark, snapping and snarling and panting"
            },
            "role-playing-notes": {
                "description": "Wulfolk are more reserved than Mundymutts, but much more intense. They are not known to have a sense of humor or good manners, and are much less likely to bond with characters outside of their immediate pack."
            },
            "customization": {
                "description": "If you need a stronger solo encounter, bump up the rank and use this as a stronger Boss character"
            }
        },
        "moods": [
            {
                "rolls": {
                    "start": "1",
                    "stop": "5"
                },
                "mood": "Unthreatened",
                "mood_text": "The Wulfolk is aware of your presence, but is more interested in cooking its prey over a campfire"
            },
            {
                "rolls": {
                    "start": "6",
                    "stop": "14"
                },
                "mood": "Wary",
                "mood_text": "This Wulfolk is carefully observing you, though not making any sudden moves"
            },
            {
                "rolls": {
                    "start": "15",
                    "stop": "20"
                },
                "mood": "Hunting",
                "mood_text": "The Wulfolk is circling you, snarling with teeth bared, looking for an opportunity to strike"
            }
        ],
        "max_speed": "veryfast",
        "aptitudes": {
            "might": 8,
            "deftness": 9,
            "grit": 7,
            "insight": 9,
            "aura": 6
        }
    },
    "EXTRASOLAR": {
        "name": "EXTRASOLAR",
        "menace": "megaboss",
        "rank": "7",
        "description": "<p>Shards of the shattered sun machine, animated by highly volatile motes of Bright mana, these so-called Extrasolar are angelic in their appearance and stoic defenders of the Light. Their forms burn brilliantly, being to blindingly radiant for most people to look directly at, which makes them incredibly difficult to describe. Most who have witnessed them described them as humanoid-shaped, with wings that look like glowing shattered glass and halos of slowly-orbiting crystals. They abhor the Darkness, and seek out creatures of the Dark with a fury that is unmatched.</p>",
        "size": "large",
        "hearts": 5,
        "atkbonus": 5,
        "bright_points": 6,
        "dark_points": 0,
        "defense": 11,
        "speed": "average",
        "creature_type": "celestial",
        "creature_subtype": "Shardbound",
        "tags": [],
        "primary_aptitudes": [
            "might",
            "aura",
            "deftness"
        ],
        "inventory": [
            {
                "id": "inv-5kk02i2kkb6",
                "name": "BRIGHT INFUSED DUST",
                "category": "Yield",
                "type": "Curiosity",
                "subtype": "Byproduct",
                "description": "<p>A slain Extrasolar loses its cohesion and form, its crystalline body reducing itself to fine, glowing sand. This sand retains a small amount of latent warmth and exudes a dim light, which grows in luminosity as it nears a shard of the Sun Machine.</p>",
                "slots": ".5",
                "magic": true,
                "denomination": "coins",
                "value": "70",
                "defense": null,
                "atkbonus": null,
                "speed": null,
                "max_speed": null,
                "allegiance": 0
            },
            {
                "id": "inv-zuyvp0xd6tg",
                "name": "SERAPHIC BLADE",
                "category": "Equipment",
                "type": "Weapon",
                "subtype": "Standard Weapon",
                "description": "<p>This weapon does an extra Heart of damage to <strong>Dark</strong> Aligned creatures.</p><p><br></p><p>In the hands of creatures that are not <strong>Bright</strong> Aligned, the blade becomes dull, inert and harmless.</p>",
                "slots": "2",
                "magic": true,
                "denomination": "gems",
                "value": "1",
                "defense": null,
                "atkbonus": 3,
                "speed": null,
                "max_speed": null,
                "allegiance": 1
            }
        ],
        "passives": [
            {
                "id": "tr-7qnpev3poby",
                "name": "Might of the Sun",
                "type": "trait",
                "modifier": "might",
                "value": 2
            },
            {
                "id": "tr-tree1eslatr",
                "name": "Commanding Aura",
                "type": "trait",
                "modifier": "aura",
                "value": 2
            },
            {
                "id": "tr-15c1057auh3",
                "name": "Crystalline Structure",
                "type": "trait",
                "modifier": "grit",
                "value": -1
            },
            {
                "id": "tr-bevrwnn7ge4",
                "name": "Single-Minded",
                "type": "trait",
                "modifier": "insight",
                "value": -1
            },
            {
                "id": "ab-passive-56wewoabzi3",
                "name": "HERCULEAN",
                "modifiers": {
                    "size": "large"
                },
                "type": "ability"
            },
            {
                "id": "ab-passive-nke0i7w5us",
                "name": "TENSILE SKIN",
                "modifiers": {
                    "defense": 2
                },
                "type": "ability"
            }
        ],
        "abilities": [
            {
                "id": "ab-zs3phdzz6j",
                "name": "RADIANCE",
                "description": "<p>At the start of their turn, any <strong>Non-Bright</strong> aligned Player in the same combat area as an Extrasolar must succeed an Aura Check or become <strong>Blinded</strong></p>",
                "allegiance": 1,
                "bound_passive": false,
                "type": "Advanced",
                "magic": true
            },
            {
                "id": "ab-ul93khgtzlm",
                "name": "BLAZING MARCH",
                "description": "<p>The combat zone occupied by the Extrasolar is set alight by its radiance, turning the immediate area into a Burning Hazard. Characters without proper protection from Burning will take 1 Fire Damage every turn. The hazard remains in that combat zone for as long as the Extrasolar remains in the combat zone</p>",
                "allegiance": 1,
                "bound_passive": false,
                "type": "Advanced",
                "magic": true
            },
            {
                "id": "ab-d6nnwu7erzs",
                "name": "SUNBURST",
                "description": "<p>Upon taking a Heart of Damage, all Players in the same combat area must make a <strong>Deftness Check:</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>On failure - Take 1 Heart of Damage</li></ol><p><br></p><p>This ability is negated if the Damage dealt to the Extrasolar is Dark Damage.</p>",
                "allegiance": 0,
                "bound_passive": false,
                "type": "Legendary",
                "magic": false
            },
            {
                "id": "ab-c9l0cmu95x",
                "name": "HERCULEAN",
                "description": "<p>The Extrasolar is <strong>Large</strong></p>",
                "allegiance": 0,
                "bound_passive": true,
                "type": "Basic",
                "magic": false
            },
            {
                "id": "ab-gt27n002f07",
                "name": "TENSILE SKIN",
                "description": "<p>The Extrasolar's crystalline skin is impregnable to all but the surest strikes. <strong>+2 Defense Rating.</strong></p>",
                "allegiance": 0,
                "bound_passive": true,
                "type": "Advanced",
                "magic": false
            }
        ],
        "facts": {
            "habitat": {
                "description": "Extrasolar generally coalesce around small, isolated Shards of the Sunmachine, and jealously guard its periphery.  They are permissive of visitors and worshippers of these shards, but they maintain authority over them."
            },
            "communication": {
                "description": "Between Extrasolars, they communicate with crystalline tinkles in barely audible frequencies. They are capable of speech across many different languages, but are almost always of few words."
            },
            "tactics": {
                "description": "Extrasolar will work together insofar as they need to guard their Shard. They are reticent to be led too far from it, and they are almost magnetically drawn back to it if there is an attempt to kite them away."
            },
            "indicators": {
                "description": "A moving glow in the distant darkness, a sudden luminosity in the periphery of a Sun Shard."
            },
            "role-playing-notes": {
                "description": "Extrasolar found in the wild will likely have seen their old Shard destroyed and be questing for a new Shard. They will work with anyone who help get them closer to a new Shard, and zealously endeavor to smite anyone they see as Dark aligned."
            },
            "customization": {
                "description": "Changing around some descriptive text can turn an Extrasolar into a powerful Fire elemental or a more generic Seraphim-like angelic enemy."
            }
        },
        "moods": [
            {
                "rolls": {
                    "start": "1",
                    "stop": "5"
                },
                "mood": "Perimeter Secured",
                "mood_text": "The area around the Sun Shard is secure, and the Extrasolar is calmly watching over it"
            },
            {
                "rolls": {
                    "start": "6",
                    "stop": "14"
                },
                "mood": "Unthreatened but Watchful",
                "mood_text": "The Extrasolar is aware of your presence and watching, but feels no immediate threat to the Sun Shard"
            },
            {
                "rolls": {
                    "start": "15",
                    "stop": "20"
                },
                "mood": "Threat Identified",
                "mood_text": "The Extrasolar has identified you as a threat to the Sun Shard and is preparing to eliminate you"
            }
        ],
        "max_speed": "veryfast",
        "aptitudes": {
            "might": 14,
            "deftness": 11,
            "grit": 9,
            "insight": 9,
            "aura": 13
        },
        "allegiance": "bright"
    }
}