export const SelectVitrin = 'select_vitrin'
export const Back = 'back'
export const ProductView = 'product-view'
export const ShopView = 'shop-view'
export const ReceptionView = 'reception-view'
export const SectionSelected = 'section-selected';

export const currentSection = {
    name :'',
    elements : [],
};


let currentPage = 1;
let appended = true;

let timeout = {
    id:'' ,
    clear : function () {
        clearTimeout(this.id)
    }
}

const vitrinView = document.getElementById('vitrin-view')
const element = document.getElementById('info');
const backbutton = document.getElementById('back-button');
const productView = document.getElementById('product-view')

const productViewBackBtn = document.getElementById('product-view-back');
const pageSectionEl = document.getElementById('page-section')
const tabs = document.getElementById('tabs');
const receptionView = document.getElementById('reception-view')

const toggleActivation = () => {
    appended = !appended;
    if (!appended) {
        backbutton.className = 'button hide'
        vitrinView.className = 'vitrin-view hide'
        return;
    }

    backbutton.className = 'button'
    vitrinView.className = 'vitrin-view'
}

export const toggleReceptionView = () => {
    const isHidden = receptionView.className.endsWith('hide');
    showShoppingCartContent();
    if(isHidden) {
        receptionView.className = 'reception-view';
        return;
    }
    receptionView.className = 'reception-view-hide';
}

const resetStyles = () => {
    const children = tabs.children;

    for(const child of children) {
        child.className = '';
        changeTabView(child.innerText.toString() , 'hide');
    }
}


const tabsFunctions = () => {
    const children = tabs.children;

    for(const child of children) {
        child.onclick = (e) => {
            resetStyles();
            child.className = 'clicked'
            const tabName = child.innerText.toLowerCase();
            changeTabView(child.innerText.toString() , '');
        }
    }
}



tabsFunctions();
toggleActivation();

backbutton.addEventListener('click', () => {
    window.dispatchEvent(new Event(Back));
    toggleActivation();
})

window.addEventListener(SelectVitrin, (e) => {
    element.appendChild(backbutton);
    toggleActivation()
})


window.addEventListener(ProductView, (e) => {
    productView.className = ('product-view')
    timeout.clear();
    toggleActivation();
})



productViewBackBtn.addEventListener('click' , (e) => {
    productView.className = 'product-view-hide'
    toggleActivation();
    timeout.id = setTimeout(() => {
        dispatchEvent(new Event(ShopView))
        currentSection.name = '';
        currentPage = 1;
    } , 100)
})


export function setSections(items) {
    pageSectionEl.innerHTML = ''
    currentSection.name = items[0];

    items.forEach((item) => {
        const el = document.createElement('div');
        el.innerText = item;
        pageSectionEl.appendChild(el)
        el.className = currentSection.name == item ? 'clicked-section':'';
        el.onclick = (e) => {
            resetSectionStyles();
            const event = new Event(SectionSelected)
            currentSection.name = item;

            event.section = item;
            event.pageNum = currentPage -1;
            el.className = 'clicked-section'

            dispatchEvent(event)
        }

        currentSection.elements.push(el)
    })
}


function resetSectionStyles () {
    currentSection.elements.forEach((item) => {
        item.className = '';
    })
}

function changeTabView(name , tabClass) {
    const item = document.getElementById(`info-view-${name.toLowerCase()}`);
    item.className = tabClass;
}

export function showShoppingCartContent() {
    const shoppingCart = document.getElementById('shopping-cart-content');
    const data = localStorage.getItem('cart');
    shoppingCart.innerHTML = ''
    if(!data || JSON.parse(data).length == 0) { 
        shoppingCart.innerText = 'card is empty!!'.toUpperCase();
        return;
    }
    const products = JSON.parse(data);
    const newProducts = [...products]
    newProducts.unshift({category:'CATEGORY' , name:'NAME' , price:'PRICE'})
    newProducts.forEach((item , index) => {
        cartContentGenerator(item , index , newProducts , shoppingCart)
    })
}


const cartContentGenerator = (item  , index , products , shoppingCart) => {
    const div = document.createElement('div');
    const btnContainer = document.createElement('div');
    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'REMOVE'
    removeBtn.onclick = () => {
        const data = localStorage.getItem('cart')
        const products = JSON.parse(data);
        let filtered = products.filter((el) => el.id != item.id );
        localStorage.setItem('cart' , JSON.stringify(filtered));
        showShoppingCartContent();
    }
    removeBtn.className = 'cart-action'
    div.className = 'cart-item'
    div.style.borderBottom= index !== products.length-1 ? '1px solid gold':'0px'


    const {name , price , category} = item;

    div.innerHTML = `<div>${name}</div>
    <div>${category.toUpperCase()}</div>
    <div>${price}</div>`

    if(index != 0) {
        btnContainer.append(removeBtn)
    }
    else {
        btnContainer.innerText = 'ACTIONS'
    }

    div.appendChild(btnContainer)
    shoppingCart.appendChild(div);
}