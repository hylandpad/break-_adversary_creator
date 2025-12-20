const barContainer = document.getElementById('bar-container');
        const labelContainer = document.getElementById('label-container');
        let inputs = Array.from({length: 5}, (_, i) => document.getElementById(`input-${i}`));
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

        window.onload = updateVisualization;

function show_hide_card(nav_item){
    main = document.querySelectorAll('.main')
    console.log(main)
    main.forEach(page => {
            if (page.id != nav_item){
                page.classList.add('hidden')
            }
    });
    const target_div = document.getElementById(nav_item)
    target_div.classList.remove('hidden')
    
}

document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.classList.toggle('hidden');

      const isHidden = targetElement.classList.contains('hidden');
      button.textContent = isHidden ? "Edit" : "Save/Close";
    }
  });
});

// rank:[attack bonus,hearts,primary stat, secondary stat]
rank_stats = {
    0:[0,1,6,6],
    1:[1,2,8,7],
    2:[2,2,8,7],
    3:[2,3,9,8],
    4:[3,3,9,8],
    5:[4,4,10,9],
    6:[4,4,10,9],
    7:[5,5,11,10],
    8:[6,5,11,10],
    9:[6,6,12,11],
    10:[7,6,12,11],
    11:[8,7,13,12],
    12:[8,7,13,12],
    13:[9,8,14,13],
    14:[10,8,14,13],
    15:[10,9,15,14]

}

class Adversary {

    constructor(data = {}){
        // creature metadata
        this.name = data.name || "Untitled Adversary";
        this.menace = data.menace || "Mook";
        this.rank = data.rank || 0;
        this.size = data.size || "Medium";
        this.hearts = data.hearts;
        this.atkbonus = data.atkbonus;
        this.defense = data.defense;
        this.speed = data.speed;
        this.creature_type = data.creature_type || "Monster";
        this.creature_subtype = data.creature_subtype || null;
        this.primary_aptitudes = data.primary_aptitudes || ["grit","deftness","might"];
        this.description = data.description || null;
        // structured data objects
        this.aptitudes = data.aptitudes || []
        this.traits = this._validateArray(data.traits,Trait);
        this.abilities = this._validateArray(data.abilities,Ability);
        this.facts = this._validateArray(data.facts,Fact);
        this.loot = this._validateArray(data.loot,Item);
        this.shop_inventory = this._validateArray(data.shop_inventory,Item);
        this.moods = data.moods
    }

    _calculateAptitudes() {
        const primary_val = rank_stats[this.rank][2]
        const secondary_val = rank_stats[this.rank][3]

        var base_aptitudes = {
            'might':0,
            'deftness':0,
            'grit':0,
            'insight':0,
            'aura':0
        }

        const aptitudeKeys = Object.keys(base_aptitudes)
        aptitudeKeys.forEach(key => {
            if (this.primary_aptitudes.includes(key)){
                base_aptitudes[key] = primary_val
            }else{
                base_aptitudes[key] = secondary_val
            }
        })
        this.aptitudes = base_aptitudes
    }

    _adjust_size(){
    //Get all current aptitude values
    // prior to doing any math at all, recalculate base aptitudes by running _calculateAptitudes to set BACK to a baseline then do one of the following:
    // for tiny add +3 defense rating, -1 might, +1 deft to baseline
    // for small, add +1 Deft, -1 Might + 1 Def to baseline based on rank
    // for medium ensure baseline based on rank
    // for large add +1 might, -defense to baseline based on rank
    // for massive add +2 Might, -2 defense to baseline, add Massive Species abilities (Sweep Attack and Focus Attack)
    // for colossal, there will need to be a lot of extensive customization - earmark for future
    // After this, rerun _adjustTraits so that new traits are re-incorporated
    }

    _adjust_traits(){
    //Do later
    }

    _validateArray(dataItem, targetClass) {
        if (dataItem === null || dataItem === undefined) return [];
        const normalized = Array.isArray(dataItem) ? dataItem : [dataItem];
        return normalized.filter(item => item instanceof targetClass);
    }
}

class Ability {
    constructor(ability_name,ability_description,alignment=0){
        this.ability_name = ability_name;
        this.ability_description = ability_description;
        this.alignment = alignment
    }
}

class Trait {
    constructor(trait_name,modifier,operator,value){
        this.trait_name = trait_name;
        this.modifier = modifier;
        this.operator = operator;
        this.value = value;
    }
}

class Item {
    constructor(item_name,item_type,item_subtype,item_description,slots=1,value){
        this.item_name = item_name;
        this.item_type = item_type;
        this.item_subtype = item_subtype;
        this.item_description = item_description;
        this.slots = slots;
        this.value = value;
    }
}

class Fact{
    constructor(fact_type,fact_text){
        this.fact_type = fact_type;
        this.fact_text = fact_text;
    }
}

class MoodTable{
    constructor(rolls,moods,moods_text){
        // do this later

    }
}

var adversary = new Adversary({
    name:'New Adversary',
    menace:'boss',
    rank:1,
    size:'medium',
    hearts: rank_stats[0][1],
    atkbonus:rank_stats[0][1],
    defense: 10,
    speed: 'average',
    creature_type: 'monster',
    creature_subtype: null,
    primary_aptitudes: ["grit","deftness","might"],
    description: null,
    traits:[],
    abilities :[],
    facts:[],
    loot:[],
    shop_inventory:[],
    moods:{}
})

adversary._calculateAptitudes()

function update_ui(adversary){
    document.getElementById('adversary-name').value = adversary.name
    document.getElementById('menace').value = adversary.menace
    document.getElementById('rank').value = adversary.rank
    document.getElementById('size').value = adversary.size
    document.getElementById('atk-bonus').innerHTML = adversary.atkbonus
    document.getElementById('defense').innerHTML = adversary.defense
    document.getElementById('speed').value = adversary.speed
    document.getElementById('adversary-type').value = adversary.creature_type
    document.getElementById('adversary-subtype').value = adversary.creature_subtype
    document.getElementById('input-0').value = adversary.aptitudes.might
    document.getElementById('input-1').value = adversary.aptitudes.deftness
    document.getElementById('input-2').value = adversary.aptitudes.grit
    document.getElementById('input-3').value = adversary.aptitudes.insight
    document.getElementById('input-4').value = adversary.aptitudes.aura
}
update_ui(adversary)