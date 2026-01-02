var saved_adversaries = {}
var current_quill_content = ''

function initializeEditors(scope = document) {
    const editorElements = scope.querySelectorAll('.editor');

    editorElements.forEach(editorDiv => {
        if (!editorDiv.classList.contains('ql-container')) {
            try {
                const quillInstance = new Quill(editorDiv, {
                    theme: 'snow',
                    modules: {
                        toolbar: [['bold', 'italic'], [{ 'list': 'bullet' }]]
                    }
                });
                editorDiv.__quill = quillInstance;
            } catch (e) {
                console.error("Quill Init Error:", e);
            }
        }
    });
}


//Event Handlers
document.addEventListener('change', function (event) {
    // Check if the changed element is the one we care about
    if (event.target && event.target.id === 'inventory-item-type') {

        // Pass the element (event.target) to your function
        fill_subtypes(event.target);
        show_hide_combat_modifiers(event.target.id);
    }
});

function initialize_mood_table_event_handlers() {
    const inputs = document.querySelectorAll('#mood-table > tbody input')
    inputs.forEach(input => {
        input.addEventListener('change', adversary._adjust_mood_table)
    }
    )
}

window.addEventListener('load', function () {
    console.log("Page fully loaded, initializing editors...");
    initializeEditors();
});


// Utility Functions
const generate_id = () => {
    return Math.random().toString(36).slice(2)
}

function confirm_prompt(id) {
    const type_designator = id.split("-")[0]
    var type = ''
    var type_friendly = ''
    var remover = ''
    if (type_designator == 'tr') {
        type = 'passives'
        type_friendly = 'Trait'
        remover = `_remove_trait('${id}')`
    } else if (type_designator == 'ab') {
        type = 'abilities'
        type_friendly = 'Ability'
        remover = `_remove_ability('${id}')`
    } else if (type_designator == 'inv') {
        type = 'inventory'
        type_friendly = 'Item'
        remover = `_remove_item('${id}')`
    }
    const obj_name = adversary[type].find(item => item.id == id).name
    const htmlbody = `
        <div>
            <p>Are you sure you want to remove the ${type_friendly} <strong>${obj_name}</strong>?</p>
            <p>This action cannot be undone.</p>
        </div>
        <button class="btn" onclick="adversary.${remover}">Confirm</button>
        <button class="btn" onclick="closeModal()">Cancel</button>
        `
    openModal('generic-confirm-modal')
    modalBody.innerHTML = htmlbody
}

// Show equipment based combat modifiers if item is weapon, armor, or shield
function show_hide_combat_modifiers(select_element) {
    const item_type_input = document.getElementById(select_element)
    const combat_modifiers = document.getElementById('equipment-combat-modifiers')
    if (item_type_input.value == 'weapon' || item_type_input.value == 'armor' || item_type_input.value == 'shield' || item_type_input.value == 'mount' || item_type_input.value == 'artifact' || item_type_input.value == 'curiosity') {
        combat_modifiers.classList.remove('hidden')
    } else {
        combat_modifiers.classList.add('hidden')
    }
}

// Fill out the item subtypes based on type selected
function fill_subtypes(select_element) {
    const item_type = select_element
    const subtype_select = document.getElementById('inventory-item-subtype-container')
    if (item_type.value == 'weapon') {
        subtype_select.innerHTML = `
        <label>Subtype: </label>
        <span class="select-wrapper">
        <select class="dropdown" id="inventory-item-subtype">
            <option value="weapon-standard">Standard</option>
            <option value="weapon-quick">Quick</option>
            <option value="weapon-master">Master</option>
            <option value="weapon-mighty">Mighty</option>
            <option value="weapon-concealed">Concealed</option>
            <option value="weapon-lash">Lash</option>
            <option value="weapon-arc">Arc</option>
            <option value="weapon-thrown">Thrown</option>
            <option value="weapon-drawn">Drawn</option>
            <option value="weapon-sm-mech">Mechanical, Small</option>
            <option value="weapon-lg-mech">Mechanical, Large</option>
            <option value="weapon-other">Other</option>
        </select>
        </span>
        `
    }
    else if (item_type.value == 'armor') {
        subtype_select.innerHTML = `
        <label>Subtype: </label>
        <span class="select-wrapper">
        <select class="dropdown" id="inventory-item-subtype">
            <option value="armor-light">Light</option>
            <option value="armor-medium">Medium</option>
            <option value="armor-heavy">Heavy</option>
            <option value="armor-superheavy">Superheavy</option>
            <option value="armor-other">Other</option>
        </select>
        </span>
        `
    }
    else if (item_type.value == 'shield') {
        subtype_select.innerHTML = `
        <label>Subtype: </label>
        <span class="select-wrapper">
        <select class="dropdown" id="inventory-item-subtype">
            <option value="shield-small">Small</option>
            <option value="shield-standard">Standard</option>
            <option value="shield-large">Large</option>
            <option value="shield-other">Other</option>
        </select>
        </span>
        `
    }
    else {
        subtype_select.innerHTML = `<label>Subtype: </label><input id="inventory-item-subtype" class="text-input w-55" type="text" placeholder="Enter Subtype">`
    }
}


