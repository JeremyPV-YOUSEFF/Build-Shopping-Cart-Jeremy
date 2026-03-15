let size;

let getSize = window.innerWidth;
/* Change size */
function changeSize(getSize){
    if ( getSize < 600) {
        size = 'mobile';
    }else if (getSize < 1000){
        size = 'tablet';
    }else if (getSize > 1000){
        size = 'desktop';
    }
}

changeSize(getSize);

window.addEventListener('resize',() => {
    let width = window.innerWidth;
    setTimeout(() => {
        changeSize(width);
    }, 3000);
})

/* Get data form data.json */
async function getData(){
    const data = await fetch('/data.json').then(response => response.json());
    const local = localStorage.getItem('shoppingCart')
    if (!local) {
        buildList(data);
        return;
    };
        
    const localData = JSON.parse(local)
    data.forEach(element => {
        const info = localData.find(x => x.name === element.name);
        element.isActive = !!info;
        if (info) {
            element.quantity = info.quantity;
        }
    });


    buildList(data);
    buildShopping()
}

getData();

/* Build List */

async function buildList(data){
    /* const data = await fetch('/data.json').then(response => response.json()); */
    
    const all = document.querySelectorAll('.list-item');
    all.forEach(element => {
       element.remove(); 
    });

    const ul = document.getElementById('list-content');
    data.forEach(element => {
        /* list-items */
        listItem(element,ul)
    });
}

/* buildList() */

/* add product to the shopping cart */
function addProduct(product){
    const getProduct = JSON.parse(localStorage.getItem('shoppingCart')) ?? [];
    
    if (getProduct) {

        let isFound = false;
        getProduct.forEach(element => {
            if (element.name == product.name) {
                element.quantity++;
                localStorage.setItem('shoppingCart',JSON.stringify(getProduct))
                isFound = true;
                return;
            }
        });

        if (isFound == false) {
             getProduct.push({name:product.name,quantity:1,price:product.price,image:product.image.thumbnail});
             localStorage.setItem('shoppingCart',JSON.stringify(getProduct))
             showMessage('Product successfully added');
             setTimeout(() => {
                hiddenMessage();
             }, 1000);
        }
    }
    getData()
    showQuantity()
    buildShopping();
}


/* Build list-item */
function listItem(data,ul){
    const li = document.createElement('li');
    li.classList.add('list-item');
    /* Div 1 */
    const div1 = document.createElement('div');
    div1.className = 'relative w-full h-48 shadow rounded-xl';
    
    const image = document.createElement('img');
    image.className = 'rounded-xl w-full h-full border-2 border-p-red';
    image.alt = data.name;

    switch (size) {
        case 'mobile':
            image.src = data.image.mobile;
            break;
        case 'tablet':
            image.src = data.image.tablet;
            break;
        case 'desktop':
            image.src = data.image.desktop;
            break;
        default:
            image.src = data.image.desktop;
            break;
    }


    const label = document.createElement('div');

    /* first 1 */
    const div1Sub1 = document.createElement('div');
    div1Sub1.className = `absolute cursor-pointer w-4/5 -bottom-4 left-1/2 -translate-x-1/2 flex rounded-full bg-p-rose-50 px-5 py-2 gap-3
                            border border-p-rose-500 flex justify-center`;

    div1Sub1.addEventListener('click', () => {
        addProduct(data);
    })

    const span1 = document.createElement('span');
    span1.className = 'block bg-cover bg-center bg-(image:--shopping) size-6';

    const h4Sub1 = document.createElement('h4');
    h4Sub1.textContent = 'Add to Cart';

    div1Sub1.appendChild(span1);
    div1Sub1.appendChild(h4Sub1);

    /* first 2 */
    const div1Sub2 = document.createElement('div');
    div1Sub2.className = `absolute  w-3/5 -bottom-4 left-1/2 -translate-x-1/2 bg-p-red rounded-full px-5 py-2 hidden`;

    const div1Sub2Cont = document.createElement('div');
    div1Sub2Cont.className = 'flex justify-between items-center';

    const divLeft = document.createElement('div');
    const spanLeft = document.createElement('span');

    divLeft.className = 'flex justify-center items-center border rounded-full border-p-rose-50 size-5 hover:bg-white hover:cursor-pointer';
    spanLeft.className = 'block bg-center bg-cover bg-(image:--less) w-3 h-0.5';

    divLeft.addEventListener('click',() => {
        decreaseQuantity(data);
    })

    divLeft.appendChild(spanLeft);

    const h4Content = document.createElement('h4');
    h4Content.className = 'flex-1 text-center text-p-rose-50 font-medium';
    h4Content.textContent = data.quantity;

    const divRight= document.createElement('div');
    const spanRight= document.createElement('span');

    const imgRight = document.createElement('img');
    imgRight.src = '/assets/images/plus(1).svg';
    imgRight.className = 'size-3'

    divRight.className = 'flex justify-center items-center border rounded-full border-p-rose-50 size-5 hover:bg-white hover:cursor-pointer';
    spanRight.className= `block bg-center bg-cover bg-[url('/assets/images/plus.svg')] w-3 h-0.5`;

    divRight.addEventListener('click',() => {
        increaseQuantity(data);
    })

    divRight.appendChild(imgRight);

    div1Sub2Cont.appendChild(divLeft);
    div1Sub2Cont.appendChild(h4Content);
    div1Sub2Cont.appendChild(divRight);

    div1Sub2.append(div1Sub2Cont)

    if (data.isActive) {
        div1Sub1.classList.add('hidden')
        div1Sub2.classList.remove('hidden')
    }

    /* label.appendChild(input); */
    label.appendChild(div1Sub1)
    label.appendChild(div1Sub2)

    div1.appendChild(image);
    div1.appendChild(label)

    /* div 2 */
    const div2 = document.createElement('div');
    div2.className = 'py-8 flex flex-col gap-1';

    const h6_2 = document.createElement('h6');
    const h5_2 = document.createElement('h5');
    const h4_2 = document.createElement('h4');

    h6_2.className = 'text-p-rose-400 font-normal';
    h6_2.textContent = data.category;

    h5_2.className = 'text-p-rose-900 font-bold text-lg';
    h5_2.textContent = data.name;
    
    h4_2.className = 'text-p-red font-semibold text-lg';
    h4_2.textContent = `S/. ${data.price}`;

    div2.appendChild(h6_2);
    div2.appendChild(h5_2);
    div2.appendChild(h4_2);

    /* Final */
    li.append(div1);
    li.append(div2);

    ul.append(li);
}

