class Adversary {

    constructor(data) {
        Object.assign(this, data);
        this.size = data.size || "Medium";
        this.max_speed = data.max_speed || 'veryfast';
    }


    //Custom Methods Section
    
    // **Adds - push new objects into Adversary arrays**

    // Add a trait to the passives primary
    _add_trait() {
        // create trait in adversary object
        const id = `tr-${generate_id()}`
        const name = document.getElementById('trait-name').value
        const value = parseInt(document.getElementById('trait-value').value)
        const modifier = document.getElementById('trait-modifier').value
        const type = 'trait'

        const createTrait = (id,name, value, modifier, type) => ({
            'id': id,
            'name': name,
            'type': type,
            'modifier': modifier,
            'value': value
        })
        this.passives.push(createTrait(id, name, value, modifier, type))
        this._calculate_aptitudes()
        update_ui(this)
    }

    // Add an ability to the abilities array
    _add_ability() {
        const id = `ab-${generate_id()}`
        const name = (document.getElementById('ability-name').value).toUpperCase() || 'UNNAMED ABILITY'
        const description = document.getElementById('ability-description').value
        const type = document.querySelector(`input[name='ability-type']:checked`).value
        const allegiance = parseInt(document.getElementById('ability-allegiance').value)
        const magic = document.getElementById('ability-magic').checked
        const passive_atkbonus = parseInt(document.getElementById('ability-atkbonus').value)
        const passive_defense = parseInt(document.getElementById('ability-defense').value)
        const passive_speed = document.getElementById('ability-base-speed-override').value
        const passive_hearts = parseInt(document.getElementById('ability-hearts').value)
        var bound_passive = false

        // first create a new ability
        const createAbility = (id, name, description, allegiance = 0, bound_passive, type = 'basic', magic = false) => ({
            'id': id,
            'name': name,
            'description': description,
            'allegiance': allegiance,
            'bound_passive': bound_passive,
            'type': type,
            'magic': magic
        });

        // adjust allegiance appropriately based on a positive or negative value
        if (allegiance > 0) {
            this.bright_points = this.bright_points + allegiance
        } else if (allegiance < 0) {
            this.dark_points = this.dark_points + Math.abs(allegiance)
        }

        // then create a new passive if this ability has any linked passives
        var passives = {}
        passive_atkbonus && (passives.atkbonus = passive_atkbonus)
        passive_defense && (passives.defense = passive_defense)
        passive_speed != '' && (passives.speed = passive_speed)
        passive_hearts && (passives.hearts = passive_hearts)

        if (Object.keys(passives).length > 0) {
            bound_passive = true
            const type = 'ability'
            const createPassive = (name, modifiers) => ({
                'name': name,
                'modifiers': modifiers,
                'type': type
            })
            this.passives.push(createPassive(name, passives, type))
        }
        // create & add new ability object to abilities array in adversary
        const new_ability = createAbility(id, name, description, allegiance, bound_passive, type, magic)
        this.abilities.push(new_ability)

        
        this._calculate_speed()
        this._adjust_allegiance()
        this._calculate_hearts()
        this._calculate_defense()
        this._calculate_atkbonus()
        update_ui(this)
    }

