const MealList = {
    template: `
        <div class="meal-list">
            <div v-for="(meal, index) in meals" :key="index" 
                 class="meal-card position-relative"
                 :class="{ 'active': activeMealIndex === index }"
                 @click="$emit('set-active-meal', index)">
                <div class="meal-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" @click.stop="$emit('duplicate-meal', index)">
                        <i class="bi bi-copy"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click.stop="$emit('remove-meal', index)" v-if="meals.length > 1">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                
                <h5>
                    <span class="meal-number">{{ index + 1 }}</span>
                    Cuscuz {{ index + 1 }}
                </h5>
                
                <div class="row mt-3">
                    <div class="col-md-4">
                        <p class="mb-1"><strong>Tamanho:</strong> {{ getDishSizeLabel(meal.dishSize) }}</p>
                    </div>
                    <div class="col-md-4">
                        <p class="mb-1"><strong>Sabor:</strong> {{ getFlavorName(meal.flavor) }}</p>
                    </div>
                    <div class="col-md-4">
                        <p class="mb-1"><strong>Adicionais:</strong> {{ meal.sides.length }}</p>
                    </div>
                </div>
                
                <div class="mt-2">
                    <span class="badge bg-primary me-1">{{ getDishSizeLabel(meal.dishSize) }}</span>
                    <span class="badge bg-success me-1">{{ getFlavorName(meal.flavor) }}</span>
                    <span class="badge bg-info">{{ meal.sides.length }} Adic.</span>
                </div>
                
                <div class="mt-2 text-end">
                    <strong>Subtotal:</strong> R$ {{ calculateMealTotal(meal).toFixed(2).replace('.', ',') }}
                </div>
                
                <div class="mt-3">
                    <button class="btn btn-sm btn-outline-secondary w-100" @click.stop="$emit('edit-meal', index)">
                        <i class="bi bi-pencil me-2"></i>Editar Este Cuscuz
                    </button>
                </div>
            </div>
        </div>
    `,
    props: {
        meals: {
            type: Array,
            required: true
        },
        activeMealIndex: {
            type: Number,
            default: 0
        },
        flavors: {
            type: Array,
            required: true
        },
        sideDishes: {
            type: Array,
            required: true
        }
    },
    emits: ['set-active-meal', 'duplicate-meal', 'remove-meal', 'edit-meal'],
    methods: {
        getDishSizeLabel(size) {
            return size === 'P' ? 'Pequeno (P)' : size === 'G' ? 'Grande (G)' : 'Não selecionado';
        },
        getFlavorName(flavorId) {
            const flavor = this.flavors.find(item => item.id === flavorId);
            return flavor ? flavor.name : 'Não selecionado';
        },
        calculateMealTotal(meal) {
            let total = 0;

            if (meal.dishSize === 'P') {
                total += 4.00;
            } else if (meal.dishSize === 'G') {
                total += 8.00;
            }

            const flavor = this.flavors.find(item => item.id === meal.flavor);
            if (flavor) {
                total += flavor.priceAddition[meal.dishSize];
            }

            meal.sides.forEach(sideId => {
                const side = this.sideDishes.find(item => item.id === sideId);
                if (side) {
                    total += side.price;
                }
            });

            return total;
        }
    }
};