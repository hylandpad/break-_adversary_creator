var saved_adversaries = {}
var current_quill_content = ''
const app_version = parseFloat(app_version_number).toFixed(3)
registerCustomBlots();
function initializeEditors(scope = document) {
    const editorElements = scope.querySelectorAll('.editor');

    editorElements.forEach(editorDiv => {
        if (!editorDiv.classList.contains('ql-container')) {
            try {
                const quill = new Quill(editorDiv, {
                    theme: 'snow',
                    modules: {
                        toolbar: [['bold', 'italic'], [{ 'list': 'bullet' }, { 'list': 'ordered' }], ['blockquote']]
                    }
                });

                // The Shorthand Listener
                quill.on('text-change', (delta, oldDelta, source) => {
                    if (source !== 'user') return;

                    const selection = quill.getSelection();
                    if (!selection) return;

                    const [line, offset] = quill.getLine(selection.index);
                    const text = line.domNode.textContent;

                    // Matches: [Might | Pass: x | Fail: y] with any amount of spacing
                    const checkRegex = /\[\s*(Might|Deftness|Grit|Insight|Aura)\s*\|\s*Pass:\s*(.*?)\s*\|\s*Fail:\s*(.*?)\]$/i;

                    // Matches: [Might vs Deftness | Pass: x | Fail: y] with any amount of spacing
                    const contestRegex = /\[\s*(Might|Deftness|Grit|Insight|Aura)\s+vs\s+(Might|Deftness|Grit|Insight|Aura)\s*\|\s*Pass:\s*(.*?)\s*\|\s*Fail:\s*(.*?)\]$/i;

                    let match;
                    if ((match = text.match(contestRegex))) {
                        let [fullMatch, yourAttr, theirAttr, pass, fail] = match;

                        const lineIndex = quill.getIndex(line);
                        const absoluteStartIndex = lineIndex + text.lastIndexOf(fullMatch);

                        if (absoluteStartIndex >= 0) {
                            quill.deleteText(absoluteStartIndex, fullMatch.length);
                            quill.insertEmbed(absoluteStartIndex, 'skillAction', {
                                yourAttr: yourAttr.trim(),
                                theirAttr: theirAttr.trim(),
                                pass: pass.trim(),
                                fail: fail.trim(),
                                isContest: true
                            });
                            quill.setSelection(absoluteStartIndex + 1, Quill.sources.SILENT);
                        }
                    }
                    else if ((match = text.match(checkRegex))) {
                        let [fullMatch, attr, pass, fail] = match;

                        const lineIndex = quill.getIndex(line);
                        const absoluteStartIndex = lineIndex + text.lastIndexOf(fullMatch);

                        if (absoluteStartIndex >= 0) {
                            quill.deleteText(absoluteStartIndex, fullMatch.length);
                            quill.insertEmbed(absoluteStartIndex, 'skillAction', {
                                yourAttr: attr.trim(),
                                pass: pass.trim(),
                                fail: fail.trim(),
                                isContest: false
                            });
                            quill.setSelection(absoluteStartIndex + 1, Quill.sources.SILENT);
                        }
                    }
                });

                editorDiv.__quill = quill;
            } catch (e) {
                console.error("Quill Init Error:", e);
            }
        }
    });
}

function fill_version_num() {
    document.getElementById('version').innerText = app_version
}

