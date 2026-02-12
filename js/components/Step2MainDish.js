const Step2MainDish = {
    template: `
        <div class="step-content">
            <h2 class="mb-4 text-center">Escolha o sabor do cuscuz</h2>
            <p class="text-center text-muted mb-5">Selecione uma opção de sabor</p>
            
            <div class="row">
                <div v-for="flavor in flavors" :key="flavor.id" class="col-md-4 mb-4">
                    <div class="menu-item" 
                         :class="{ 'selected': currentMeal.flavor === flavor.id }"
                         @click="$emit('update:flavor', flavor.id)">
                        <div class="d-flex align-items-start">
                            <div class="flex-shrink-0 me-3">
                                <div class="bg-light rounded-circle p-3">
                                    <i class="bi" :class="flavor.id === 1 ? 'bi-droplet' : flavor.id === 2 ? 'bi-egg-fried' : 'bi-egg-fill'" class="fs-4 text-primary"></i>
                                </div>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <h5 class="fw-bold mb-1">{{ flavor.name }}</h5>
                                    <div class="price-tag">+ R$ {{ flavor.priceAddition[dishSize].toFixed(2).replace('.', ',') }}</div>
                                </div>
                                <p class="text-muted mb-2">{{ flavor.description }}</p>
                                <div class="mt-2">
                                    <small class="text-muted">
                                        <i class="bi bi-info-circle me-1"></i>
                                        Pequeno: +R$ {{ flavor.priceAddition.P.toFixed(2).replace('.', ',') }} | 
                                        Grande: +R$ {{ flavor.priceAddition.G.toFixed(2).replace('.', ',') }}
                                    </small>
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
        flavors: {
            type: Array,
            required: true
        },
        dishSize: {
            type: String,
            required: true
        }
    },
    emits: ['update:flavor']
};