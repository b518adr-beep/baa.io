// Initial Data
const defaultArticles = [
    { id: '1', title: 'أساسيات الأمن السيبراني للمؤسسات', category: 'أمن المعلومات', content: 'استعراض لأهم التهديدات الرقمية وكيفية حماية البنى التحتية والتصدي للهجمات.', date: '2026-11-01', type: 'article' },
    { id: '2', title: 'مستقبل الذكاء الاصطناعي في التحول الرقمي', category: 'التحول الرقمي', content: 'كيف تساهم نماذج الذكاء الاصطناعي في أتمتة الأعمال وتحسين الكفاءة.', date: '2026-10-25', type: 'article' }
];

const defaultProjects = [
    { id: '101', title: 'نظام إدارة البنية التحتية', category: 'Next.js, Supabase', content: 'منصة سحابية متكاملة لمراقبة السيرفرات والتنبيهات الفورية.', date: '2026-09-15', type: 'project' }
];

// LocalStorage Initialization
let articles = JSON.parse(localStorage.getItem('as_articles')) || defaultArticles;
let projects = JSON.parse(localStorage.getItem('as_projects')) || defaultProjects;
let isAdmin = localStorage.getItem('as_admin') === 'true';

document.getElementById('year').innerText = new Date().getFullYear();

// Navigation Controller
function switchTab(tab) {
    ['home', 'articles', 'projects', 'admin'].forEach(p => {
        const pageEl = document.getElementById(`page-${p}`);
        if(pageEl) pageEl.classList.add('hidden');
    });

    document.getElementById(`page-${tab}`).classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Auth Controller
function openAdminModal() {
    if (isAdmin) {
        switchTab('admin');
        renderAdminList();
    } else {
        document.getElementById('auth-modal').classList.remove('hidden');
    }
}

function closeAdminModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('auth-error').classList.add('hidden');
}

function loginAdmin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === '123456') {
        isAdmin = true;
        localStorage.setItem('as_admin', 'true');
        closeAdminModal();
        switchTab('admin');
        renderAdminList();
    } else {
        document.getElementById('auth-error').classList.remove('hidden');
    }
}

function logoutAdmin() {
    isAdmin = false;
    localStorage.removeItem('as_admin');
    switchTab('home');
}

// Render Functions
function renderAll() {
    renderGrid('home-articles-grid', articles.slice(0, 3));
    renderGrid('articles-grid', articles);
    renderGrid('projects-grid', projects);
}

function renderGrid(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map(item => `
        <div class="item-card bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
                <span class="text-xs font-bold text-[#00d2ff] bg-[#00d2ff]/10 px-2.5 py-1 rounded-full border border-[#00d2ff]/20 inline-block mb-3">${item.category}</span>
                <h3 class="font-bold text-slate-100 text-lg mb-2">${item.title}</h3>
                <p class="text-slate-400 text-sm leading-relaxed mb-4">${item.content}</p>
            </div>
            <div class="text-xs text-slate-500 pt-4 border-t border-slate-800/60 flex justify-between">
                <span><i class="fa-regular fa-calendar ml-1"></i>${item.date}</span>
                <span class="text-slate-400 font-medium">${item.type === 'article' ? 'مقال' : 'مشروع'}</span>
            </div>
        </div>
    `).join('');
}

function renderAdminList() {
    const listContainer = document.getElementById('admin-items-list');
    const allItems = [...articles, ...projects];
    
    listContainer.innerHTML = allItems.map(item => `
        <div class="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
                <span class="text-xs ${item.type === 'article' ? 'text-[#00d2ff]' : 'text-emerald-400'} font-bold ml-2">[${item.type === 'article' ? 'مقال' : 'مشروع'}]</span>
                <strong class="text-slate-200 text-sm">${item.title}</strong>
            </div>
            <div class="flex gap-2">
                <button onclick="editItem('${item.id}', '${item.type}')" class="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-xs">تعديل</button>
                <button onclick="deleteItem('${item.id}', '${item.type}')" class="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded text-xs">حذف</button>
            </div>
        </div>
    `).join('');
}

// CRUD Operations
function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('item-id').value || Date.now().toString();
    const type = document.getElementById('item-type').value;
    const title = document.getElementById('item-title').value;
    const category = document.getElementById('item-category').value;
    const content = document.getElementById('item-content').value;

    const newItem = { id, title, category, content, date: new Date().toISOString().split('T')[0], type };

    if (type === 'article') {
        articles = articles.filter(a => a.id !== id);
        articles.unshift(newItem);
        localStorage.setItem('as_articles', JSON.stringify(articles));
    } else {
        projects = projects.filter(p => p.id !== id);
        projects.unshift(newItem);
        localStorage.setItem('as_projects', JSON.stringify(projects));
    }

    resetForm();
    renderAll();
    renderAdminList();
}

function editItem(id, type) {
    const item = type === 'article' ? articles.find(a => a.id === id) : projects.find(p => p.id === id);
    if (!item) return;

    document.getElementById('item-id').value = item.id;
    document.getElementById('item-type').value = item.type;
    document.getElementById('item-title').value = item.title;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-content').value = item.content;
    document.getElementById('form-title').innerText = 'تعديل المحتوى';
}

function deleteItem(id, type) {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا العنصر؟')) return;
    if (type === 'article') {
        articles = articles.filter(a => a.id !== id);
        localStorage.setItem('as_articles', JSON.stringify(articles));
    } else {
        projects = projects.filter(p => p.id !== id);
        localStorage.setItem('as_projects', JSON.stringify(projects));
    }
    renderAll();
    renderAdminList();
}

function resetForm() {
    document.getElementById('crud-form').reset();
    document.getElementById('item-id').value = '';
    document.getElementById('form-title').innerText = 'إضافة محتوى جديد';
}

// App Initialization
renderAll();