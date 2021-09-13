let nbMails = $('.msg').length

const displayNbMails = (num) => {
    $('#nbMsg').text(num)
}

// Init nb mails & trash listeners
displayNbMails(nbMails)

$('.trash-btn').click(
    function() {
        $(this).parent().remove()
        nbMails--
        displayNbMails(nbMails)
    }
)

// Add message
$('.addBtn').click(
    function() {
        var message = $('#textarea').val()
        var content = `
            <div class="row msg">
                <img src="./img/avatar-bouh.png" alt="avatar" class="avatar">
                <div class="infos">
                    <h6 class="name">Mysterious Person</h6>
                    <p class="infos-txt">${message}</p>
                </div>
                <button class="trash-btn newtrash" >
                    <img src="./img/trash.png" alt="delete" class="trash-icon">
                </button>        
            </div>
        `
        $('.add-msg').after($(content))

        // Update count
        nbMails++
        displayNbMails(nbMails)

        // Reset text field
        $('#textarea').val('')

        // Add trash listener
        $('.newtrash').click(
            function() {
                $(this).parent().remove()
                nbMails--
                displayNbMails(nbMails)
            }
        )
    }
)

// Search message
$("#searchBtn" ).click(function() {
    $( ".name" ).each(function() {
        if ($(this).text() != $('#searchfield').val()) {
            $(this).parent().parent().fadeOut()
        } else {
            $(this).parent().parent().show();
        }
    });

    $('#searchfield').val('')

    setTimeout( () => {
        const hiddenElements = $('.msg:hidden');
        const newCount = nbMails - hiddenElements.length
        displayNbMails(newCount)
        
    }, 500)

});