function fill_help_text() {
    document.getElementById('help-content').innerHTML = help_text
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


window.addEventListener('load', function () {
    console.log("Page fully loaded, initializing editors...");
    initializeEditors();
    update_ui(adversary)
});

// Utility Functions;

window.onload = () => {
    menace_color(document.getElementById('menace').value)
    set_max_rank()

    // Load saved adversaries from localStorage
    const storedData = localStorage.getItem('saved_adversaries');

    if (storedData) {
        saved_adversaries = JSON.parse(storedData);
        console.log("Adversaries loaded:", saved_adversaries);
    } else {
        console.log("No saved data found.");
    }

    // Create tag list
    create_tag_list()
};

function load_example_adversaries() {
    Object.keys(example_adversaries).forEach(name => {
        saved_adversaries[name] = example_adversaries[name];
    });
    // Save to localStorage
    const stringData = JSON.stringify(saved_adversaries);
    localStorage.setItem('saved_adversaries', stringData);
    render_saved_list(saved_adversaries);
    console.log("Example Adversaries loaded and saved locally!");
    show_toast("Example Adversaries loaded!", 2000);
}

const show_toast = (message, duration = 3000) => {
    const toast = document.getElementById('toast-content')
    toast.innerText = message
    toast.classList.remove('opacity-0')
    toast.classList.add('opacity-100')
    setTimeout(() => {
        toast.classList.add('opacity-0')
        toast.classList.remove('opacity-100')
    }, duration)
}

const generate_id = () => {
    return Math.random().toString(36).slice(2)
}


function create_tag_list() {
    var tag_set = new Set(
        [
            'Bright',
            'Dark',
            'Controller',
            'Tank',
            'Blaster',
            'Striker',
            'Support'
        ]
    )

    datalist = document.getElementById('tag-suggestions')
    datalist.innerHTML = '';

    adversary.tags.forEach(tag => tag_set.add(tag))

    const adversaries = Object.keys(saved_adversaries)
    adversaries.forEach(adversary => {
        saved_adversaries[adversary].tags.forEach(tag => tag_set.add(tag))
    })

    for (let tag of tag_set) {
        option = document.createElement('option')
        option.value = tag
        datalist.appendChild(option)
    }
}

function render_tags_for_filter() {
    var tag_set = new Set(
        [
            'Bright',
            'Dark',
            'Controller',
            'Tank',
            'Blaster',
            'Striker',
            'Support'
        ]
    )
    const filter_tag_container = document.getElementById('filter-tags-list')
    const adversaries = Object.keys(saved_adversaries)
    adversaries.forEach(adversary => {
        saved_adversaries[adversary].tags.forEach(tag => tag_set.add(tag))
    })
    filter_tag_container.innerHTML = ''
    tag_set = [...tag_set]
    tag_set.sort().forEach(tag => {
        const tag_html = `<div class="mx-1 inline-block"><input id="tag-${tag}" name="tag-filter" type="checkbox" value="${tag}" onclick="update_filter()"><label class="mx-1 px-1" for="tag-${tag}">${tag}</label></div>`
        filter_tag_container.innerHTML += tag_html
    })
}

function update_filter() {
    tag_list = []
    document.querySelectorAll('input[name="tag-filter"]:checked').forEach(el => { tag_list.push(el.value) })
    render_filtered_list(tag_list)
}

function render_filtered_list(tags) {
    if (tags.length == 0) {
        render_saved_list(saved_adversaries)
    } else {
        const adversaries = Object.keys(saved_adversaries)
        var filtered_adversaries = {}
        tags.forEach(tag => {
            adversaries.forEach(adversary => {
                if (saved_adversaries[adversary].tags.includes(tag)) {
                    filtered_adversaries[adversary] = saved_adversaries[adversary]
                }
            })
        })
        render_saved_list(filtered_adversaries)
    }
}

function toggle_magic(item_or_ability) {
    const magic_checkbox = document.getElementById(`${item_or_ability}-magic`);
    if (magic_checkbox.checked) {
        document.getElementById(`${item_or_ability}-allegiance-div`).classList.remove('hidden')
        document.getElementById(`${item_or_ability}-allegiance-div`).classList.add('inline-flex');
    } else {
        document.getElementById(`${item_or_ability}-allegiance-div`).classList.add('hidden')
        document.getElementById(`${item_or_ability}-allegiance-div`).classList.remove('inline-flex');
    }
}

function confirm_prompt(id_or_name) {
    if (saved_adversaries[id_or_name]) {
        const obj_name = saved_adversaries[id_or_name].name;
        const htmlbody = `
            <div>
                <p>Are you sure you want to remove <strong>${obj_name}</strong> from your saved Adversaries list?</p>
                <p>This action cannot be undone.</p>
            </div>
            <button class="btn" onclick="remove_saved_adversary('${id_or_name}')">Confirm</button>
            <button class="btn" onclick="closeModal()">Cancel</button>
            `;
        openModal('generic-confirm-modal')
        modalBody.innerHTML = htmlbody
    } else {
        const type_designator = id_or_name.split("-")[0]
        var type = ''
        var type_friendly = ''
        var remover = ''
        if (type_designator == 'tr') {
            type = 'passives'
            type_friendly = 'Trait'
            remover = `_remove_trait('${id_or_name}')`
        } else if (type_designator == 'ab') {
            type = 'abilities'
            type_friendly = 'Ability'
            remover = `_remove_ability('${id_or_name}')`
        } else if (type_designator == 'inv') {
            type = 'inventory'
            type_friendly = 'Item'
            remover = `_remove_item('${id_or_name}')`
        }

        const obj_name = adversary[type].find(item => item.id == id_or_name).name
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
}

// Show equipment based combat modifiers if item is weapon, armor, or shield
function show_hide_combat_modifiers(select_element) {
    const item_type_input = document.getElementById(select_element)
    const combat_modifiers = document.getElementById('equipment-combat-modifiers')
    if (item_type_input.value == 'Weapon' || item_type_input.value == 'Armor' || item_type_input.value == 'Shield' || item_type_input.value == 'Mount' || item_type_input.value == 'Artifact' || item_type_input.value == 'Curiosity') {
        combat_modifiers.classList.remove('hidden')
    } else {
        combat_modifiers.classList.add('hidden')
    }
}

// Fill out the item subtypes based on type selected
function fill_subtypes(select_element) {
    const item_type = select_element
    const subtype_select = document.getElementById('inventory-item-subtype-container')
    if (item_type.value == 'Weapon') {
        subtype_select.innerHTML = `
        <label>Subtype: </label>
        <span class="select-wrapper">
        <select class="dropdown" data-required id="inventory-item-subtype">
            <option value="Standard Weapon">Standard</option>
            <option value="Quick Weapon">Quick</option>
            <option value="Master Weapon">Master</option>
            <option value="Mighty Weapon">Mighty</option>
            <option value="Concealed Weapon">Concealed</option>
            <option value="Lash Weapon">Lash</option>
            <option value="Arc Weapon">Arc</option>
            <option value="Thrown Weapon">Thrown</option>
            <option value="Drawn Weapon">Drawn</option>
            <option value="Mechanical Weapon, Small">Mechanical, Small</option>
            <option value="Mechanical Weapon, Large">Mechanical, Large</option>
            <option value="Other Weapon">Other</option>
        </select>
        </span>
        `
    }
    else if (item_type.value == 'Armor') {
        subtype_select.innerHTML = `
        <label>Subtype: </label>
        <span class="select-wrapper">
        <select class="dropdown" data-required id="inventory-item-subtype">
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Heavy">Heavy</option>
            <option value="Superheavy">Superheavy</option>
            <option value="Other">Other</option>
        </select>
        </span>
        `
    }
    else if (item_type.value == 'Shield') {
        subtype_select.innerHTML = `
        <label>Subtype: </label>
        <span class="select-wrapper">
        <select class="dropdown" data-required id="inventory-item-subtype">
            <option value="Small">Small</option>
            <option value="Standard">Standard</option>
            <option value="Large">Large</option>
            <option value="Other">Other</option>
        </select>
        </span>
        `
    }
    else {
        subtype_select.innerHTML = `<label>Subtype: </label><input data-required id="inventory-item-subtype" class="text-input w-55" type="text" placeholder="Enter Subtype">`
    }
}

function menace_color(menace) {

    if (menace == 'mook') {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'mook')
    } else if (menace == 'boss') {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'boss')
    } else if (menace == 'megaboss') {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'megaboss')
    } else {
        document.getElementById('menace').className = ''
        document.getElementById('menace').classList.add('rounded-lg', 'bg-slate-500')
    }

}