function menace_color(menace) {

    if (menace == 'mook') {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'bg-lime-500')
    } else if (menace == 'boss') {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'bg-amber-400')
    } else if (menace == 'megaboss') {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'bg-pink-600')
    } else {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'bg-slate-500')
    }

}

function save_adversary() {
    const name = adversary.name;

    saved_adversaries[name] = JSON.parse(JSON.stringify(adversary));
    render_saved_list();
}

function load_adversary(adv_name) {
    adversary = new Adversary({ ...saved_adversaries[adv_name] })
    full_reload
    update_ui(adversary)
}

function render_saved_list() {
    const container = document.getElementById('adversaries-scrollable');
    container.innerHTML = '';

    Object.keys(saved_adversaries).forEach(name => {
        const subname = (`${saved_adversaries[name].size} Rank ${saved_adversaries[name].rank} ${saved_adversaries[name].creature_type}`).toUpperCase()
        const adversary_sidebar_card = `
        <div class="p-4 mb-2 text-center rounded-lg bg-cyan-700 text-white" id="load-${name}" onclick="load_adversary('${name}')">
            <h4 class="font-bold adversary-list-name">${name.toUpperCase()}</h4>
            <p class="italic text-sm adversary-list-subname">${subname}</p>
        </div>`
        container.insertAdjacentHTML('beforeend', adversary_sidebar_card)
    });
}

function render_current_adversary_card() {
    const name = adversary.name ? adversary.name.toUpperCase() : 'UNNAMED ADVERSARY'
    const subname = (`${adversary.size} Rank ${adversary.rank} ${adversary.creature_type}`).toUpperCase()
    document.getElementById('adversary-card-name').innerHTML = name
    document.getElementById('adversary-card-subname').innerHTML = subname
}

function initialize_mood_table() {
    const moods = adversary.moods
    for (const this_mood of moods) {
        add_row(
            this_mood.rolls.start,
            this_mood.rolls.stop,
            this_mood.mood,
            this_mood.mood_text
        )
    }
}

function add_row(roll1 = "", roll2 = "", moodname = "", mooddesc = "") {
    const table = document.querySelector('#mood-table > tbody')
    const row_number = document.querySelectorAll('#mood-table > tbody > tr').length + 1
    const row_html = `
    <tr id="mood-table-row-${row_number}">    
        <td><input type="text" class="w-7 bg-slate-400 rounded-sm pl-1" value="${roll1}" inputmode="numeric" pattern="[0-9]*"> - <input class="w-7 bg-slate-400 rounded-sm pl-1" type="text" value="${roll2}" inputmode="numeric" pattern="[0-9]*"></td>
        <td><input type="text" class="bg-slate-400 rounded-sm w-full pl-2" value="${moodname}"></td>
        <td><input type="text" class="bg-slate-400 rounded-sm w-full pl-2" value="${mooddesc}"></td>
        <td><button onclick="remove_row("${row_number}")" class="btn">X</button></td>
    </tr>
        `
    table.insertAdjacentHTML('beforeend', row_html)
    initialize_mood_table_event_handlers()
}

function remove_row(row_number) {
    const row_to_remove = document.getElementById('mood-table-row-' + row_number)
    //space for removing any existing data from mood table in adversary
    row_to_remove.remove()
}

function ability_types_access() {
    const advanced_ability = document.getElementById('ability-advanced')
    const legendary_ability = document.getElementById('ability-legendary')
    if (adversary.menace == 'mook') {
        advanced_ability.setAttribute('disabled', 'disabled')
        legendary_ability.setAttribute('disabled', 'disabled')
    } else if (adversary.menace == 'boss' && parseInt(adversary.rank) >= 5) {
        advanced_ability.removeAttribute('disabled')
        legendary_ability.setAttribute('disabled', 'disabled')
    } else if (adversary.menace == 'megaboss' && parseInt(adversary.rank) >= 5) {
        advanced_ability.removeAttribute('disabled')
        legendary_ability.removeAttribute('disabled')
    }
}

