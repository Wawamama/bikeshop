const trashBtns = document.querySelectorAll('.trash-btn')
const nbMsgEl = document.querySelector('#nbMsg')
const addBtn = document.querySelector('#addBtn')
const containerEl = document.querySelector('.container')
const textarea = document.querySelector('#textarea')

// let nbMails = document.querySelector('.container').childElementCount-1 
let nbMails = document.querySelectorAll('.msg').length

const displayNbMessages = (count) => {
    nbMsgEl.innerText = count
    console.log(nbMsgEl, count)
}

const displayNewMsg = (msg) => {

    const rows = document.querySelectorAll('.row')
    const div = document.createElement('div')
    div.classList.add('row')
    div.innerHTML = `
        <img src="./img/avatar-bouh.png" alt="avatar" class="avatar">
        <div class="infos">
            <h6 class="name">Mysterious Person</h6>
            <p class="infos-txt">${msg}</p>
        </div>
        <button class="trash-btn" >
            <img src="./img/trash.png" alt="delete" class="trash-icon">
        </button>
        `

    const trash = div.querySelector('.trash-btn')

    trash.addEventListener('click', (e) => {

        const div = e.target.parentNode.parentNode
        div.classList.add('deleted')
        
        setTimeout( () => {
            //div.style.display = 'none' 
            div.remove()
             nbMails --
             displayNbMessages(nbMails)

        }, 500)
    })


    // Insert new row
    containerEl.insertBefore(div, rows[2])

    // Reset textarea value
    textarea.value = ''

    // Update count and display updated count
    nbMails++
    displayNbMessages(nbMails)
}

displayNbMessages(nbMails)

trashBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {

        const div = e.target.parentNode.parentNode
        div.classList.add('deleted')
        
        setTimeout( () => {
            //div.style.display = 'none' 
            div.remove()
             nbMails --
             displayNbMessages(nbMails)

        }, 500)
    })
})

addBtn.addEventListener('click', () => {
    const msg = textarea.value
    if (msg) {
        displayNewMsg(msg)
    }
})


