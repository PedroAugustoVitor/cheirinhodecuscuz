const StepIndicator = {
    template: `
        <div class="row mb-5">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div v-for="(step, index) in steps" :key="step.id" 
                         class="step text-center flex-fill" 
                         :class="{ 'active': currentStep === step.id, 'completed': step.completed }">
                        
                        <div class="position-relative">
                            <div class="step-circle" 
                                 :class="currentStep === step.id ? 'bg-primary text-white' : step.completed ? 'bg-success text-white' : 'bg-light text-secondary'">
                                <span v-if="step.completed" class="check-icon">
                                    <i class="bi bi-check-lg"></i>
                                </span>
                                <span v-else>{{ index + 1 }}</span>
                            </div>
                            
                            <div v-if="index < steps.length - 1" 
                                 class="position-absolute top-50 start-100 translate-middle-y w-100 d-none d-md-block">
                                <hr class="my-0" :class="step.completed ? 'border-success' : 'border-secondary'">
                            </div>
                        </div>
                        
                        <div class="mt-2 fw-semibold" 
                             :class="currentStep === step.id ? 'text-primary' : step.completed ? 'text-success' : 'text-secondary'">
                            {{ step.label }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        steps: {
            type: Array,
            required: true
        },
        currentStep: {
            type: Number,
            required: true
        }
    }
};