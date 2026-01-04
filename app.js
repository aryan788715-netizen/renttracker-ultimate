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
            { id: '3', name: 'Downtown Condo', type: 'condo', address: '789 Business St, Bangalore', rent: 35000, beds: 2, baths: 2, sqft: 1500, status: 'vacant', value: 6000000, created: new Date().toISOString() },
            { id: '4', name: 'Lakeview Villa', type: 'house', address: '321 Lake Rd, Pune', rent: 55000, beds: 4, baths: 3, sqft: 2500, status: 'occupied', value: 10000000, created: new Date().toISOString() },
            { id: '5', name: 'City Center Office', type: 'commercial', address: '555 Business Park, Hyderabad', rent: 75000, beds: 0, baths: 2, sqft: 3000, status: 'occupied', value: 15000000, created: new Date().toISOString() }
        ]));
        
        localStorage.setItem('tenants', JSON.stringify([
            { id: '1', name: 'Rajesh Kumar', email: 'renter@renttracker.com', phone: '+91 98765 43210', propertyId: '1', leaseStart: '2024-01-01', leaseEnd: '2024-12-31', deposit: 50000, emergencyContact: '+91 98765 43211', created: new Date().toISOString() },
            { id: '2', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43212', propertyId: '2', leaseStart: '2024-02-01', leaseEnd: '2025-01-31', deposit: 90000, emergencyContact: '+91 98765 43213', created: new Date().toISOString() },
            { id: '3', name: 'Amit Patel', email: 'amit@email.com', phone: '+91 98765 43214', propertyId: '4', leaseStart: '2024-03-01', leaseEnd: '2025-02-28', deposit: 110000, emergencyContact: '+91 98765 43215', created: new Date().toISOString() },
            { id: '4', name: 'Tech Solutions Pvt Ltd', email: 'tech@email.com', phone: '+91 98765 43216', propertyId: '5', leaseStart: '2024-01-15', leaseEnd: '2026-01-14', deposit: 150000, emergencyContact: '+91 98765 43217', created: new Date().toISOString() }
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
                    const methods = ['cash', 'bank', 'upi', 'check', 'card'];
                    payments.push({
                        id: Date.now() + Math.random().toString(),
                        tenantId: tenant.id,
                        propertyId: property.id,
                        amount: property.rent,
                        date: date.toISOString().split('T')[0],
                        method: methods[Math.floor(Math.random() * methods.length)],
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
            { id: '1', propertyId: '1', category: 'plumbing', title: 'Leaking Faucet', description: 'Kitchen faucet needs repair', priority: 'medium', status: 'in-progress', cost: 2500, created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '2', propertyId: '2', category: 'hvac', title: 'AC Not Working', description: 'Master bedroom AC needs service', priority: 'high', status: 'pending', cost: 5000, created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '3', propertyId: '4', category: 'electrical', title: 'Light Fixture Broken', description: 'Living room light needs replacement', priority: 'low', status: 'completed', cost: 1500, created: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '4', propertyId: '5', category: 'structural', title: 'Ceiling Leak', description: 'Water damage in conference room', priority: 'urgent', status: 'in-progress', cost: 15000, created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: '5', propertyId: '1', category: 'appliance', title: 'Refrigerator Issue', description: 'Fridge not cooling properly', priority: 'high', status: 'pending', cost: 3500, created: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
        ]));
        
        localStorage.setItem('initialized', 'true');
    }
}

// ==================== AUTH ====================
window.loginAsAdmin = function() {
    document.getElementById('email').value = 'admin@renttracker.com';
    document.getElementById('password').value = 'admin123';
    const form = document.getElementById('loginForm');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
}

window.loginAsRenter = function() {
    document.getElementById('email').value = 'renter@renttracker.com';
    document.getElementById('password').value = 'renter123';
    const form = document.getElementById('loginForm');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
}

window.showDashboard = function() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').classList.add('show');
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = currentUser.role.toUpperCase();
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
    setupNavigation();
    if (typeof loadDashboard === 'function') {
        loadDashboard();
    }
}

window.logout = function() {
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
        const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
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
            
            const monthExpenses = maintenance.filter(m => {
                const mDate = new Date(m.created);
                return mDate.getMonth() === date.getMonth() && mDate.getFullYear() === date.getFullYear();
            }).reduce((sum, m) => sum + (m.cost || 0), 0);
            expenses.push(monthExpenses);
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
    },
    
    // NEW ADVANCED CHARTS
    propertyType: () => {
        const ctx = document.getElementById('propertyTypeChart');
        if (!ctx) return;
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const types = {};
        properties.forEach(p => {
            types[p.type] = (types[p.type] || 0) + 1;
        });
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(types).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
                datasets: [{
                    data: Object.values(types),
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    paymentMethod: () => {
        const ctx = document.getElementById('paymentMethodChart');
        if (!ctx) return;
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const methods = {};
        payments.forEach(p => {
            methods[p.method] = (methods[p.method] || 0) + 1;
        });
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(methods).map(m => m.toUpperCase()),
                datasets: [{
                    data: Object.values(methods),
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    maintenanceCost: () => {
        const ctx = document.getElementById('maintenanceCostChart');
        if (!ctx) return;
        const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        const last6Months = [];
        const costs = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toLocaleDateString('en-IN', { month: 'short' }));
            const monthCost = maintenance.filter(m => {
                const mDate = new Date(m.created);
                return mDate.getMonth() === date.getMonth() && mDate.getFullYear() === date.getFullYear();
            }).reduce((sum, m) => sum + (m.cost || 0), 0);
            costs.push(monthCost);
        }
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'Maintenance Cost',
                    data: costs,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    leaseExpiry: () => {
        const ctx = document.getElementById('leaseExpiryChart');
        if (!ctx) return;
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const labels = [];
        const data = [];
        tenants.forEach(t => {
            const property = properties.find(p => p.id === t.propertyId);
            if (property) {
                labels.push(property.name.substring(0, 20));
                const daysLeft = Math.ceil((new Date(t.leaseEnd) - new Date()) / (1000 * 60 * 60 * 24));
                data.push(daysLeft);
            }
        });
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Days Until Lease Expiry',
                    data: data,
                    backgroundColor: data.map(d => d < 30 ? '#ef4444' : d < 90 ? '#f59e0b' : '#10b981')
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                indexAxis: 'y'
            }
        });
    },
    
    propertyValue: () => {
        const ctx = document.getElementById('propertyValueChart');
        if (!ctx) return;
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: properties.map(p => p.name.substring(0, 15)),
                datasets: [{
                    label: 'Property Value (₹)',
                    data: properties.map(p => p.value),
                    backgroundColor: '#667eea'
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    paymentTimeline: () => {
        const ctx = document.getElementById('paymentTimelineChart');
        if (!ctx) return;
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const last6Months = [];
        const paid = [];
        const pending = [];
        const overdue = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toLocaleDateString('en-IN', { month: 'short' }));
            paid.push(payments.filter(p => {
                const pDate = new Date(p.date);
                return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear() && p.status === 'paid';
            }).length);
            pending.push(payments.filter(p => {
                const pDate = new Date(p.date);
                return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear() && p.status === 'pending';
            }).length);
            overdue.push(payments.filter(p => {
                const pDate = new Date(p.date);
                return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear() && p.status === 'overdue';
            }).length);
        }
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last6Months,
                datasets: [
                    { label: 'Paid', data: paid, backgroundColor: '#10b981' },
                    { label: 'Pending', data: pending, backgroundColor: '#f59e0b' },
                    { label: 'Overdue', data: overdue, backgroundColor: '#ef4444' }
                ]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                scales: { x: { stacked: true }, y: { stacked: true } }
            }
        });
    },
    
    occupancyTrend: () => {
        const ctx = document.getElementById('occupancyTrendChart');
        if (!ctx) return;
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const last6Months = [];
        const rates = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toLocaleDateString('en-IN', { month: 'short' }));
            // Simulate occupancy trend (in real app, track historical data)
            const rate = ((properties.filter(p => p.status === 'occupied').length / properties.length) * 100) + (Math.random() * 10 - 5);
            rates.push(Math.max(0, Math.min(100, rate)));
        }
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'Occupancy Rate (%)',
                    data: rates,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                scales: { y: { min: 0, max: 100 } }
            }
        });
    },
    
    revenueByProperty: () => {
        const ctx = document.getElementById('revenueByPropertyChart');
        if (!ctx) return;
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const revenueData = properties.map(p => {
            const propRevenue = payments.filter(pay => pay.propertyId === p.id && pay.status === 'paid')
                .reduce((sum, pay) => sum + pay.amount, 0);
            return { name: p.name.substring(0, 20), revenue: propRevenue };
        }).sort((a, b) => b.revenue - a.revenue);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: revenueData.map(d => d.name),
                datasets: [{
                    label: 'Total Revenue (₹)',
                    data: revenueData.map(d => d.revenue),
                    backgroundColor: '#10b981'
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                indexAxis: 'y'
            }
        });
    },
    
    maintenanceCategory: () => {
        const ctx = document.getElementById('maintenanceCategoryChart');
        if (!ctx) return;
        const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        const categories = {};
        maintenance.forEach(m => {
            categories[m.category] = (categories[m.category] || 0) + 1;
        });
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.slice(1)),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6']
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    cashFlow: () => {
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) return;
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        const last6Months = [];
        const netCashFlow = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            last6Months.push(date.toLocaleDateString('en-IN', { month: 'short' }));
            const monthRevenue = payments.filter(p => {
                const pDate = new Date(p.date);
                return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear() && p.status === 'paid';
            }).reduce((sum, p) => sum + p.amount, 0);
            const monthExpenses = maintenance.filter(m => {
                const mDate = new Date(m.created);
                return mDate.getMonth() === date.getMonth() && mDate.getFullYear() === date.getFullYear();
            }).reduce((sum, m) => sum + (m.cost || 0), 0);
            netCashFlow.push(monthRevenue - monthExpenses);
        }
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: last6Months,
                datasets: [{
                    label: 'Net Cash Flow (₹)',
                    data: netCashFlow,
                    backgroundColor: netCashFlow.map(v => v >= 0 ? '#10b981' : '#ef4444')
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    },
    
    collectionRate: () => {
        const ctx = document.getElementById('collectionRateChart');
        if (!ctx) return;
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const thisMonth = payments.filter(p => {
            const pDate = new Date(p.date);
            const now = new Date();
            return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
        });
        const collected = thisMonth.filter(p => p.status === 'paid').length;
        const total = thisMonth.length;
        const rate = total > 0 ? (collected / total * 100).toFixed(1) : 0;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Collected', 'Pending'],
                datasets: [{
                    data: [collected, total - collected],
                    backgroundColor: ['#10b981', '#e5e7eb']
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true },
                    title: { display: true, text: `${rate}% Collection Rate` }
                }
            }
        });
    },
    
    tenantDistribution: () => {
        const ctx = document.getElementById('tenantDistributionChart');
        if (!ctx) return;
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        const data = properties.map(p => ({
            name: p.name.substring(0, 15),
            count: tenants.filter(t => t.propertyId === p.id).length
        }));
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    label: 'Number of Tenants',
                    data: data.map(d => d.count),
                    backgroundColor: '#667eea'
                }]
            },
            options: { responsive: true, maintainAspectRatio: true }
        });
    }
};

// ==================== INIT ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    initData();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                console.log('User found:', user);
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showDashboard();
            } else {
                console.log('Invalid credentials');
                alert('Invalid credentials!');
            }
        });
    }
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
});