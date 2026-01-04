// Part 2 - Dashboard and Page Functions

// ==================== DASHBOARD ====================
window.loadDashboard = function() {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    
    const totalProperties = properties.length;
    const totalTenants = tenants.length;
    
    const thisMonth = payments.filter(p => {
        const pDate = new Date(p.date);
        const now = new Date();
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
    });
    
    const lastMonth = payments.filter(p => {
        const pDate = new Date(p.date);
        const now = new Date();
        now.setMonth(now.getMonth() - 1);
        return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
    });
    
    const monthlyRevenue = thisMonth.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const lastMonthRevenue = lastMonth.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const revenueGrowth = Utils.calculateGrowth(monthlyRevenue, lastMonthRevenue);
    const pendingMaintenance = maintenance.filter(m => m.status !== 'completed').length;
    const occupancyRate = ((properties.filter(p => p.status === 'occupied').length / totalProperties) * 100).toFixed(1);
    const totalValue = properties.reduce((sum, p) => sum + (p.value || 0), 0);
    
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Total Properties</div>
                    <div class="stat-value">${totalProperties}</div>
                    <div class="stat-change up"><i class="fas fa-arrow-up"></i> 12% from last month</div>
                </div>
                <div class="stat-icon blue"><i class="fas fa-building"></i></div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Active Tenants</div>
                    <div class="stat-value">${totalTenants}</div>
                    <div class="stat-change up"><i class="fas fa-arrow-up"></i> 8% from last month</div>
                </div>
                <div class="stat-icon green"><i class="fas fa-users"></i></div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Monthly Revenue</div>
                    <div class="stat-value">${Utils.formatCurrency(monthlyRevenue)}</div>
                    <div class="stat-change ${revenueGrowth >= 0 ? 'up' : 'down'}">
                        <i class="fas fa-arrow-${revenueGrowth >= 0 ? 'up' : 'down'}"></i> ${Math.abs(revenueGrowth)}% from last month
                    </div>
                </div>
                <div class="stat-icon purple"><i class="fas fa-money-bill-wave"></i></div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Pending Maintenance</div>
                    <div class="stat-value">${pendingMaintenance}</div>
                    <div class="stat-change down"><i class="fas fa-arrow-down"></i> 15% from last month</div>
                </div>
                <div class="stat-icon orange"><i class="fas fa-tools"></i></div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Occupancy Rate</div>
                    <div class="stat-value">${occupancyRate}%</div>
                    <div class="progress-bar"><div class="progress-fill" style="width: ${occupancyRate}%"></div></div>
                </div>
                <div class="stat-icon red"><i class="fas fa-chart-pie"></i></div>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div>
                    <div class="stat-label">Total Portfolio Value</div>
                    <div class="stat-value">${Utils.formatCurrency(totalValue)}</div>
                    <div class="stat-change up"><i class="fas fa-arrow-up"></i> 5% from last month</div>
                </div>
                <div class="stat-icon indigo"><i class="fas fa-chart-line"></i></div>
            </div>
        </div>
    `;
    
    const recentPayments = payments.slice(-10).reverse();
    const recentHtml = recentPayments.map(p => {
        const tenant = tenants.find(t => t.id === p.tenantId);
        const property = properties.find(pr => pr.id === p.propertyId);
        return `
            <div class="alert alert-${p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}">
                <i class="fas fa-${p.status === 'paid' ? 'check-circle' : p.status === 'pending' ? 'clock' : 'exclamation-circle'}"></i>
                <div>
                    <strong>${tenant?.name || 'Unknown'}</strong> - ${property?.name || 'Unknown'}
                    <br><small>${Utils.formatCurrency(p.amount)} • ${Utils.formatDate(p.date)} • ${p.method.toUpperCase()}</small>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('recentActivity').innerHTML = recentHtml || '<div class="empty-state"><div class="empty-icon"><i class="fas fa-inbox"></i></div><h3>No recent activity</h3></div>';
    
    // Load all charts with a slight delay to ensure DOM is ready
    setTimeout(() => {
        // Primary Charts
        Charts.revenue();
        Charts.occupancy();
        Charts.paymentStatus();
        Charts.revenueExpense();
        
        // Advanced Analytics Charts
        Charts.propertyType();
        Charts.paymentMethod();
        Charts.maintenanceCost();
        Charts.leaseExpiry();
        Charts.propertyValue();
        Charts.paymentTimeline();
        Charts.occupancyTrend();
        Charts.revenueByProperty();
        Charts.maintenanceCategory();
        Charts.cashFlow();
        Charts.collectionRate();
        Charts.tenantDistribution();
    }, 100);
}

