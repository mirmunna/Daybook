document.addEventListener("DOMContentLoaded", () => {
  const PREFIX = "mirKiryana_";
  const KEYS = {
    customers: PREFIX + "customers",
    products: PREFIX + "products",
    transactions: PREFIX + "transactions",
    settings: PREFIX + "settings",
    darkMode: PREFIX + "darkMode",
  };

  // Elements
  const navItems = document.querySelectorAll("#sidebar .nav-item");
  const modules = document.querySelectorAll("main > section.module");
  const sidebar = document.getElementById("sidebar");
  const menuToggleBtn = document.getElementById("menu-toggle");

  // Dashboard summary
  const summaryCustomers = document.getElementById("summary-customers");
  const summaryProducts = document.getElementById("summary-products");
  const summaryTransactions = document.getElementById("summary-transactions");
  const summarySales = document.getElementById("summary-sales");

  // Customer module
  const customerForm = document.getElementById("customer-form");
  const customersTableBody = document.querySelector("#customers-table tbody");
  const customerIdInput = document.getElementById("customer-id");
  const customerNameInput = document.getElementById("customer-name");
  const customerPhoneInput = document.getElementById("customer-phone");
  const customerAddressInput = document.getElementById("customer-address");
  const searchCustomersInput = document.getElementById("search-customers");

  // Family members
  const familyMemberForm = document.getElementById("family-member-form");
  const familyCustomerIdInput = document.getElementById("family-customer-id");
  const familyMemberNameInput = document.getElementById("family-member-name");
  const familyMemberRelationInput = document.getElementById("family-member-relation");
  const familyMembersTableBody = document.querySelector("#family-members-table tbody");
  const familyClearBtn = document.getElementById("family-clear");

  // Products module
  const productForm = document.getElementById("product-form");
  const productsTableBody = document.querySelector("#products-table tbody");
  const productIdInput = document.getElementById("product-id");
  const productNameInput = document.getElementById("product-name");
  const productStockInput = document.getElementById("product-stock");
  const productPriceInput = document.getElementById("product-price");
  const searchProductsInput = document.getElementById("search-products");

  // Transactions module
  const transactionForm = document.getElementById("transaction-form");
  const transactionsTableBody = document.querySelector("#transactions-table tbody");
  const transactionDateInput = document.getElementById("transaction-date");
  const transactionCustomerSelect = document.getElementById("transaction-customer");
  const transactionFamilyMemberSelect = document.getElementById("transaction-family-member");
  const transactionProductSelect = document.getElementById("transaction-product");
  const transactionQuantityInput = document.getElementById("transaction-quantity");
  const searchTransactionsInput = document.getElementById("search-transactions");

  // Reports module
  const reportForm = document.getElementById("report-form");
  const reportTypeSelect = document.getElementById("report-type");
  const reportDateRow = document.getElementById("report-date-row");
  const reportDateInput = document.getElementById("report-date");
  const reportCustomerRow = document.getElementById("report-customer-row");
  const reportCustomerSelect = document.getElementById("report-customer");
  const reportFeedback = document.getElementById("report-feedback");

  // Settings module
  const settingsForm = document.getElementById("settings-form");
  const shopNameInput = document.getElementById("shop-name");
  const shopColorPrimaryInput = document.getElementById("shop-color-primary");
  const shopColorSecondaryInput = document.getElementById("shop-color-secondary");
  const toggleDarkBtn = document.getElementById("toggle-dark-btn");

  // Chatbot elements
  const chatToggleBtn = document.getElementById("chat-widget-toggle");
  const chatWidget = document.getElementById("chat-widget");
  const chatMessages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  // Data
  let customers = load(KEYS.customers) || [];
  customers.forEach((c) => {
    if (!c.familyMembers) c.familyMembers = [];
  });
  let products = load(KEYS.products) || [];
  let transactions = load(KEYS.transactions) || [];
  let settings =
    load(KEYS.settings) || {
      shopName: "Mir Kiryana Shop",
      shopColorPrimary: "#fb923c",
      shopColorSecondary: "#f97316",
    };
  let darkMode = load(KEYS.darkMode) || false;

  // LocalStorage helpers
  function save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      alert("Failed to save data locally.");
    }
  }
  function load(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }
  function generateId() {
    return "_" + Math.random().toString(36).substr(2, 9);
  }
  function findIndexById(arr, id) {
    return arr.findIndex((i) => i.id === id);
  }
  function escapeHtml(text) {
    if (!text) return "";
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Alert helper
  function showAlert(msg, type, container = main) {
    const alertDiv = document.createElement("div");
    alertDiv.className = "alert alert-" + (type === "error" ? "error" : "success");
    alertDiv.textContent = msg;
    container.prepend(alertDiv);
    setTimeout(() => {
      if (alertDiv.parentElement) alertDiv.parentElement.removeChild(alertDiv);
    }, 3500);
  }
  function clearFormErrors(form) {
    form.querySelectorAll(".error-message").forEach((e) => (e.textContent = ""));
  }
  function setError(input, msg) {
    if (!input) return;
    const errorSpan = document.getElementById(input.id + "-error");
    if (errorSpan) errorSpan.textContent = msg;
  }
  function formatDate(input) {
    const d = new Date(input);
    if (isNaN(d)) return input;
    return d.toLocaleDateString();
  }
  function formatMonthYear(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long" });
  }
  function getTodayFilename() {
    return new Date().toISOString().slice(0, 10).replace(/-/g, "");
  }
  function hexRGB(hex) {
    const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return res
      ? [parseInt(res[1], 16), parseInt(res[2], 16), parseInt(res[3], 16)]
      : [251, 146, 60];
  }

  // DARK MODE
  function updateDarkModeUI() {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }
  toggleDarkBtn.onclick = () => {
    darkMode = !darkMode;
    save(KEYS.darkMode, darkMode);
    updateDarkModeUI();
  };

  // THEME COLORS
  function applyThemeColors(primary, secondary) {
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", primary);
    root.style.setProperty("--theme-secondary", secondary);
    const header = document.querySelector("header");
    if (header)
      header.style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
  }
  function updateShopLabel(txt) {
    document.querySelector("header .logo, header").textContent = txt;
    document.querySelector(
      "footer"
    ).innerHTML = `&copy; 2024 ${txt}. All rights reserved.`;
  }

  // NAVIGATION
  navItems.forEach((item) => {
    item.addEventListener("click", () => activateModule(item.dataset.target));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateModule(item.dataset.target);
      }
    });
  });
  function activateModule(mod) {
    navItems.forEach((i) => {
      const active = i.dataset.target === mod;
      i.classList.toggle("active", active);
      if (active) i.setAttribute("aria-current", "page");
      else i.removeAttribute("aria-current");
    });
    modules.forEach((m) => m.id === mod ? m.classList.add("active") : m.classList.remove("active"));
    switch (mod) {
      case "dashboard":
        updateDashboard();
        break;
      case "customers":
        renderCustomers();
        hideFamilySection(true);
        break;
      case "products":
        renderProducts();
        break;
      case "transactions":
        renderTransactions();
        populateTransactionSelects();
        break;
      case "reports":
        fillReports();
        break;
      case "settings":
        fillSettings();
        break;
    }
    if (window.innerWidth <= 640) {
      sidebar.classList.add("hidden");
      menuToggleBtn.setAttribute("aria-expanded", "false");
      menuToggleBtn.focus();
    }
  }
  menuToggleBtn.onclick = () => {
    const hidden = sidebar.classList.toggle("hidden");
    menuToggleBtn.setAttribute("aria-expanded", (!hidden).toString());
    if (!hidden) sidebar.focus();
  };
  document.addEventListener("click", (e) => {
    if (
      window.innerWidth <= 640 &&
      !sidebar.contains(e.target) &&
      e.target !== menuToggleBtn &&
      !sidebar.classList.contains("hidden")
    ) {
      sidebar.classList.add("hidden");
      menuToggleBtn.setAttribute("aria-expanded", "false");
    }
  });

  // DASHBOARD
  function updateDashboard() {
    summaryCustomers.textContent = customers.length;
    summaryProducts.textContent = products.length;
    summaryTransactions.textContent = transactions.length;
    const sales = transactions.reduce((acc, t) => {
      const prod = products.find((p) => p.id === t.productId);
      return acc + (prod ? prod.price * t.quantity : 0);
    }, 0);
    summarySales.textContent = sales.toFixed(2);
  }

  // CUSTOMERS
  searchCustomersInput.addEventListener("input", () =>
    renderCustomers(searchCustomersInput.value)
  );
  document.getElementById("customer-clear").onclick = () => {
    clearCustomerForm();
    hideFamilySection(true);
  };
  customerForm.onsubmit = (e) => {
    e.preventDefault();
    clearFormErrors(customerForm);
    const id = customerIdInput.value.trim();
    const name = customerNameInput.value.trim();
    const phone = customerPhoneInput.value.trim();
    const address = customerAddressInput.value.trim();
    if (!name) {
      alert("Name required");
      customerNameInput.focus();
      return;
    }
    if (phone && !/^[0-9+ ()-]{7,15}$/.test(phone)) {
      alert("Invalid phone");
      customerPhoneInput.focus();
      return;
    }
    if (id) {
      const idx = findIndexById(customers, id);
      if (idx !== -1) {
        customers[idx].name = name;
        customers[idx].phone = phone;
        customers[idx].address = address;
        if (!customers[idx].familyMembers) customers[idx].familyMembers = [];
      }
    } else {
      customers.push({ id: generateId(), name, phone, address, familyMembers: [] });
    }
    save(KEYS.customers, customers);
    renderCustomers();
    clearCustomerForm();
    hideFamilySection(true);
    updateDashboard();
    alert("Customer saved successfully");
  };
  familyClearBtn.onclick = () => {
    familyMemberForm.reset();
  };
  familyMemberForm.onsubmit = (e) => {
    e.preventDefault();
    clearFormErrors(familyMemberForm);
    const custId = customerIdInput.value.trim();
    if (!custId) {
      alert("Select a customer");
      return;
    }
    const fname = familyMemberNameInput.value.trim();
    const frel = familyMemberRelationInput.value.trim();
    if (!fname) {
      alert("Family member name required");
      return;
    }
    if (!frel) {
      alert("Relation required");
      return;
    }
    const cust = customers.find((c) => c.id === custId);
    if (!cust) return;
    if (!cust.familyMembers) cust.familyMembers = [];
    cust.familyMembers.push({ id: generateId(), name: fname, relation: frel });
    save(KEYS.customers, customers);
    renderFamilyMembers(custId);
    familyMemberForm.reset();
    alert("Family member added");
  };
  function renderCustomers(filter = "") {
    const f = filter.toLowerCase().trim();
    customersTableBody.innerHTML = "";
    customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(f) ||
          (c.phone || "").toLowerCase().includes(f) ||
          (c.address || "").toLowerCase().includes(f)
      )
      .forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.phone)}</td>
      <td>${escapeHtml(c.address)}</td>
      <td>
        <button class="btn-action" aria-label="Edit customer ${escapeHtml(
          c.name
        )}" data-id="${c.id}"><span class="material-icons">edit</span></button>
        <button class="btn-action" aria-label="Delete customer ${escapeHtml(
          c.name
        )}" data-id="${c.id}"><span class="material-icons">delete</span></button>
      </td>`;
        customersTableBody.appendChild(tr);
      });
    customersTableBody.querySelectorAll("button").forEach((btn) => {
      if (btn.querySelector(".material-icons").textContent === "edit")
        btn.onclick = () => editCustomer(btn.dataset.id);
      else btn.onclick = () => deleteCustomer(btn.dataset.id);
    });
  }
  function editCustomer(id) {
    const c = customers.find((cust) => cust.id === id);
    if (!c) return;
    customerIdInput.value = c.id;
    customerNameInput.value = c.name;
    customerPhoneInput.value = c.phone;
    customerAddressInput.value = c.address;
    renderFamilyMembers(c.id);
    hideFamilySection(false);
    customerNameInput.focus();
  }
  function deleteCustomer(id) {
    if (
      !confirm(
        "Delete this customer? All transactions and family members for this customer will also be deleted."
      )
    )
      return;
    customers = customers.filter((c) => c.id !== id);
    transactions = transactions.filter((t) => t.customerId !== id);
    save(KEYS.customers, customers);
    save(KEYS.transactions, transactions);
    renderCustomers();
    updateDashboard();
    hideFamilySection(true);
    alert("Customer deleted");
  }
  function renderFamilyMembers(custId) {
    const cust = customers.find((c) => c.id === custId);
    familyMembersTableBody.innerHTML = "";
    if (!cust || !cust.familyMembers || cust.familyMembers.length === 0) {
      familyMembersTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#92400e;">No family members added</td></tr>`;
      familyCustomerIdInput.value = "";
      return;
    }
    familyCustomerIdInput.value = cust.id;
    cust.familyMembers.forEach((fm) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
      <td>${escapeHtml(fm.name)}</td>
      <td>${escapeHtml(fm.relation)}</td>
      <td><button class="btn-action" aria-label="Delete family member ${escapeHtml(
        fm.name
      )}" data-fid="${fm.id}"><span class="material-icons">delete</span></button></td>`;
      familyMembersTableBody.appendChild(tr);
    });
    familyMembersTableBody.querySelectorAll("button").forEach(
      (btn) =>
        (btn.onclick = () => {
          const fid = btn.dataset.fid;
          const cust = customers.find((c) => c.id === customerIdInput.value);
          if (cust) {
            if (confirm("Delete this family member?")) {
              cust.familyMembers = cust.familyMembers.filter((f) => f.id !== fid);
              save(KEYS.customers, customers);
              renderFamilyMembers(cust.id);
              alert("Family member deleted");
            }
          }
        })
    );
  }
  function clearCustomerForm() {
    customerForm.reset();
    customerIdInput.value = "";
  }
  function hideFamilySection(hide) {
    document.getElementById("family-member-form").style.display = hide
      ? "none"
      : "block";
    document.getElementById("family-members-table").style.display = hide
      ? "none"
      : "table";
    if (hide) {
      familyMemberForm.reset();
      familyCustomerIdInput.value = "";
      familyMembersTableBody.innerHTML = "";
    }
  }

  // PRODUCTS
  searchProductsInput.addEventListener("input", () =>
    renderProducts(searchProductsInput.value)
  );
  document.getElementById("product-clear").onclick = () => productForm.reset();
  productForm.onsubmit = (e) => {
    e.preventDefault();
    const id = productIdInput.value.trim();
    const name = productNameInput.value.trim();
    const stock = Number(productStockInput.value);
    const price = Number(productPriceInput.value);
    if (!name) {
      alert("Product name required");
      productNameInput.focus();
      return;
    }
    if (isNaN(stock) || stock < 0) {
      alert("Stock must be 0 or more");
      productStockInput.focus();
      return;
    }
    if (isNaN(price) || price < 0) {
      alert("Price must be 0 or more");
      productPriceInput.focus();
      return;
    }
    if (id) {
      const idx = findIndexById(products, id);
      if (idx !== -1) {
        products[idx].name = name;
        products[idx].stock = stock;
        products[idx].price = price;
      }
    } else {
      products.push({ id: generateId(), name, stock, price });
    }
    save(KEYS.products, products);
    renderProducts(searchProductsInput.value);
    productForm.reset();
    updateDashboard();
    alert("Product saved");
  };
  function renderProducts(filter = "") {
    const f = filter.toLowerCase().trim();
    productsTableBody.innerHTML = "";
    products
      .filter((p) => p.name.toLowerCase().includes(f))
      .forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${escapeHtml(p.name)}</td>
        <td>${p.stock}</td>
        <td>₹${p.price.toFixed(2)}</td>
        <td>
          <button class="btn-action" aria-label="Edit product ${escapeHtml(p.name)}" data-id="${p.id}"><span class="material-icons">edit</span></button>
          <button class="btn-action" aria-label="Delete product ${escapeHtml(p.name)}" data-id="${p.id}"><span class="material-icons">delete</span></button>
        </td>`;
        productsTableBody.appendChild(tr);
      });
    productsTableBody.querySelectorAll("button").forEach((btn) => {
      if (btn.querySelector(".material-icons").textContent === "edit")
        btn.onclick = () => editProduct(btn.dataset.id);
      else btn.onclick = () => deleteProduct(btn.dataset.id);
    });
  }
  function editProduct(id) {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    productIdInput.value = p.id;
    productNameInput.value = p.name;
    productStockInput.value = p.stock;
    productPriceInput.value = p.price.toFixed(2);
    productNameInput.focus();
  }
  function deleteProduct(id) {
    if (!confirm("Delete product? Related transactions will remain.")) return;
    products = products.filter((p) => p.id !== id);
    save(KEYS.products, products);
    renderProducts(searchProductsInput.value);
    updateDashboard();
    alert("Product deleted");
  }

  // TRANSACTIONS
  searchTransactionsInput.addEventListener("input", () =>
    renderTransactions(searchTransactionsInput.value)
  );
  document.getElementById("transaction-clear").onclick = () =>
    transactionForm.reset();
  transactionForm.onsubmit = (e) => {
    e.preventDefault();
    const date = transactionDateInput.value;
    const cust = transactionCustomerSelect.value;
    const fam = transactionFamilyMemberSelect.value;
    const prod = transactionProductSelect.value;
    const quantity = Number(transactionQuantityInput.value);
    if (!date) {
      alert("Date required");
      transactionDateInput.focus();
      return;
    }
    if (!cust) {
      alert("Customer required");
      transactionCustomerSelect.focus();
      return;
    }
    if (!fam) {
      alert("Family member required");
      transactionFamilyMemberSelect.focus();
      return;
    }
    if (!prod) {
      alert("Product required");
      transactionProductSelect.focus();
      return;
    }
    if (isNaN(quantity) || quantity < 1) {
      alert("Quantity ≥ 1");
      transactionQuantityInput.focus();
      return;
    }
    const pidx = products.findIndex((p) => p.id === prod);
    if (pidx === -1) {
      alert("Product not found");
      return;
    }
    if (products[pidx].stock < quantity) {
      alert(`Insufficient stock (${products[pidx].stock})`);
      return;
    }
    products[pidx].stock -= quantity;
    transactions.push({
      id: generateId(),
      date,
      customerId: cust,
      familyMemberId: fam,
      productId: prod,
      quantity,
    });
    save(KEYS.transactions, transactions);
    save(KEYS.products, products);
    renderTransactions(searchTransactionsInput.value);
    renderProducts(searchProductsInput.value);
    transactionForm.reset();
    alert("Transaction saved");
    updateDashboard();
  };
  function renderTransactions(filter = "") {
    const f = filter.toLowerCase().trim();
    transactionsTableBody.innerHTML = "";
    const dtfmt = new Intl.DateTimeFormat();
    transactions
      .filter((t) => {
        const c = customers.find((cust) => cust.id === t.customerId);
        const fm =
          c && c.familyMembers
            ? c.familyMembers.find((fm) => fm.id === t.familyMemberId)
            : null;
        const p = products.find((prod) => prod.id === t.productId);
        return (
          (c && (c.name.toLowerCase().includes(f) || (c.phone || "").toLowerCase().includes(f))) ||
          (fm && fm.name.toLowerCase().includes(f)) ||
          (p && p.name.toLowerCase().includes(f)) ||
          dtfmt.format(new Date(t.date)).toLowerCase().includes(f)
        );
      })
      .forEach((t) => {
        const c = customers.find((cust) => cust.id === t.customerId) || {};
        const fm =
          c.familyMembers ? c.familyMembers.find((fm) => fm.id === t.familyMemberId) : null;
        const p = products.find((prod) => prod.id === t.productId) || {};
        const total = (p.price || 0) * t.quantity;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${dtfmt.format(new Date(t.date))}</td>
          <td>${escapeHtml(c.name || "[Deleted]")}</td>
          <td>${escapeHtml(fm ? fm.name : "N/A")}</td>
          <td>${escapeHtml(p.name || "[Deleted]")}</td>
          <td>${t.quantity}</td>
          <td>₹${total.toFixed(2)}</td>
          <td>
            <button class="btn-action" aria-label="Delete transaction" data-id="${t.id}">
              <span class="material-icons">delete</span>
            </button>
          </td>
        `;
        transactionsTableBody.appendChild(tr);
      });
    transactionsTableBody.querySelectorAll("button").forEach(
      (btn) =>
        (btn.onclick = () => {
          if (!confirm("Delete transaction?")) return;
          const id = btn.dataset.id;
          const idx = transactions.findIndex((t) => t.id === id);
          if (idx !== -1) {
            const t = transactions[idx];
            const pidx = products.findIndex((p) => p.id === t.productId);
            if (pidx !== -1) products[pidx].stock += t.quantity;
            transactions.splice(idx, 1);
            save(KEYS.transactions, transactions);
            save(KEYS.products, products);
            renderTransactions(searchTransactionsInput.value);
            renderProducts(searchProductsInput.value);
            alert("Transaction deleted");
            updateDashboard();
          }
        })
    );
  }
  function populateTransactionSelects() {
    transactionCustomerSelect.innerHTML =
      '<option value="" disabled selected>Select customer</option>';
    customers.forEach((c) => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.name;
      transactionCustomerSelect.appendChild(o);
    });
    transactionFamilyMemberSelect.innerHTML =
      '<option value="" disabled selected>Select family member</option>';
    transactionFamilyMemberSelect.disabled = true;
    transactionCustomerSelect.onchange = () => {
      const cust = customers.find((c) => c.id === transactionCustomerSelect.value);
      if (cust && cust.familyMembers && cust.familyMembers.length > 0) {
        transactionFamilyMemberSelect.innerHTML = "";
        cust.familyMembers.forEach((fm) => {
          const o = document.createElement("option");
          o.value = fm.id;
          o.textContent = `${fm.name} (${fm.relation})`;
          transactionFamilyMemberSelect.appendChild(o);
        });
        transactionFamilyMemberSelect.disabled = false;
      } else {
        transactionFamilyMemberSelect.innerHTML =
          '<option value="" disabled selected>No family members</option>';
        transactionFamilyMemberSelect.disabled = true;
      }
    };
    transactionProductSelect.innerHTML =
      '<option value="" disabled selected>Select product</option>';
    products.forEach((p) => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = `${p.name} (₹${p.price.toFixed(2)}, Stock: ${p.stock})`;
      transactionProductSelect.appendChild(o);
    });
  }

  // REPORTS
  reportTypeSelect.onchange = () => {
    if (reportTypeSelect.value === "customer") {
      reportDateRow.style.display = "none";
      reportDateInput.removeAttribute("required");
      reportCustomerRow.style.display = "block";
      reportCustomerSelect.setAttribute("required", "true");
    } else {
      reportDateRow.style.display = "block";
      reportDateInput.setAttribute("required", "true");
      reportCustomerRow.style.display = "none";
      reportCustomerSelect.removeAttribute("required");
    }
  };
  reportForm.onsubmit = async (e) => {
    e.preventDefault();
    reportFeedback.textContent = "";
    let type = reportTypeSelect.value;
    let date = reportDateInput.value;
    let custId = reportCustomerSelect.value;
    if (!type) {
      alert("Select report type");
      return;
    }
    if ((type === "daily" || type === "monthly") && !date) {
      alert("Select date");
      return;
    }
    if (type === "customer" && !custId) {
      alert("Select customer");
      return;
    }
    try {
      await generatePDFReport(type, date, custId);
      alert("PDF report generated and downloaded");
    } catch (err) {
      alert("PDF generation error: " + err.message);
    }
  };
  async function generatePDFReport(type, date, custId) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.width;

    const primary = settings.shopColorPrimary || "#fb923c";
    const secondary = settings.shopColorSecondary || "#f97316";
    const shopName = settings.shopName || "Mir Kiryana Shop";

    doc.setFillColor(...hexRGB(primary));
    doc.rect(0, 0, pageWidth, 60, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(shopName, margin, 40);
    doc.setFontSize(16);
    doc.setTextColor(secondary);

    let title = "";
    if (type === "daily") title = `Daily Report for ${formatDate(date)}`;
    else if (type === "monthly")
      title = `Monthly Report for ${formatMonthYear(date)}`;
    else if (type === "customer") {
      const c = customers.find((cust) => cust.id === custId);
      title = `Customer Report for ${c ? c.name : "[Unknown]"}`;
    }
    doc.text(title, margin, 90);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const autoTableOpts = {
      startY: 110,
      margin: { left: margin, right: margin },
      styles: { font: "helvetica", fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: hexRGB(primary), textColor: [255, 255, 255] },
      theme: "striped",
    };

    if (type === "daily") {
      const data = getDailyReportData(date);
      doc.autoTable({
        ...autoTableOpts,
        head: ["Customer", "Family Member", "Product", "Quantity", "Unit Price", "Total"],
        body: data,
      });
    } else if (type === "monthly") {
      const data = getMonthlyReportData(date);
      doc.autoTable({
        ...autoTableOpts,
        head: ["Product", "Total Sales"],
        body: data,
      });
    } else if (type === "customer") {
      const data = getCustomerReportData(custId);
      doc.autoTable({
        ...autoTableOpts,
        head: ["Date", "Product", "Quantity", "Unit Price", "Total"],
        body: data,
      });
    }
    doc.save(`MirKiryana_${type}_Report_${getTodayFilename()}.pdf`);
  }
  function getDailyReportData(date) {
    const txs = transactions.filter((t) => t.date === date);
    const data = [];
    txs.forEach((tx) => {
      const c = customers.find((cust) => cust.id === tx.customerId);
      const fm =
        c && c.familyMembers
          ? c.familyMembers.find((fm) => fm.id === tx.familyMemberId)
          : null;
      const p = products.find((prod) => prod.id === tx.productId);
      if (!c || !p) return;
      data.push([
        c.name,
        fm ? fm.name : "Self",
        p.name,
        tx.quantity.toString(),
        `₹${p.price.toFixed(2)}`,
        `₹${(p.price * tx.quantity).toFixed(2)}`,
      ]);
    });
    return data;
  }
  function getMonthlyReportData(date) {
    if (!date) return [];
    const [y, m] = date.split("-");
    const monthNum = parseInt(m) - 1;
    const txs = transactions.filter((t) => {
      const dt = new Date(t.date);
      return dt.getFullYear() === parseInt(y) && dt.getMonth() === monthNum;
    });
    const salesByProduct = {};
    txs.forEach((tx) => {
      const p = products.find((prod) => prod.id === tx.productId);
      if (p) {
        salesByProduct[p.name] = (salesByProduct[p.name] || 0) + p.price * tx.quantity;
      }
    });
    return Object.entries(salesByProduct).map(([name, total]) => [
      name,
      `₹${total.toFixed(2)}`,
    ]);
  }
  function getCustomerReportData(custId) {
    const txs = transactions.filter((t) => t.customerId === custId);
    const data = [];
    txs.forEach((tx) => {
      const p = products.find((prod) => prod.id === tx.productId);
      if (!p) return;
      data.push([
        formatDate(tx.date),
        p.name,
        tx.quantity.toString(),
        `₹${p.price.toFixed(2)}`,
        `₹${(p.price * tx.quantity).toFixed(2)}`,
      ]);
    });
    return data;
  }

  // Settings fill/save
  function fillSettings() {
    shopNameInput.value = settings.shopName;
    shopColorPrimaryInput.value = settings.shopColorPrimary;
    shopColorSecondaryInput.value = settings.shopColorSecondary;
    applyThemeColors(settings.shopColorPrimary, settings.shopColorSecondary);
    updateShopLabel(settings.shopName);
    updateDarkModeUI();
  }
  settingsForm.onsubmit = (e) => {
    e.preventDefault();
    const name = shopNameInput.value.trim();
    if (!name) {
      alert("Shop name required");
      shopNameInput.focus();
      return;
    }
    settings.shopName = name;
    settings.shopColorPrimary = shopColorPrimaryInput.value;
    settings.shopColorSecondary = shopColorSecondaryInput.value;
    save(KEYS.settings, settings);
    applyThemeColors(settings.shopColorPrimary, settings.shopColorSecondary);
    updateShopLabel(settings.shopName);
    alert("Settings saved");
  };

  // Apply theme colors
  function applyThemeColors(primary, secondary) {
    const root = document.documentElement;
    root.style.setProperty("--theme-primary", primary);
    root.style.setProperty("--theme-secondary", secondary);
    const header = document.querySelector("header");
    if (header)
      header.style.background = `linear-gradient(135deg, ${primary}, ${secondary})`;
  }
  function updateShopLabel(txt) {
    document.querySelector("header .logo, header").textContent = txt;
    document.querySelector("footer").innerHTML = `&copy; 2024 ${txt}. All rights reserved.`;
  }

  // Dark mode toggle and apply
  toggleDarkBtn.onclick = () => {
    darkMode = !darkMode;
    save(KEYS.darkMode, darkMode);
    updateDarkModeUI();
  };
  function updateDarkModeUI() {
    if (darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }
  updateDarkModeUI();

  // Customer-related renders and DOM updates
  function clearCustomerForm() {
    customerForm.reset();
    customerIdInput.value = "";
  }
  function hideFamilySection(hide) {
    document.getElementById("family-member-form").style.display = hide ? "none" : "block";
    document.getElementById("family-members-table").style.display = hide ? "none" : "table";
    if (hide) {
      familyMemberForm.reset();
      familyCustomerIdInput.value = "";
      familyMembersTableBody.innerHTML = "";
    }
  }
  // Render family members list
  function renderFamilyMembers(custId) {
    const cust = customers.find((c) => c.id === custId);
    familyMembersTableBody.innerHTML = "";
    if (!cust || !cust.familyMembers || cust.familyMembers.length === 0) {
      familyMembersTableBody.innerHTML =
        '<tr><td colspan="3" style="text-align:center;color:#92400e;">No family members added</td></tr>';
      familyCustomerIdInput.value = "";
      return;
    }
    familyCustomerIdInput.value = cust.id;
    cust.familyMembers.forEach((fm) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${escapeHtml(fm.name)}</td><td>${escapeHtml(
        fm.relation
      )}</td><td><button class="btn-action" aria-label="Delete family member ${
        fm.name
      }" data-fid="${fm.id}"><span class="material-icons">delete</span></button></td>`;
      familyMembersTableBody.appendChild(tr);
    });
    for (const btn of familyMembersTableBody.querySelectorAll("button")) {
      btn.onclick = () => {
        const fid = btn.dataset.fid;
        const cust = customers.find((c) => c.id === customerIdInput.value);
        if (cust) {
          if (confirm("Delete this family member?")) {
            cust.familyMembers = cust.familyMembers.filter((f) => f.id !== fid);
            save(KEYS.customers, customers);
            renderFamilyMembers(cust.id);
            alert("Family member deleted");
          }
        }
      };
    }
  }
  // Customers render
  function renderCustomers(filter = "") {
    const f = filter.toLowerCase().trim();
    customersTableBody.innerHTML = "";
    customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(f) ||
          (c.phone || "").toLowerCase().includes(f) ||
          (c.address || "").toLowerCase().includes(f)
      )
      .forEach((c) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(c.name)}</td>
          <td>${escapeHtml(c.phone)}</td>
          <td>${escapeHtml(c.address)}</td>
          <td>
            <button class="btn-action" aria-label="Edit customer ${escapeHtml(
              c.name
            )}" data-id="${c.id}"><span class="material-icons">edit</span></button>
            <button class="btn-action" aria-label="Delete customer ${escapeHtml(
              c.name
            )}" data-id="${c.id}"><span class="material-icons">delete</span></button>
          </td>`;
        customersTableBody.appendChild(tr);
      });
    customersTableBody.querySelectorAll("button").forEach((btn) => {
      if (btn.querySelector(".material-icons").textContent === "edit")
        btn.onclick = () => editCustomer(btn.dataset.id);
      else btn.onclick = () => deleteCustomer(btn.dataset.id);
    });
  }
  // Edit customer handler
  function editCustomer(id) {
    const c = customers.find((cust) => cust.id === id);
    if (!c) return;
    customerIdInput.value = c.id;
    customerNameInput.value = c.name;
    customerPhoneInput.value = c.phone;
    customerAddressInput.value = c.address;
    renderFamilyMembers(c.id);
    hideFamilySection(false);
    customerNameInput.focus();
  }
  // Delete customer handler
  function deleteCustomer(id) {
    if (
      !confirm(
        "Delete this customer? All transactions and family members for this customer will also be deleted."
      )
    )
      return;
    customers = customers.filter((c) => c.id !== id);
    transactions = transactions.filter((t) => t.customerId !== id);
    save(KEYS.customers, customers);
    save(KEYS.transactions, transactions);
    renderCustomers();
    updateDashboard();
    hideFamilySection(true);
    alert("Customer deleted");
  }
  // Products render
  function renderProducts(filter = "") {
    const f = filter.toLowerCase().trim();
    productsTableBody.innerHTML = "";
    products
      .filter((p) => p.name.toLowerCase().includes(f))
      .forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${escapeHtml(p.name)}</td>
          <td>${p.stock}</td>
          <td>₹${p.price.toFixed(2)}</td>
          <td>
            <button class="btn-action" aria-label="Edit product ${escapeHtml(p.name)}" data-id="${p.id}"><span class="material-icons">edit</span></button>
            <button class="btn-action" aria-label="Delete product ${escapeHtml(p.name)}" data-id="${p.id}"><span class="material-icons">delete</span></button>
          </td>`;
        productsTableBody.appendChild(tr);
      });
    productsTableBody.querySelectorAll("button").forEach((btn) => {
      if (btn.querySelector(".material-icons").textContent === "edit")
        btn.onclick = () => editProduct(btn.dataset.id);
      else btn.onclick = () => deleteProduct(btn.dataset.id);
    });
  }
  function editProduct(id) {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    productIdInput.value = p.id;
    productNameInput.value = p.name;
    productStockInput.value = p.stock;
    productPriceInput.value = p.price.toFixed(2);
    productNameInput.focus();
  }
  function deleteProduct(id) {
    if (!confirm("Delete product? Related transactions will remain.")) return;
    products = products.filter((p) => p.id !== id);
    save(KEYS.products, products);
    renderProducts(searchProductsInput.value);
    updateDashboard();
    alert("Product deleted");
  }
  // Transactions render
  function renderTransactions(filter = "") {
    const f = filter.toLowerCase().trim();
    transactionsTableBody.innerHTML = "";
    const dtfmt = new Intl.DateTimeFormat();
    transactions
      .filter((t) => {
        const c = customers.find((cust) => cust.id === t.customerId);
        const fm =
          c && c.familyMembers
            ? c.familyMembers.find((fm) => fm.id === t.familyMemberId)
            : null;
        const p = products.find((prod) => prod.id === t.productId);
        return (
          (c &&
            (c.name.toLowerCase().includes(f) ||
              (c.phone || "").toLowerCase().includes(f))) ||
          (fm && fm.name.toLowerCase().includes(f)) ||
          (p && p.name.toLowerCase().includes(f)) ||
          dtfmt.format(new Date(t.date)).toLowerCase().includes(f)
        );
      })
      .forEach((t) => {
        const c = customers.find((cust) => cust.id === t.customerId) || {};
        const fm =
          c.familyMembers ? c.familyMembers.find((fm) => fm.id === t.familyMemberId) : null;
        const p = products.find((prod) => prod.id === t.productId) || {};
        const total = (p.price || 0) * t.quantity;
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${dtfmt.format(new Date(t.date))}</td>
          <td>${escapeHtml(c.name || "[Deleted]")}</td>
          <td>${escapeHtml(fm ? fm.name : "N/A")}</td>
          <td>${escapeHtml(p.name || "[Deleted]")}</td>
          <td>${t.quantity}</td>
          <td>₹${total.toFixed(2)}</td>
          <td>
            <button class="btn-action" aria-label="Delete transaction" data-id="${t.id}">
              <span class="material-icons">delete</span>
            </button>
          </td>
        `;
        transactionsTableBody.appendChild(tr);
      });
    transactionsTableBody.querySelectorAll("button").forEach(
      (btn) =>
        (btn.onclick = () => {
          if (!confirm("Delete transaction?")) return;
          const id = btn.dataset.id;
          const idx = transactions.findIndex((t) => t.id === id);
          if (idx !== -1) {
            const t = transactions[idx];
            const pidx = products.findIndex((p) => p.id === t.productId);
            if (pidx !== -1) products[pidx].stock += t.quantity;
            transactions.splice(idx, 1);
            save(KEYS.transactions, transactions);
            save(KEYS.products, products);
            renderTransactions(searchTransactionsInput.value);
            renderProducts(searchProductsInput.value);
            alert("Transaction deleted");
            updateDashboard();
          }
        })
    );
  }
  function populateTransactionSelects() {
    transactionCustomerSelect.innerHTML =
      '<option value="" disabled selected>Select customer</option>';
    customers.forEach((c) => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.name;
      transactionCustomerSelect.appendChild(o);
    });
    transactionFamilyMemberSelect.innerHTML =
      '<option value="" disabled selected>Select family member</option>';
    transactionFamilyMemberSelect.disabled = true;
    transactionCustomerSelect.onchange = () => {
      const cust = customers.find((c) => c.id === transactionCustomerSelect.value);
      if (cust && cust.familyMembers && cust.familyMembers.length > 0) {
        transactionFamilyMemberSelect.innerHTML = "";
        cust.familyMembers.forEach((fm) => {
          const o = document.createElement("option");
          o.value = fm.id;
          o.textContent = `${fm.name} (${fm.relation})`;
          transactionFamilyMemberSelect.appendChild(o);
        });
        transactionFamilyMemberSelect.disabled = false;
      } else {
        transactionFamilyMemberSelect.innerHTML =
          '<option value="" disabled selected>No family members</option>';
        transactionFamilyMemberSelect.disabled = true;
      }
    };
    transactionProductSelect.innerHTML =
      '<option value="" disabled selected>Select product</option>';
    products.forEach((p) => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = `${p.name} (₹${p.price.toFixed(2)}, Stock: ${p.stock})`;
      transactionProductSelect.appendChild(o);
    });
  }

  // Reports
  function fillReports(){
    reportCustomerSelect.innerHTML = '<option value="" disabled selected>Select customer</option>';
    customers.forEach(c=>{
      const o = document.createElement('option');
      o.value = c.id;
      o.textContent = c.name;
      reportCustomerSelect.appendChild(o);
    });
    reportTypeSelect.onchange();
  }
  reportTypeSelect.onchange = () => {
    if(reportTypeSelect.value === 'customer'){
      reportDateRow.style.display = 'none';
      reportDateInput.removeAttribute('required');
      reportCustomerRow.style.display = 'block';
      reportCustomerSelect.setAttribute('required', 'true');
    } else {
      reportDateRow.style.display = 'block';
      reportDateInput.setAttribute('required', 'true');
      reportCustomerRow.style.display = 'none';
      reportCustomerSelect.removeAttribute('required');
    }
  };
  reportForm.onsubmit = async (e) => {
    e.preventDefault();
    reportFeedback.textContent = '';
    const type = reportTypeSelect.value;
    const date = reportDateInput.value;
    const custId = reportCustomerSelect.value;
    if (!type) { alert("Please select a report type."); return; }
    if ((type === "daily" || type === "monthly") && !date) { alert("Please select a date."); return; }
    if (type === "customer" && !custId) {alert("Please select a customer."); return; }
    try {
      await generatePDFReport(type, date, custId);
      alert("PDF generated and downloaded.");
    } catch (err) {
      alert("Error generating PDF: " + err.message);
    }
  };
  async function generatePDFReport(type, date, custId){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:"pt",format:"a4"});
    const margin = 40;
    const pageWidth = doc.internal.pageSize.width;
    const primary = settings.shopColorPrimary || "#fb923c";
    const secondary = settings.shopColorSecondary || "#f97316";
    const shopName = settings.shopName || "Mir Kiryana Shop";

    doc.setFillColor(...hexRGB(primary));
    doc.rect(0, 0, pageWidth, 60, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(shopName, margin, 40);
    doc.setFontSize(16);
    doc.setTextColor(secondary);

    let title = "";
    if(type === "daily") title = `Daily Report for ${formatDate(date)}`;
    else if(type === "monthly") title = `Monthly Report for ${formatMonthYear(date)}`;
    else if(type === "customer") {
      const c = customers.find((cust) => cust.id === custId);
      title = `Customer Report for ${c ? c.name : "[Unknown]"}`;
    }
    doc.text(title, margin, 90);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    const autoTableOpts = {
      startY: 110,
      margin: {left: margin, right: margin},
      styles: {font:"helvetica", fontSize: 10, cellPadding:4},
      headStyles: {fillColor: hexRGB(primary), textColor:[255,255,255]},
      theme: "striped",
    };

    if(type === "daily"){
      const data = getDailyReportData(date);
      doc.autoTable({
        ...autoTableOpts,
        head: ["Customer", "Family Member", "Product", "Quantity", "Unit Price", "Total"],
        body: data,
      });
    } else if(type === "monthly"){
      const data = getMonthlyReportData(date);
      doc.autoTable({
        ...autoTableOpts,
        head: ["Product", "Total Sales"],
        body: data,
      });
    } else if(type === "customer"){
      const data = getCustomerReportData(custId);
      doc.autoTable({
        ...autoTableOpts,
        head: ["Date", "Product", "Quantity", "Unit Price", "Total"],
        body: data,
      });
    }
    doc.save(`MirKiryana_${type}_Report_${getTodayFilename()}.pdf`);
  }
  function getDailyReportData(date) {
    const txs = transactions.filter(t => t.date === date);
    return txs.map(tx => {
      const c = customers.find(cust => cust.id === tx.customerId);
      const fm = c && c.familyMembers ? c.familyMembers.find(fm => fm.id === tx.familyMemberId) : null;
      const p = products.find(prod => prod.id === tx.productId);
      if(!c || !p) return [];
      return [c.name, fm ? fm.name : "Self", p.name, tx.quantity.toString(), `₹${p.price.toFixed(2)}`, `₹${(p.price * tx.quantity).toFixed(2)}`];
    });
  }
  function getMonthlyReportData(date) {
    if(!date) return [];
    const [y,m] = date.split("-");
    const monthNum = parseInt(m)-1;
    const txs = transactions.filter(t => {
      const dt = new Date(t.date);
      return dt.getFullYear() === parseInt(y) && dt.getMonth() === monthNum;
    });
    const salesByProduct = {};
    txs.forEach(t => {
      const p = products.find(prod => prod.id === t.productId);
      if(p) salesByProduct[p.name] = (salesByProduct[p.name] || 0) + p.price * t.quantity;
    });
    return Object.entries(salesByProduct).map(([name,total]) => [name, `₹${total.toFixed(2)}`]);
  }
  function getCustomerReportData(custId) {
    const txs = transactions.filter(t => t.customerId === custId);
    return txs.map(tx => {
      const p = products.find(prod => prod.id === tx.productId);
      if(!p) return [];
      return [formatDate(tx.date), p.name, tx.quantity.toString(), `₹${p.price.toFixed(2)}`, `₹${(p.price * tx.quantity).toFixed(2)}`];
    });
  }

  // Chatbot functionality
  chatToggleBtn.onclick = () => {
    chatWidget.classList.toggle("active");
    if (chatWidget.classList.contains("active")) chatInput.focus();
  };
  chatForm.onsubmit = e => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if(!msg) return;
    addChatMessage(msg, "user");
    chatInput.value = "";
    setTimeout(() => {
      addChatMessage(generateChatbotReply(msg), "bot");
    }, 600);
  };
  function addChatMessage(text, sender){
    const div = document.createElement("div");
    div.className = `chat-message ${sender}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function generateChatbotReply(input) {
    const lower = input.toLowerCase();
    if(/hello|hi|hey/.test(lower)) return "Hello! How can I assist you today?";
    if(/sales/.test(lower)){
      const s = transactions.reduce((sum,t)=> {
        const p = products.find(p => p.id === t.productId);
        return sum + (p ? p.price * t.quantity : 0);
      },0);
      return `Your total sales so far are ₹${s.toFixed(2)}.`;
    }
    if(/customer/.test(lower)) return `There are ${customers.length} customers currently.`;
    if(/product|inventory/.test(lower)) return `You have ${products.length} products in your inventory.`;
    if(/transaction|buy/.test(lower)) return "To add purchases, go to the Transactions section in the menu.";
    if(/family/.test(lower)) return "You can manage family members in Customers section by selecting a customer.";
    return "Sorry, I didn't understand that. Ask about sales, customers, products, or transactions.";
  }

  // Initialize displays
  activateModule("dashboard");
});