    // Add items to the inventory array
    _add_item() {
        const id = `it-${generate_id()}`;
        const name = (document.getElementById('gear-name').value).toUpperCase();
        const category = null
        const type = document.getElementById('gear-item-type').value;
        const subtype = document.getElementById('gear-item-subtype').value;
        const description = document.getElementById('gear-item-description').value;
        const denomination = document.querySelector(`input[name='gear-item-denomination']:checked`).value
        const value = document.getElementById('gear-item-value').value;
        const slots = document.getElementById('gear-item-slots').value
        // optional gear attributes that may affect combat stats
        const defense = document.getElementById('gear-item-defense').value ? document.getElementById('gear-item-defense').value : null
        const atkbonus = document.getElementById('gear-item-atkbonus').value ? document.getElementById('gear-item-atkbonus').value : null
        const speed = document.getElementById('gear-item-speed').value ? document.getElementById('gear-item-speed').value : null
        const max_speed = document.getElementById('gear-item-max-speed').value ? document.getElementById('gear-item-max-speed').value : null

        const createItem = (
            id,
            name,
            category,
            type,
            subtype,
            description,
            slots,
            denomination,
            value,
            defense,
            atkbonus,
            speed,
            max_speed) => ({

            'id': id,
            'name': name,
            'category' : category,
            'type' : type,
            'subtype' : subtype,
            'description' : description,
            'slots' : slots,
            'denomination' : denomination,
            'value' : value,
            'defense' : defense,
            'atkbonus' : atkbonus,
            'speed' : speed,
            'max_speed' : max_speed
        });


        this.inventory.push(createItem(id,name,category,type,subtype,description,slots,denomination,value,defense,atkbonus,speed,max_speed))
        this._adjust_gear()
    }

    // **Adjusts - make changes to existing data and manipulate the DOM to reflect UI changes

    // Change allegiance by manipulating Bright and Dark point values
    _adjust_allegiance() {
        const bright_points = parseInt(this.bright_points)
        const dark_points = parseInt(this.dark_points)

        // determine is bright/dark points exceeds one or the other by 2 or more
        function exceedsByX(A, B, X) {
            return A - B >= X;
        }

        if (bright_points <= 1 && dark_points <= 1) {
            this.allegiance = 'unaligned'
        } else if (exceedsByX(bright_points, dark_points, 2)) {
            this.allegiance = 'bright'
        } else if (exceedsByX(dark_points, this.bright_points, 2)) {
            this.allegiance = 'dark'
        } else {
            this.allegiance = 'twilight'
        }
        update_ui(this)
    }

    // Change the menace tier with limited mook automation
    _adjust_menace() {
        this.menace = document.getElementById('menace').value
        menace_color(document.getElementById('menace').value)
        update_ui(this)
    }

    // Change value of adversary name
    _adjust_name() {
        this.name = document.getElementById('adversary-name').value.toUpperCase()
        document.getElementById('adversary-name').value = this.name
        current_adversary_card()
    }

    // Manipulate the Type and Subtype
    _adjust_type_subtype() {
        this.creature_type = document.getElementById('adversary-type').value
        this.creature_subtype = document.getElementById('adversary-subtype').value
        current_adversary_card()
        update_ui(this)
    }

    // Make changes to adversary description
    _adjust_description() {
        this.description = document.getElementById('adversary-description').value
    }

    // Adjust primary attributes. 
    // **This is technically an addition since the attributes are added and removed from an array

    _adjust_primary_aptitudes(attr = None) {
        //add passed argument to the primary attributes array on the adversary object
        if (document.getElementById(`${attr}-primary`).checked) {
            this.primary_aptitudes.push(attr)
        } else {
            const i = this.primary_aptitudes.indexOf(attr)
            if (i > -1) {
                this.primary_aptitudes.splice(i, 1)
            }
        }
        this._calculate_aptitudes()
        this._adjust_size()
        update_ui(adversary)
    }

    // Adjust the adversary's rank
    _adjust_rank() {
        const rankElement = document.getElementById('rank')
        this.rank = rankElement.value
        this.hearts = rank_stats[this.rank][1]
        this.atkbonus = rank_stats[this.rank][0]
        // change menace based on rank
        if (parseInt(this.rank) < 1) {
            document.getElementById('menace').value = 'mook'
        } else if (this.menace == 'megaboss') {
            return
        } else if (parseInt(this.rank) >= 1) {
            document.getElementById('menace').value = 'boss'
        }
        this._adjust_menace()
        // recalculate all attributes
        this._calculate_aptitudes()
        this._adjust_size()
        this._calculate_atkbonus()
        current_adversary_card()
        update_ui(this)
    }

