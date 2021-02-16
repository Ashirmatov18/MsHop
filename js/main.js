let inp1 = $('.add-name');
let inp2 = $('.add-price');
let inp3 = $('.add-genre');
let inp4 = $('.add-preview');
let list = $('.list')
let editItemId = null;
let edit1 = $('.edit-name');
let edit2 = $('.edit-price');
let edit3 = $('.edit-genre');
let edit4 = $('.edit-preview');
let pageCount = 1;
let page = 1;   
let searchText = '';
let likes = 0;
let thisPostLike


$('.search').on('input',function(event){
    searchText = event.target.value;
    page = 1;
    render()
})


$('.btn-add').on('click',function(){
    $('.main-modal').css('display','block')
})


$('.btn-save').on('click',function(){
    $('.main-modal').css('display','none');
    if (!inp1.val().trim()) {
        alert('Заполните все поля')
        return
    }if(!inp2.val().trim()){
        alert('Заполните все поля')
        return
    }if(!inp3.val().trim()){
        alert('Заполните все поля')
        return
    }if(!inp4.val().trim()){
        alert('Заполните все поля')
        return
    }
    let newFilm = {
        name: inp1.val(),
        price : inp2.val(),
        genre:inp3.val(),
        preview: inp4.val()
    }
    postNewFilm(newFilm)
    inp1.val('')
    inp2.val('')
    inp3.val('')
    inp4.val('')
})



$('.btn-close').on('click',function(){
    $('.main-modal').css('display','none');
    $('.edit-modal').css('display','none')
})



function postNewFilm(newFilm){
    fetch(`http://localhost:8000/films`,{
        method: 'POST',
        body:JSON.stringify(newFilm),
        headers:{
            'Content-Type': 'application/json;charset = utf-8'
        }
    })
    .then(()=> render())
}




async function render(){
    let res = await fetch(`http://localhost:8000/films?_page=${page}&_limit=6&q=${searchText}`)
    let data = await res.json()
    list.html('')
    getPagination()
    data.forEach(item=>{
        list.append(`<li id="${item.id}" class = 'li-list'>
            <span>Название: ${item.name}</span>
            <img src = "${item.preview}" alt=" ">
            <span>Цена: ${item.price} сом </span>
            <span>Жанр: ${item.genre} </span>
            <div class = 'btn-div'>
            <button class="btn-delete">Delete</button>
            <button class="btn-edit">Edit</button>
            </div>
        </li>`)
    })
}



$('body').on('click','.btn-delete', function(event){
    let id = event.target.parentNode.parentNode.id
    fetch(`http://localhost:8000/films/${id}`,{
        method: 'DELETE'
    })
    .then(()=> render())
})  



$('body').on('click','.btn-edit',function(event){
    $('.edit-modal').css('display','block')



    editItemId = event.target.parentNode.parentNode.id
    fetch(`http://localhost:8000/films/${editItemId}`)
    .then(res => res.json())
    .then(data=> {
        $('.edit-name').val(data.name),
        $('.edit-price').val(data.price),
        $('.edit-genre').val(data.genre),
        $('.edit-preview').val(data.preview)    
    })
    
})

$('.btn-savechange').on('click',function(){
    if (!edit1.val()) {
        alert('Заполните все поля')
        return
    }if(!edit2.val()){
        alert('Заполните все поля')
        return
    }if(!edit3.val()){
        alert('Заполните все поля')
        return
    }if(!edit4.val()){
        alert('Заполните все поля')
        return
    }
    let obj = {
        name: $('.edit-name').val(),
        price : $('.edit-price').val(),
        genre:$('.edit-genre').val(),
        preview: $('.edit-preview').val()
    }
    fetch(`http://localhost:8000/films/${editItemId}`, {
        method: 'PUT',
        body : JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(()=>{
        render()
        $('.edit-modal').css('display','none')
    })
})

function getPagination(){
    fetch(`http://localhost:8000/films?&q=${searchText}`)
        .then((res)=>res.json())
        .then(data=> {
            pageCount = Math.ceil(data.length/6)
            $('.pagination-page').remove()
            for(let i = pageCount;i >= 1; i--){
                $('.prev-btn').after(`
                <span class="pagination-page">
                <a href="#" class = 'number-pag'>${i}</a>
                </span>
                `)
            }
        })
}
$('.next-btn').on('click', function(){
    if(page>=pageCount){
        return
    }
    page++
    render()
})
$('.prev-btn').on('click', function(){
    if(page<=1){
        return
    }
    page--
    render()
})
$('body').on('click','.pagination-page',function(e){
    page = e.target.innerText;
    render()
})

render()