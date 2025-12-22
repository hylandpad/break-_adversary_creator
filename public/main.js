// Aptitude bar visualization

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

        

// Nav menu dynamic hide/show 

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

// Used to help track changes to adversary stats across rank changes
// rank:[attack bonus,hearts,primary stat value, secondary stat value (p.432 phb)]
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

// Instead of hard setting the max rank at 15, I generated it based on the number of ranks in rank_stats 
// this way if high-level enemies or prestige enemies are introduced (or I add the ability to just make higher rank enemies)
// it will be easier to implement dynamically
function set_max_rank(){
    const max_rank = Object.keys(rank_stats).length - 1
    document.getElementById('rank').max = max_rank
}

class Adversary {

    constructor(data = {}){
        // creature metadata
        this.name = data.name || null;
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

    _adjust_name(){
        this.name = document.getElementById('adversary-name').value
    }
    // Update the data object with base aptitudes based on primary aptitudes
    // use this method to assist in calculations of aptitude changes from size, rank or traits
    _calculate_aptitudes() {
        const primary_val = rank_stats[this.rank][2]
        const secondary_val = rank_stats[this.rank][3]

        var base_aptitudes = {
            'might':0,
            'deftness':0,
            'grit':0,
            'insight':0,
            'aura':0
        }
        // Increase value for primary attributes
        const aptitudeKeys = Object.keys(base_aptitudes)
        aptitudeKeys.forEach(key => {
            if (this.primary_aptitudes.includes(key)){
                base_aptitudes[key] = primary_val
            }else{
                base_aptitudes[key] = secondary_val
            }
        })
        this.aptitudes = base_aptitudes
        
        // add in trait-based aptitude modifiers
        // I think I am going to need to do this differently - I think recalculating with this as 
        // a base number is screwing stuff up. I either have to do ALL of the calculations here, 
        // or break them up even more discretely
        aptitudeKeys.forEach(key =>{
            adversary.traits.forEach(this_trait => 
                {if (this_trait.modifier == key)
                    {
                        this_trait.operator == 'add' ?
                        this.aptitudes[key] =  parseInt(this.aptitudes[key]) + parseInt(this_trait.value) :
                        this.aptitudes[key] =  parseInt(this.aptitudes[key]) - parseInt(this_trait.value)
                    }
                })
        })
    }

    // adjustment methods should probably be integrated directly into calculate aptitudes method at some point
    // keeping them separate for now to work through any low hanging fruit bugs
    
    _adjust_primary_aptitudes(attr=None){
        //add passed argument to the primary attributes array on the adversary object
        if (document.getElementById(`${attr}-primary`).checked){
            this.primary_aptitudes.push(attr)
        }else{
            const i = this.primary_aptitudes.indexOf(attr)
            if(i > -1){
                this.primary_aptitudes.splice(i,1)
            }
        }
        this._calculate_aptitudes()
        this._adjust_size()
        update_ui(adversary)
    }
    
    _adjust_rank(){
        const rankElement = document.getElementById('rank')
        this.rank = rankElement.value
        this.hearts = rank_stats[this.rank][1]
        this.atkbonus = rank_stats[this.rank][0]
        // recalculate all attributes
        this._calculate_aptitudes()
        this._adjust_size()
        update_ui(adversary)
    }

    _adjust_speed(){
        const speedElement = document.getElementById('speed')
        this.speed = speedElement.value
        // add a spot for trait-based speed mods
        this._calculate_defense()
    }

    _calculate_defense(){
        let def = 10
        
        if(this.speed == 'fast'){
            def = def + 2
        }else if(this.speed == 'veryfast'){
            def = def + 4
        }

        if(this.size == 'tiny'){
            def = def + 3
        }else if(this.size == 'small'){
            def = def + 1
        }    
        else if(this.size == 'large'){
            def = def - 1
        }else if(this.size == 'massive'){
            def = def - 2
        }
        
        // Add space where traits will influence defense
        // iterate over all traits that use defense as a modifier and add as necessary
        this.defense = def
        update_ui(adversary)
    }

    _adjust_size(){
        const sizeElement = document.getElementById('size')
        this.size = sizeElement.value.toLowerCase()
        //Get all current aptitude values
        // prior to doing any math at all, recalculate base aptitudes by running _calculate_aptitudes to set BACK to a baseline then do one of the following:
        this._calculate_aptitudes()
        let modified_aptitudes = {...this.aptitudes}
        // for tiny add +3 defense rating, -1 might, +1 deft to baseline
        if (this.size == 'tiny'){
            modified_aptitudes.deftness++
            modified_aptitudes.might--
            
        }
        // for small, add +1 Deft, -1 Might + 1 Def to baseline based on rank
        else if (this.size == 'small'){
            modified_aptitudes.deftness++
            modified_aptitudes.might--
            
        }
        // for medium ensure baseline based on rank
        else if (this.size == 'medium'){
            this.defense = 10
            
        }
        // for large add +1 might, -defense to baseline based on rank
        else if (this.size == 'large'){
            modified_aptitudes.might++
            this.defense = 9
            
        }
        // for massive add +2 Might, -2 defense to baseline, add Massive Species abilities (Sweep Attack and Focus Attack)
        else if(this.size == 'massive'){
            modified_aptitudes.might = modified_aptitudes.might + 2
            this.defense = 9
            
            // add traits to adversary data model
        }
        // set new traits
        this.aptitudes = modified_aptitudes
        // for colossal, there will need to be a lot of extensive customization - earmark for future
        // After this, rerun _adjustTraits so that new traits are re-incorporated
        this._calculate_defense()
    }

    _adjust_traits(){
    //Do later
        update_ui(adversary)
    }

    // Confirms data being injected into Adversary class is of the correct type/class

    _validateArray(dataItem, targetClass) {
        if (dataItem === null || dataItem === undefined) return [];
        const normalized = Array.isArray(dataItem) ? dataItem : [dataItem];
        return normalized.filter(item => item instanceof targetClass);
    }

    _add_trait(){
        // create trait in adversary object
        var name = document.getElementById('trait-name').value
        var operator = document.querySelector(`input[name='trait-operator']:checked`).value
        var value = document.getElementById('trait-value').value
        var modifier = document.getElementById('trait-modifier').value
        var new_trait = new Trait(name,modifier,operator,value)
        this.traits.push(new_trait)
        this._adjust_traits()
    }

    _remove_trait(name){
        const trait_to_remove = adversary.traits.indexOf(adversary.traits.find(trait => trait.trait_name === name))
        adversary.traits.splice(trait_to_remove,1)
        this._adjust_traits()
    }

    _adjust_traits(){
        //add trait to page by clearing out container div and constructing new traits based 
        // on trait array in adversary
        const trait_container = document.getElementById('trait-container')
        trait_container.innerHTML = ''
        adversary.traits.forEach(trait => {
            var trait_span = document.createElement('span')
            trait_span.innerHTML = `${(trait.trait_name?trait.trait_name:'Unnamed').toUpperCase()} : ${(trait.operator == 'add' ? '+' : '-')}${trait.value} ${trait.modifier.toUpperCase()}`
            trait_span.classList.add('trait-span')
            trait_span.id = (`trait-${trait.trait_name?trait.trait_name:'Unnamed'}-${trait.modifier}-${trait.operator}-${trait.value}`).toLowerCase()
            trait_span.setAttribute('onclick',`adversary._remove_trait('${trait.trait_name}')`)
            trait_container.appendChild(trait_span)
        })
        this._calculate_aptitudes()
        update_ui(adversary)
    }
}

// Class definitions

// Abilities are functionally the same as items, except they dont take up space, have no monetary value and may have an alignment value. 
class Ability {
    constructor(ability_name,ability_description,alignment=0){
        this.ability_name = ability_name;
        this.ability_description = ability_description;
        this.alignment = alignment
    }
}

// These can influence aptitudes, health, speed, defense or atkbonus. The addition of any trait will need to be factored into the model and UI changes
class Trait {
    constructor(trait_name,modifier,operator,value){
        this.trait_name = trait_name;
        this.modifier = modifier;
        this.operator = operator;
        this.value = value;
    }
}

// Generic item class - can be used as Loot or as equipment a vendor is looking to sell or as equipment the creature has on it
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

// fun tidbits
class Fact{
    constructor(fact_type,fact_text){
        this.fact_type = fact_type;
        this.fact_text = fact_text;
    }
}

// Rollable mood table - need to work on how to structure this. Probably a matrix?
class MoodTable{
    constructor(rolls,moods,moods_text){
        // do this later

    }
}

// Load page with some preformatted adversary data
var adversary = new Adversary({
    name: null,
    menace:'boss',
    rank:1,
    size:'medium',
    hearts: rank_stats[0][1],
    atkbonus:rank_stats[0][1],
    defense: 10,
    speed: 'average',
    creature_type: 'monster',
    creature_subtype: null,
    primary_aptitudes: [],
    description: null,
    traits:[],
    abilities :[],
    facts:[],
    loot:[],
    shop_inventory:[],
    moods:{}
})

// make changes on the page to represent changes in the data structure for the current adversary

function update_ui(adversary){
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
    if (adversary.primary_aptitudes.includes('might')){document.getElementById('might-primary').checked=true}
    document.getElementById('input-1').value = adversary.aptitudes.deftness
    if (adversary.primary_aptitudes.includes('deftness')){document.getElementById('deftness-primary').checked=true}
    document.getElementById('input-2').value = adversary.aptitudes.grit
    if (adversary.primary_aptitudes.includes('grit')){document.getElementById('grit-primary').checked=true}
    document.getElementById('input-3').value = adversary.aptitudes.insight
    if (adversary.primary_aptitudes.includes('insight')){document.getElementById('insight-primary').checked=true}
    document.getElementById('input-4').value = adversary.aptitudes.aura
    if (adversary.primary_aptitudes.includes('aura')){document.getElementById('aura-primary').checked=true}

    //update the data bars
    updateVisualization()
}

adversary._calculate_aptitudes()
set_max_rank()
//window.onload = updateVisualization;
update_ui(adversary)