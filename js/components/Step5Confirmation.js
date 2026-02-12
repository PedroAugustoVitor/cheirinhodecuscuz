const Step5Confirmation = {
    template: `
        <div class="step-content text-center">
            <div class="py-5">
                <div class="mb-4">
                    <i class="bi bi-check-circle-fill text-success display-1"></i>
                </div>
                <h2 class="mb-3">Pedido Confirmado!</h2>
                <p class="lead text-muted mb-4">Seu pedido foi recebido e já está sendo preparado.</p>
                
                <div class="card border-success mx-auto" style="max-width: 500px;">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">Detalhes do Pedido</h5>
                    </div>
                    <div class="card-body text-start">
                        <p><strong>Código do Pedido:</strong> #{{ orderCode }}</p>
                        <p><strong>Cliente:</strong> {{ order.customerName || 'Não informado' }}</p>
                        <p><strong>Quantidade de Cuscuzes:</strong> {{ order.meals.length }}</p>
                        <p><strong>Total:</strong> R$ {{ total.toFixed(2).replace('.', ',') }}</p>
                        <p><strong>Tempo estimado:</strong> {{ order.urgent ? '15-20 minutos' : '25-35 minutos' }}</p>
                    </div>
                </div>
                
                <div class="mt-5">
                    <button class="btn btn-primary" @click="$emit('start-new-order')">
                        <i class="bi bi-plus-circle me-2"></i>Fazer Novo Pedido
                    </button>
                </div>
            </div>
        </div>
    `,
    props: {
        orderCode: {
            type: String,
            default: ''
        },
        order: {
            type: Object,
            required: true
        },
        total: {
            type: Number,
            required: true
        }
    },
    emits: ['start-new-order']
};