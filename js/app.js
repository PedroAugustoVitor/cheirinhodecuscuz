const { createApp } = Vue;

// Componente Principal: App
const App = {
    components: {
        StepIndicator,
        Step1DishSize,
        Step2MainDish,
        Step3SideDishes,
        Step4Review,
        Step5Confirmation
    },
    data() {
        return {
            currentStep: 1,
            editingMealIndex: null,
            activeMealIndex: 0,
            currentMeal: {
                dishSize: null,
                flavor: null,
                sides: [],
                observations: ''
            },
            order: {
                meals: [],
                observations: '',
                customerName: '',
                customerPhone: '',
                urgent: false
            },
            orderCode: '',
            steps: [
                { id: 1, label: 'Tamanho', completed: false },
                { id: 2, label: 'Sabor', completed: false },
                { id: 3, label: 'Adicionais', completed: false },
                { id: 4, label: 'Revisar', completed: false },
                { id: 5, label: 'Confirmar', completed: false }
            ],
            flavors: [
                {
                    id: 1,
                    name: 'Creme',
                    description: 'Cuscuz com creme de leite',
                    priceAddition: { P: 5, G: 6 }
                },
                {
                    id: 2,
                    name: 'Carne',
                    description: 'Cuscuz com carne de sol',
                    priceAddition: { P: 4, G: 6 }
                },
                {
                    id: 3,
                    name: 'Carne com Creme',
                    description: 'Cuscuz com carne de sol e creme de leite',
                    priceAddition: { P: 8, G: 7 }
                }
            ],
            sideDishes: [
                { id: 1, name: 'Vinagrete', description: 'Vinagrete de tomate e cebola', price: 1.00 },
                { id: 2, name: 'Ovo Frito', description: 'Ovo frito', price: 3.00 },
                { id: 3, name: 'Banana Frita', description: 'Banana frita', price: 3.00 }
            ]
        };
    },
    computed: {
        canProceed() {
            switch(this.currentStep) {
                case 1:
                    return this.currentMeal.dishSize !== null;
                case 2:
                    return this.currentMeal.flavor !== null;
                case 3:
                    return true;
                default:
                    return true;
            }
        }
    },
    methods: {
        resetCurrentMeal() {
            this.currentMeal = {
                dishSize: null,
                flavor: null,
                sides: [],
                observations: ''
            };
        },

        nextStep() {
            if (this.currentStep < 4 && this.canProceed) {
                this.steps[this.currentStep - 1].completed = true;
                this.currentStep++;

                if (this.currentStep === 4) {
                    this.saveCurrentMeal();
                }
            }
        },

        previousStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
            }
        },

        saveCurrentMeal() {
            if (this.editingMealIndex !== null) {
                this.order.meals[this.editingMealIndex] = JSON.parse(JSON.stringify(this.currentMeal));
                this.editingMealIndex = null;
            } else {
                this.order.meals.push(JSON.parse(JSON.stringify(this.currentMeal)));
            }

            this.activeMealIndex = this.order.meals.length - 1;
            this.resetCurrentMeal();
        },

        addNewMeal() {
            if (this.editingMealIndex !== null) {
                this.saveCurrentMeal();
            }

            this.resetCurrentMeal();
            this.currentStep = 1;
            this.editingMealIndex = null;
        },

        editMeal(index) {
            this.currentMeal = JSON.parse(JSON.stringify(this.order.meals[index]));
            this.editingMealIndex = index;
            this.currentStep = 1;
        },

        duplicateMeal(index) {
            const duplicatedMeal = JSON.parse(JSON.stringify(this.order.meals[index]));
            this.order.meals.push(duplicatedMeal);
            this.activeMealIndex = this.order.meals.length - 1;
        },

        duplicateLastMeal() {
            if (this.order.meals.length > 0) {
                this.duplicateMeal(this.order.meals.length - 1);
            }
        },

        removeMeal(index) {
            this.order.meals.splice(index, 1);

            if (this.activeMealIndex >= this.order.meals.length) {
                this.activeMealIndex = this.order.meals.length - 1;
            }
        },

        setActiveMeal(index) {
            this.activeMealIndex = index;
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
        },

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

        finalizeOrder() {
            if (this.order.meals.length === 0) {
                alert('Adicione pelo menos uma refeição ao pedido!');
                return;
            }

            this.steps[this.currentStep - 1].completed = true;
            this.currentStep = 5;
            this.generateOrderCode();
        },

        generateOrderCode() {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            let code = '';

            for (let i = 0; i < 3; i++) {
                code += letters.charAt(Math.floor(Math.random() * letters.length));
            }

            for (let i = 0; i < 3; i++) {
                code += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }

            this.orderCode = code;
        },

        startNewOrder() {
            this.order = {
                meals: [],
                observations: '',
                customerName: '',
                customerPhone: '',
                urgent: false
            };

            this.resetCurrentMeal();

            this.steps.forEach(step => {
                step.completed = false;
            });

            this.currentStep = 1;
            this.editingMealIndex = null;
            this.activeMealIndex = 0;
            this.orderCode = '';
        }
    },
    template: `
        <div class="container-fluid py-4">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-10 col-xl-8">
                    <header class="text-center mb-5">
                        <h1 class="display-4 fw-bold text-primary">
                            <i class="bi bi-egg-fried cuscuz-icon me-3"></i>
                            Cuscuz Delícia
                        </h1>
                        <p class="lead text-muted">Monte seu cuscuz em poucos passos</p>
                    </header>
                    
                    <StepIndicator :steps="steps" :currentStep="currentStep" />
                    
                    <div class="card shadow-lg border-0">
                        <div class="card-body p-4 p-md-5">
                            <Step1DishSize 
                                v-if="currentStep === 1"
                                :currentMeal="currentMeal" 
                                :editingMealIndex="editingMealIndex"
                                @update:dishSize="currentMeal.dishSize = $event" />
                            
                            <Step2MainDish 
                                v-if="currentStep === 2"
                                :currentMeal="currentMeal" 
                                :flavors="flavors"
                                :dishSize="currentMeal.dishSize"
                                @update:flavor="currentMeal.flavor = $event" />
                            
                            <Step3SideDishes 
                                v-if="currentStep === 3"
                                :currentMeal="currentMeal" 
                                :sideDishes="sideDishes"
                                @update:sides="currentMeal.sides = $event" />
                            
                            <Step4Review 
                                v-if="currentStep === 4"
                                :order="order"
                                :activeMealIndex="activeMealIndex"
                                :flavors="flavors"
                                :sideDishes="sideDishes"
                                @add-new-meal="addNewMeal"
                                @duplicate-meal="duplicateMeal"
                                @remove-meal="removeMeal"
                                @set-active-meal="setActiveMeal"
                                @edit-meal="editMeal"
                                @duplicate-last-meal="duplicateLastMeal"
                                @update:order="order = $event"
                                @finalize-order="finalizeOrder" />
                            
                            <Step5Confirmation 
                                v-if="currentStep === 5"
                                :orderCode="orderCode"
                                :order="order"
                                :total="calculateTotal()"
                                @start-new-order="startNewOrder" />
                            
                            <div class="d-flex justify-content-between mt-5 pt-4 border-top">
                                <button class="btn btn-outline-secondary" 
                                        @click="previousStep" 
                                        :disabled="currentStep === 1">
                                    <i class="bi bi-arrow-left me-2"></i>Voltar
                                </button>
                                
                                <div v-if="currentStep < 5">
                                    <button v-if="currentStep < 4" class="btn btn-primary" 
                                            @click="nextStep"
                                            :disabled="!canProceed">
                                        {{ currentStep === 3 ? 'Concluir Refeição' : 'Próximo' }}
                                        <i class="bi bi-arrow-right ms-2"></i>
                                    </button>
                                    
                                    <button v-if="currentStep === 4" class="btn btn-success" 
                                            @click="finalizeOrder"
                                            :disabled="order.meals.length === 0">
                                        Finalizar Pedido
                                        <i class="bi bi-check-circle ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-4 text-center text-muted">
                        <small>Passo {{ currentStep }} de {{ steps.length }}</small>
                    </div>
                </div>
            </div>
        </div>
    `
};

createApp(App).mount('#app');