// ==================== PROPERTIES ====================
window.loadProperties = function() {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    
    if (properties.length === 0) {
        document.getElementById('propertiesTable').innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-building"></i></div><h3>No properties yet</h3></div>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Rent</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Tenant</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${properties.map(p => {
                    const tenant = tenants.find(t => t.propertyId === p.id);
                    return `
                        <tr>
                            <td><strong>${p.name}</strong></td>
                            <td><span class="badge badge-primary">${p.type.toUpperCase()}</span></td>
                            <td>${p.address}</td>
                            <td><strong>${Utils.formatCurrency(p.rent)}</strong></td>
                            <td>${p.beds || 0} BD • ${p.baths || 0} BA • ${p.sqft || 0} sqft</td>
                            <td><span class="badge badge-${p.status === 'occupied' ? 'success' : p.status === 'vacant' ? 'warning' : 'danger'}">${p.status.toUpperCase()}</span></td>
                            <td>${tenant ? tenant.name : '-'}</td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteProperty('${p.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('propertiesTable').innerHTML = html;
}

window.deleteProperty = function(id) {
    if (confirm('Delete this property?')) {
        const properties = JSON.parse(localStorage.getItem('properties') || '[]').filter(p => p.id !== id);
        localStorage.setItem('properties', JSON.stringify(properties));
        loadProperties();
        loadDashboard();
        alert('Property deleted!');
    }
}

// ==================== TENANTS ====================
window.loadTenants = function() {
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    if (tenants.length === 0) {
        document.getElementById('tenantsTable').innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-users"></i></div><h3>No tenants yet</h3></div>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Property</th>
                    <th>Lease Period</th>
                    <th>Deposit</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${tenants.map(t => {
                    const property = properties.find(p => p.id === t.propertyId);
                    return `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.email}</td>
                            <td>${t.phone}</td>
                            <td>${property?.name || 'Unknown'}</td>
                            <td>${Utils.formatDate(t.leaseStart)} - ${Utils.formatDate(t.leaseEnd)}</td>
                            <td><strong>${Utils.formatCurrency(t.deposit || 0)}</strong></td>
                            <td>
                                <button class="btn btn-danger btn-sm" onclick="deleteTenant('${t.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('tenantsTable').innerHTML = html;
}

window.deleteTenant = function(id) {
    if (confirm('Delete this tenant?')) {
        const tenants = JSON.parse(localStorage.getItem('tenants') || '[]').filter(t => t.id !== id);
        localStorage.setItem('tenants', JSON.stringify(tenants));
        loadTenants();
        loadDashboard();
        alert('Tenant deleted!');
    }
}

