const Step3SideDishes = {
    template: `
        <div class="step-content">
            <h2 class="mb-4 text-center">Selecione os adicionais</h2>
            <p class="text-center text-muted mb-5">Escolha os adicionais para o seu cuscuz (opcional)</p>
            
            <div class="row">
                <div v-for="side in sideDishes" :key="side.id" class="col-md-4 mb-3">
                    <div class="form-check card h-100" 
                         :class="{ 'border-primary': currentMeal.sides.includes(side.id) }">
                        <div class="card-body">
                            <div class="d-flex">
                                <input class="form-check-input me-3 mt-0" 
                                       type="checkbox" 
                                       :id="'side-' + side.id"
                                       :value="side.id"
                                       :checked="currentMeal.sides.includes(side.id)"
                                       @change="onSideChange(side.id, $event.target.checked)">
                                <div>
                                    <label class="form-check-label fw-bold" :for="'side-' + side.id">
                                        {{ side.name }}
                                    </label>
                                    <p class="text-muted small mb-2">{{ side.description }}</p>
                                    <div class="price-tag small">R$ {{ side.price.toFixed(2).replace('.', ',') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        currentMeal: {
            type: Object,
            required: true
        },
        sideDishes: {
            type: Array,
            required: true
        }
    },
    emits: ['update:sides'],
    methods: {
        onSideChange(sideId, isChecked) {
            let sides = [...this.currentMeal.sides];
            if (isChecked) {
                sides.push(sideId);
            } else {
                sides = sides.filter(id => id !== sideId);
            }
            this.$emit('update:sides', sides);
        }
    }
};