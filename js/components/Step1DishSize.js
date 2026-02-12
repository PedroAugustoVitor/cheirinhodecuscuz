// Componente: Step1DishSize
const Step1DishSize = {
    template: `
        <div class="step-content">
        <h2 class="mb-4 text-center">
            <span v-if="editingMealIndex !== null">Editar Refeição {{ editingMealIndex + 1 }}</span>
            <span v-else>Adicionar Nova Refeição</span>
        </h2>
        <p class="text-center text-muted mb-5">Escolha o tamanho do cuscuz</p>
    
        <div class="row justify-content-center">
            <div class="col-md-6 mb-4">
                <div class="dish-option text-center" 
                     :class="{ 'selected': currentMeal.dishSize === 'P' }"
                     @click="$emit('update:dishSize', 'P')">
                    <div class="mb-3">
                        <i class="bi bi-egg display-1 text-warning"></i>
                    </div>
                    <h3 class="fw-bold">Cuscuz Pequeno (P)</h3>
                    <p class="text-muted">Porção individual</p>
                    <div class="price-tag mt-3">R$ 4,00</div>
                    <div class="mt-3">
                        <span class="badge bg-info">Serve 1 pessoa</span>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6 mb-4">
                <div class="dish-option text-center" 
                     :class="{ 'selected': currentMeal.dishSize === 'G' }"
                     @click="$emit('update:dishSize', 'G')">
                    <div class="mb-3">
                        <i class="bi bi-egg display-1 text-primary"></i>
                        <i class="bi bi-plus-lg text-primary"></i>
                        <i class="bi bi-egg display-1 text-primary"></i>
                    </div>
                    <h3 class="fw-bold">Cuscuz Grande (G)</h3>
                    <p class="text-muted">Porção para duas pessoas</p>
                    <div class="price-tag mt-3">R$ 8,00</div>
                    <div class="mt-3">
                        <span class="badge bg-info">Serve 2 pessoas</span>
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
        editingMealIndex: {
            type: Number,
            default: null
        }
    },
    emits: ['update:dishSize']
};