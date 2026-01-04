<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Pages Site</title>
</head>
<body>
// RentTracker Pro Ultimate - Enterprise System
// 15+ Charts, Advanced Features, Premium UI

let currentUser = null;
let charts = {};

// ==================== DATA INITIALIZATION ====================
function initData() {
    if (!localStorage.getItem('initialized')) {
        // Users
        localStorage.setItem('users', JSON.stringify([
            {
                id: '1',
                name: 'Admin User',
                email: 'admin@renttracker.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                id: '2',
                name: 'Rajesh Kumar',
                email: 'renter@renttracker.com',
                password: 'renter123',
                role: 'renter',
                propertyId: '1'
            }
        ]));

        // Properties - More detailed
        localStorage.setItem('properties', JSON.stringify([
            {
                id: '1',
                name: 'Sunset Apartments 101',
                type: 'apartment',
                address: '123 Main St, Mumbai, Maharashtra 400001',
                rent: 25000,
                beds: 2,
                baths: 2,
                sqft: 1200,
                status: 'occupied',
                value: 5000000,
                created: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Green Valley House',
                type: 'house',
                address: '456 Park Ave, Delhi, NCR 110001',
                rent: 45000,
                beds: 3,
                baths: 3,
                sqft: 2000,
                status: 'occupied',
                value: 8000000,
                created: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Downtown Condo',
                type: 'condo',
                address: '789 Business St, Bangalore, Karnataka 560001',
                rent: 35000,
                beds: 2,
                baths: 2,
                sqft: 1500,
                status: 'vacant',
                value: 6000000,
                created: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Luxury Villa',
                type: 'villa',
                address: '321 Beach Road, Goa 403001',
                rent: 75000,
                beds: 4,
                baths: 4,
                sqft: 3000,
                status: 'occupied',
                value: 12000000,
                created: new Date().toISOString()
            },
            {
                id: '5',
                name: 'Studio Apartment',
                type: 'studio',
                address: '555 Tech Park, Pune, Maharashtra 411001',
                rent: 18000,
                beds: 1,
                baths: 1,
                sqft: 600,
                status: 'vacant',
                value: 3000000,
                created: new Date().toISOString()
            }
        ]));

        // Tenants
        localStorage.setItem('tenants', JSON.stringify([
            {
                id: '1',
                name: 'Rajesh Kumar',
                email: 'renter@renttracker.com',
                phone: '+91 98765 43210',
                propertyId: '1',
                leaseStart: '2024-01-01',
                leaseEnd: '2024-12-31',
                deposit: 50000,
                emergencyContact: '+91 98765 43211',
                created: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Priya Sharma',
                email: 'priya@email.com',
                phone: '+91 98765 43212',
                propertyId: '2',
                leaseStart: '2024-02-01',
                leaseEnd: '2025-01-31',
                deposit: 90000,
                emergencyContact: '+91 98765 43213',
                created: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Amit Patel',
                email: 'amit@email.com',
                phone: '+91 98765 43214',
                propertyId: '4',
                leaseStart: '2024-03-01',
                leaseEnd: '2025-02-28',
                deposit: 150000,
                emergencyContact: '+91 98765 43215',
                created: new Date().toISOString()
            }
        ]));

        // Payments - 12 months of data
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

        // Maintenance - More detailed
        localStorage.setItem('maintenance', JSON.stringify([
            {
                id: '1',
                propertyId: '1',
                category: 'plumbing',
                title: 'Leaking Faucet',
                description: 'Kitchen faucet needs repair - water dripping continuously',
                priority: 'medium',
                status: 'in-progress',
                cost: 2500,
                created: new Date().toISOString()
            },
            {
                id: '2',
                propertyId: '2',
                category: 'hvac',
                title: 'AC Not Working',
                description: 'Master bedroom AC needs service - not cooling properly',
                priority: 'high',
                status: 'pending',
                cost: 5000,
                created: new Date().toISOString()
            },
            {
                id: '3',
                propertyId: '4',
                category: 'electrical',
                title: 'Light Fixture Replacement',
                description: 'Living room light fixture needs replacement',
                priority: 'low',
                status: 'completed',
                cost: 1500,
                created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: '4',
                propertyId: '1',
                category: 'appliance',
                title: 'Refrigerator Repair',
                description: 'Refrigerator making unusual noise',
                priority: 'urgent',
                status: 'in-progress',
                cost: 3500,
                created: new Date().toISOString()
            }
        ]));

        // Expenses
        const expenses = [];
        for (let i = 0; i < 12; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            expenses.push({
                id: Date.now() + i,
                category: ['maintenance', 'utilities', 'insurance', 'taxes', 'repairs'][Math.floor(Math.random() * 5)],
                amount: Math.floor(Math.random() * 20000) + 5000,
                date: date.toISOString().split('T')[0],
                description: 'Monthly expense',
                created: date.toISOString()
            });
        }
        localStorage.setItem('expenses', JSON.stringify(expenses));

        localStorage.setItem('initialized', 'true');
    }
}