function set_ability_allegiance() {
    var allegiance = document.getElementById('ability-allegiance').value
    const unaligned = document.getElementById('ability-unaligned')
    const bright = document.getElementById('ability-bright')
    const dark = document.getElementById('ability-dark')
    if (allegiance == 0) {
        unaligned.classList.add('text-slate-400')
        unaligned.classList.remove('text-stone-200')
        bright.classList.add('text-stone-200')
        bright.classList.remove('text-yellow-500')
        dark.classList.add('text-stone-200')
        dark.classList.remove('text-purple-900')
    } else if (allegiance > 0) {
        unaligned.classList.remove('text-slate-400')
        unaligned.classList.add('text-stone-200')
        bright.classList.remove('text-stone-200')
        bright.classList.add('text-yellow-500')
        dark.classList.add('text-stone-200')
        dark.classList.remove('text-purple-900')
    } else if (allegiance < 0) {
        unaligned.classList.remove('text-slate-400')
        unaligned.classList.add('text-stone-200')
        bright.classList.add('text-stone-200')
        bright.classList.remove('text-yellow-500')
        dark.classList.remove('text-stone-200')
        dark.classList.add('text-purple-900')
    }
}

// Aptitude bar visualization

const barContainer = document.getElementById('bar-container');
const labelContainer = document.getElementById('label-container');
let inputs = Array.from({ length: 5 }, (_, i) => document.getElementById(`input-${i}`));
const resetBtn = document.getElementById('reset-btn');
const equalizeBtn = document.getElementById('equalize-btn');

const colors = [
    'bg-red-500',    // Might
    'bg-orange-500', // Deftness
    'bg-green-500',    // Grit
    'bg-blue-500',  // Insight
    'bg-purple-500'    // Aura
];

const titles = ['Might', 'Deftness', 'Grit', 'Insight', 'Aura'];

function updateVisualization() {
    const values = inputs.map(input => Math.max(0, parseFloat(input.value) || 0));
    const total = values.reduce((acc, val) => acc + val, 0);

    barContainer.innerHTML = '';
    labelContainer.innerHTML = '';

    if (total === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'w-full h-full flex items-center justify-center text-slate-400 text-sm italic';
        emptyMsg.textContent = 'Enter attribute values to calculate balance';
        barContainer.appendChild(emptyMsg);
        return;
    }

    values.forEach((val, i) => {
        const percentage = (val / total) * 100;

        // Create Segment
        if (percentage > 0) {
            const segment = document.createElement('div');
            segment.className = `bar-segment h-full ${colors[i]} border-r border-white/20 last:border-0`;
            segment.style.width = `${percentage}%`;
            segment.title = `${titles[i]}: ${val} (${percentage.toFixed(1)}%)`;
            barContainer.appendChild(segment);
        }
    });
}

inputs.forEach(input => {
    input.addEventListener('input', updateVisualization);
});



// Used to help track changes to adversary stats across rank changes
// rank:[attack bonus,hearts,primary stat value, secondary stat value (p.432 phb)]
rank_stats = {
    0: [0, 1, 6, 6],
    1: [1, 2, 8, 7],
    2: [2, 2, 8, 7],
    3: [2, 3, 9, 8],
    4: [3, 3, 9, 8],
    5: [4, 4, 10, 9],
    6: [4, 4, 10, 9],
    7: [5, 5, 11, 10],
    8: [6, 5, 11, 10],
    9: [6, 6, 12, 11],
    10: [7, 6, 12, 11],
    11: [8, 7, 13, 12],
    12: [8, 7, 13, 12],
    13: [9, 8, 14, 13],
    14: [10, 8, 14, 13],
    15: [10, 9, 15, 14]

}

// Instead of hard setting the max rank at 15, I generated it based on the number of ranks in rank_stats 
// this way if high-level enemies or prestige enemies are introduced (or I add the ability to just make higher rank enemies)
// it will be easier to implement dynamically
function set_max_rank() {
    const max_rank = Object.keys(rank_stats).length - 1
    document.getElementById('rank').max = max_rank
}