/* increase quantity */
function increaseQuantity(data){
    let getInfo = JSON.parse(localStorage.getItem('shoppingCart'));
    getInfo.forEach(element => {
        if (element.name == data.name) {
            element.quantity++;    
        }
    });
    localStorage.setItem('shoppingCart',JSON.stringify(getInfo))
    getData();
}   

/* decrease quantity */
function decreaseQuantity(data){
    let getInfo = JSON.parse(localStorage.getItem('shoppingCart'));
    getInfo.forEach(element => {
        if (element.name == data.name) {  
            if (element.quantity > 1) {
                element.quantity--;    
            }
        }
    });
    localStorage.setItem('shoppingCart',JSON.stringify(getInfo))
    getData();
}

/*  show quantity of products */
function showQuantity() {
    const local = JSON.parse(localStorage.getItem('shoppingCart')) ?? []
    if (local.length > 0) {
        const element = document.getElementById('quantity');
        element.classList.remove('hidden'); 
        element.classList.add('flex'); 
        document.getElementById('quantity-text').textContent = local.length;
    }else{
        const element = document.getElementById('quantity');
        element.classList.add('hidden');
    }
}

showQuantity();

/* show shopping cart */
const toggleShopping = document.getElementById('toggle-shopping')
toggleShopping.addEventListener('click', () => {
    document.getElementById('shopping-main').classList.toggle('hidden')
    window.scrollTo(0,0)
})

