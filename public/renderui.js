// make changes on the page to represent changes in the data structure for the current adversary

function update_ui(adversary) {
    document.getElementById('adversary-name').value = adversary.name
    document.getElementById('menace').value = adversary.menace
    document.getElementById('rank').value = adversary.rank
    document.getElementById('size').value = adversary.size
    document.getElementById('hearts').innerHTML = adversary.hearts
    document.getElementById('atk-bonus').innerHTML = adversary.atkbonus
    document.getElementById('defense').innerHTML = adversary.defense
    document.getElementById('speed').value = adversary.speed
    document.getElementById('adversary-type').value = adversary.creature_type
    document.getElementById('adversary-subtype').value = adversary.creature_subtype

    // Primary Aptitudes check
    document.getElementById('input-0').value = adversary.aptitudes.might
    if (adversary.primary_aptitudes.includes('might')) { document.getElementById('might-primary').checked = true }
    document.getElementById('input-1').value = adversary.aptitudes.deftness
    if (adversary.primary_aptitudes.includes('deftness')) { document.getElementById('deftness-primary').checked = true }
    document.getElementById('input-2').value = adversary.aptitudes.grit
    if (adversary.primary_aptitudes.includes('grit')) { document.getElementById('grit-primary').checked = true }
    document.getElementById('input-3').value = adversary.aptitudes.insight
    if (adversary.primary_aptitudes.includes('insight')) { document.getElementById('insight-primary').checked = true }
    document.getElementById('input-4').value = adversary.aptitudes.aura
    if (adversary.primary_aptitudes.includes('aura')) { document.getElementById('aura-primary').checked = true }

    // Allegiance visualization
    const app_main_div = document.getElementById('app-main')
    if (adversary.allegiance = 'unaligned') {
        document.getElementById('unaligned').classList.remove('hidden')
        document.getElementById('bright').classList.add('hidden')
        document.getElementById('dark').classList.add('hidden')
        document.getElementById('twilight').classList.add('hidden')
        app_main_div.classList.add('unaligned-allegiance')
        app_main_div.classList.remove('dark-allegiance', 'bright-allegiance', 'twilight-allegiance')
    } else if (adversary.allegiance = 'bright') {
        document.getElementById('unaligned').classList.add('hidden')
        document.getElementById('bright').classList.remove('hidden')
        document.getElementById('dark').classList.add('hidden')
        document.getElementById('twilight').classList.add('hidden')
        app_main_div.classList.add('bright-allegiance')
        app_main_div.classList.remove('dark-allegiance', 'unaligned-allegiance', 'twilight-allegiance')
    } else if (adversary.allegiance = 'dark') {
        document.getElementById('unaligned').classList.add('hidden')
        document.getElementById('bright').classList.add('hidden')
        document.getElementById('dark').classList.remove('hidden')
        document.getElementById('twilight').classList.add('hidden')
        app_main_div.classList.add('dark-allegiance')
        app_main_div.classList.remove('bright-allegiance', 'unaligned-allegiance', 'twilight-allegiance')
    } else {
        document.getElementById('unaligned').classList.add('hidden')
        document.getElementById('bright').classList.add('hidden')
        document.getElementById('dark').classList.add('hidden')
        document.getElementById('twilight').classList.remove('hidden')
        app_main_div.classList.add('twilight-allegiance')
        app_main_div.classList.remove('bright-allegiance', 'unaligned-allegiance', 'dark-allegiance')
    }

    // Make changes to trait container
    const trait_container = document.getElementById('trait-container')
    trait_container.innerHTML = ''
    adversary.passives.forEach(passive => {
        const passive_id = (`${ability.type}-${ability.id}`)
        if (passive.type == 'trait') {
            const trait_span = `<span id="${passive.id}" onclick='adversary._remove_trait("${passive.id}")'>${(passive.name).toUpperCase()} (${passive.value >= 0 ? '+' : ''}${passive.value} ${passive.modifier.toUpperCase()})</span>`
            trait_container.insertAdjacentHTML('beforeend', trait_span)

        } else if (passive.type = "ability") {
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

    // make changes to ability container
    const ability_container = document.getElementById('ability-container')
    ability_container.innerHTML = ''
    adversary.abilities.forEach(ability => {
        const name = ability.name
        const type = ability.type
        const description = ability.description
        const allegiance = ability.allegiance
        const magic = ability.magic
        const id = ability.id
        const ability_block = `
        <div id="${id}" class="ability-card w-1/2">
            <div class="text-white flex"><span class="font-bold">${name}</span><span class="ability-icon">${type == 'Basic' ? 'B' : type == 'Advanced' ? 'A' : type == 'Legendary' ? 'L' : 'NA'}</span>${magic ? '<span class="magic-icon">M</span>' : ''}</div>
            <div class="ability-content bg-slate-200 p-1 rounded-md">
                ${description != 'None' ? `<div id=description" class="italic">${description}</div>` : ''}
            </div>
        </div>
        `
        ability_container.insertAdjacentHTML('beforeend', ability_block)
        const ability_div = document.getElementById(id)
        ability_div.setAttribute('onclick', `adversary._remove_ability('${name}')`)
        if (ability.allegiance != 0) {
            const allegiance_box = `<div class="${allegiance > 0 ? 'ability-bright-allegiance' : allegiance < 0 ? 'ability-dark-allegiance' : ''}" id="allegiance-box-${name}-${type}">Adds ${Math.abs(allegiance)} ${allegiance > 0 ? 'Bright' : allegiance < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
            ability_div.insertAdjacentHTML('beforeend', allegiance_box)
        }
    })

    const inventory_container = document.getElementById('inventory-container')
    inventory_container.innerHTML = ''
    adversary.inventory.forEach(item => {
        const item_block = `
            <div id="${item.category}-${item.id}" class="${item.category == 'equipment' ? 'equipment-card' : item.category == 'item' ? 'item-card' : item.category == 'yield' ? 'yield-card' : ''} w-1/2 mb-2   ">
                <div class="text-white"><span class="font-bold">${item.name}</span> (<span
                        class="italic">${item.subtype}</span>)</div>
                <div class="item-content bg-slate-200 p-1 rounded-md">
                    <div>
                        ${item.atkbonus > 0 ? `<img class="svg-icon" src="images/sword-fill-svgrepo-com.svg"></i><span>+${item.atkbonus}</span>` : ''}
                        ${item.defense > 0 ? `<i class="fa-solid fa-shield"></i><span>+${item.defense}</span>` : ''}
                        ${item.speed > 0 || item.speed < 0 ? `<i class="fa-solid fa-person-running"></i><span>MAX: ${item.speed}</span>` : ''}
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
        if (item.allegiance != 0) {
            const allegiance_box = `<div class="${item.allegiance > 0 ? 'item-bright-allegiance' : item.allegiance < 0 ? 'item-dark-allegiance' : ''}" id="allegiance-box-${item.id}">Adds ${Math.abs(item.allegiance)} ${item.allegiance > 0 ? 'Bright' : item.allegiance < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
            ability_div.insertAdjacentHTML('beforeend', allegiance_box)
        }
        inventory_container.insertAdjacentHTML('beforeend', item_block)
        const item_div = document.getElementById(item.id)
        item_div.setAttribute('onclick', `adversary._remove_item('${item.name}')`)
    })

    //update the data bars
    updateVisualization()
    render_current_adversary_card()
}