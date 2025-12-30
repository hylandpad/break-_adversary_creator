class Adversary {

    constructor(data) {
        Object.assign(this, data);
        this.size = data.size || "Medium";
        this.max_speed = data.max_speed || 'veryfast';
    }


    //Custom Methods Section
    
    // **Adds - push new objects into Adversary arrays**

    // Add a trait to the passives array
    _add_trait() {
        // create trait in adversary object
        var name = document.getElementById('trait-name').value
        var value = parseInt(document.getElementById('trait-value').value)
        var modifier = document.getElementById('trait-modifier').value
        const type = 'trait'

        const createTrait = (name, value, modifier, type) => ({
            'name': name,
            'type': type,
            'modifier': modifier,
            'value': value
        })
        this.passives.push(createTrait(name, value, modifier, type))
        this._adjust_passives()
        update_ui(this)
    }

    // Add an ability to the abilities array
    _add_ability() {
        const ability_name = (document.getElementById('ability-name').value).toUpperCase() || 'UNNAMED ABILITY'
        const ability_description = document.getElementById('ability-description').value
        const ability_type = document.querySelector(`input[name='ability-type']:checked`).value
        const allegiance = parseInt(document.getElementById('ability-allegiance').value)
        const magic = document.getElementById('ability-magic').checked
        const passive_atkbonus = parseInt(document.getElementById('ability-atkbonus').value)
        const passive_defense = parseInt(document.getElementById('ability-defense').value)
        const passive_speed = document.getElementById('ability-base-speed-override').value
        const passive_hearts = parseInt(document.getElementById('ability-hearts').value)
        var bound_passive = false

        // first create a new ability
        const createAbility = (ability_name, ability_description, allegiance = 0, bound_passive, ability_type = 'basic', magic = false) => ({
            'name': ability_name,
            'description': ability_description,
            'allegiance': allegiance,
            'bound_passive': bound_passive,
            'type': ability_type,
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
            this.passives.push(createPassive(ability_name, passives, type))
            this._adjust_passives()

        }
        // create & add new ability object to abilities array in adversary
        const new_ability = createAbility(ability_name, ability_description, allegiance, bound_passive, ability_type, magic)
        this.abilities.push(new_ability)

        this._adjust_allegiance()
        this._adjust_abilities()
        this._adjust_passives()
    }

    // Add gear to the gear array
    _add_gear() {
        const item_name = (document.getElementById('gear-name').value).toUpperCase();
        const item_type = document.getElementById('gear-item-type').value;
        const item_subtype = document.getElementById('gear-item-subtype').value;
        const item_description = document.getElementById('gear-item-description').value;
        const item_denomination = document.querySelector(`input[name='gear-item-denomination']:checked`).value
        const item_value = document.getElementById('gear-item-value').value;
        const item_slots = document.getElementById('gear-item-slots').value
        // optional gear attributes that may affect combat stats
        const item_defense = document.getElementById('gear-item-defense').value ? document.getElementById('gear-item-defense').value : null
        const item_atkbonus = document.getElementById('gear-item-atkbonus').value ? document.getElementById('gear-item-atkbonus').value : null
        const item_speed = document.getElementById('gear-item-speed').value ? document.getElementById('gear-item-speed').value : null
        const item_max_speed = document.getElementById('gear-item-max-speed').value ? document.getElementById('gear-item-max-speed').value : null

        const createGear = (
            name,
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

            'name': name,
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


        this.gear.push(createGear(item_name,item_type,item_subtype,item_description,item_slots, item_denomination,item_value,item_defense,item_atkbonus,item_speed,item_max_speed))
        this._adjust_gear()
    }

    // Add loot to the loot array
    _add_loot() {
        const item_name = (document.getElementById('loot-name').value).toUpperCase();
        const item_type = document.getElementById('loot-item-type').value;
        const item_subtype = document.getElementById('loot-item-subtype').value;
        const item_description = document.getElementById('loot-item-description').value;
        const item_denomination = document.querySelector(`input[name='loot-item-denomination']:checked`).value
        const item_value = document.getElementById('loot-item-value').value;
        const item_slots = document.getElementById('loot-item-slots').value

        const createLoot = (
            name,
            type,
            subtype,
            description,
            slots,
            denomination,
            value) => ({

            'name': name,
            'type' : type,
            'subtype' : subtype,
            'description' : description,
            'slots' : slots,
            'denomination' : denomination,
            'value' : value
        });


        this.gear.push(createLoot(item_name,item_type,item_subtype,item_description,item_slots, item_denomination,item_value))
        this._adjust_loot()
    }

    // **Adjusts - make changes to existing data and manipulate the DOM to reflect UI changes

    // Change allegiance by manipulating Bright and Dark point values
    _adjust_allegiance() {
        const bright_points = parseInt(this.bright_points)
        const dark_points = parseInt(this.dark_points)
        const app_main_div = document.getElementById('app-main')

        // determine is bright/dark points exceeds one or the other by 2 or more
        function exceedsByX(A, B, X) {
            return A - B >= X;
        }

        if (bright_points <= 1 && dark_points <= 1) {
            this.allegiance = 'unaligned'
            document.getElementById('unaligned').classList.remove('hidden')
            document.getElementById('bright').classList.add('hidden')
            document.getElementById('dark').classList.add('hidden')
            document.getElementById('twilight').classList.add('hidden')
            app_main_div.classList.add('unaligned-allegiance')
            app_main_div.classList.remove('dark-allegiance', 'bright-allegiance', 'twilight-allegiance')
        } else if (exceedsByX(bright_points, dark_points, 2)) {
            this.allegiance = 'bright'
            document.getElementById('unaligned').classList.add('hidden')
            document.getElementById('bright').classList.remove('hidden')
            document.getElementById('dark').classList.add('hidden')
            document.getElementById('twilight').classList.add('hidden')
            app_main_div.classList.add('bright-allegiance')
            app_main_div.classList.remove('dark-allegiance', 'unaligned-allegiance', 'twilight-allegiance')
        } else if (exceedsByX(dark_points, this.bright_points, 2)) {
            this.allegiance = 'dark'
            document.getElementById('unaligned').classList.add('hidden')
            document.getElementById('bright').classList.add('hidden')
            document.getElementById('dark').classList.remove('hidden')
            document.getElementById('twilight').classList.add('hidden')
            app_main_div.classList.add('dark-allegiance')
            app_main_div.classList.remove('bright-allegiance', 'unaligned-allegiance', 'twilight-allegiance')
        } else {
            this.allegiance = 'twilight'
            document.getElementById('unaligned').classList.add('hidden')
            document.getElementById('bright').classList.add('hidden')
            document.getElementById('dark').classList.add('hidden')
            document.getElementById('twilight').classList.remove('hidden')
            app_main_div.classList.add('twilight-allegiance')
            app_main_div.classList.remove('bright-allegiance', 'unaligned-allegiance', 'dark-allegiance')
        }

        // make changes to UI to reflect new allegiance
    }

    // Change the menace tier with limited mook automation
    _adjust_menace() {
        this.menace = document.getElementById('menace').value
        menace_color(document.getElementById('menace').value)
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
    _adjust_speed() {
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

        this.gear.forEach(this_item => {
            if (this_item.speed > 0 || this_item.speed < 0) {
                var current_speed = speeds.indexOf(this.speed)
                var new_speed = current_speed + this_item.speed
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

            // add traits to adversary data model
        }
        // set new traits
        this.aptitudes = modified_aptitudes
        
        // After this, rerun _adjust_traits so that new traits are re-incorporated
        this._calculate_defense()
        current_adversary_card()
    }

    // Adjust any passives related to abilities
    _adjust_passives() {
        //add trait to page by clearing out container div and constructing new traits based 
        // on trait array in adversary
        const trait_container = document.getElementById('trait-container')
        trait_container.innerHTML = ''
        this.passives.forEach(passive => {
            if (passive.type == 'trait') {
                const trait_span = document.createElement('span')
                trait_span.innerHTML = `${(passive.name).toUpperCase()} (${passive.value >= 0 ? '+' : ''}${passive.value} ${passive.modifier.toUpperCase()})`
                trait_span.classList.add('trait-span', 'font-bold')
                trait_span.id = (`trait-${passive.name}-${passive.modifier}`).replaceAll(" ","").toLowerCase()
                trait_span.setAttribute('onclick', `adversary._remove_trait('${passive.name}')`)
                trait_container.appendChild(trait_span)
            
            } else if (passive.type = "ability") {
                const passive_id = (`passive-${passive.name}`).replaceAll(" ","").toLowerCase()
                const passive_span_html = `
                <span id="${passive_id}" class="passive-span font-bold">${passive.name}: </span>
                `
                trait_container.insertAdjacentHTML('beforeend', passive_span_html)
                const passive_span = document.getElementById(passive_id)
                if (passive.modifiers.atkbonus) {
                    const atk_span = `<span><svg class="svg-icon"><use href="images/sword-fill-svgrepo-com.svg"></use></svg>+${passive.modifiers.atkbonus}</span>`
                    passive_span.insertAdjacentHTML('beforeend', atk_span)
                }
                if (passive.modifiers.defense) {
                    const defense_span = `<span><i class="fa-solid fa-shield"></i>+${passive.modifiers.defense}</span>`
                    passive_span.insertAdjacentHTML('beforeend', defense_span)
                }
                if (passive.modifiers.hearts) {
                    const hearts_span = `<span><i class="text-red-600 fa-solid fa-heart"></i>+${passive.modifiers.hearts}</span>`
                    passive_span.insertAdjacentHTML('beforeend', hearts_span)
                }
                if (passive.modifiers.speed) {
                    const speed_span = `<span><i class="fa-solid fa-person-running"></i>Base Speed - ${(passive.modifiers.speed).toUpperCase()}</span>`
                    passive_span.insertAdjacentHTML('beforeend', speed_span)
                }
            }
        })
        this._calculate_aptitudes()
        this._calculate_defense()
        update_ui(this)
    }

    // Adjust for any changes to abilities
    _adjust_abilities() {
        // Adds the ability card to the abilities div

        const ability_container = document.getElementById('ability-container')
        ability_container.innerHTML = ''
        this.abilities.forEach(ability => {
            const ability_name = ability['name']
            const ability_type = ability['type']
            const ability_description = ability['description']
            const allegiance = ability.allegiance
            const magic = ability.magic

            const ability_id = `ability-${ability.name}-${ability.type}`.replaceAll(" ","").toLowerCase()
            const ability_block = `
            <div id="${ability_id}" class="ability-card w-1/2">
                <div class="text-white flex"><span class="font-bold">${ability_name}</span><span class="ability-icon">${ability_type == 'Basic' ? 'B' : ability_type == 'Advanced' ? 'A' : ability_type == 'Legendary' ? 'L' : 'NA'}</span>${magic ? '<span class="magic-icon">M</span>' : ''}</div>
                <div class="ability-content bg-slate-200 p-1 rounded-md">
                    ${ability_description != 'None' ? `<div id=description" class="italic">${ability_description}</div>` : ''}
                </div>
            </div>
            `
            ability_container.insertAdjacentHTML('beforeend', ability_block)
            const ability_div = document.getElementById(ability_id)
            ability_div.setAttribute('onclick', `adversary._remove_ability('${ability_name}')`)
            if (ability.allegiance != 0) {
                const allegiance_box = `<div class="${allegiance > 0 ? 'ability-bright-allegiance' : allegiance < 0 ? 'ability-dark-allegiance' : ''}" id="allegiance-box-${ability_name}-${ability_type}">Adds ${Math.abs(allegiance)} ${allegiance > 0 ? 'Bright' : allegiance < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
                ability_div.insertAdjacentHTML('beforeend', allegiance_box)
            }
        })
        this._calculate_hearts()
        this._calculate_defense()
        this._calculate_atkbonus()
        this._adjust_speed()
        update_ui(this)

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
        const gear_container = document.getElementById('gear-container')
        gear_container.innerHTML = ''
        this.gear.forEach(item => {
            const gear_id = `gear-${item.name}-${item.type}-${item.subtype}}`.replaceAll(" ","").toLowerCase()
            const gear_block = `
            <div id="${gear_id}" class="gear-item bg-slate-600 rounded-md p-3 mr-4 mb-4 max-w-sm">
                <div class="text-white"><span class="font-bold">${item.name}</span> (<span
                        class="italic">${item.subtype}</span>)</div>
                <div class="gear-content bg-slate-200 p-1 rounded-md">
                    <div>
                        ${item.atkbonus > 0 ? `<img class="svg-icon" src="images/sword-fill-svgrepo-com.svg"></i><span>+${item.atkbonus}</span>` : ''}
                        ${item.defense > 0 ? `<i class="fa-solid fa-shield"></i><span>+${item.defense}</span>` : ''}
                        ${item.speed > 0 || item.speed < 0 ? `<i class="fa-solid fa-person-running"></i><span>${item.speed}</span>` : ''}
                        ${item.max_speed ? `<span class="font-bold">MAX </span><i class="fa-solid fa-person-running"></i><span>${item.max_speed}</span>` : ''}
                    </div>
                    ${item.item_description != 'None' ? `<div id=description" class="italic">${item.item_description}</div>` : ''}
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
        this._adjust_speed()
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
        const ability_to_remove = this.abilities.indexOf(this.abilities.find(abilities => abilities['name'] === name))
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
            this.bright_points = this.bright - points
        }
        this._adjust_abilities()
        this._adjust_passives()
        this._adjust_allegiance()
    }

}