/* build shopping item */
function buildShopping(){
    
    const local = JSON.parse(localStorage.getItem('shoppingCart')) ?? []
    if (local.length > 0) {
        const items = document.querySelectorAll('.shopping-item');
        items.forEach(element => {
            element.remove();
        });

        const allShopping = document.querySelectorAll('.shopping');
        allShopping.forEach(element => {
            element.classList.add('flex');
            element.classList.remove('hidden');
        });

        /* document.getElementById('shopping').classList.add('flex');
        document.getElementById('shopping').classList.remove('hidden'); */

        const allShowNoItem = document.querySelectorAll('.show-no-item');
        allShowNoItem.forEach(element => {
            element.classList.add('hidden')
        });
        /* document.getElementById('show-no-item').classList.add('hidden'); */

        const total = local.reduce((acc,sum) => acc + (sum.price * sum.quantity),0)
        document.getElementById('total').textContent = `S/. ${total}`;

        /* build shopping cart item */
/*         const ul = document.getElementById('shopping-content'); */
        
        const ul = document.querySelectorAll('.shopping-content');
        ul.forEach(element1 => {
            local.forEach(element => {
                const li = document.createElement('li');
                li.className = 'flex justify-between items-center border-b pb-3 border-p-rose-300';
                li.classList.add('shopping-item');
                const div1 = document.createElement('div2');
                div1.className = 'flex flex-col';

                const h3_1 = document.createElement('h3');
                h3_1.className = 'text-lg font-semibold text-p-rose-900';
                h3_1.textContent = element.name;

                const div_1 = document.createElement('div');
                div_1.className = 'flex gap-2';

                const span_1 = document.createElement('span');
                span_1.className = 'text-p-red font-semibold';
                span_1.textContent = `${element.quantity}x`

                const h5_1 = document.createElement('h5');
                h5_1.className = 'text-p-rose-300 font-medium';
                h5_1.textContent = `@ S/.${element.price}`

                const h6_1 = document.createElement('h6');
                h6_1.className = 'text-p-rose-500 font-medium';
                h6_1.textContent = `S/.${element.quantity * element.price}`
                
                div_1.appendChild(span_1);
                div_1.appendChild(h5_1);
                div_1.appendChild(h6_1);

                div1.appendChild(h3_1)
                div1.appendChild(div_1)

                const div2 = document.createElement('div2');
                div2.className = 'flex justify-center items-center border-2 rounded-full size-6 border-p-rose-400 cursor-pointer';
                div2.addEventListener('click',() => {
                    deleteItem(element);
                })
                const span2 = document.createElement('span');
                span2.className = 'block bg-cover bg-center bg-(image:--close) size-4'

                div2.appendChild(span2);

                li.append(div1)
                li.append(div2)

                element1.append(li)
            });
        });


        /* local.forEach(element => {
            const li = document.createElement('li');
            li.className = 'flex justify-between items-center border-b pb-3 border-p-rose-300';
            li.classList.add('shopping-item');
            const div1 = document.createElement('div2');
            div1.className = 'flex flex-col';

            const h3_1 = document.createElement('h3');
            h3_1.className = 'text-lg font-semibold text-p-rose-900';
            h3_1.textContent = element.name;

            const div_1 = document.createElement('div');
            div_1.className = 'flex gap-2';

            const span_1 = document.createElement('span');
            span_1.className = 'text-p-red font-semibold';
            span_1.textContent = `${element.quantity}x`

            const h5_1 = document.createElement('h5');
            h5_1.className = 'text-p-rose-300 font-medium';
            h5_1.textContent = `@ S/.${element.price}`

            const h6_1 = document.createElement('h6');
            h6_1.className = 'text-p-rose-500 font-medium';
            h6_1.textContent = `S/.${element.quantity * element.price}`
            
            div_1.appendChild(span_1);
            div_1.appendChild(h5_1);
            div_1.appendChild(h6_1);

            div1.appendChild(h3_1)
            div1.appendChild(div_1)

            const div2 = document.createElement('div2');
            div2.className = 'flex justify-center items-center border-2 rounded-full size-6 border-p-rose-400 cursor-pointer';
            div2.addEventListener('click',() => {
                deleteItem(element);
            })
            const span2 = document.createElement('span');
            span2.className = 'block bg-cover bg-center bg-(image:--close) size-4'

            div2.appendChild(span2);

            li.append(div1)
            li.append(div2)

            ul.append(li)
        }); */

    }else{
        /* document.getElementById('show-no-item').classList.remove('hidden'); */
        const allShowNoItem = document.querySelectorAll('.show-no-item');
        allShowNoItem.forEach(element => {
            element.classList.remove('hidden')
        });

        const allShopping = document.querySelectorAll('.shopping');
        allShopping.forEach(element => {
            element.classList.add('hidden');
        });
        /* document.getElementById('shopping').classList.add('hidden'); */
    }
}

buildShopping();

/* Close shopping */
const allClose = document.querySelectorAll('.close-shopping');

allClose.forEach(element => {
    element.addEventListener('click',() => {
    document.getElementById('shopping-main').classList.add('hidden')
    })
});


let confirmData;
/* Delete item */
function deleteItem(data){
    showConfirmation()
    confirmData = data;
    /* let local = JSON.parse(localStorage.getItem('shoppingCart')) ?? []
    if (local.length > 0) {
        local = local.filter(x => x.name != data.name)
        localStorage.setItem('shoppingCart',JSON.stringify(local))
        showQuantity();
        buildShopping();
        getData()
    } */
}

/* show message add */
function showMessage(text){
    document.getElementById('message').classList.remove('hidden');
    document.querySelector('main').classList.add('opacity-15');
    document.getElementById('text-message').textContent = text;
}