function save_adversary() {
    const name = adversary.name;
    const toast_message = 'Adversary "' + name + '" saved!';

    saved_adversaries[name] = JSON.parse(JSON.stringify(adversary));
    show_toast(toast_message, 2000);

    // Save to localStorage
    const stringData = JSON.stringify(saved_adversaries);
    localStorage.setItem('saved_adversaries', stringData);
    console.log("Adversaries saved locally!");
}

function load_adversary() {
    const adv_name = document.getElementById('saved-adversaries-dropdown').value;
    adversary = new Adversary({ ...saved_adversaries[adv_name] })
    const toast_message = 'Adversary "' + adv_name + '" loaded!';

    update_ui(adversary)
    closeModal()
    show_toast(toast_message, 2000);
}

function create_new_adversary() {
    adversary = new Adversary(adversary_template);
    const toast_message = 'New Adversary created!';
    adversary._calculate_aptitudes()
    update_ui(adversary)
    show_toast(toast_message, 2000);
}


function remove_saved_adversary(adv_name = curr_adv) {
    delete saved_adversaries[adv_name];
    const toast_message = 'Adversary "' + adv_name + '" removed from saved list!';
    closeModal();

    // Save to localStorage
    const stringData = JSON.stringify(saved_adversaries);
    localStorage.setItem('saved_adversaries', stringData);

    create_new_adversary()
    show_toast(toast_message, 2000);
}

