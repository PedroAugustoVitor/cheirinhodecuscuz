const Step4Review = {
    template: `
        <div class="step-content">
            <h2 class="mb-4 text-center">Revise seu pedido</h2>
            <p class="text-center text-muted mb-5">Confirme as informações antes de finalizar</p>
            
            <div class="mb-5">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0">Seus Cuscuzes ({{ order.meals.length }})</h4>
                    <button class="btn btn-success" @click="$emit('add-new-meal')">
                        <i class="bi bi-plus-circle me-2"></i>Adicionar Novo Cuscuz
                    </button>
                </div>
                
                <MealList 
                    :meals="order.meals"
                    :activeMealIndex="activeMealIndex"
                    :flavors="flavors"
                    :sideDishes="sideDishes"
                    @set-active-meal="$emit('set-active-meal', $event)"
                    @duplicate-meal="$emit('duplicate-meal', $event)"
                    @remove-meal="$emit('remove-meal', $event)"
                    @edit-meal="$emit('edit-meal', $event)" />
            </div>
            
            <div class="row">
                <div class="col-md-8">
                    <div class="order-summary">
                        <h4 class="mb-3">Resumo do Pedido</h4>
                        
                        <div v-for="(meal, index) in order.meals" :key="index" class="summary-item">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="fw-bold">Cuscuz {{ index + 1 }}</h6>
                                    <div class="ms-3">
                                        <small class="d-block">{{ getDishSizeLabel(meal.dishSize) }} - {{ getFlavorName(meal.flavor) }}</small>
                                        <small v-if="meal.sides.length > 0" class="text-muted">
                                            Adic: {{ getSideDishNames(meal.sides) }}
                                        </small>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <div>R$ {{ calculateMealTotal(meal).toFixed(2).replace('.', ',') }}</div>
                                </div>
                            </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fs-5 fw-bold">Total ({{ order.meals.length }} cuscuzes):</span>
                            <span class="total-price">R$ {{ calculateTotal().toFixed(2).replace('.', ',') }}</span>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <label for="observations" class="form-label">Observações do pedido?</label>
                        <textarea class="form-control" id="observations" rows="3" 
                                  v-model="order.observations" 
                                  placeholder="Ex: Entregar na portaria, embalar separadamente, etc."></textarea>
                    </div>
                </div>
                
                <div class="col-md-4 mt-4 mt-md-0">
                    <div class="card border-primary">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">Informações do Cliente</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label for="customerName" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="customerName" 
                                       v-model="order.customerName" placeholder="Seu nome">
                            </div>
                            <div class="mb-3">
                                <label for="customerPhone" class="form-label">Telefone</label>
                                <input type="tel" class="form-control" id="customerPhone" 
                                       v-model="order.customerPhone" placeholder="(11) 99999-9999">
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="urgent" v-model="order.urgent">
                                <label class="form-check-label" for="urgent">
                                    Pedido urgente (preparo prioritário)
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card border-success mt-3">
                        <div class="card-header bg-success text-white">
                            <h6 class="mb-0"><i class="bi bi-repeat me-2"></i>Repetir Cuscuz</h6>
                        </div>
                        <div class="card-body">
                            <p class="small">Deseja adicionar outro cuscuz igual a um já existente?</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-success" @click="$emit('duplicate-last-meal')" :disabled="order.meals.length === 0">
                                    <i class="bi bi-copy me-2"></i>Repetir Último Cuscuz
                                </button>
                                <button class="btn btn-outline-primary" @click="$emit('add-new-meal')">
                                    <i class="bi bi-plus-circle me-2"></i>Novo Cuscuz Diferente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        order: {
            type: Object,
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
    components: {
        MealList
    },
    emits: ['add-new-meal', 'duplicate-meal', 'remove-meal', 'set-active-meal',
        'edit-meal', 'duplicate-last-meal', 'update:order', 'finalize-order'],
    methods: {
        getDishSizeLabel(size) {
            return size === 'P' ? 'Pequeno (P)' : size === 'G' ? 'Grande (G)' : 'Não selecionado';
        },
        getFlavorName(flavorId) {
            const flavor = this.flavors.find(item => item.id === flavorId);
            return flavor ? flavor.name : 'Não selecionado';
        },
        getSideDishName(sideId) {
            const side = this.sideDishes.find(item => item.id === sideId);
            return side ? side.name : '';
        },
        getSideDishNames(sideIds) {
            return sideIds.map(id => this.getSideDishName(id)).join(', ');
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
        },
        calculateTotal() {
            return this.order.meals.reduce((total, meal) => {
                return total + this.calculateMealTotal(meal);
            }, 0);
        }
    }
};