// Load page with some preformatted adversary data
var adversary = new Adversary({
    name: 'New Adversary',
    menace: "",
    rank: 1,
    size: 'medium',
    hearts: rank_stats[1][1],
    atkbonus: rank_stats[1][0],
    bright_points: 0,
    dark_points: 0,
    defense: 10,
    speed: 'average',
    creature_type: 'monster',
    creature_subtype: 'Abberant',
    primary_aptitudes: [],
    inventory: [],
    description: null,
    passives: [],
    abilities: [],
    facts: {
        'habitat': {
            description: ''
        },
        'communication': {
            description: ''
        },
        'tactics': {
            description: ''
        },
        'indicators': {
            description: ''
        },
        'role-playing-notes': {
            description: ''
        },
        'customization': {
            description: ''
        }

    },
    moods: [
        {
            rolls: {
                start: 1,
                stop: 5
            },
            mood: 'Friendly/Benign',
            mood_text: 'This creature seems to have a favorable disposition to you'
        },
        {
            rolls: {
                start: 6,
                stop: 14
            },
            mood: 'Indifferent/Wary',
            mood_text: 'This creature is not immediately interested in harming you, but is watchful'
        },
        {
            rolls: {
                start: 15,
                stop: 20
            },
            mood: 'Hostile/Bloodthirsty',
            mood_text: 'This creature is angry or aggressive. Prepare for combat'
        }
    ]
})

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
    if (adversary.allegiance == 'unaligned' || adversary.allegiance == undefined) {
        document.getElementById('unaligned').classList.remove('hidden')
        document.getElementById('bright').classList.add('hidden')
        document.getElementById('dark').classList.add('hidden')
        document.getElementById('twilight').classList.add('hidden')
        app_main_div.classList.add('unaligned-allegiance')
        app_main_div.classList.remove('dark-allegiance', 'bright-allegiance', 'twilight-allegiance')
    } else if (adversary.allegiance == 'bright') {
        document.getElementById('unaligned').classList.add('hidden')
        document.getElementById('bright').classList.remove('hidden')
        document.getElementById('dark').classList.add('hidden')
        document.getElementById('twilight').classList.add('hidden')
        app_main_div.classList.add('bright-allegiance')
        app_main_div.classList.remove('dark-allegiance', 'unaligned-allegiance', 'twilight-allegiance')
    } else if (adversary.allegiance == 'dark') {
        document.getElementById('unaligned').classList.add('hidden')
        document.getElementById('bright').classList.add('hidden')
        document.getElementById('dark').classList.remove('hidden')
        document.getElementById('twilight').classList.add('hidden')
        app_main_div.classList.add('dark-allegiance')
        app_main_div.classList.remove('bright-allegiance', 'unaligned-allegiance', 'twilight-allegiance')
    } else if (adversary.allegiance == 'twilight') {
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
        const passive_id = (`${passive.type}-${passive.id}`)
        if (passive.type == 'trait') {
            const trait_span = `<span class="trait-span" id="${passive.id}" onclick="confirm_prompt('${passive.id}')">${(passive.name).toUpperCase()} (${passive.value >= 0 ? '+' : ''}${passive.value} ${passive.modifier.toUpperCase()})</span>`
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
        ability_div.setAttribute('onclick', `confirm_prompt('${item.id}')`)
        if (ability.allegiance != 0) {
            const allegiance_box = `<div class="${allegiance > 0 ? 'ability-bright-allegiance' : allegiance < 0 ? 'ability-dark-allegiance' : ''}" id="allegiance-box-${name}-${type}">Adds ${Math.abs(allegiance)} ${allegiance > 0 ? 'Bright' : allegiance < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
            ability_div.insertAdjacentHTML('beforeend', allegiance_box)
        }
    })

    // make changes to inventory container
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
        inventory_container.insertAdjacentHTML('beforeend', item_block)
        const item_div = document.getElementById(`${item.category}-${item.id}`)
        if (item.allegiance) {
            const allegiance_box = `<div class="${item.allegiance > 0 ? 'item-bright-allegiance' : item.allegiance < 0 ? 'item-dark-allegiance' : ''}" id="allegiance-box-${item.id}">Adds ${Math.abs(item.allegiance)} ${item.allegiance > 0 ? 'Bright' : item.allegiance < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
            item_div.insertAdjacentHTML('beforeend', allegiance_box)
        }
        item_div.setAttribute('onclick', `confirm_prompt('${item.id}')`)
    })

    //update the data bars
    updateVisualization()
    render_current_adversary_card()
}

const exportAdversariesJson = (data, filename = 'adversaries.json') => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

const importAdversariesJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                console.log("Data imported successfully:", importedData);
                saved_adversaries = importedData;
                render_saved_list();
            } catch (err) {
                console.error("Error parsing JSON:", err);
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// On page loads
adversary._calculate_aptitudes()
initialize_mood_table()
set_max_rank()
menace_color(document.getElementById('menace').value)
update_ui(adversary)
render_current_adversary_card()
render_saved_list()