/* hidden message */
function hiddenMessage(){
    document.getElementById('message').classList.add('hidden');
    document.querySelector('main').classList.remove('opacity-15');
}

/* show confirmation */
function showConfirmation(){
    document.getElementById('confirmation').classList.add('flex');
    document.getElementById('confirmation').classList.remove('hidden');
    document.querySelector('main').classList.add('opacity-15');
    /* document.getElementById('shopping').classList.add('opacity-15'); */

    const allShopping = document.querySelectorAll('.shopping');
    allShopping.forEach(element => {
        element.classList.add('opacity-15');
    });
}

/* Cancel confirmation */
document.getElementById('cancel').addEventListener('click',() => {
    document.getElementById('confirmation').classList.remove('flex');
    document.getElementById('confirmation').classList.add('hidden');

    document.querySelector('main').classList.remove('opacity-15');

    const allShopping = document.querySelectorAll('.shopping');
    allShopping.forEach(element => {
        element.classList.remove('opacity-15');
    });
    /* document.getElementById('shopping').classList.remove('opacity-15'); */
})

/* confirm  */
document.getElementById('confirm').addEventListener('click',() => {
    if (!confirmData) return;
    let local = JSON.parse(localStorage.getItem('shoppingCart')) ?? []
    if (local.length > 0) {
        local = local.filter(x => x.name != confirmData.name)
        localStorage.setItem('shoppingCart',JSON.stringify(local))
        showQuantity();
        buildShopping();
        getData()

        document.getElementById('confirmation').classList.remove('flex');
        document.getElementById('confirmation').classList.add('hidden');

        const allShopping = document.querySelectorAll('.shopping');
        allShopping.forEach(element => {
            element.classList.remove('opacity-15');
        });
        /* document.getElementById('shopping').classList.remove('opacity-15'); */

        showMessage('Product successfully deleted');
        setTimeout(() => {
           hiddenMessage();
        }, 1000);
    }
    
})

/* confirm order */
/* document.getElementById('confirm-order').addEventListener('click',() => {
    buildOrder();
}) */
const allConfirmOrderdocument = document.querySelectorAll('.confirm-order');
allConfirmOrderdocument.forEach(element => {
    element.addEventListener('click',() => {
        buildOrder();
    })
});


/* Order */

function buildOrder() {
    document.getElementById('order').classList.remove('hidden');
    document.querySelector('main').classList.add('opacity-15')

    const local = JSON.parse(localStorage.getItem('shoppingCart')) ?? []

    const all = document.querySelectorAll('.order-total');
    all.forEach(element => {
       element.remove(); 
    });

    if (local.length > 0) 
    {
        local.forEach(element => {
            orderItem(element)            
        });
        const total = local.reduce((acc,tt) => acc + (tt.price * tt.quantity),0)
        document.getElementById('order-total').textContent = `S/${total}`;
    }
}


/* Order item */
function orderItem(data){
    const ul = document.getElementById('order-content');

    const li = document.createElement('li');
    li.className = 'flex justify-between items-center border-b-2 pb-3 pt-2 border-p-rose-300';
    li.classList.add('order-item');

    const div1 = document.createElement('div');
    div1.className = 'flex gap-3 items-center';

    const img = document.createElement('img');
    img.className = 'size-12 rounded-lg';
    img.src = data.image;

    const divSub1 = document.createElement('div');
    divSub1.className = 'flex flex-col gap-2';
    
    const h4 = document.createElement('h4');
    h4.className = 'text-p-rose-900 font-semibold';
    h4.textContent = data.name;
    
    const h5 = document.createElement('h5');
    h5.className = 'text-p-red font-semibold'
    h5.textContent = `${data.quantity}x`

    const span = document.createElement('span');
    span.className = 'pl-3 text-p-rose-500 font-normal';
    span.textContent = `@S/${data.price}`

    h5.appendChild(span);
    divSub1.appendChild(h4);
    divSub1.appendChild(h5);

    div1.appendChild(img)
    div1.appendChild(divSub1)

    const div2 = document.createElement('div');
    div2.className = 'text-lg font-semibold'

    const h52 = document.createElement('h4');
    h52.textContent = `S/${data.price * data.quantity}`

    li.append(div1)
    li.append(div2)

    ul.append(li);
}

/* Finish */
document.getElementById('finish').addEventListener('click',() => {
    localStorage.clear();

    document.getElementById('order').classList.add('hidden');
    document.getElementById('shopping-main').classList.add('hidden');

    document.querySelector('main').classList.remove('opacity-15');

    getData();
    showQuantity();
    buildShopping();
})