    // Change the Adversary's speed and calculate its max speed rating
    _calculate_speed() {
        const speeds = ['slow', 'average', 'fast', 'veryfast']
        this.speed = 'average'
        // set lowest base speed allowed by any abilities
        this.passives.forEach(this_passive => {
            if (this_passive.type != 'ability') {
                return
            } else if (this_passive.modifiers.speed) {
                this.speed = this_passive.modifiers.speed
            }
        })

        // set max speed based on item with the least permissable max speed
        const get_lowest_speed = () => {
            const gear_list = this.gear
            const speed_list = [...new Set(gear_list.map(item => item.max_speed))]
            return speed_list
        }

        if (get_lowest_speed().includes('slow')) {
            this.max_speed = 'slow'
        } else if (get_lowest_speed().includes('slow')) {
            this.max_speed = 'slow'
        } else if (get_lowest_speed().includes('average')) {
            this.max_speed = 'average'
        } else if (get_lowest_speed().includes('fast')) {
            this.max_speed = 'fast'
        } else {
            this.max_speed = 'veryfast'
        }

        this.inventory.forEach(item => {
            if (item.speed > 0 || item.speed < 0) {
                var current_speed = speeds.indexOf(this.speed)
                var new_speed = current_speed + item.speed
                if (new_speed > 3) {
                    new_speed = 3
                }
                else if (new_speed < 0) {
                    new_speed = 0
                }
            } else {
                return
            }
            this.speed = speeds[new_speed]
        })
        const adversary_speed_index = speeds.indexOf(this.speed)
        const adversary_max_speed_index = speeds.indexOf(this.max_speed)

        if (adversary_speed_index > adversary_max_speed_index) {
            this.speed = this.max_speed
        }
        this._calculate_defense()
    }

    // Adjust adversary size and manipulate aptitudes and other combat values based on the changes
    _adjust_size() {
        const sizeElement = document.getElementById('size')
        this.size = sizeElement.value.toLowerCase()
        //Get all current aptitude values
        // prior to doing any math at all, recalculate base aptitudes by running _calculate_aptitudes to set BACK to a baseline then do one of the following:
        this._calculate_aptitudes()
        let modified_aptitudes = { ...this.aptitudes }
        // for tiny add +3 defense rating, -1 might, +1 deft to baseline
        if (this.size == 'tiny') {
            modified_aptitudes.deftness++
            modified_aptitudes.might--

        }
        // for small, add +1 Deft, -1 Might + 1 Def to baseline based on rank
        else if (this.size == 'small') {
            modified_aptitudes.deftness++
            modified_aptitudes.might--

        }
        // for medium ensure baseline based on rank
        else if (this.size == 'medium') {
            this.defense = 10

        }
        // for large add +1 might, -defense to baseline based on rank
        else if (this.size == 'large') {
            modified_aptitudes.might++
            this.defense = 9

        }
        // for massive add +2 Might, -2 defense to baseline, add Massive Species abilities (Sweep Attack and Focus Attack)
        else if (this.size == 'massive') {
            modified_aptitudes.might = modified_aptitudes.might + 2
            this.defense = 9

        }
        // set new traits
        this.aptitudes = modified_aptitudes
        
        // After this, rerun _adjust_traits so that new traits are re-incorporated
        this._calculate_defense()
        current_adversary_card()
    }

    // Adjust fact text
    _adjust_facts(fact) {
        const fact_content = document.getElementById(fact).value
        this.facts[fact].description = fact_content
    }

    // Adjust mood table
    _adjust_mood_table() {
        const rows = document.querySelectorAll('#mood-table > tbody > tr')
        //clear out moods object and reindex info from table
        this.moods = []
        for (var row of rows) {
            var data = []

            row.querySelectorAll('input').forEach(input => data.push(input.value))
            const rolls = {
                start: data[0],
                stop: data[1]
            }
            
            const createMood = (rolls,mood,description) =>({
                'rolls': rolls,
                'mood' : mood,
                'description' : description

            })
            this.moods.push(createMood(rolls, data[2], data[3]))
        }
    }

