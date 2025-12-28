class Adversary {

    constructor(data = {}) {
        // creature metadata
        this.name = data.name || null;
        this.menace = data.menace;
        this.rank = data.rank || 0;
        this.size = data.size || "Medium";
        this.hearts = data.hearts;
        this.atkbonus = data.atkbonus;
        this.defense = data.defense;
        this.speed = data.speed;
        this.max_speed = data.max_speed || 'veryfast';
        this.creature_type = data.creature_type || "Monster";
        this.creature_subtype = data.creature_subtype || null;
        this.primary_aptitudes = data.primary_aptitudes
        this.gear = data.gear || []
        this.bright_points = data.bright_points || 0;
        this.dark_points = data.dark_points || 0;
        this.allegiance = data.allegiance || 'unaligned';
        this.description = data.description || null;
        // structured data objects
        this.aptitudes = data.aptitudes || []
        this.passives = this._validateArray(data.passives, Passive);
        this.abilities = {};
        this.facts = data.facts;
        this.loot = this._validateArray(data.loot, Item);
        this.moods = data.moods;
    }

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

    _adjust_menace() {
        this.menace = document.getElementById('menace').value
        menace_color(document.getElementById('menace').value)
    }

    _adjust_name() {
        this.name = document.getElementById('adversary-name').value.toUpperCase()
        document.getElementById('adversary-name').value = this.name
        current_adversary_card()
    }

    _adjust_type_subtype() {
        this.creature_type = document.getElementById('adversary-type').value
        this.creature_subtype = document.getElementById('adversary-subtype').value
        current_adversary_card()
    }

    _adjust_description() {
        this.description = document.getElementById('adversary-description').value
    }

    _calculate_atkbonus() {
        // Calculate atkbonus from gear, then from ability-based passives
        adversary.gear.forEach(this_item => {
            if (this_item.atkbonus > 0) {
                this.atkbonus = parseInt(this.atkbonus) + parseInt(this_item.atkbonus)
            }
        })
        adversary.passives.forEach(this_passive => {
            if (this_passive.passive_type != 'ability') {
                return
            } else if (this_passive.modifier.flat().includes('atkbonus')) {
                const atkbonus_index = this_passive.modifier.flat().indexOf('atkbonus')
                this.atkbonus = parseInt(this.atkbonus) + parseInt(this_passive.value.flat()[atkbonus_index])
            }
        })
    }

    _calculate_hearts() {
        adversary.passives.forEach(this_passive => {
            if (this_passive.passive_type != 'ability') {
                return
            } else if (this_passive.modifier.flat().includes('hearts')) {
                const hearts_index = this_passive.modifier.flat().indexOf('hearts')
                this.hearts = parseInt(this.hearts) + parseInt(this_passive.value.flat()[hearts_index])
            }
        })
    }

    // Update the data object with base aptitudes based on primary aptitudes
    // use this method to assist in calculations of aptitude changes from size, rank or traits
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
            adversary.passives.forEach(this_trait => {
                if (this_trait.modifier == key) {
                    this_trait.operator == 'add' ?
                        this.aptitudes[key] = parseInt(this.aptitudes[key]) + parseInt(this_trait.value) :
                        this.aptitudes[key] = parseInt(this.aptitudes[key]) - parseInt(this_trait.value)
                }
            })
        })
    }

    // adjustment methods should probably be integrated directly into calculate aptitudes method at some point
    // keeping them separate for now to work through any low hanging fruit bugs

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
        update_ui(adversary)
    }

    _adjust_speed() {
        const selected_speed = document.getElementById('speed')
        const speeds = ['slow', 'average', 'fast', 'veryfast']
        this.speed = selected_speed.value
        // set lowest base speed allowed by any abilities
        adversary.passives.forEach(this_passive => {
            if (this_passive.passive_type != 'ability') {
                return
            } else if (this_passive.modifier.flat().includes('speed')) {
                const speed_index = this_passive.modifier.flat().indexOf('speed')
                this.speed = this_passive.value.flat()[speed_index]
            }
        })

        // set max speed based on item with the least permissable max speed
        const get_lowest_speed = () => {
            const gear_list = adversary.gear
            const speed_list = [...new Set(gear_list.map(item => item.max_speed))]
            return speed_list
        }

        if (get_lowest_speed().includes('slow')) {
            this.max_speed = 'slow'
        } else if (get_lowest_speed().includes('slow')) {
            adversary.max_speed = 'slow'
        } else if (get_lowest_speed().includes('average')) {
            adversary.max_speed = 'average'
        } else if (get_lowest_speed().includes('fast')) {
            adversary.max_speed = 'fast'
        } else {
            adversary.max_speed = 'veryfast'
        }

        adversary.gear.forEach(this_item => {
            if (this_item.max_speed) {
                this.max_speed = this_item.max_speed
            }
            if (this_item.speed > 0 || this_item.speed < 0) {
                var current_speed = speeds.indexOf(this.speed)
                var new_speed = parseInt(current_speed) + (parseInt(this_item.speed))
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

        adversary.gear.forEach(this_item => {
            if (this_item.defense > 0) {
                this.defense = parseInt(this.defense) + parseInt(this_item.defense)
            }
        })

        adversary.passives.forEach(this_passive => {
            if (this_passive.passive_type != 'ability') {
                return
            } else if (this_passive.modifier.flat().includes('defense')) {
                const defense_index = this_passive.modifier.flat().indexOf('defense')
                this.defense = parseInt(this.defense) + parseInt(this_passive.value.flat()[defense_index])
            }
        })

        update_ui(adversary)
    }

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
        // for colossal, there will need to be a lot of extensive customization - earmark for future
        // After this, rerun _adjustTraits so that new traits are re-incorporated
        this._calculate_defense()
        current_adversary_card()
    }

    // Confirms data being injected into Adversary class is of the correct type/class

    _validateArray(dataItem, targetClass) {
        if (dataItem === null || dataItem === undefined) return [];
        const normalized = Array.isArray(dataItem) ? dataItem : [dataItem];
        return normalized.filter(item => item instanceof targetClass);
    }

    _add_trait() {
        // create trait in adversary object
        var name = document.getElementById('trait-name').value
        var operator = document.querySelector(`input[name='trait-operator']:checked`).value
        var value = document.getElementById('trait-value').value
        var modifier = document.getElementById('trait-modifier').value
        var new_trait = new Passive(name, 'trait', modifier, operator, value)
        this.passives.push(new_trait)
        this._adjust_passives()
    }

    _remove_trait(name) {
        const trait_to_remove = adversary.passives.indexOf(adversary.passives.find(trait => trait.passive_name === name))
        adversary.passives.splice(trait_to_remove, 1)
        this._adjust_passives()
    }

    _adjust_passives() {
        //add trait to page by clearing out container div and constructing new traits based 
        // on trait array in adversary
        const trait_container = document.getElementById('trait-container')
        trait_container.innerHTML = ''
        adversary.passives.forEach(passive => {
            if (passive.passive_type == 'trait') {
                const trait_span = document.createElement('span')
                trait_span.innerHTML = `${(passive.passive_name ? passive.passive_name : 'Unnamed').toUpperCase()} (${(passive.operator == 'add' ? '+' : '-')}${passive.value} ${passive.modifier.toUpperCase()})`
                trait_span.classList.add('trait-span', 'font-bold')
                trait_span.id = (`trait-${passive.passive_name ? passive.passive_name : 'Unnamed'}-${passive.modifier}-${passive.operator}-${passive.value}`).toLowerCase()
                trait_span.setAttribute('onclick', `adversary._remove_trait('${passive.passive_name}')`)
                trait_container.appendChild(trait_span)
            } else if (passive.passive_type = "ability") {
                const passive_id = (`passive-${passive.passive_name ? passive.passive_name : 'Unnamed'}-${passive.modifier}-${passive.operator}-${passive.value}`).toLowerCase()
                const passive_span_html = `
                <span id="${passive_id}" class="passive-span font-bold">${passive.linked_ability.ability_name}: </span>
                `
                trait_container.insertAdjacentHTML('beforeend', passive_span_html)
                const passive_span = document.getElementById(passive_id)
                if (passive.modifier.flat().includes('atkbonus')) {
                    const atk_span = `<span><img class="svg-icon" src="images/sword-fill-svgrepo-com.svg">+${passive.value.flat()[passive.modifier.flat().indexOf('atkbonus')]}</span>`
                    passive_span.insertAdjacentHTML('beforeend', atk_span)
                }
                if (passive.modifier.flat().includes('defense')) {
                    const defense_span = `<span><i class="fa-solid fa-shield"></i>+${passive.value.flat()[passive.modifier.flat().indexOf('defense')]}</span>`
                    passive_span.insertAdjacentHTML('beforeend', defense_span)
                }
                if (passive.modifier.flat().includes('hearts')) {
                    const hearts_span = `<span><i class="text-red-600 fa-solid fa-heart"></i>+${passive.value.flat()[passive.modifier.flat().indexOf('hearts')]}</span>`
                    passive_span.insertAdjacentHTML('beforeend', hearts_span)
                }
                if (passive.modifier.flat().includes('speed')) {
                    const speed_span = `<span><i class="fa-solid fa-person-running"></i>Base Speed - ${passive.value.flat()[passive.modifier.flat().indexOf('speed')].toUpperCase()}</span>`
                    passive_span.insertAdjacentHTML('beforeend', speed_span)
                }
            }
        })
        this._calculate_aptitudes()
        this._calculate_defense()
        update_ui(adversary)
    }

    _add_gear() {
        const item_name = (document.getElementById('gear-name').value).toUpperCase();
        const item_type = document.getElementById('gear-item-type').value;
        const item_subtype = document.getElementById('gear-item-subtype').value;
        const item_description = document.getElementById('gear-item-description').value;
        const denomination = document.querySelector(`input[name='gear-item-denomination']:checked`).value
        const item_value = document.getElementById('gear-item-value').value;
        const item_slots = document.getElementById('gear-item-slots').value
        // optional gear attributes that may affect combat stats
        const item_defense = document.getElementById('gear-item-defense').value ? document.getElementById('gear-item-defense').value : null
        const item_atkbonus = document.getElementById('gear-item-atkbonus').value ? document.getElementById('gear-item-atkbonus').value : null
        const item_speed = document.getElementById('gear-item-speed').value ? document.getElementById('gear-item-speed').value : null
        const item_max_speed = document.getElementById('gear-item-max-speed').value ? document.getElementById('gear-item-max-speed').value : null

        var new_gear_item = new Item(
            item_name,
            item_type,
            item_subtype,
            item_description,
            item_slots,
            denomination,
            item_value,
            item_defense,
            item_atkbonus,
            item_speed,
            item_max_speed
        )
        this.gear.push(new_gear_item)
        this._adjust_gear()
    }

    _remove_gear(name) {
        const gear_to_remove = adversary.gear.indexOf(adversary.gear.find(gear => gear.item_name === name))
        this.gear.splice(gear_to_remove, 1)
        this._calculate_defense()
        this._calculate_atkbonus()
        this._adjust_gear()
        this._adjust_rank()
    }

    _adjust_gear() {
        const gear_container = document.getElementById('gear-container')
        gear_container.innerHTML = ''
        adversary.gear.forEach(item => {
            const gear_block = `
            <div id="${item.item_name}-${item.item_type}-${item.item_subtype}" class="gear-item bg-slate-600 rounded-md p-3 mr-4 mb-4 max-w-sm">
                <div class="text-white"><span class="font-bold">${item.item_name}</span> (<span
                        class="italic">${item.item_subtype}</span>)</div>
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
            const gear_div = document.getElementById(`${item.item_name}-${item.item_type}-${item.item_subtype}`)
            gear_div.setAttribute('onclick', `adversary._remove_gear('${item.item_name}')`)
        })
        this._calculate_aptitudes()
        this._calculate_defense()
        this._calculate_atkbonus()
        this._adjust_speed()
        update_ui(adversary)
    }

    _add_loot() {
        const item_name = (document.getElementById('loot-name').value).toUpperCase();
        const item_type = document.getElementById('loot-item-type').value;
        const item_subtype = document.getElementById('loot-item-subtype').value;
        const item_description = document.getElementById('loot-item-description').value;
        const denomination = document.querySelector(`input[name='loot-item-denomination']:checked`).value
        const item_value = document.getElementById('loot-item-value').value;
        const item_slots = document.getElementById('loot-item-slots').value

        var new_loot_item = new Item(
            item_name || 'Unnamed Item',
            item_type || 'Generic Type',
            item_subtype || 'Generic Subtype',
            item_description || 'None',
            item_slots,
            denomination,
            item_value
        )
        this.loot.push(new_loot_item)
        this._adjust_loot()
    }

    _adjust_loot() {
        const loot_container = document.getElementById('loot-container')
        loot_container.innerHTML = ''
        adversary.loot.forEach(item => {
            const loot_block = `
            <div id="${item.item_name}-${item.item_type}-${item.item_subtype}" class="loot-item bg-teal-600 rounded-md p-3 mr-4 mb-4 max-w-sm">
                <div class="text-white"><span class="font-bold">${item.item_name}</span> (<span
                        class="italic">${item.item_subtype}</span>)</div>
                <div class="loot-content bg-slate-200 p-1 rounded-md">
                    ${item.item_description != 'None' ? `<div id=description" class="italic">${item.item_description}</div>` : ''}
                </div>
                <div class="text-stone-200 italic flex">
                    <div class="basis-xs">Slots : ${item.slots}</div>
                    <div class="basis-1/3 text-right">${item.value} ${item.denomination}</div>
                </div>
            </div>
            `
            loot_container.insertAdjacentHTML('beforeend', loot_block)
            const loot_div = document.getElementById(`${item.item_name}-${item.item_type}-${item.item_subtype}`)
            loot_div.setAttribute('onclick', `adversary._remove_loot('${item.item_name}')`)
        })
        update_ui(adversary)
    }

    _remove_loot(name) {
        const loot_to_remove = adversary.loot.indexOf(adversary.loot.find(loot => loot.item_name === name))
        this.loot.splice(loot_to_remove, 1)
        this._adjust_loot()
    }


    _add_ability() {
        const ability_name = (document.getElementById('ability-name').value).toUpperCase() || 'UNNAMED ABILITY'
        const ability_description = document.getElementById('ability-description').value
        const ability_type = document.querySelector(`input[name='ability-type']:checked`).value
        const allegiance = document.getElementById('ability-allegiance').value
        const magic = document.getElementById('ability-magic').checked
        const passive_atkbonus = document.getElementById('ability-atkbonus').value
        const passive_defense = document.getElementById('ability-defense').value
        const passive_speed = document.getElementById('ability-base-speed-override').value
        const passive_hearts = document.getElementById('ability-hearts').value

        // first create a new ability
        //var new_ability = new Ability(
        //    ability_name, ability_description, allegiance, [], ability_type, magic
        //)

        var new_ability = createAbility(ability_name, ability_description, allegiance, [], ability_type, magic)

        // adjust allegiance appropriately based on a positive or negative value
        if (parseInt(allegiance) > 0) {
            this.bright_points = this.bright_points + parseInt(allegiance)
        } else if (parseInt(allegiance) < 0) {
            this.dark_points = this.dark_points + Math.abs(parseInt(allegiance))
        }

        // add new ability object to abilities object in adversary
        this.abilities[ability_name] = new_ability

        // then create a new passive if this ability has any linked passives
        var passives = {}
        passive_atkbonus && (passives.atkbonus = passive_atkbonus)
        passive_defense && (passives.defense = passive_defense)
        passive_speed != '' && (passives.speed = passive_speed)
        passive_hearts && (passives.hearts = passive_hearts)

        if (Object.keys(passives).length > 0) {
            const passive_keys = [Object.keys(passives)]
            const passive_values = [Object.values(passives)]
            const linked_ability = ability_name
            var new_bound_passive = new Passive(
                ability_name, 'ability', passive_keys, 'add', passive_values, linked_ability
            )
            //Link the bound passive to the ability
            this.abilities[ability_name].bound_passive = ability_name
        }

        new_bound_passive && this.passives.push(new_bound_passive)


        this._adjust_allegiance()
        this._adjust_abilities()
        this._adjust_passives()
    }

    _remove_ability(name) {
        const ability_to_remove = this.abilities[name]
        const points = parseInt(ability_to_remove.allegiance)
        delete this.abilities[name]

        //remove any linked passives
        const passive_index = this.passives.findIndex(passive => passive.passive_name == name)
        if (passive_index !== -1) {
            adversary.passives.splice(passive_index, 1);
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

    _adjust_abilities() {
        // Adds the ability card to the abilities div

        const ability_container = document.getElementById('ability-container')
        ability_container.innerHTML = ''
        for (let key in this.abilities) {
            const ability = this.abilities[key]
            const ability_block = `
            <div id="${ability.ability_name}-${ability.ability_type}-${ability - allegiance}" class="ability-card w-1/2">
                <div class="text-white flex"><span class="font-bold">${ability.ability_name}</span><span class="ability-icon">${ability.ability_type == 'Basic' ? 'B' : ability.ability_type == 'Advanced' ? 'A' : ability.ability_type == 'Legendary' ? 'L' : 'NA'}</span>${ability.magic ? '<span class="magic-icon">M</span>' : ''}</div>
                <div class="ability-content bg-slate-200 p-1 rounded-md">
                    ${ability.ability_description != 'None' ? `<div id=description" class="italic">${ability.ability_description}</div>` : ''}
                </div>
            </div>
            `

            ability_container.insertAdjacentHTML('beforeend', ability_block)
            const ability_div = document.getElementById(`${ability.ability_name}-${ability.ability_type}-${ability - allegiance}`)
            ability_div.setAttribute('onclick', `adversary._remove_ability('${ability.ability_name}')`)
            if (parseInt(ability.allegiance) != 0) {
                const allegiance_box = `<div class="${parseInt(ability.allegiance) > 0 ? 'ability-bright-allegiance' : parseInt(ability.allegiance) < 0 ? 'ability-dark-allegiance' : ''}" id="allegiance-box-${ability.ability_name}">Adds ${Math.abs(parseInt(ability.allegiance))} ${parseInt(ability.allegiance) > 0 ? 'Bright' : parseInt(ability.allegiance) < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
                ability_div.insertAdjacentHTML('beforeend', allegiance_box)
            }
        }
        this._calculate_hearts()
        this._calculate_defense()
        this._calculate_atkbonus()
        this._adjust_speed()
        update_ui(adversary)

    }

    _adjust_facts(fact) {
        const fact_content = document.getElementById(fact).value
        this.facts[fact].description = fact_content
    }

    _adjust_mood_table() {
        const rows = document.querySelectorAll('#mood-table > tbody > tr')
        //clear out moods object and reindex info from table
        adversary.moods = []
        for (var row of rows) {
            var data = []

            row.querySelectorAll('input').forEach(input => data.push(input.value))
            const rolls = {
                start: data[0],
                stop: data[1]
            }
            const mood = new Mood(rolls, data[2], data[3])
            adversary.moods.push(mood)
        }
    }
}

// Class definitions

// Abilities are functionally the same as items, except they dont take up space, have no monetary value 
// and may have an alignment value.
// Also abilities will need a way to optionally add in traits bound to them (IE - Surging Darkness (p.414) adds speed and defense)

// Ability Factory example (convert all other classes to this type of factory function)
const createAbility = (ability_name, ability_description, allegiance = 0, bound_passive = null, ability_type = 'basic', magic = false) => ({
    'ability name': ability_name,
    'ability description': ability_description, 
    'allegiance': allegiance, 
    'bound passive': bound_passive, 
    'ability type': ability_type, 
    'magic': magic
});


class Ability {
    constructor(ability_name, ability_description, allegiance = 0, bound_passive = null, ability_type = 'basic', magic = false) {
        this.ability_name = ability_name || 'Unnamed Ability';
        this.ability_type = ability_type;
        this.ability_description = ability_description || 'N/A';
        this.allegiance = allegiance;
        this.bound_passive = bound_passive;
        this.magic = magic;
    }
}

// These can influence aptitudes, health, speed, defense or atkbonus. 
// The addition of any trait will need to be factored into the model and UI changes
// Consider renaming this class to "passive" for use as both a Trait and Ability 
// (for creatures whose abilities also grant them passives)
class Passive {
    constructor(passive_name, passive_type, modifier, operator, value, linked_ability = null) {
        this.passive_name = passive_name || 'Unnamed Passive';
        this.passive_type = passive_type || 'N/A'
        this.modifier = modifier;
        this.operator = operator;
        this.value = value;
        this.linked_ability = linked_ability
    }
}

// Generic item class - can be used as Loot or as equipment or as items a vendor is looking to sell
class Item {
    constructor(item_name, item_type, item_subtype, item_description = '', slots = 1, denomination, value, defense = null, atkbonus = null, speed = null, max_speed = null) {
        this.item_name = item_name || 'Unnamed Item';
        this.item_type = item_type || 'Generic Type';
        this.item_subtype = item_subtype || 'Generic Subtype';
        this.item_description = item_description || 'None';
        this.slots = slots;
        this.denomination = denomination;
        this.value = value;
        this.defense = defense;
        this.atkbonus = atkbonus;
        this.speed = speed;
        this.max_speed = max_speed;
    }
}

// Moods to insert into the mood table
class Mood {
    constructor(rolls, mood, mood_text) {
        this.rolls = rolls
        this.mood = mood
        this.mood_text = mood_text
    }
}