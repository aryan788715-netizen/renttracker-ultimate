// Part 3 - Modals, Forms, and Navigation

// ==================== MODALS ====================
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    modal.classList.add('show');
    
    if (type === 'tenant' || type === 'maintenance') {
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const selectId = type === 'tenant' ? 'tenantProperty' : 'maintProperty';
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Property</option>' +
            properties.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }
    
    if (type === 'payment') {
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        const select = document.getElementById('paymentTenant');
        select.innerHTML = '<option value="">Select Tenant</option>' +
            tenants.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    }
    
    if (currentUser && currentUser.role === 'renter' && type === 'maintenance') {
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        const tenant = tenants.find(t => t.email === currentUser.email);
        if (tenant) {
            document.getElementById('maintProperty').value = tenant.propertyId;
        }
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    modal.classList.remove('show');
}

// ==================== FORMS ====================
document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('propertyForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        properties.push({
            id: Utils.generateId(),
            name: document.getElementById('propName').value,
            type: document.getElementById('propType').value,
            address: document.getElementById('propAddress').value,
            rent: parseInt(document.getElementById('propRent').value),
            beds: parseInt(document.getElementById('propBeds').value) || 0,
            baths: parseInt(document.getElementById('propBaths').value) || 0,
            sqft: parseInt(document.getElementById('propSqft').value) || 0,
            status: document.getElementById('propStatus').value,
            value: parseInt(document.getElementById('propRent').value) * 200,
            created: new Date().toISOString()
        });
        
        localStorage.setItem('properties', JSON.stringify(properties));
        closeModal('property');
        this.reset();
        loadProperties();
        loadDashboard();
        alert('Property added successfully!');
    });

    document.getElementById('tenantForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        tenants.push({
            id: Utils.generateId(),
            name: document.getElementById('tenantName').value,
            email: document.getElementById('tenantEmail').value,
            phone: document.getElementById('tenantPhone').value,
            propertyId: document.getElementById('tenantProperty').value,
            leaseStart: document.getElementById('tenantStart').value,
            leaseEnd: document.getElementById('tenantEnd').value,
            deposit: parseInt(document.getElementById('tenantDeposit').value) || 0,
            emergencyContact: document.getElementById('tenantEmergency').value,
            created: new Date().toISOString()
        });
        
        localStorage.setItem('tenants', JSON.stringify(tenants));
        closeModal('tenant');
        this.reset();
        loadTenants();
        loadDashboard();
        alert('Tenant added successfully!');
    });

    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const tenantId = document.getElementById('paymentTenant').value;
        const tenant = JSON.parse(localStorage.getItem('tenants') || '[]').find(t => t.id === tenantId);
        
        payments.push({
            id: Utils.generateId(),
            tenantId: tenantId,
            propertyId: tenant.propertyId,
            amount: parseInt(document.getElementById('paymentAmount').value),
            date: document.getElementById('paymentDate').value,
            method: document.getElementById('paymentMethod').value,
            status: document.getElementById('paymentStatus').value,
            txnId: document.getElementById('paymentTxnId').value || 'TXN' + Date.now(),
            notes: document.getElementById('paymentNotes').value,
            created: new Date().toISOString()
        });
        
        localStorage.setItem('payments', JSON.stringify(payments));
        closeModal('payment');
        this.reset();
        loadPayments();
        loadDashboard();
        alert('Payment recorded successfully!');
    });

    document.getElementById('maintenanceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        maintenance.push({
            id: Utils.generateId(),
            propertyId: document.getElementById('maintProperty').value,
            category: document.getElementById('maintCategory').value,
            title: document.getElementById('maintTitle').value,
            description: document.getElementById('maintDesc').value,
            priority: document.getElementById('maintPriority').value,
            status: document.getElementById('maintStatus').value,
            cost: parseInt(document.getElementById('maintCost').value) || 0,
            created: new Date().toISOString()
        });
        
        localStorage.setItem('maintenance', JSON.stringify(maintenance));
        closeModal('maintenance');
        this.reset();
        loadMaintenance();
        if (currentUser && currentUser.role === 'renter') {
            loadRenterView();
        }
        loadDashboard();
        alert('Maintenance request created successfully!');
    });
    
});

// ==================== NAVIGATION ====================
function showPage(page) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + 'Page').classList.add('active');
    
    if (page === 'dashboard') {
        loadDashboard();
    } else if (page === 'properties') {
        loadProperties();
    } else if (page === 'tenants') {
        loadTenants();
    } else if (page === 'payments') {
        loadPayments();
    } else if (page === 'maintenance') {
        loadMaintenance();
    } else if (page === 'renter') {
        loadRenterView();
    }
}