// ==================== UTILITIES ====================
const Utils = {
    formatCurrency: (amount) => '₹' + amount.toLocaleString('en-IN'),
    
    formatDate: (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
        alert('Invalid email or password!');
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
            <button class="nav-btn active" onclick="showPage('dashboard')">
                <i class="fas fa-chart-line"></i> Dashboard
            </button>
            <button class="nav-btn" onclick="showPage('properties')">
                <i class="fas fa-building"></i> Properties
            </button>
            <button class="nav-btn" onclick="showPage('tenants')">
                <i class="fas fa-users"></i> Tenants
            </button>
            <button class="nav-btn" onclick="showPage('payments')">
                <i class="fas fa-money-bill-wave"></i> Payments
            </button>
            <button class="nav-btn" onclick="showPage('maintenance')">
                <i class="fas fa-tools"></i> Maintenance
            </button>
            <button class="nav-btn" onclick="showPage('analytics')">
                <i class="fas fa-chart-bar"></i> Analytics
            </button>
            <button class="nav-btn" onclick="showPage('reports')">
                <i class="fas fa-file-alt"></i> Reports
            </button>
        `;
    } else {
        navMenu.innerHTML = `
            <button class="nav-btn active" onclick="showPage('renter')">
                <i class="fas fa-home"></i> My Property
            </button>
        `;
    }
}

// ==================== CHARTS ====================
const Charts = {
    destroy: (id) => {
        if (charts[id]) {
            charts[id].destroy();
            delete charts[id];
        }
    },
    
    revenue: () => {
        Charts.destroy('revenueChart');
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]').filter(p => p.status === 'paid');
        const months = [];
        const revenue = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short' }));
            
            const monthRevenue = payments
                .filter(p => {
                    const pDate = new Date(p.date);
                    return pDate.getMonth() === date.getMonth() &&
                           pDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, p) => sum + p.amount, 0);
            
            revenue.push(monthRevenue);
        }
        
        charts.revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Revenue',
                    data: revenue,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => '₹' + context.parsed.y.toLocaleString('en-IN')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + (value/1000) + 'K'
                        }
                    }
                }
            }
        });
    },
    
    occupancy: () => {
        Charts.destroy('occupancyChart');
        const ctx = document.getElementById('occupancyChart');
        if (!ctx) return;
        
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const occupied = properties.filter(p => p.status === 'occupied').length;
        const vacant = properties.filter(p => p.status === 'vacant').length;
        const maintenance = properties.filter(p => p.status === 'maintenance').length;
        
        charts.occupancyChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Occupied', 'Vacant', 'Maintenance'],
                datasets: [{
                    data: [occupied, vacant, maintenance],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    },
    
    paymentStatus: () => {
        Charts.destroy('paymentStatusChart');
        const ctx = document.getElementById('paymentStatusChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const paid = payments.filter(p => p.status === 'paid').length;
        const pending = payments.filter(p => p.status === 'pending').length;
        const overdue = payments.filter(p => p.status === 'overdue').length;
        
        charts.paymentStatusChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Paid', 'Pending', 'Overdue'],
                datasets: [{
                    label: 'Payments',
                    data: [paid, pending, overdue],
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },
    
    revenueExpense: () => {
        Charts.destroy('revenueExpenseChart');
        const ctx = document.getElementById('revenueExpenseChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]').filter(p => p.status === 'paid');
        const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        const months = [];
        const revenue = [];
        const expenseData = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short' }));
            
            const monthRevenue = payments
                .filter(p => {
                    const pDate = new Date(p.date);
                    return pDate.getMonth() === date.getMonth() &&
                           pDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, p) => sum + p.amount, 0);
            
            const monthExpense = expenses
                .filter(e => {
                    const eDate = new Date(e.date);
                    return eDate.getMonth() === date.getMonth() &&
                           eDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, e) => sum + e.amount, 0);
            
            revenue.push(monthRevenue);
            expenseData.push(monthExpense);
        }
        
        charts.revenueExpenseChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Revenue',
                        data: revenue,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.dataset.label + ': ₹' + context.parsed.y.toLocaleString('en-IN')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + (value/1000) + 'K'
                        }
                    }
                }
            }
        });
    },
    
    monthly: () => {
        Charts.destroy('monthlyChart');
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]').filter(p => p.status === 'paid');
        const months = [];
        const revenue = [];
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short' }));
            
            const monthRevenue = payments
                .filter(p => {
                    const pDate = new Date(p.date);
                    return pDate.getMonth() === date.getMonth() &&
                           pDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, p) => sum + p.amount, 0);
            
            revenue.push(monthRevenue);
        }
        
        charts.monthlyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Revenue',
                    data: revenue,
                    backgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => '₹' + context.parsed.y.toLocaleString('en-IN')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + (value/1000) + 'K'
                        }
                    }
                }
            }
        });
    },
    
    revenueGrowth: () => {
        Charts.destroy('revenueGrowthChart');
        const ctx = document.getElementById('revenueGrowthChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]').filter(p => p.status === 'paid');
        const months = [];
        const growth = [];
        let prevRevenue = 0;
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short' }));
            
            const monthRevenue = payments
                .filter(p => {
                    const pDate = new Date(p.date);
                    return pDate.getMonth() === date.getMonth() &&
                           pDate.getFullYear() === date.getFullYear();
                })
                .reduce((sum, p) => sum + p.amount, 0);
            
            if (prevRevenue > 0) {
                growth.push(((monthRevenue - prevRevenue) / prevRevenue * 100).toFixed(1));
            } else {
                growth.push(0);
            }
            prevRevenue = monthRevenue;
        }
        
        charts.revenueGrowthChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Growth %',
                    data: growth,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.parsed.y + '%'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });
    },
    
    types: () => {
        Charts.destroy('typesChart');
        const ctx = document.getElementById('typesChart');
        if (!ctx) return;
        
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const types = {};
        properties.forEach(p => {
            types[p.type] = (types[p.type] || 0) + 1;
        });
        
        charts.typesChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(types).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
                datasets: [{
                    data: Object.values(types),
                    backgroundColor: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    },
    
    methods: () => {
        Charts.destroy('methodsChart');
        const ctx = document.getElementById('methodsChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const methods = {};
        payments.forEach(p => {
            methods[p.method] = (methods[p.method] || 0) + 1;
        });
        
        charts.methodsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(methods).map(m => m.toUpperCase()),
                datasets: [{
                    data: Object.values(methods),
                    backgroundColor: ['#10b981', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    },
    
    revenueByProperty: () => {
        Charts.destroy('revenueByPropertyChart');
        const ctx = document.getElementById('revenueByPropertyChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]').filter(p => p.status === 'paid');
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const propertyRevenue = {};
        
        properties.forEach(p => {
            const revenue = payments
                .filter(pay => pay.propertyId === p.id)
                .reduce((sum, pay) => sum + pay.amount, 0);
            propertyRevenue[p.name] = revenue;
        });
        
        charts.revenueByPropertyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(propertyRevenue),
                datasets: [{
                    label: 'Revenue',
                    data: Object.values(propertyRevenue),
                    backgroundColor: '#6366f1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => '₹' + context.parsed.x.toLocaleString('en-IN')
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => '₹' + (value/1000) + 'K'
                        }
                    }
                }
            }
        });
    },
    
    occupancyRate: () => {
        Charts.destroy('occupancyRateChart');
        const ctx = document.getElementById('occupancyRateChart');
        if (!ctx) return;
        
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const total = properties.length;
        const occupied = properties.filter(p => p.status === 'occupied').length;
        const rate = (occupied / total * 100).toFixed(1);
        
        charts.occupancyRateChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Occupied', 'Available'],
                datasets: [{
                    data: [rate, 100 - rate],
                    backgroundColor: ['#10b981', '#e5e7eb'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (context) => context.parsed + '%'
                        }
                    }
                }
            }
        });
    },
    
    propertyValue: () => {
        Charts.destroy('propertyValueChart');
        const ctx = document.getElementById('propertyValueChart');
        if (!ctx) return;
        
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const months = [];
        const values = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short' }));
            
            const totalValue = properties.reduce((sum, p) => sum + (p.value || 0), 0);
            values.push(totalValue + (Math.random() * 100000 - 50000));
        }
        
        charts.propertyValueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Total Value',
                    data: values,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => '₹' + (context.parsed.y/100000).toFixed(1) + 'L'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: (value) => '₹' + (value/100000).toFixed(1) + 'L'
                        }
                    }
                }
            }
        });
    },
    
    maintenanceByProperty: () => {
        Charts.destroy('maintenanceByPropertyChart');
        const ctx = document.getElementById('maintenanceByPropertyChart');
        if (!ctx) return;
        
        const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        const properties = JSON.parse(localStorage.getItem('properties') || '[]');
        const propertyMaintenance = {};
        
        properties.forEach(p => {
            const count = maintenance.filter(m => m.propertyId === p.id).length;
            propertyMaintenance[p.name] = count;
        });
        
        charts.maintenanceByPropertyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(propertyMaintenance),
                datasets: [{
                    label: 'Requests',
                    data: Object.values(propertyMaintenance),
                    backgroundColor: '#f59e0b'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },
    
    tenantDuration: () => {
        Charts.destroy('tenantDurationChart');
        const ctx = document.getElementById('tenantDurationChart');
        if (!ctx) return;
        
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
        const durations = tenants.map(t => {
            const start = new Date(t.leaseStart);
            const end = new Date(t.leaseEnd);
            const months = (end - start) / (1000 * 60 * 60 * 24 * 30);
            return months.toFixed(0);
        });
        
        charts.tenantDurationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: tenants.map(t => t.name),
                datasets: [{
                    label: 'Lease Duration (Months)',
                    data: durations,
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },
    
    paymentCompliance: () => {
        Charts.destroy('paymentComplianceChart');
        const ctx = document.getElementById('paymentComplianceChart');
        if (!ctx) return;
        
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        const onTime = payments.filter(p => p.status === 'paid').length;
        const late = payments.filter(p => p.status === 'overdue').length;
        const pending = payments.filter(p => p.status === 'pending').length;
        
        charts.paymentComplianceChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['On Time', 'Late', 'Pending'],
                datasets: [{
                    data: [onTime, late, pending],
                    backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    },
    
    priority: () => {
        Charts.destroy('priorityChart');
        const ctx = document.getElementById('priorityChart');
        if (!ctx) return;
        
        const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
        const priorities = {};
        maintenance.forEach(m => {
            priorities[m.priority] = (priorities[m.priority] || 0) + 1;
        });
        
        charts.priorityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(priorities).map(p => p.charAt(0).toUpperCase() + p.slice(1)),
                datasets: [{
                    label: 'Count',
                    data: Object.values(priorities),
                    backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#dc2626']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    },
    
    satisfaction: () => {
        Charts.destroy('satisfactionChart');
        const ctx = document.getElementById('satisfactionChart');
        if (!ctx) return;
        
        const months = [];
        const scores = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleString('default', { month: 'short' }));
            scores.push(Math.floor(Math.random() * 20) + 80);
        }
        
        charts.satisfactionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Satisfaction Score',
                    data: scores,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            callback: (value) => value + '%'
                        }
                    }
                }
            }
        });
    }
};

// Continue in next message due to length...
</body>
</html>