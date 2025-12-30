# break-_adversary_creator

This is a personal project im working on to create a web-app capable of creating a break adversary card that can be customized, exported and printed for use physically or as a card on a VTT.
Someday, it would be really cool to be able to export for a VTT importer.
This will also be my submission for a code bootcamp personal project.

*12/29/2025* - **I think we're about ready for a beta release. Features of this release is as follows:**
- Autocalculation of Aptitudes and combat values based on traits, ability passives, gear, size and rank
- Logging of a creature's allegiance, descriptors, facts and mood table values
- Import and Export functionality through JSON import files (A template will be provided later)

As it stands, this does not store adversaries in a cookie or locally so you will need to export and import your adversaries every time you open up the page. That is a longer term goal for the project.

**Plans for Full Release**
- Upload images into local storage
- Cookie-ify adversary data
- Support raw text exports and a print friendly export
- Better text editing support for large text fields such as abilities and gear
- Create a data model for contests and skill checks that can be inserted into skills
- A better interface for removing skills, gear, traits and loot
- Visual enhancements to make the interface a little less cluttered when you have very large ability cards

**Far future plans and beyond**
- Exports for Adversary import into Foundry VTT (when such imports become supported)

**Adversary Template**
If you want to make your own tool or find it just easier to write down a bunch of stuff, here's what your template will need to look like

Please note, the front end validation will do its best to reconcile any information that may cause aptitude math specifically to be off kilter. So if you're trying to do something really wacky, it probably wont work properly.

```
{
  "New Adversary": {
    "name": "New Adversary",
    "menace": "",
    "rank": 1,
    "size": "medium",
    "hearts": 1,
    "atkbonus": 1,
    "bright_points": 0,
    "dark_points": 0,
    "defense": 10,
    "speed": "average",
    "creature_type": "monster",
    "creature_subtype": "Abberant",
    "primary_aptitudes": [],
    "gear": [],
    "description": null,
    "passives": [],
    "abilities": [],
    "facts": {
      "habitat": {
        "description": ""
      },
      "communication": {
        "description": ""
      },
      "tactics": {
        "description": ""
      },
      "indicators": {
        "description": ""
      },
      "role-playing-notes": {
        "description": ""
      },
      "customization": {
        "description": ""
      }
    },
    "loot": [],
    "moods": [
      {
        "rolls": {
          "start": 1,
          "stop": 5
        },
        "mood": "Friendly/Benign",
        "mood_text": "This creature seems to have a favorable disposition to you"
      },
      {
        "rolls": {
          "start": 6,
          "stop": 14
        },
        "mood": "Indifferent/Wary",
        "mood_text": "This creature is not immediately interested in harming you, but is watchful"
      },
      {
        "rolls": {
          "start": 15,
          "stop": 20
        },
        "mood": "Hostile/Bloodthirsty",
        "mood_text": "This creature is angry or aggressive. Prepare for combat"
      }
    ],
    "max_speed": "veryfast",
    "aptitudes": {
      "might": 7,
      "deftness": 7,
      "grit": 7,
      "insight": 7,
      "aura": 7
    }
  },
  "NEW ADVERSARY 2": {
    "name": "NEW ADVERSARY 2",
    "menace": "boss",
    "rank": "3",
    "size": "medium",
    "hearts": 3,
    "atkbonus": 2,
    "bright_points": 0,
    "dark_points": 0,
    "defense": 10,
    "speed": "average",
    "creature_type": "monster",
    "creature_subtype": "Abberant",
    "primary_aptitudes": [],
    "gear": [],
    "description": null,
    "passives": [],
    "abilities": [],
    "facts": {
      "habitat": {
        "description": ""
      },
      "communication": {
        "description": ""
      },
      "tactics": {
        "description": ""
      },
      "indicators": {
        "description": ""
      },
      "role-playing-notes": {
        "description": ""
      },
      "customization": {
        "description": ""
      }
    },
    "loot": [],
    "moods": [
      {
        "rolls": {
          "start": 1,
          "stop": 5
        },
        "mood": "Friendly/Benign",
        "mood_text": "This creature seems to have a favorable disposition to you"
      },
      {
        "rolls": {
          "start": 6,
          "stop": 14
        },
        "mood": "Indifferent/Wary",
        "mood_text": "This creature is not immediately interested in harming you, but is watchful"
      },
      {
        "rolls": {
          "start": 15,
          "stop": 20
        },
        "mood": "Hostile/Bloodthirsty",
        "mood_text": "This creature is angry or aggressive. Prepare for combat"
      }
    ],
    "max_speed": "veryfast",
    "aptitudes": {
      "might": 8,
      "deftness": 8,
      "grit": 8,
      "insight": 8,
      "aura": 8
    }
  }
}
```