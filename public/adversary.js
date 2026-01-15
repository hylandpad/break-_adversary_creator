class Adversary {

    constructor(data) {
        Object.assign(this, data);
        this.size = data.size || "Medium";
        this.max_speed = data.max_speed || 'veryfast';
    }

    _add_tag() {
        var tag_name = document.getElementById('tag-search-add').value.toLowerCase()
        tag_name = tag_name.charAt(0).toUpperCase() + tag_name.slice(1).toLowerCase()
        var toast_message = ''
        
        
        if (this.tags && this.tags.length == max_tags) {
            toast_message = `Maximum number of tags reached (${max_tags})`;
            show_toast(toast_message, 3000)
        }
        else if (tag_name.length < 1) {
            toast_message = 'Tag must be at least one character long'
            show_toast(toast_message, 3000)
            return
        } else {
            if (this.tags == undefined || this.tags.length < 1) {
                this.tags = [tag_name]
                document.getElementById('tag-search-add').value = ''
            } else {
                var tags = new Set(adversary.tags)
                tags.add(tag_name)
                this.tags = [...tags]
                document.getElementById('tag-search-add').value = ''
            }
        }
        create_tag_list()
        update_ui(adversary)
    }

    // Add a trait to the passives primary
    _add_trait() {
        // create trait in adversary object
        const passives = [...this.passives]
        const id = `tr-${generate_id()}`
        const name = (document.getElementById('trait-name').value).toUpperCase()
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
            this._integrate_passive(passive_id)
        }
        // create & add new ability object to abilities array in adversary
        const new_ability = createAbility(id, name, description, allegiance, bound_passive, type, magic)
        const abilities = [...this.abilities]
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
        const description = document.querySelector('#inventory-item-div .editor').__quill.root.innerHTML;
        const denomination = document.querySelector(`input[name='inventory-item-denomination']:checked`).value;
        const value = parseInt(document.getElementById('inventory-item-value').value);
        const slots = parseFloat(document.getElementById('inventory-item-slots').value);
        const magic = document.getElementById('inventory-item-magic').checked
        const quantity = parseInt(document.getElementById('inventory-item-quantity').value) || 1
        const allegiance = parseInt(document.getElementById('inventory-item-allegiance').value)
        // optional gear attributes that may affect combat stats
        const defense = document.getElementById('inventory-item-defense').value ? parseInt(document.getElementById('inventory-item-defense').value) : null
        const atkbonus = document.getElementById('inventory-item-atkbonus').value ? parseInt(document.getElementById('inventory-item-atkbonus').value) : null
        const speed = document.getElementById('inventory-item-speed').value ? parseInt(document.getElementById('inventory-item-speed').value) : null
        const max_speed = document.getElementById('inventory-item-max-speed').value ? document.getElementById('inventory-item-max-speed').value : null

        const createItem = (
            id,
            name,
            category,
            type,
            subtype,
            description,
            slots,
            magic,
            quantity,
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
                'magic': magic,
                'quantity': quantity,
                'denomination': denomination,
                'value': value,
                'defense': defense,
                'atkbonus': atkbonus,
                'speed': speed,
                'max_speed': max_speed,
                'allegiance': allegiance,
            });

        if (magic && allegiance > 0) {
            this.bright_points = this.bright_points + allegiance
        } else if (allegiance < 0) {
            this.dark_points = this.dark_points + Math.abs(allegiance)
        }

        inventory.push(createItem(id, name, category, type, subtype, description, slots, magic, quantity, denomination, value, defense, atkbonus, speed, max_speed, allegiance))
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

    _load_item(item_id) {
        const item = this.inventory.find(this_item => this_item.id === item_id)
        const html = `
            <div id="inventory-edit-item-div">
                <div class="item-container">
                    <div class="header break-adversary-header">
                        <h3 class="break-header-text"><i class="material-icons text-white mr-1">edit</i><input
                                data-required id="inventory-item-name" class="basis-xl" value="${item.name}" type="text">
                        </h3>
                    </div>
                    <div id="inventory-item-category-div" class="my-2">
                        <label for="inventory-item-category">Category: </label>
                        <span class="select-wrapper">
                            <select class="dropdown" id="inventory-item-category">
                                <option ${item.category === "Yield" ? "selected" : ""} value="Yield">Yield</option>
                                <option ${item.category === "Equipment" ? "selected" : ""} value="Equipment">Equipment</option>
                                <option ${item.category === "Item" ? "selected" : ""} value="Item">Item</option>
                            </select>
                        </span>
                    </div>
                    <div id="inventory-item-type-subtype-div" class="mb-1">
                        <label class="font-bold" for="inventory-item-type">Item Type: </label>
                        <span class="select-wrapper mb-2">
                            <select class="dropdown" data-required id="inventory-item-type">
                                <option ${item.type === "Weapon" ? "selected" : ""} value="Weapon">Weapon</option>
                                <option ${item.type === "Armor" ? "selected" : ""} value="Armor">Armor</option>
                                <option ${item.type === "Shield" ? "selected" : ""} value="Shield">Shield</option>
                                <option ${item.type === "Outfit" ? "selected" : ""} value="Outfit">Outfit</option>
                                <option ${item.type === "Mount" ? "selected" : ""} value="Mount">Mount</option>
                                <option ${item.type === "Accessories" ? "selected" : ""} value="Accessories">Accessories</option>
                                <option ${item.type === "Wayfinding" ? "selected" : ""} value="Wayfinding">Wayfinding</option>
                                <option ${item.type === "Illumination" ? "selected" : ""} value="Illumination">Illumination</option>
                                <option ${item.type === "Kits" ? "selected" : ""} value="Kits">Specialist Kit</option>
                                <option ${item.type === "Books" ? "selected" : ""} value="Books">Books</option>
                                <option ${item.type === "Consumables" ? "selected" : ""} value="Consumables">Consumable</option>
                                <option ${item.type === "Explosives" ? "selected" : ""} value="Explosives">Explosives</option>
                                <option ${item.type === "Chemicals" ? "selected" : ""} value="Chemicals">Chemicals</option>
                                <option ${item.type === "Reagent" ? "selected" : ""} value="Reagent">Crafting Reagent</option>
                                <option ${item.type === "Misc" ? "selected" : ""} value="Misc">Miscellaneous</option>
                                <option ${item.type === "Curiosity" ? "selected" : ""} value="Curiosity">Curiosity</option>
                                <option ${item.type === "Gadget" ? "selected" : ""} value="Gadget">Gadget</option>
                                <option ${item.type === "Artifact" ? "selected" : ""} value="Artifact">Artifact</option>
                                <option ${item.type === "Otherworld" ? "selected" : ""} value="Otherworld">Otherworldy Items</option>
                                <option ${item.type === "Vehicle" ? "selected" : ""} value="Vehicle">Vehicle</option>
                                <option value="Companion">Companion</option>
                            </select>
                        </span>
                        <span id="inventory-item-subtype-container"></span>
                    </div>
                    <div id="equipment-combat-modifiers" class="hidden mb-1" class="mb-2">
                        <img class="svg-icon" src="images/sword-fill-svgrepo-com.svg"><input min='0' class="text-input"
                            id="inventory-item-atkbonus" type="number">
                        <i class="fa-solid fa-shield"></i><input min='0' value="${item.defense?item.defense:0}" class="text-input" id="inventory-item-defense"
                            type="number">
                        <i class="fa-solid fa-person-running"></i><input value="${item.speed?item.speed:0}" class="text-input" id="inventory-item-speed"
                            type="number">
                        <i class="fa-solid fa-person-running"></i> <label> MAX </label>
                        <span class="select-wrapper">
                            <select class="dropdown font-bold" id="inventory-item-max-speed" >
                                <option ${item.max_speed === "" ? "selected" : ""} value=""></option>
                                <option ${item.max_speed === "slow" ? "selected" : ""} value='slow'>Slow</option>
                                <option ${item.max_speed === "average" ? "selected" : ""} value='average'>Average</option>
                                <option ${item.max_speed === "fast" ? "selected" : ""} value='fast'>Fast</option>
                                <option ${item.max_speed === "veryfast" ? "selected" : ""} value='veryfast'>Very Fast</option>
                            </select>
                        </span>
                    </div>
                    <hr class="faded-hr" />
                    <div id="inventory-item-magic-container" class="flex text-center">
                        <div><label for="inventory-item-magic">Magic: </label></div>
                        <div><label class="switch switch-small ml-3">
                                <input id="inventory-item-magic" type="checkbox" ${item.magic ? 'checked' : ''}
                                    onclick="toggle_magic('inventory-item')">
                                <span class="slider round"></span>
                            </label>
                        </div>
                    </div>
                    <div id="inventory-item-allegiance-div" class="pb-2 hidden">
                        <label for="inventory-item-allegiance">Allegiance Points: </label><input ${item.allegiance ? ` value="${item.allegiance}"` : ''} onchange="set_item_allegiance()" id="inventory-item-allegiance"
                            onchange="set_item_allegiance()" id="inventory-item-allegiance"
                            class="w-10 text-right text-input " type="number" value="0">
                        <span id="item-allegiance-icon-box" class="inline-flex">
                            <span><i id="item-bright" class="material-icons text-stone-200">brightness_5</i><i
                                    id="item-unaligned" class="material-icons text-slate-400">circle</i><i
                                    id="item-dark" class="material-icons text-stone-200">cyclone</i>
                            </span>
                        </span>
                    </div>
                    <div class="editor"></div>
                    <div class="flex flew-row align-top">
                        <div id="inventory-item-slots-div" class="w-1/4">
                            <label for="inventory-item-slots">Slots: </label>
                            <input min='0' value="${item.slots}" class="text-input" id="inventory-item-slots" type="number">
                        </div>
                        <div id="inventory-item-quantity-div" class="w-1/4 text-center">
                            <label>Quantity: </label><input id="inventory-item-quantity" type="number" min="1" value="${item.quantity}"
                                class="text-input">
                        </div>
                        <div id="inventory-item-value-div" class="w-1/2 text-right">
                            <label for="inventory-item-value">Value: </label>
                            <input type="number" ${item.value ? ` value="${item.value}"` : ''} id="inventory-item-value" class="text-input">
                            <div>
                                <span id="inventory-item-denomination-div">
                                    <input class="mr-1" type="radio" id="inventory-item-stones" name="inventory-item-denomination"
                                        value="stones" ${item.denomination === "stones" ? "checked" : ""}><img class="svg-icon mr-2" src="images/stone-pile-svgrepo-com.svg">
                                    <input class="mr-1" type="radio" id="items-coins" name="inventory-item-denomination"
                                        value="coins" ${item.denomination === "coins" ? "checked" : ""}><img class="svg-icon mr-2"
                                        src="images/coin-business-and-finance-svgrepo-com.svg">
                                    <input class="mr-1" type="radio" id="items-gems" name="inventory-item-denomination"
                                        value="gems" ${item.denomination === "gems" ? "checked" : ""}><img class="svg-icon mr-2" src="images/gem-svgrepo-com.svg">
                                </span>
                            </div>
                        </div>
                    </div>
                    <button id="btnAddItem" onclick="adversary._add_item()" disabled
                        class="btn close-modal submit-btn">Save</button>
                </div>
            </div>
        `
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(html, 'text/html');
        const editDiv = htmlDoc.getElementById('inventory-edit-item-div');
        openModal(editDiv)
    }

    // **Adjusts - make changes to existing data and manipulate the DOM to reflect UI changes

    _integrate_passive(passive_id) {
        const passive = this.passives.find(passive => passive.id === passive_id)
        if (passive.type == 'ability') {
            if (passive.modifiers.atkbonus) {
                this._calculate_atkbonus()
            }
            if (passive.modifiers.defense) {
                this._calculate_defense()
            }
            if (passive.modifiers.speed != undefined) {
                this._calculate_speed()
            }
            if (passive.modifiers.hearts) {
                this._calculate_hearts()
            }
            if (passive.modifiers.size != undefined) {
                this._adjust_size()
            }
        } else if (passive.type == "trait") {
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
        if (this.rank < 1) {
            document.getElementById('menace').value = 'mook'
        } else if (this.menace == 'megaboss') {
            return
        } else if (this.rank >= 1) {
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
        if (this.size == 'massive') {
            const createAbility = (id, name, description, allegiance = 0, bound_passive, type = 'basic', magic = false) => ({
                'id': id,
                'name': name,
                'description': description,
                'allegiance': allegiance,
                'bound_passive': bound_passive,
                'type': type,
                'magic': magic

            })
            var abilities = [...this.abilities]
            if (abilities.find(ability => ability.id !== 'ab-sweep-001')) {
                const sweep_ability = createAbility('ab-sweep-001', 'SWEEP ATTACK', 'This adversary can attack as with an Arc Weapon.', 0, false, 'basic', false);
                abilities.push(sweep_ability)
            }
            if (abilities.find(ability => ability.id !== 'ab-focus-001')) {
                const focus_ability = createAbility('ab-focus-001', 'FOCUS ATTACK', 'This adversary can attack as with an Mighty Weapon.', 0, false, 'basic', false);
                abilities.push(focus_ability)
            }
            this.abilities = abilities
        } else {
            var abilities = [...this.abilities]
            //remove sweep and focus attack if size is changed away from massive
            if (abilities.find(ability => ability.id === 'ab-sweep-001')) {
                this._remove_ability('ab-sweep-001')
            }
            if (abilities.find(ability => ability.id === 'ab-focus-001')) {
                this._remove_ability('ab-focus-001')
            }
            update_ui(this)
        }
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
                start: parseInt(data[0]),
                stop: parseInt(data[1])
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
                this.hearts = this.hearts + this_passive.modifiers.hearts
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
            aptitudes.might = aptitudes.might + 2
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
                this.defense = this.defense + this_item.defense
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

    _remove_tag(tag) {
        var tags = [...this.tags]
        const index = tags.indexOf(tag)
        tags.splice(index, 1)
        this.tags = tags
        create_tag_list()
        update_ui(this)
    }

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
        const abilities = [...this.abilities]
        abilities.splice(abilities.indexOf(ability_to_remove), 1)
        this.abilities = abilities
        closeModal()
        update_ui(this)
    }

}