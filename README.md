# break-_adversary_creator

This is a personal project im working on to create a web-app capable of creating a break adversary card that can be customized, exported and printed for use physically or as a card on a VTT.
Someday, it would be really cool to be able to export for a VTT importer.
This will also be my submission for a code bootcamp personal project.

*1/03/26* - **1.0 Release Highlights**
- Restructured the UI Refresh so that Save/Load Adversary now works properly
- Added feedback through Toast Messages for all sorts of user actions
- Added Modal Confirm windows to Delete Actions
- Added a Help Button with version info and basic instructions
- Changed display of Traits, Items and Abilitys to make better use of their containers and have a much cleaner display when there are many abilities with a lot of text
- Implemented Quill editors as a WYSIWYG rich text editor for Adversary Description and Item/Ability descriptions
- Bound speed and size to abilities - they are no longer individually editable (per Adversary creation rules)
- Changed layout of certain sections
- Added a "Create New Adversary" button to cut down on accidentally overwriting a Saved Adversary
- Added a Delete function for removing saved Adversaries

**Known Issues**
- Currently attributes, descriptions, adversary info, and quick facts all save ONLY after manually saving an adversary. However, Gear, ability and Trait removals automatically save without manually saving the Adversary. This is a bit confusing and can lead to difficulties reverting changes that you didn't intend to make. 1.1 should have a fix for this. For now, take care when you delete abilities, traits or items.


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
