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
        document.getElementById('menace').classList.add('rounded-lg', 'bg-stone-600')
    }

}

function save_adversary() {
    const name = adversary.name;

    saved_adversaries[name] = JSON.parse(JSON.stringify(adversary));
    render_saved_list();
}

function render_saved_list() {
    const container = document.getElementById('adversaries-scrollable');
    container.innerHTML = '';

    Object.keys(saved_adversaries).forEach(name => {
        const subname = (`${saved_adversaries[name].size} Rank ${saved_adversaries[name].rank} ${saved_adversaries[name].creature_type}`).toUpperCase()
        const adversary_sidebar_card = `
        <div class="p-4 mb-2 text-center rounded-lg bg-cyan-700 text-white" id="load-${name}" onclick="load_adversary('${name}')">
            <h4 class="font-bold" id="adversary-card-name">${name}</h4>
            <p class="italic text-sm" id="adversary-card-subname">${subname}</p>
        </div>`
        container.insertAdjacentHTML('beforeend', adversary_sidebar_card)
    });
}

function load_adversary(adversary_name) {
    //this load function loads a generic JSON object into the UI, which only half works. I think it needs to reuse the constructor to rebuild the Adversary object

    //In fact, I am going to need to refactor almost all my useless classes since classifying them doesn't do anything and its too much of a pain in the ass to have to reconstruct every classified object on each load
    const name = String(adversary_name)
    adversary = saved_adversaries[name]
    update_ui(adversary)
    
}

function current_adversary_card() {
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

function initialize_mood_table_event_handlers() {
    const inputs = document.querySelectorAll('#mood-table > tbody input')
    inputs.forEach(input => {
        input.addEventListener('change', adversary._adjust_mood_table)
    }
    )
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



// Nav menu dynamic hide/show 

function show_hide_card(nav_item) {
    main = document.querySelectorAll('.main')
    main.forEach(page => {
        if (page.id != nav_item) {
            page.classList.add('hidden')
        }
    });
    const target_div = document.getElementById(nav_item)
    target_div.classList.remove('hidden')

}

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
    menace: "",
    rank: 1,
    size: 'medium',
    hearts: rank_stats[0][1],
    atkbonus: rank_stats[0][1],
    bright_points: 0,
    dark_points: 0,
    defense: 10,
    speed: 'average',
    creature_type: 'monster',
    creature_subtype: null,
    primary_aptitudes: [],
    gear: [],
    description: null,
    passives: [],
    abilities: {},
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
    loot: [],
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

    //update the data bars
    updateVisualization()
    current_adversary_card()
}

adversary._calculate_aptitudes()
set_max_rank()
menace_color(document.getElementById('menace').value)
update_ui(adversary)
current_adversary_card()
var saved_adversaries = {}