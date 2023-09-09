const tag = (tag)=>document.querySelector(tag)
const tags = (tags)=>document.querySelectorAll(tags)

const allBtn = tags('.btn-add');
const btnDeleteCart = tag('.btn-delete-cart');
const btnUpdateCart = tag('.btn-update-cart');
let allBtnDelete;
const bill = tag('.bill');
const note = tag('.note');
const billFoot = tag('.bill-foot');
const allProduct = tags('.product');
const div = tag('.div')
let arrProduct = Array.from(allProduct)
let isCheck = false, isFoot = false;
let arrBill, dataStorage, billContent ;
let stt = 0;
let storage;

window.addEventListener('load', ()=>{
    storage = sessionStorage.getItem('cart');
    if(!storage){
        sessionStorage.setItem('cart', JSON.stringify([]))
    }else{
        dataStorage = JSON.parse(sessionStorage.getItem('cart'));
        billContent = tag('.bill-content')
        if(dataStorage.length!=0){
            if(!isCheck){
                bill.style.display = 'table';
                div.style.display = 'block';
                isCheck = true;
                note.style.display = 'none';
            }
            arrProduct.forEach((el, index)=>{
                let data = dataStorage.find((el)=>el.product_id === index+1);
                if(data){
                    createNew(el, data);
                }
            })
            totalRow();
            hanldBtnDelete()
        }
    }
})

Array.from(allBtn).forEach((el, index)=>{
    el.addEventListener('click', ()=>{
        let indexEl = index;
        let nameParent = el;
        while(nameParent.className != 'product'){
            nameParent = nameParent.parentNode;
        }
        if(!isCheck){
            bill.style.display = 'table';
            div.style.display = 'block';
            isCheck = true;
            note.style.display = 'none';
        }
        dataStorage = JSON.parse(sessionStorage.getItem('cart'));
        if(dataStorage.length){
            const result = dataStorage.find((el)=>{
                return el.product_id === indexEl+1
            });
            console.log('Rơi vào 1');
            if(result){
                console.log('Rơi vào 2');
                billContent = tag('.bill-content');
                let number = nameParent.children[3].children[0].children[0].value
                let price =  nameParent.children[2].textContent
                Array.from(billContent.children).forEach((el)=>{
                    if(el.children[2].textContent == nameParent.children[2].textContent){
                        el.children[3].textContent = number;
                        el.children[4].textContent = `${number * price}`;
                        dataStorage.forEach((el, index)=>{
                            if(el.product_id === result.product_id){
                                dataStorage[index].quantity = number;
                                dataStorage[index].price = price;
                                sessionStorage.setItem('cart', JSON.stringify(dataStorage));
                                totalRow()
                            }
                        })
                    }
                })
            }else{
                console.log('Rơi vào 3');
                createNew(nameParent);
                dataStorage.push({product_id: indexEl+1, quantity: nameParent.children[3].children[0].children[0].value , price: nameParent.children[2].textContent});
                sessionStorage.setItem('cart', JSON.stringify(dataStorage))
            }
        }else{
            console.log('Rơi vào 4', nameParent);
            dataStorage.push({product_id: indexEl+1, quantity: nameParent.children[3].children[0].children[0].value , price: nameParent.children[2].textContent});
            createNew(nameParent);
            sessionStorage.setItem('cart', JSON.stringify(dataStorage))
        }
        totalRow();
        hanldBtnDelete();
    })
})

