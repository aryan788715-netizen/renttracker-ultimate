// RentTracker Pro Ultimate - Complete JavaScript
let currentUser = null;
let charts = {};

// ==================== UTILITIES ====================
const Utils = {
    formatCurrency: (amount) => '₹' + amount.toLocaleString('en-IN'),
    formatDate: (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    generateId: () => Date.now().toString() + Math.random().toString(36).substr(2, 9),
    calculateGrowth: (current, previous) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    }
};

// ==================== AUTH ====================
function loginAsAdmin() {
    document.getElementById('email').value = 'admin@renttracker.com';
    document.getElementById('password').value = 'admin123';
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

function loginAsRenter() {
    document.getElementById('email').value = 'renter@renttracker.com';
    document.getElementById('password').value = 'renter123';
    document.getElementById('loginForm').dispatchEvent(new Event('submit'));
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showDashboard();
    } else {
        alert('Invalid credentials!');
    }
});

function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').classList.add('show');
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role.toUpperCase();
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    setupNavigation();
    loadDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('show');
    document.getElementById('loginForm').reset();
}

function setupNavigation() {
    const navMenu = document.getElementById('navMenu');
    if (currentUser.role === 'admin') {
        navMenu.innerHTML = `
            <button class="nav-btn active" onclick="showPage('dashboard')"><i class="fas fa-chart-line"></i> Dashboard</button>
            <button class="nav-btn" onclick="showPage('properties')"><i class="fas fa-building"></i> Properties</button>
            <button class="nav-btn" onclick="showPage('tenants')"><i class="fas fa-users"></i> Tenants</button>
            <button class="nav-btn" onclick="showPage('payments')"><i class="fas fa-money-bill-wave"></i> Payments</button>
            <button class="nav-btn" onclick="showPage('maintenance')"><i class="fas fa-tools"></i> Maintenance</button>
        `;
    } else {
        navMenu.innerHTML = `<button class="nav-btn active" onclick="showPage('renter')"><i class="fas fa-home"></i> My Property</button>`;
    }
}

// ==================== INIT DATA ====================
function initData() {
    if (!localStorage.getItem('initialized')) {
        localStorage.setItem('users', JSON.stringify([
            { id: '1', name: 'Admin User', email: 'admin@renttracker.com', password: 'admin123', role: 'admin' },
            { id: '2', name: 'Rajesh Kumar', email: 'renter@renttracker.com', password: 'renter123', role: 'renter' }
        ]));
        
        localStorage.setItem('properties', JSON.stringify([
            { id: '1', name: 'Sunset Apartments 101', type: 'apartment', address: '123 Main St, Mumbai', rent: 25000, beds: 2, baths: 2, sqft: 1200, status: 'occupied', value: 5000000, created: new Date().toISOString() },
            { id: '2', name: 'Green Valley House', type: 'house', address: '456 Park Ave, Delhi', rent: 45000, beds: 3, baths: 3, sqft: 2000, status: 'occupied', value: 8000000, created: new Date().toISOString() },
            { id: '3', name: 'Downtown Condo', type: 'condo', address: '789 Business St, Bangalore', rent: 35000, beds: 2, baths: 2, sqft: 1500, status: 'vacant', value: 6000000, created: new Date().toISOString() }
        ]));
        
        localStorage.setItem('tenants', JSON.stringify([
            { id: '1', name: 'Rajesh Kumar', email: 'renter@renttracker.com', phone: '+91 98765 43210', propertyId: '1', leaseStart: '2024-01-01', leaseEnd: '2024-12-31', deposit: 50000, emergencyContact: '+91 98765 43211', created: new Date().toISOString() },
            { id: '2', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43212', propertyId: '2', leaseStart: '2024-02-01', leaseEnd: '2025-01-31', deposit: 90000, emergencyContact: '+91 98765 43213', created: new Date().toISOString() }
        ]));
        
        const payments = [];
        const tenants = JSON.parse(localStorage.getItem('tenants'));
        const properties = JSON.parse(localStorage.getItem('properties'));
        for (let i = 0; i < 12; i++) {
            tenants.forEach(tenant => {
                const property = properties.find(p => p.id === tenant.propertyId);
                if (property) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    payments.push({
                        id: Date.now() + Math.random().toString(),
                        tenantId: tenant.id,
                        propertyId: property.id,
                        amount: property.rent,
                        date: date.toISOString().split('T')[0],
                        method: ['cash', 'bank', 'upi', 'check', 'card'][Math.floor(Math.random() * 5)],
                        status: i === 0 ? 'pending' : i === 1 ? 'overdue' : 'paid',
                        txnId: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9),
                        notes: i === 0 ? 'Pending payment' : 'Payment received',
                        created: date.toISOString()
                    });
                }
            });
        }
        localStorage.setItem('payments', JSON.stringify(payments));
        
        localStorage.setItem('maintenance', JSON.stringify([
            { id: '1', propertyId: '1', category: 'plumbing', title: 'Leaking Faucet', description: 'Kitchen faucet needs repair', priority: 'medium', status: 'in-progress', cost: 2500, created: new Date().toISOString() },
            { id: '2', propertyId: '2', category: 'hvac', title: 'AC Not Working', description: 'Master bedroom AC needs service', priority: 'high', status: 'pending', cost: 5000, created: new Date().toISOString() }
        ]));
        
        localStorage.setItem('initialized', 'true');
    }
}

// ==================== CHARTS ====================
const Charts = {
    revenue: () => {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const last6Months = [];
        const revenue = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toLocaleDateString('en-IN', { month: 'short' }));
            const monthRevenue = payments.filter(p => {
                const pDate = new Date(p.date);
                return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear() && p.status === 'paid';
            }).reduce((sum, p) => sum + p.amount, 0);
            revenue.push(monthRevenue);
        }
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'Revenue',
                    data: revenue,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    occupancy: () => {
        const ctx = document.getElementById('occupancyChart');
        if (!ctx) return;
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const occupied = properties.filter(p => p.status === 'occupied').length;
        const vacant = properties.filter(p => p.status === 'vacant').length;
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Occupied', 'Vacant'],
                datasets: [{
                    data: [occupied, vacant],
                    backgroundColor: ['#10b981', '#f59e0b']
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    paymentStatus: () => {
        const ctx = document.getElementById('paymentChart');
        if (!ctx) return;
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const paid = payments.filter(p => p.status === 'paid').length;
        const pending = payments.filter(p => p.status === 'pending').length;
        const overdue = payments.filter(p => p.status === 'overdue').length;
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Paid', 'Pending', 'Overdue'],
                datasets: [{
                    label: 'Payments',
                    data: [paid, pending, overdue],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    revenueExpense: () => {
        const ctx = document.getElementById('revenueExpenseChart');
        if (!ctx) return;
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const last6Months = [];
        const revenue = [];
        const expenses = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toLocaleDateString('en-IN', { month: 'short' }));
            const monthRevenue = payments.filter(p => {
                const pDate = new Date(p.date);
                return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear() && p.status === 'paid';
            }).reduce((sum, p) => sum + p.amount, 0);
            revenue.push(monthRevenue);
            expenses.push(monthRevenue * 0.3);
        }
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [
                    { label: 'Revenue', data: revenue, borderColor: '#10b981', tension: 0.4 },
                    { label: 'Expenses', data: expenses, borderColor: '#ef4444', tension: 0.4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
};

// Continue with rest of functions in next part...