// ==================== PAYMENTS ====================
window.loadPayments = function() {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    if (payments.length === 0) {
        document.getElementById('paymentsTable').innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-money-bill-wave"></i></div><h3>No payments yet</h3></div>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Tenant</th>
                    <th>Property</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${payments.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 50).map(p => {
                    const tenant = tenants.find(t => t.id === p.tenantId);
                    const property = properties.find(pr => pr.id === p.propertyId);
                    return `
                        <tr>
                            <td>${Utils.formatDate(p.date)}</td>
                            <td><strong>${tenant?.name || 'Unknown'}</strong></td>
                            <td>${property?.name || 'Unknown'}</td>
                            <td><strong>${Utils.formatCurrency(p.amount)}</strong></td>
                            <td><span class="badge badge-info">${p.method.toUpperCase()}</span></td>
                            <td><small>${p.txnId || '-'}</small></td>
                            <td><span class="badge badge-${p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}">${p.status.toUpperCase()}</span></td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('paymentsTable').innerHTML = html;
}

// ==================== MAINTENANCE ====================
window.loadMaintenance = function() {
    const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    
    if (maintenance.length === 0) {
        document.getElementById('maintenanceTable').innerHTML = '<div class="empty-state"><div class="empty-icon"><i class="fas fa-tools"></i></div><h3>No maintenance requests yet</h3></div>';
        return;
    }
    
    const html = `
        <table>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Category</th>
                    <th>Issue</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Cost</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${maintenance.map(m => {
                    const property = properties.find(p => p.id === m.propertyId);
                    return `
                        <tr>
                            <td><strong>${property?.name || 'Unknown'}</strong></td>
                            <td><span class="badge badge-info">${m.category.toUpperCase()}</span></td>
                            <td>${m.title}</td>
                            <td>${m.description}</td>
                            <td><span class="badge badge-${m.priority === 'urgent' ? 'danger' : m.priority === 'high' ? 'danger' : m.priority === 'medium' ? 'warning' : 'success'}">${m.priority.toUpperCase()}</span></td>
                            <td><span class="badge badge-${m.status === 'completed' ? 'success' : m.status === 'in-progress' ? 'warning' : 'primary'}">${m.status.toUpperCase()}</span></td>
                            <td><strong>${Utils.formatCurrency(m.cost || 0)}</strong></td>
                            <td>${Utils.formatDate(m.created)}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
    
    document.getElementById('maintenanceTable').innerHTML = html;
}

// ==================== RENTER VIEW ====================
window.loadRenterView = function() {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const maintenance = JSON.parse(localStorage.getItem('maintenance') || '[]');
    const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    
    const tenant = tenants.find(t => t.email === currentUser.email);
    if (!tenant) return;
    
    const property = properties.find(p => p.id === tenant.propertyId);
    
    document.getElementById('myProperty').innerHTML = property ? `
        <div style="padding: 30px; background: linear-gradient(135deg, #f8fafc, #e0e7ff); border-radius: 12px;">
            <h2 style="font-size: 24px; margin-bottom: 20px; color: var(--dark);">${property.name}</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <p style="color: #666; font-size: 13px; margin-bottom: 5px;">ADDRESS</p>
                    <p style="font-weight: 600;">${property.address}</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 13px; margin-bottom: 5px;">MONTHLY RENT</p>
                    <p style="font-weight: 600; font-size: 20px; color: #667eea;">${Utils.formatCurrency(property.rent)}</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 13px; margin-bottom: 5px;">LEASE PERIOD</p>
                    <p style="font-weight: 600;">${Utils.formatDate(tenant.leaseStart)} - ${Utils.formatDate(tenant.leaseEnd)}</p>
                </div>
                <div>
                    <p style="color: #666; font-size: 13px; margin-bottom: 5px;">PROPERTY SIZE</p>
                    <p style="font-weight: 600;">${property.beds} BD • ${property.baths} BA • ${property.sqft} sqft</p>
                </div>
            </div>
        </div>
    ` : '<p>No property assigned</p>';
    
    const myPayments = payments.filter(p => p.tenantId === tenant.id);
    document.getElementById('myPayments').innerHTML = myPayments.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Transaction ID</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${myPayments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(p => `
                    <tr>
                        <td>${Utils.formatDate(p.date)}</td>
                        <td><strong>${Utils.formatCurrency(p.amount)}</strong></td>
                        <td><span class="badge badge-info">${p.method.toUpperCase()}</span></td>
                        <td><small>${p.txnId || '-'}</small></td>
                        <td><span class="badge badge-${p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}">${p.status.toUpperCase()}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<div class="empty-state"><div class="empty-icon"><i class="fas fa-money-bill-wave"></i></div><p>No payments yet</p></div>';
    
    const myMaintenance = maintenance.filter(m => m.propertyId === tenant.propertyId);
    document.getElementById('myMaintenance').innerHTML = myMaintenance.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Issue</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                ${myMaintenance.map(m => `
                    <tr>
                        <td><span class="badge badge-info">${m.category.toUpperCase()}</span></td>
                        <td><strong>${m.title}</strong><br><small>${m.description}</small></td>
                        <td><span class="badge badge-${m.priority === 'urgent' ? 'danger' : m.priority === 'high' ? 'danger' : m.priority === 'medium' ? 'warning' : 'success'}">${m.priority.toUpperCase()}</span></td>
                        <td><span class="badge badge-${m.status === 'completed' ? 'success' : m.status === 'in-progress' ? 'warning' : 'primary'}">${m.status.toUpperCase()}</span></td>
                        <td>${Utils.formatDate(m.created)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    ` : '<div class="empty-state"><div class="empty-icon"><i class="fas fa-tools"></i></div><p>No maintenance requests yet</p></div>';
}