function createNew(element, dataStorage= ''){
    console.log('create')
    billContent = tag('.bill-content')
    let name, price, quantity, total;
    name = element.children[1].textContent;
    if(!dataStorage){
        price = element.children[2].textContent;
        quantity = element.children[3].children[0].children[0].value;
    }else{
        price = dataStorage.price;
        quantity = dataStorage.quantity
    }
    let row = document.createElement('tr');
    row.className = 'rowItem'
    let tdSTT = document.createElement('td');
    tdSTT.textContent = ++stt;
    row.appendChild(tdSTT);
    let td_name = document.createElement('td');
    td_name.textContent =  name;
    row.appendChild(td_name);
    let td_price = document.createElement('td');
    td_price.textContent = price-1;
    row.appendChild(td_price);
    let td_quantity = document.createElement('td');
    td_quantity.textContent =  quantity-1;
    row.appendChild(td_quantity);
    let td_totalPrice = document.createElement('td');
    total = ++td_price.textContent * ++td_quantity.textContent;
    td_totalPrice.textContent = total;
    row.appendChild(td_totalPrice);
    let td_delete = document.createElement('td');
    let btn_delete = document.createElement('button');
    btn_delete.className = 'btn-delete';
    btn_delete.textContent = 'Xóa';
    td_delete.appendChild(btn_delete)
    row.appendChild(td_delete)
    billContent.appendChild(row);
    if(!isFoot){
        let rowTotal = document.createElement('tr');
        rowTotal.className = 'rowTotal'
        let td_totalName = document.createElement('td');
        td_totalName.setAttribute('colspan', 3);
        td_totalName.textContent = 'Tổng';
        rowTotal.appendChild(td_totalName);
        let td_totalNumber = document.createElement('td');
        td_totalNumber.textContent = '5';
        td_totalNumber.setAttribute('colspan', 1);
        rowTotal.appendChild(td_totalNumber);
        let td_totalPrices = document.createElement('td');
        td_totalPrices.setAttribute('colspan', 2);
        td_totalPrices.textContent = '10';
        rowTotal.appendChild(td_totalPrices);
        billFoot.appendChild(rowTotal)
        isFoot = true;
    }
}
function totalRow(){
    let rowTotal = tag('.rowTotal');
    dataStorage = JSON.parse(sessionStorage.getItem('cart'))
    let totalNum = dataStorage.reduce((first, el)=>{
        return first + +el.quantity
    }, 0)
    let totalPrice = dataStorage.reduce((first, el)=>{
        return first + +el.price * +el.quantity
    }, 0)
    rowTotal.children[1].textContent = totalNum;
    rowTotal.children[2].textContent = totalPrice;
}
function checkEmpty(){
    let data = JSON.parse(sessionStorage.getItem('cart'))
    if(!data.length){
        isCheck = false;
        bill.style.display = 'none';
        div.style.display = 'none';
        note.style.display = 'block';
    }
}
function hanldBtnDelete(){
    allBtnDelete = tags('.btn-delete');
        Array.from(allBtnDelete).forEach((el, index)=>{
            el.onclick = function(){
                const answer = confirm('Are you sure !!!');
                if(answer){
                    let nameParent = this;
                    while(nameParent.className != 'rowItem'){
                        nameParent = nameParent.parentNode;
                    }
                    let value = +nameParent.children[0].textContent
                    for(let i = index; i< billContent.children.length; i++){
                        let elNext = billContent.children[i].nextSibling;
                        if(elNext){
                            elNext.children[0].textContent = value  ;
                            ++value ;
                        }
                    }
                    const childRemove = {
                        product_id: index+1,
                        quantity: nameParent.children[3].textContent,
                        price: nameParent.children[2].textContent
                    }
                    let data = dataStorage.filter((el)=>{
                        if(el.product_id !== childRemove.product_id){
                            return el
                        }
                    })
                    sessionStorage.setItem('cart', JSON.stringify(data));
                    nameParent.remove();
                    totalRow();
                    checkEmpty();
                    alert('Xóa sản phẩm thành công')
                }
            }
        })
}
btnDeleteCart.onclick = () =>{
    if(confirm('Are you sure !!!')){
        sessionStorage.setItem('cart', JSON.stringify([]));
        dataStorage = JSON.parse(sessionStorage.getItem('cart'))
        checkEmpty();
        alert('Xóa sản phẩm thành công')
    }
}
btnUpdateCart.onclick = ()=>{
    billContent = tag('.bill-content');
    Array.from(billContent.children).forEach((el)=>{
        el.remove();
    })
    dataStorage = JSON.parse(sessionStorage.getItem('cart'));
    billContent = tag('.bill-content')
    if(dataStorage.length!=0){
        if(!isCheck){
            bill.style.display = 'table';
            div.style.display = 'block';
            isCheck = true;
            note.style.display = 'none';
        }
        arrProduct.forEach((el, index)=>{
            let data = dataStorage.find((el)=>el.product_id === index+1);
            if(data){
                createNew(el, data);
            }
        })
        totalRow();
        hanldBtnDelete()
    }
    alert('Update sản phẩm thành công')
}