    // Adjust gear
    _adjust_gear() {
        const gear_container = document.getElementById('inventory-container')
        gear_container.innerHTML = ''
        this.gear.forEach(item => {
            const gear_block = `
            <div id="${item.id}" class="gear-item bg-slate-600 rounded-md p-3 mr-4 mb-4 max-w-sm">
                <div class="text-white"><span class="font-bold">${item.name}</span> (<span
                        class="italic">${item.subtype}</span>)</div>
                <div class="gear-content bg-slate-200 p-1 rounded-md">
                    <div>
                        ${item.atkbonus > 0 ? `<img class="svg-icon" src="images/sword-fill-svgrepo-com.svg"></i><span>+${item.atkbonus}</span>` : ''}
                        ${item.defense > 0 ? `<i class="fa-solid fa-shield"></i><span>+${item.defense}</span>` : ''}
                        ${item.speed > 0 || item.speed < 0 ? `<i class="fa-solid fa-person-running"></i><span>${item.speed}</span>` : ''}
                        ${item.max_speed ? `<span class="font-bold">MAX </span><i class="fa-solid fa-person-running"></i><span>${item.max_speed}</span>` : ''}
                    </div>
                    ${item.description != 'None' ? `<div id=description" class="italic">${item.description}</div>` : ''}
                </div>
                <div class="text-stone-200 italic flex">
                    <div class="basis-xs">Slots : ${item.slots}</div>
                    <div class="basis-1/3 text-right">${item.value} ${item.denomination}</div>
                </div>
            </div>
            `
            gear_container.insertAdjacentHTML('beforeend', gear_block)
            const gear_div = document.getElementById(gear_id)
            gear_div.setAttribute('onclick', `adversary._remove_gear('${item.name}')`)
        })
        this._calculate_aptitudes()
        this._calculate_defense()
        this._calculate_atkbonus()
        this._calculate_speed()
        update_ui(this)
    }

    // Adjust loot
    _adjust_loot() {
        const loot_container = document.getElementById('loot-container')
        loot_container.innerHTML = ''
        this.loot.forEach(item => {
            const loot_id = `loot-${item.name}-${item.type}-${item.subtype}}`.replaceAll(" ","").toLowerCase()
            const loot_block = `
            <div id="${loot_id}" class="loot-item bg-teal-600 rounded-md p-3 mr-4 mb-4 max-w-sm">
                <div class="text-white"><span class="font-bold">${item.name}</span> (<span
                        class="italic">${item.subtype}</span>)</div>
                <div class="loot-content bg-slate-200 p-1 rounded-md">
                    ${item.description != 'None' ? `<div id=description" class="italic">${item.description}</div>` : ''}
                </div>
                <div class="text-stone-200 italic flex">
                    <div class="basis-xs">Slots : ${item.slots}</div>
                    <div class="basis-1/3 text-right">${item.value} ${item.denomination}</div>
                </div>
            </div>
            `
            loot_container.insertAdjacentHTML('beforeend', loot_block)
            const loot_div = document.getElementById(loot_id)
            loot_div.setAttribute('onclick', `adversary._remove_loot('${item.name}')`)
        })
        update_ui(adversary)
    }

    // **Calculates - broader functions that integrate changes from a number of different sources to recalculate specific attributes

    // Calculate atk bonus based on gear, abilities and rank
    _calculate_atkbonus() {
        // Calculate atkbonus from gear, then from ability-based passives
        this.gear.forEach(this_item => {
            if (this_item.atkbonus > 0) {
                this.atkbonus = parseInt(this.atkbonus) + parseInt(this_item.atkbonus)
            }
        })

        this.passives.forEach(this_passive => {
            if (this_passive.type != 'ability') {
                return
            } else if (this_passive.modifiers.atkbonus) {
                this.atkbonus = this.atkbonus + this_passive.modifiers.atkbonus
            }
        })
    }

    // Calculate hearts based on rank and abilities
    _calculate_hearts() {
        this.passives.forEach(this_passive => {
            if (this_passive.type != 'ability') {
                return
            } else if (this_passive.modifiers.hearts) {
                this.hearts = parseInt(this.hearts) + this_passive.modifiers.hearts
            }
        })
    }

    // Calculate aptitudes based on primary aptitudes, rank, traits and size
    _calculate_aptitudes() {
        const primary_val = rank_stats[this.rank][2]
        const secondary_val = rank_stats[this.rank][3]

        var base_aptitudes = {
            'might': 0,
            'deftness': 0,
            'grit': 0,
            'insight': 0,
            'aura': 0
        }
        // Increase value for primary attributes
        const aptitudeKeys = Object.keys(base_aptitudes)
        aptitudeKeys.forEach(key => {
            if (this.primary_aptitudes.includes(key)) {
                base_aptitudes[key] = primary_val
            } else {
                base_aptitudes[key] = secondary_val
            }
        })
        this.aptitudes = base_aptitudes

        // Trait based modifications to aptitudes
        aptitudeKeys.forEach(key => {
            this.passives.forEach(this_trait => {
                if (this_trait.modifier == key) {
                        this.aptitudes[key] = this.aptitudes[key] + this_trait.value
                }
            })
        })
    }

    // Calculate defense based on size, speed, abilities and gear
    _calculate_defense() {
        let def = 10

        if (this.speed == 'fast') {
            def = def + 2
        } else if (this.speed == 'veryfast') {
            def = def + 4
        }

        if (this.size == 'tiny') {
            def = def + 3
        } else if (this.size == 'small') {
            def = def + 1
        }
        else if (this.size == 'large') {
            def = def - 1
        } else if (this.size == 'massive') {
            def = def - 2
        }
        this.defense = def
        // Recalculate defense accounting for gear and passives 

        this.gear.forEach(this_item => {
            if (this_item.defense > 0) {
                this.defense = parseInt(this.defense) + parseInt(this_item.defense)
            }
        })

        this.passives.forEach(this_passive => {
            if (this_passive.type != 'ability') {
                return
            } else if (this_passive.modifiers.defense) {
                this.defense = this.defense + this_passive.modifiers.defense
            }
        })

        update_ui(this)
    }

    // **Removals - undo the addition of a trait, loot, gear or ability
    
    _remove_trait(name) {
        const trait_to_remove = this.passives.indexOf(this.passives.find(trait => trait.name == name && trait.type == 'trait'))
        this.passives.splice(trait_to_remove, 1)
        this._adjust_passives()
    }

    _remove_loot(name) {
        const loot_to_remove = this.loot.indexOf(this.loot.find(loot => loot.name === name))
        this.loot.splice(loot_to_remove, 1)
        this._adjust_loot()
    }

    _remove_gear(name) {
        const gear_to_remove = this.gear.indexOf(this.gear.find(gear => gear.item_name === name))
        this.gear.splice(gear_to_remove, 1)
        this._calculate_defense()
        this._calculate_atkbonus()
        this._adjust_gear()
        this._adjust_rank()
    }

    _remove_ability(name) {
        const ability_to_remove = this.abilities[this.abilities.indexOf(this.abilities.find(abilities => abilities['name'] === name))]
        const points = ability_to_remove.allegiance
       this.abilities.splice(ability_to_remove,1)

        //remove any linked passives
        const passive_index = this.passives.findIndex(passive => passive.name == name)
        if (passive_index !== -1) {
            this.passives.splice(passive_index, 1);
        }
        //offset bright or dark point values 
        if (points < 0) {
            this.dark_points = this.dark_points + points
        } else if (points > 0) {
            this.bright_points = this.bright_points - points
        }
        this._adjust_abilities()
        this._adjust_passives()
        this._adjust_allegiance()
    }

}