function render_saved_list(adversaries) {
    const dropdown = document.getElementById('saved-adversaries-dropdown')
    dropdown.innerHTML = ''
    Object.keys(adversaries).sort().forEach(name => {
        const saved_adversary_dropdown_item = `
        <option value="${name}">${name}</option>
        `
        dropdown.insertAdjacentHTML('beforeend', saved_adversary_dropdown_item)
    });
}

function initialize_mood_table() {
    document.querySelector('#mood-table tbody').innerHTML = ''
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
        <td><input type="text" class="w-7 bg-slate-300 rounded-sm pl-1" value="${roll1}" inputmode="numeric" pattern="[0-9]*"> - <input class="w-7 bg-slate-300 rounded-sm pl-1" type="text" value="${roll2}" inputmode="numeric" pattern="[0-9]*"></td>
        <td><input type="text" class="bg-slate-300 rounded-sm w-full pl-2" value="${moodname}"></td>
        <td><input type="text" class="bg-slate-300 rounded-sm w-full pl-2" value="${mooddesc}"></td>
        <td><button onclick="remove_row("${row_number}")" class="btn">X</button></td>
    </tr>
        `
    table.insertAdjacentHTML('beforeend', row_html)
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

function set_item_allegiance() {
    var allegiance = document.getElementById('inventory-item-allegiance').value
    const unaligned = document.getElementById('item-unaligned')
    const bright = document.getElementById('item-bright')
    const dark = document.getElementById('item-dark')
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
    name: null,
    aptitudes: {
        "might": 7,
        "deftness": 7,
        "grit": 7,
        "insight": 7,
        "aura": 7
    },
    menace: "",
    rank: 1,
    description: "",
    size: 'medium',
    hearts: rank_stats[1][1],
    atkbonus: rank_stats[1][0],
    bright_points: 0,
    dark_points: 0,
    defense: 10,
    speed: 'average',
    creature_type: 'monster',
    creature_subtype: '',
    primary_aptitudes: [],
    inventory: [],
    passives: [],
    tags: [],
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

var adversary_template = JSON.parse(JSON.stringify(adversary))

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
    const primary_aptitude_checkboxes = [
        document.getElementById('might-primary'),
        document.getElementById('deftness-primary'),
        document.getElementById('grit-primary'),
        document.getElementById('insight-primary'),
        document.getElementById('aura-primary')
    ]
    primary_aptitude_checkboxes.forEach(checkbox => {
        checkbox.checked = false
    })

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

    //fill quill editor with description from adversary
    const description_editor = document.querySelector('#description-container-div div.editor').__quill
    description_editor.root.innerHTML = adversary.description;
    

    // Display all the adversary's tags
    if (adversary.tags) {
        const tags = adversary.tags
        const tags_container = document.getElementById('tags-container')
        tags_container.innerHTML = ''
        tags.forEach(tag => {
            tag_element = `<span class="tag-chip" onclick="adversary._remove_tag('${tag}')">${tag}</span>`
            tags_container.innerHTML += tag_element
        })
    } else {
        const tags_container = document.getElementById('tags-container')
        tags_container.innerHTML = ''
    }

    // Make changes to trait container
    const trait_container = document.getElementById('trait-container')
    trait_container.innerHTML = ''
    adversary.passives.forEach(passive => {
        if (passive.type == 'trait') {
            const trait_span = `<span class="trait-span" id="${passive.id}" onclick="confirm_prompt('${passive.id}')">${(passive.name).toUpperCase()} (${passive.value >= 0 ? '+' : ''}${passive.value} ${passive.modifier.toUpperCase()})</span>`
            trait_container.insertAdjacentHTML('beforeend', trait_span)

        } else if (passive.type = "ability") {
            const passive_span_html = `
            <span class="passive-span font-bold" id="${passive.id}">${passive.name}: </span>
            `
            trait_container.insertAdjacentHTML('beforeend', passive_span_html)
            const passive_span = document.getElementById(passive.id)
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
            if (passive.modifiers.size) {
                const size_span = `<span><i class="fa-solid fa-person"></i>Size - ${(passive.modifiers.size).toUpperCase()}</span>`
                passive_span.insertAdjacentHTML('beforeend', size_span)
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
            <div class="text-white flex"><span class="font-bold">${name}</span><span class="ability-icon">${type == 'Basic' ? 'B' : type == 'Advanced' ? 'A' : type == 'Legendary' ? 'L' : 'NA'}</span>${magic ? '<span class="magic-icon-ability">M</span>' : ''}</div>
            <div class="ability-content bg-slate-200 p-1 rounded-md">
                ${description != 'None' ? `<div id=description" class="italic">${description}</div>` : ''}
            </div>
        </div>
        `
        ability_container.insertAdjacentHTML('beforeend', ability_block)
        const ability_div = document.getElementById(id)
        ability_div.setAttribute('onclick', `confirm_prompt('${ability.id}')`)
        if (ability.allegiance != 0) {
            const allegiance_box = `<div class="${allegiance > 0 ? 'ability-bright-allegiance' : allegiance < 0 ? 'ability-dark-allegiance' : ''}" id="allegiance-box-${name}-${type}">Adds ${Math.abs(allegiance)} ${allegiance > 0 ? 'Bright' : allegiance < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
            ability_div.insertAdjacentHTML('beforeend', allegiance_box)
        }
    })

    // make changes to inventory container
    const inventory_container = document.getElementById('inventory-container')
    inventory_container.innerHTML = ''
    adversary.inventory.forEach(item => {
        const magic = item.magic
        var max_speed_text = ''
        if (item.max_speed) {
            if (item.max_speed == 'veryfast') {
                var max_speed_text = 'VERY FAST'
            } else {
                var max_speed_text = item.max_speed.toUpperCase()
            }
        }

        const item_block = `
            <div id="${item.category}-${item.id}" class="${item.category == 'Equipment' ? 'equipment-card' : item.category == 'Item' ? 'item-card' : item.category == 'Yield' ? 'yield-card' : ''} w-1/2 mb-2   ">
                <div class="text-white flex"><span class="font-bold">${item.name}${item.quantity > 1 ? ' (x' + item.quantity + ')' : ''}</span> (<span
                        class="italic">${item.type} - ${item.subtype}</span>)<span class="font-bold">: ${item.category}</span>${magic ? `<span class="magic-icon-${item.category.toLowerCase()}">M</span></span>` : ''}</div>
                <div class="item-content bg-slate-200 p-1 mt-2 rounded-md">
                    <div>
                        ${item.atkbonus > 0 ? `<label>Total Attack Bonus </label><img class="svg-icon" src="images/sword-fill-svgrepo-com.svg"></i><span>+${parseInt(item.atkbonus) + parseInt(adversary.atkbonus)}</span>` : ''}
                        ${item.defense > 0 ? `<i class="fa-solid fa-shield"></i><span>+${item.defense}</span>` : ''}
                        ${item.speed > 0 || item.speed < 0 ? `<i class="fa-solid fa-person-running"></i><span>${item.speed}</span>` : ''}
                        ${item.max_speed ? `<span class="font-bold"></span><i class="fa-solid fa-person-running"></i><span><strong>MAX: </strong>${max_speed_text}</span>` : ''}
                    </div>
                    ${item.description != 'None' ? `<div id=${item.id}-description" class="italic">${item.description}</div>` : ''}
                </div>
                <div class="text-stone-200 italic flex">
                    <div id="${item.category}-${item.id}-slots" class="basis-xs">Slots : ${item.slots * item.quantity}</div>
                    <div id="${item.category}-${item.id}-value" class="basis-1/3 text-right">${item.value * item.quantity} ${item.denomination}</div>
                </div>
            </div>
            `
        inventory_container.insertAdjacentHTML('beforeend', item_block)
        const item_div = document.getElementById(`${item.category}-${item.id}`)

        //insert allegiance box if item has allegiance
        if (item.allegiance) {
            const allegiance_box = `<div class="${item.allegiance > 0 ? 'item-bright-allegiance' : item.allegiance < 0 ? 'item-dark-allegiance' : ''}" id="allegiance-box-${item.id}">Adds ${Math.abs(item.allegiance)} ${item.allegiance > 0 ? 'Bright' : item.allegiance < 0 ? 'Dark' : ''} Allegiance Point(s)</div>`
            item_div.insertAdjacentHTML('beforeend', allegiance_box)
        }

        //hide slots and values if slots is 0 and value is 0
        if (item.slots == 0 || item.slots == '' || item.slots == null) {
            const slots_div = document.getElementById(`${item.category}-${item.id}-slots`)
            slots_div.classList.add('hidden')
        }
        if (item.value == 0 || item.value == '' || item.value == null) {
            const value_div = document.getElementById(`${item.category}-${item.id}-value`)
            value_div.classList.add('hidden')
        }

        //Add confirm prompt to item div
        item_div.setAttribute('onclick', `confirm_prompt('${item.id}')`)
    })

    Object.keys(adversary.facts).forEach(fact_key => {
        const fact_textarea = document.getElementById(`${fact_key}`)
        fact_textarea.value = adversary.facts[fact_key].description
    })
    //update the data bars
    updateVisualization()

    //update mood table on every refresh
    initialize_mood_table()

    //reset curr_adv
    curr_adv = adversary.name

    //get proper color for menace
    menace_color(adversary.menace)


}

var curr_adv = adversary.name

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
    closeModal();
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
                for (const advName in importedData) {
                    saved_adversaries[advName] = importedData[advName];
                }
                console.log("Data imported successfully:", importedData);
            } catch (err) {
                console.error("Error parsing JSON:", err);
            }
        };
        reader.readAsText(file);
        // Save to localStorage
        const stringData = JSON.stringify(saved_adversaries);
        localStorage.setItem('saved_adversaries', stringData);
    };
    input.click();
}

function convert_to_markdown(adversaries,con=false) {
  condensed = con
  let output = "";
  const clean = (str) => str ? str.replace(/<[^>]*>?/gm, '').trim() : "N/A";

  Object.values(adversaries).forEach(adv => {
    // 1. Header
    output += `# ${adv.name}\n`;
    output += `**Type:** ${adv.creature_type} (${adv.creature_subtype}) | **Rank:** ${adv.rank} | **Size:** ${adv.size}\n`;
    if (condensed == false) {output += `**Description:** ${clean(adv.description)}\n\n`;}

    // 2. Core Stats
    output += `### Core Stats\n`;
    output += `* **Hearts:** ${adv.hearts} | **Defense:** ${adv.defense} | **Atk Bonus:** +${adv.atkbonus || 0}\n`;
    output += `* **Speed:** ${adv.speed} (Max: ${adv.max_speed}) | **Allegiance Points:** B: ${adv.bright_points} / D: ${adv.dark_points}\n`;
    output += `* **Aptitudes:** Mgt ${adv.aptitudes.might}, Def ${adv.aptitudes.deftness}, Grt ${adv.aptitudes.grit}, Ins ${adv.aptitudes.insight}, Aur ${adv.aptitudes.aura}\n\n`;

    // 3. Special Rules (Traits + Abilities)
    output += `### Traits and Abilities\n`;
    const abilityNames = adv.abilities.map(a => a.name.toUpperCase());
    const uniquePassives = adv.passives.filter(p => !abilityNames.includes(p.name.toUpperCase()));

    [...uniquePassives, ...adv.abilities].forEach(p => {
      let detail = "";
      
      if (p.description) {
        detail = clean(p.description);
      } else if (p.modifier && p.value) {
        detail = `${p.modifier} ${p.value >= 0 ? '+' : ''}${p.value}`;
      } else if (p.modifiers) { 
        // Logic to catch nested "atkbonus" or "size" inside a passive modifier object
        detail = Object.entries(p.modifiers)
          .map(([key, val]) => `${key}: ${val >= 0 ? '+' : ''}${val}`)
          .join(", ");
      }

      output += `* **${p.name}**: ${detail}\n`;
    });

    // 4. Quick Facts
    if (adv.facts && condensed == false) {
      output += `\n### Quick Facts\n`;
      output += `| Category | Details |\n| :--- | :--- |\n`;
      for (const [key, value] of Object.entries(adv.facts)) {
        output += `| ${key.replace(/-/g, ' ').toUpperCase()} | ${clean(value.description)} |\n`;
      }
    }

    // 5. Mood Table
    if (adv.moods?.length > 0 && condensed == false) {
      output += `\n### Moods (1d20)\n`;
      output += `| Roll | Mood | Behavior |\n| :--- | :--- | :--- |\n`;
      adv.moods.forEach(m => {
        output += `| ${m.rolls.start}-${m.rolls.stop} | ${m.mood} | ${clean(m.mood_text)} |\n`;
      });
    }

    // 6. Inventory & Allegiance
    if (adv.inventory?.length > 0) {
      output += `\n### Inventory\n`;
      adv.inventory.forEach(i => {
        output += `* **${i.name}** (${i.category}): ${clean(i.description)} [Value: ${i.value} ${i.denomination}]\n`;
      });
    }

    output += `\n---\n\n`;
  });

  return output;
}

function download_markdown_file(adversaries,con=false) {
  const content = convert_to_markdown(adversaries,con);
  
  const blob = new Blob([content], { type: 'text/plain' });
  
  const link = document.createElement('a');
  
  link.download = 'adversary_markdown_export.txt';
  link.href = window.URL.createObjectURL(blob);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
 
  window.URL.revokeObjectURL(link.href);

  closeModal()
}