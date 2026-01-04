class Adversary {

    constructor(data) {
        Object.assign(this, data);
        this.size = data.size || "Medium";
        this.max_speed = data.max_speed || 'veryfast';
    }

    // Add a trait to the passives primary
    _add_trait() {
        // create trait in adversary object
        const passives = [...this.passives]
        const id = `tr-${generate_id()}`
        const name = document.getElementById('trait-name').value
        const value = parseInt(document.getElementById('trait-value').value)
        const modifier = document.getElementById('trait-modifier').value
        const type = 'trait'

        const createTrait = (id, name, value, modifier, type) => ({
            'id': id,
            'name': name,
            'type': type,
            'modifier': modifier,
            'value': value
        })
        passives.push(createTrait(id, name, value, modifier, type))
        this.passives = passives
        //this._calculate_aptitudes()
        this._integrate_passive(id)
        //temporary solution to offset issue with primary aptitudes not updating immediately
        this._adjust_size()
        closeModal()
        update_ui(this)
    }

    // Add an ability to the abilities array
    _add_ability() {
        const abilities = [...this.abilities]
        const passives = [...this.passives]
        const id = `ab-${generate_id()}`
        const name = (document.getElementById('ability-name').value).toUpperCase()
        const description = document.querySelector('#ability-div .editor').__quill.root.innerHTML
        const type = document.querySelector(`input[name='ability-type']:checked`).value
        const allegiance = parseInt(document.getElementById('ability-allegiance').value)
        const magic = document.getElementById('ability-magic').checked
        const passive_atkbonus = parseInt(document.getElementById('ability-atkbonus').value)
        const passive_defense = parseInt(document.getElementById('ability-defense').value)
        const passive_speed = document.getElementById('ability-base-speed-override').value
        const passive_hearts = parseInt(document.getElementById('ability-hearts').value)
        const passive_size = document.getElementById('ability-size-override').value
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
            this._calculate_allegiance()
        } else if (allegiance < 0) {
            this.dark_points = this.dark_points + Math.abs(allegiance)
            this._calculate_allegiance()
        }

        // then create a new passive if this ability has any linked passives
        var ability_passives = {}
        passive_atkbonus && (ability_passives.atkbonus = passive_atkbonus)
        passive_defense && (ability_passives.defense = passive_defense)
        passive_speed != '' && (ability_passives.speed = passive_speed)
        passive_hearts && (ability_passives.hearts = passive_hearts)
        passive_size != '' && (ability_passives.size = passive_size)
        if (Object.keys(ability_passives).length > 0) {
            const passive_id = `ab-passive-${generate_id()}`
            bound_passive = true
            const type = 'ability'
            const createPassive = (id, name, modifiers, type) => ({
                'id': id,
                'name': name,
                'modifiers': modifiers,
                'type': type
            })
            passives.push(createPassive(passive_id, name, ability_passives, type))
            this.passives = passives
            // recalculate any affected stats

            //if (passive_atkbonus){
            //    this._calculate_atkbonus()
            //}
            //if (passive_defense){
            //    this._calculate_defense()
            //}
            //if (passive_speed != ''){
            //    this._calculate_speed()
            //}
            //if (passive_hearts){
            //    this._calculate_hearts()
            //}
            //if (passive_size != ''){
            //    this._adjust_size()
            //}
            this._integrate_passive(id)
        }
        // create & add new ability object to abilities array in adversary
        const new_ability = createAbility(id, name, description, allegiance, bound_passive, type, magic)
        abilities.push(new_ability)
        this.abilities = abilities
        update_ui(this)
    }

    // Add items to the inventory array
    _add_item() {
        const inventory = [...this.inventory]
        const id = `inv-${generate_id()}`;
        const name = (document.getElementById('inventory-item-name').value).toUpperCase();
        const category = (document.getElementById('inventory-item-category').value)
        const type = document.getElementById('inventory-item-type').value;
        const subtype = document.getElementById('inventory-item-subtype').value;
        const description = document.querySelector('#inventory-item-div .editor').__quill.root.innerHTML
        const denomination = document.querySelector(`input[name='inventory-item-denomination']:checked`).value
        const value = document.getElementById('inventory-item-value').value;
        const slots = document.getElementById('inventory-item-slots').value
        const allegiance = parseInt(document.getElementById('inventory-item-allegiance').value)
        // optional gear attributes that may affect combat stats
        const defense = parseInt(document.getElementById('inventory-item-defense').value) ? parseInt(document.getElementById('inventory-item-defense').value) : null
        const atkbonus = parseInt(document.getElementById('inventory-item-atkbonus').value) ? parseInt(document.getElementById('inventory-item-atkbonus').value) : null
        const speed = parseInt(document.getElementById('inventory-item-speed').value) ? parseInt(document.getElementById('inventory-item-speed').value) : null
        const max_speed = document.getElementById('inventory-item-max-speed').value ? document.getElementById('inventory-item-max-speed').value : null

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
            max_speed,
            allegiance) => ({

                'id': id,
                'name': name,
                'category': category,
                'type': type,
                'subtype': subtype,
                'description': description,
                'slots': slots,
                'denomination': denomination,
                'value': value,
                'defense': defense,
                'atkbonus': atkbonus,
                'speed': speed,
                'max_speed': max_speed,
                'allegiance': allegiance,
            });

        if (allegiance > 0) {
            this.bright_points = this.bright_points + allegiance
        } else if (allegiance < 0) {
            this.dark_points = this.dark_points + Math.abs(allegiance)
        }

        inventory.push(createItem(id, name, category, type, subtype, description, slots, denomination, value, defense, atkbonus, speed, max_speed, allegiance))
        this.inventory = inventory

        if (allegiance) {
            this._calculate_allegiance()
        }
        if (defense) {
            this._calculate_defense()
        }
        if (atkbonus) {
            this._calculate_atkbonus()
        }
        if (speed != null || max_speed != null) {
            this._calculate_speed()
        }
        if (hearts) {
            this._calculate_hearts()
        }
        update_ui(this)
    }

    // **Adjusts - make changes to existing data and manipulate the DOM to reflect UI changes

    // Change allegiance by manipulating Bright and Dark point values
    _integrate_passive(passive_id){
        const passive = this.passives.find(passive => passive.id === passive_id)
        if (passive.type == 'ability') {
            if (passive.modifiers.atkbonus){
                this._calculate_atkbonus()
            }
            if (passive.modifiers.defense){
                this._calculate_defense()
            }
            if (passive.modifiers.speed != undefined){
                this._calculate_speed()
            }
            if (passive.modifiers.hearts){
                this._calculate_hearts()
            }
            if (passive.modifiers.size != undefined){
                this._adjust_size()
            }
        } else if(passive.type == "trait") {
            this._calculate_aptitudes()
        }
    }
    
    _calculate_allegiance() {
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
    _change_menace() {
        this.menace = document.getElementById('menace').value
        menace_color(document.getElementById('menace').value)
        update_ui(this)
    }

    // Change value of adversary name
    _change_name() {
        this.name = document.getElementById('adversary-name').value.toUpperCase()
        document.getElementById('adversary-name').value = this.name
    }

    // Manipulate the Type and Subtype
    _change_type_subtype() {
        this.creature_type = document.getElementById('adversary-type').value
        this.creature_subtype = document.getElementById('adversary-subtype').value
        update_ui(this)
    }

    // Make changes to adversary description
    _change_description() {
        this.description = document.querySelector('#description-container-div .editor').__quill.root.innerHTML
        save_adversary()
    }

    // Adjust primary attributes. 
    // **This is technically an addition since the attributes are added and removed from an array

    _adjust_primary_aptitudes(attr = None) {
        //add passed argument to the primary attributes array on the adversary object
        var primary_aptitudes = [...this.primary_aptitudes]
        if (document.getElementById(`${attr}-primary`).checked) {
            primary_aptitudes.push(attr)
        } else {
            const i = primary_aptitudes.indexOf(attr)
            if (i > -1) {
                primary_aptitudes.splice(i, 1)
            }
        }
        this.primary_aptitudes = primary_aptitudes
        this._adjust_size()
        update_ui(adversary)
    }

    // Adjust the adversary's rank
    _change_rank() {
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
        this._change_menace()
        // recalculate all attributes
        this._calculate_aptitudes()
        this._adjust_size()
        this._calculate_atkbonus()
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
            const inventory_list = this.inventory
            const speed_list = [...new Set(inventory_list.map(item => item.max_speed))]
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
        this.size = 'medium'
        this.passives.forEach(this_passive => {
            if (this_passive.type != 'ability') {
                return
            } else if (this_passive.modifiers.size) {
                this.size = this_passive.modifiers.size
            }
        })
        this._calculate_aptitudes()
        this._calculate_defense()
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

            const createMood = (rolls, mood, description) => ({
                'rolls': rolls,
                'mood': mood,
                'mood_text': description

            })
            this.moods.push(createMood(rolls, data[2], data[3]))
        }
        update_ui(this)
        save_adversary()
    }

    // **Calculates - broader functions that integrate changes from a number of different sources to recalculate specific attributes

    // Calculate atk bonus based on gear, abilities and rank
    _calculate_atkbonus() {
        //set back to atkbonus based on rank
        this.atkbonus = rank_stats[this.rank][0]
        
        // Calculate atkbonus from gear, then from ability-based passives
        this.inventory.forEach(this_item => {
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
        //set back to hearts based on rank
        this.hearts = rank_stats[this.rank][1]

        // Calculate hearts from ability-based passives
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
        // Get primary and secondary values from rank stats
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
        var aptitudes = base_aptitudes

        // Trait based modifications to aptitudes
        aptitudeKeys.forEach(key => {
            this.passives.forEach(this_trait => {
                if (this_trait.modifier == key) {
                    aptitudes[key] = aptitudes[key] + this_trait.value
                }
            })
        })

        // Size based modifications to aptitudes
        if (this.size == 'tiny') {
            aptitudes.deftness++
            aptitudes.might--
        }
        else if (this.size == 'small') {
            aptitudes.deftness++
            aptitudes.might--
        }
        else if (this.size == 'large') {
            aptitudes.might++
        }
        else if (this.size == 'massive') {
            aptitudes.might = modified_aptitudes.might + 2
        }
        this.aptitudes = aptitudes
        update_ui(this)
    }

    // Calculate defense based on size, speed, abilities and gear
    _calculate_defense() {
        //set defense back to base 10
        let def = 10

        // Recalculate defense accounting for size and speed
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

        this.inventory.forEach(this_item => {
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

    _remove_trait(id) { 
        const passives = [...this.passives]
        const trait_to_remove = this.passives.indexOf(this.passives.find(trait => trait.id === id && trait.type == 'trait'))
        passives.splice(trait_to_remove, 1)
        this.passives = passives
        this._calculate_aptitudes()
        closeModal()
        update_ui(this)
    }

    _remove_item(id) {
        const inventory = [...this.inventory]
        const item_to_remove = this.inventory[this.inventory.indexOf(this.inventory.find(this_item => this_item.id === id))]
        const points = item_to_remove.allegiance
        const atkbonus = item_to_remove.atkbonus
        const defense = item_to_remove.defense
        const speed = item_to_remove.speed
        const max_speed = item_to_remove.max_speed
        inventory.splice(this.inventory.indexOf(item_to_remove), 1)
        this.inventory = inventory
        //recalculate any affected stats
        if (atkbonus != undefined || atkbonus != null || atkbonus != 0) {
            this._calculate_atkbonus()
        }
        if (defense != undefined || defense != null || defense != 0) {
            this._calculate_defense()
        }
        if ((speed != null || speed != 0 || speed != undefined) || (max_speed != null || max_speed != undefined)) {
            this._calculate_speed()
        }
        //offset bright or dark point values 
        if (points < 0) {
            this.dark_points = this.dark_points + points
            this._calculate_allegiance()
        } else if (points > 0) {
            this.bright_points = this.bright_points - points
            this._calculate_allegiance()
        }
        closeModal()
        update_ui(this)
    }

    _remove_ability(id) {
        const abilities = [...this.abilities]
        const passives = [...this.passives]
        const ability_to_remove = this.abilities[this.abilities.indexOf(this.abilities.find(abilities => abilities.id === id))]
        const points = ability_to_remove.allegiance
        //remove any linked passives
        const passive_index = passives.findIndex(passives => passives.name == ability_to_remove.name)
        if (passive_index !== -1) {

            const atkbonus = passives.find(passive => passive.name == ability_to_remove.name).modifiers.atkbonus
            const defense = passives.find(passive => passive.name == ability_to_remove.name).modifiers.defense
            const speed = passives.find(passive => passive.name == ability_to_remove.name).modifiers.speed
            const max_speed = passives.find(passive => passive.name == ability_to_remove.name).modifiers.max_speed
            const hearts = passives.find(passive => passive.name == ability_to_remove.name).modifiers.hearts
            const size = passives.find(passive => passive.name == ability_to_remove.name).modifiers.size

            passives.splice(passive_index, 1);
            this.passives = passives
            if (atkbonus != undefined || atkbonus != null || atkbonus != 0) {
                this._calculate_atkbonus()
            }
            if (hearts != undefined || hearts != null || hearts != 0) {
                this._calculate_hearts()
            }
            if (defense != undefined || defense != null || defense != 0) {
                this._calculate_defense()
            }
            if ((speed != null || speed != 0 || speed != undefined) || (max_speed != null || max_speed != undefined)) {
                this._calculate_speed()
            }
            if (size != null || size != undefined) {
                this._adjust_size()
            }
            
        }
        //offset bright or dark point values 
        if (points < 0) {
            this.dark_points = this.dark_points + points
            this._calculate_allegiance()
        } else if (points > 0) {
            this.bright_points = this.bright_points - points
            this._calculate_allegiance()
        }
        abilities.splice(abilities.indexOf(ability_to_remove), 1)
        this.abilities = abilities
        closeModal()
        update_ui(this)
    }

}