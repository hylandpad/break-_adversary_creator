const app_version_number = 1.5
const max_tags = 5
const help_text = `
    
<br />
<p><strong>Update Notes:</strong></p>
<hr class="faded-hr" />
<div class="text-sm">        
  <ul>
    <li><strong>Markdown Exports</strong> - You can now export all your saved adversaries in a markdown format. In the future, I will enhance this to export one or several selected adversaries, but for now, the entire list gets converted. Go post your cool adversaries on the Break!! Discord!</li>            
    <li>Ability and Inventory Text descriptions now include support for formatted checks and challenges from the editor toolbar. Simply use the "Check" or "VS" button on the toolbar to create a new check or challenge.</li>
    <li><strong>Ability and Items now support editing functionality.</strong>  Click on the name of an ability or item in the loadout list to open the edit modal for that ability or item.</li>            
    <li>Damage Types - In the editor, highlight some text and select from the DMG Type dropdown to color-code and automatically include some text to help draw attention to the Damage Type.</li>
    <li>Massive Size automatically adds an ability for Sweep and Focus attacks. Removal of Massive Size removes these abilities automatically</li>
    <li><strong>Adversaries now save to browser local storage automagically</strong>. No more exporting and reimporting necessary</li>
    <li>Allegiance locked to magical items and abilities to be more in line with Core rules</li>
    <li>Adversaries can now be assigned up to 5 tags. Choose from some predefined options or make your own</li>
    <li>Adversary load bar reworked and now includes filtering using tags</li>
    <li>Numerous QOL improvements for better usability and readability</li>
    <li>Tons of visual modifications</li>
    <li>Bug squashes</li>
  </ul>
  <br />
</div>
<p><em>Next Major Update</em>: The 2.0 <strong>Colossal</strong> Update</p>
<div class="text-sm"><em>Including...</em>
  <ul>
    <li>Full Colossal Monster support, including dynamic monster part creation</li>
    <li>And more...hopefully.</li>
  </ul>
</div>
<br />
<p class="font-bold">Please report bugs or request features on the <a class="underline text-blue-700" href="https://github.com/hylandpad/break-_adversary_creator/issues" target="_blank">Project Github</a></p>
`
var example_adversaries = {
  "EXTRASOLAR": {
    "name": "EXTRASOLAR",
    "menace": "megaboss",
    "rank": "7",
    "description": "<p>Shards of the shattered sun machine, animated by highly volatile motes of Bright mana, these so-called Extrasolar are angelic in their appearance and stoic defenders of the Light. Their forms burn brilliantly, being to blindingly radiant for most people to look directly at, which makes them incredibly difficult to describe. Most who have witnessed them described them as humanoid-shaped, with wings that look like glowing shattered glass and halos of slowly-orbiting crystals. They abhor the Darkness, and seek out creatures of the Dark with a fury that is unmatched.</p>",
    "size": "large",
    "hearts": 7,
    "atkbonus": 5,
    "bright_points": 7,
    "dark_points": 0,
    "defense": 11,
    "speed": "average",
    "creature_type": "celestial",
    "creature_subtype": "Shardbound",
    "tags": [
      "Bright",
      "Wistful dark",
      "Example"
    ],
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
        "quantity": 2,
        "defense": null,
        "atkbonus": null,
        "speed": null,
        "max_speed": null,
        "allegiance": 0
      },
      {
        "id": "inv-7g6ylvejhgg",
        "name": "SERAPHIC BLADE",
        "category": "Equipment",
        "type": "Weapon",
        "subtype": "Standard Weapon",
        "description": "<p>This weapon does an extra Heart of damage to <span data-amount=\"Aligned\" data-dmg-type=\"dark\" class=\"damage-type-blot\" contenteditable=\"false\"><span contenteditable=\"false\"><span class=\"dmg-name\"> dark </span><span class=\"dmg-val dark\">Aligned</span></span></span> creatures.</p><p><br></p><p>In the hands of creatures that are not <span data-amount=\"Aligned\" data-dmg-type=\"bright\" class=\"damage-type-blot\" contenteditable=\"false\"><span contenteditable=\"false\"><span class=\"dmg-name\"> bright </span><span class=\"dmg-val bright\">Aligned</span></span></span>, the blade becomes dull, inert and harmless.</p>",
        "slots": 2,
        "magic": true,
        "quantity": 1,
        "denomination": "gems",
        "value": 1,
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
        "name": "MIGHT OF THE SUN",
        "type": "trait",
        "modifier": "might",
        "value": 2
      },
      {
        "id": "tr-tree1eslatr",
        "name": "COMMANDING AURA",
        "type": "trait",
        "modifier": "aura",
        "value": 2
      },
      {
        "id": "tr-15c1057auh3",
        "name": "CRYSTALLINE STRUCTURE",
        "type": "trait",
        "modifier": "grit",
        "value": -1
      },
      {
        "id": "tr-bevrwnn7ge4",
        "name": "SINGLE-MINDED",
        "type": "trait",
        "modifier": "insight",
        "value": -1
      },
      {
        "id": "ab-passive-nke0i7w5us",
        "name": "TENSILE SKIN",
        "modifiers": {
          "defense": 2
        },
        "type": "ability"
      },
      {
        "id": "ab-passive-f34n1gpxp6l",
        "name": "HERCULEAN",
        "modifiers": {
          "hearts": 2,
          "size": "large"
        },
        "type": "ability"
      }
    ],
    "abilities": [
      {
        "id": "ab-gt27n002f07",
        "name": "TENSILE SKIN",
        "description": "<p>The Extrasolar's crystalline skin is impregnable to all but the surest strikes. <strong>+2 Defense Rating.</strong></p>",
        "allegiance": 0,
        "bound_passive": true,
        "type": "Advanced",
        "magic": false
      },
      {
        "id": "ab-rn4xb58j0gh",
        "name": "SUNBURST",
        "description": "<p>Upon the Extrasolar taking a Heart of Damage, all Players in the same combat area must make a <strong>Check</strong>:</p><p><br></p><p><br></p><p><div data-your-attr=\"Grit\" data-their-attr=\"Grit\" data-pass=\"No Effect\" data-fail=\"You are Blinded for the remainder of the combat round\" data-contest=\"false\" class=\"skill-action-blot\" contenteditable=\"false\"><span contenteditable=\"false\"><span contenteditable=\"false\"><span contenteditable=\"false\"><span contenteditable=\"false\">\n        <div class=\"blot-container\"><div class=\"blot-header\"><span class=\"action-label\">CHECK</span><span class=\"editable-field attr-chip attr-grit\" data-field=\"yourAttr\" contenteditable=\"true\">Grit</span></div><div class=\"blot-body\"><div class=\"res-row res-pass\"><span class=\"res-label\">Pass:</span><span class=\"editable-field res-text\" data-field=\"pass\" contenteditable=\"true\">No Effect</span></div><div class=\"res-row res-fail\"><span class=\"res-label\">Fail:</span><span class=\"editable-field res-text\" data-field=\"fail\" contenteditable=\"true\">You are Disoriented for the remainder of the combat round</span></div></div></div></span></span></span></span></div></p><p><br></p><p>This ability is negated if the Damage dealt to the Extrasolar is <span data-amount=\"Damage\" data-dmg-type=\"dark\" class=\"damage-type-blot\" contenteditable=\"false\"><span contenteditable=\"false\"><span contenteditable=\"false\"><span contenteditable=\"false\"><span contenteditable=\"false\"><span class=\"dmg-name\"> dark </span><span class=\"dmg-val dark\">Damage</span></span></span></span></span></span></p>",
        "allegiance": 1,
        "bound_passive": false,
        "type": "Legendary",
        "magic": true
      },
      {
        "id": "ab-p46xr46vi9n",
        "name": "BLAZING MARCH",
        "description": "<p>The combat zone occupied by the Extrasolar is set alight by its radiance, turning the immediate area into a Burning Hazard. Characters without proper protection from Burning will take <span data-amount=\"1\" data-dmg-type=\"burn\" class=\"damage-type-blot\" contenteditable=\"false\"><span contenteditable=\"false\"><span class=\"dmg-name\"> burn </span><span class=\"dmg-val burn\">1</span></span></span> every turn. The hazard remains in that combat zone for as long as the Extrasolar remains in the combat zone.</p>",
        "allegiance": 1,
        "bound_passive": false,
        "type": "Advanced",
        "magic": true
      },
      {
        "id": "ab-2xzdhkmovgo",
        "name": "HERCULEAN",
        "description": "<p>The Extrasolar is <strong>Large </strong>and has <strong>+2 Maximum Hearts</strong></p>",
        "allegiance": 0,
        "bound_passive": true,
        "type": "Basic",
        "magic": false
      },
      {
        "id": "ab-pr4l5y1yfo",
        "name": "RADIANCE",
        "description": "<p>At the start of their turn, any <strong>Non </strong><span data-amount=\"Aligned\" data-dmg-type=\"bright\" class=\"damage-type-blot\" contenteditable=\"false\"><span contenteditable=\"false\"><span class=\"dmg-name\"> bright </span><span class=\"dmg-val bright\">Aligned</span></span></span> Player in the same combat area as an Extrasolar must make a <strong>Check</strong>.</p><p><br></p><p><div data-your-attr=\"Aura\" data-their-attr=\"Grit\" data-pass=\"No effect\" data-fail=\"Become Blinded for the remainder of your turn\" data-contest=\"false\" class=\"skill-action-blot\" contenteditable=\"false\"><span contenteditable=\"false\"><span contenteditable=\"false\">\n        <div class=\"blot-container\"><div class=\"blot-header\"><span class=\"action-label\">CHECK</span><span class=\"editable-field attr-chip attr-aura\" data-field=\"yourAttr\" contenteditable=\"true\">Aura</span></div><div class=\"blot-body\"><div class=\"res-row res-pass\"><span class=\"res-label\">Pass:</span><span class=\"editable-field res-text\" data-field=\"pass\" contenteditable=\"true\">No effect</span></div><div class=\"res-row res-fail\"><span class=\"res-label\">Fail:</span><span class=\"editable-field res-text\" data-field=\"fail\" contenteditable=\"true\">Become Blinded for the remainder of your turn</span></div></div></div></span></span></div></p><p><br></p><p><br></p>",
        "allegiance": 1,
        "bound_passive": false,
        "type": "Advanced",
        "magic": true
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
          "start": 1,
          "stop": 5
        },
        "mood": "Perimeter Secured",
        "mood_text": "The area around the Sun Shard is secure, and the Extrasolar is calmly watching over it"
      },
      {
        "rolls": {
          "start": 6,
          "stop": 14
        },
        "mood": "Unthreatened but Watchful",
        "mood_text": "The Extrasolar is aware of your presence and watching, but feels no immediate threat to the Sun Shard"
      },
      {
        "rolls": {
          "start": 15,
          "stop": 20
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
    "tags": [
      "Canine",
      "Pack hunter",
      "Example"
    ],
    "primary_aptitudes": [
      "deftness",
      "insight",
      "might"
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
        "quantity": 1,
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
        "quantity": 1,
        "defense": null,
        "atkbonus": null,
        "speed": null,
        "max_speed": null,
        "allegiance": 0
      },
      {
        "id": "inv-qrch8jt7x1s",
        "name": "RAZOR TOOTH",
        "category": "Yield",
        "type": "Reagent",
        "subtype": "Bone",
        "description": "<p>An adult  Wulfolk's canines are worth quite a bit on the black market. They are not easily acquired by outsiders. They make for excellent bone knives or tools once refined and sharpened, and keep an edge better than most other bone weaponry.</p>",
        "slots": 0.5,
        "magic": false,
        "quantity": 2,
        "denomination": "coins",
        "value": 20,
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
        "name": "KEEN NOSE",
        "type": "trait",
        "modifier": "insight",
        "value": 1
      },
      {
        "id": "tr-vpd2v9r67x8",
        "name": "LITHE",
        "type": "trait",
        "modifier": "deftness",
        "value": 1
      },
      {
        "id": "tr-08iqlbe0asbr",
        "name": "SAVAGE DEMEANOR",
        "type": "trait",
        "modifier": "aura",
        "value": -1
      },
      {
        "id": "ab-passive-9bdwimrw5g",
        "name": "WOODSPEED",
        "modifiers": {
          "speed": "fast"
        },
        "type": "ability"
      }
    ],
    "abilities": [
      {
        "id": "ab-vibfoj5hul",
        "name": "BLOOD CURDLING HOWL",
        "description": "<p>Target one enemy up to one Combat Zone away. Make a <strong>Contest</strong> against that target:</p><p><br></p><p><br></p><p><div data-your-attr=\"Aura\" data-their-attr=\"Insight\" data-pass=\"The target is Terrified until the end of the round\" data-fail=\"The target suffers no effect\" data-contest=\"true\" class=\"skill-action-blot\" contenteditable=\"false\"><span contenteditable=\"false\">\n        <div class=\"blot-container\"><div class=\"blot-header\"><span class=\"action-label\">CONTEST</span><span class=\"editable-field attr-chip attr-aura\" data-field=\"yourAttr\" contenteditable=\"true\">Aura</span><span class=\"vs-label\">vs</span><span class=\"editable-field attr-chip attr-insight\" data-field=\"theirAttr\" contenteditable=\"true\">Insight</span></div><div class=\"blot-body\"><div class=\"res-row res-pass\"><span class=\"res-label\">Pass:</span><span class=\"editable-field res-text\" data-field=\"pass\" contenteditable=\"true\">The target is Terrified until the end of the round</span></div><div class=\"res-row res-fail\"><span class=\"res-label\">Fail:</span><span class=\"editable-field res-text\" data-field=\"fail\" contenteditable=\"true\">The target suffers no effect</span></div></div></div></span></div></p><p><br></p><p>This ability suffers a <strong>Snag</strong> if a Target has already been Terrified from<strong> Blood Curdling Howl</strong> this combat.</p>",
        "allegiance": 0,
        "bound_passive": false,
        "type": "Basic",
        "magic": false
      },
      {
        "id": "ab-r8lo4wlp6m7",
        "name": "HUNTED",
        "description": "<p>At the start of Combat, choose one player character. This player character becomes <strong>Hunted</strong> as the Wulfolk enter a state of extreme concentration and focus. All Wulfolk adversaries gain an <strong>Edge</strong> against any checks or contests imposed on them by that character, and an <strong>Edge</strong> on all checked targeting that character. However, they suffer a <strong>Snag</strong> on any checks or contests imposed upon them by other characters. If the Hunted character becomes unable to fight due to loss of consciousness or death, the Hunted status can be assigned to any other Player Character adjacent to any Wulfolk.</p>",
        "allegiance": 0,
        "bound_passive": false,
        "type": "Basic",
        "magic": false
      },
      {
        "id": "ab-xr362mik8t",
        "name": "WOODSPEED",
        "description": "<blockquote><em>It was probably just the wind.</em></blockquote><p><br></p><p>The Wulfolk's base speed is <strong>Fast</strong></p>",
        "allegiance": 0,
        "bound_passive": true,
        "type": "Basic",
        "magic": false
      }
    ],
    "facts": {
      "habitat": {
        "description": "Wulfolk are native to forested areas, and prefer to live there in packs. However, Lone Wulfolk hunters often find homes in cities where they can put their skills to use for coin aiding local law enforcement or acting as bodyguards for powerful individuals."
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
          "start": 1,
          "stop": 5
        },
        "mood": "Unthreatened",
        "mood_text": "The Wulfolk is aware of your presence, but is more interested in cooking its prey over a campfire"
      },
      {
        "rolls": {
          "start": 6,
          "stop": 14
        },
        "mood": "Wary",
        "mood_text": "This Wulfolk is carefully observing you, though not making any sudden moves"
      },
      {
        "rolls": {
          "start": 15,
          "stop": 20
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
    },
    "allegiance": "unaligned"
  },
  "JELLY MONSTER": {
    "name": "JELLY MONSTER",
    "menace": "mook",
    "rank": "0",
    "description": "<p>Jelly Monsters, or Jellies, are caustic amoebas that are largely harmless on their own. However, they can meld themselves together to create massive unicellular organisms that can take up entire corridors in deep, dark dungeons. Do not underestimate Jelly Monsters. If an infestation is left untreated, it grows - literally.</p>",
    "size": "small",
    "hearts": 1,
    "atkbonus": 0,
    "bright_points": 0,
    "dark_points": 0,
    "defense": 11,
    "speed": "average",
    "creature_type": "monster",
    "creature_subtype": "Abberation",
    "tags": [
      "Caves",
      "Example"
    ],
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
        "quantity": 3,
        "defense": null,
        "atkbonus": null,
        "speed": null,
        "max_speed": null,
        "allegiance": 0
      },
      {
        "id": "inv-w7n62rx61aj",
        "name": "HALF DISSOLVED REMAINS",
        "category": "Item",
        "type": "Reagent",
        "subtype": "Bones",
        "description": "<p>The still-slimy, partially dissolved bones of a small creature consumed by the Jelly Monster.  No organic material remains. Usable only as the crudest components for primitive tools or weapons.</p>",
        "slots": 1,
        "magic": false,
        "quantity": 1,
        "denomination": "stones",
        "value": 50,
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
        "name": "RESILIENT",
        "type": "trait",
        "modifier": "grit",
        "value": 2
      },
      {
        "id": "tr-a76sm3t58tw",
        "name": "PRIMITIVE",
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
        "id": "ab-ky1qgq1nw7k",
        "name": "STUNNING PSEUDOPOD",
        "description": "<p>The Jelly Monster only has one weapon - a prehensile pseudopod that it can shoot out with great force and precision - especially impressive for a creature lacking any discernible sensory organs.</p><p><br></p><p><strong>On hit: </strong></p><p><div data-your-attr=\"Deftness\" data-their-attr=\"Grit\" data-pass=\"Take 1 Damage\" data-fail=\"Take 1 Damage and become Disoriented for one round\" data-contest=\"false\" class=\"skill-action-blot\" contenteditable=\"false\"><span contenteditable=\"false\">\n        <div class=\"blot-container\"><div class=\"blot-header\"><span class=\"action-label\">CHECK</span><span class=\"editable-field attr-chip attr-deftness\" data-field=\"yourAttr\" contenteditable=\"true\">Deftness</span></div><div class=\"blot-body\"><div class=\"res-row res-pass\"><span class=\"res-label\">Pass:</span><span class=\"editable-field res-text\" data-field=\"pass\" contenteditable=\"true\">Take 1 Damage</span></div><div class=\"res-row res-fail\"><span class=\"res-label\">Fail:</span><span class=\"editable-field res-text\" data-field=\"fail\" contenteditable=\"true\">Take 1 Damage and become Disoriented for one round</span></div></div></div></span></div></p><p><br></p>",
        "allegiance": 0,
        "bound_passive": false,
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
  }
}