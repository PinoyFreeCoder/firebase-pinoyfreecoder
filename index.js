const booklist = $('#booklist');
const add_data = $('#add-data');


function renderBooks(doc){

    booklist.append(`<tr id="${doc.id}">
                        <td>${doc.data().title}</td>
                        <td>${doc.data().rating}</td>
                        <td>${doc.data().volume}</td>
                        <td align="center" width="100">
                            <a href="javascript:void(0)" class="delete" id="${doc.id}">&times;</a>
                            <a href="javascript:void(0)" class="edit" id="${doc.id}">edit</a>
                        </td>
                    </tr>`);

    $('.delete').click((e)=> {
         e.stopImmediatePropagation();
         var id = e.target.id;
         
         db.collection('books').doc(id).delete();
    })

    
    $('.edit').click((e)=> {
        e.stopImmediatePropagation();
        var id = e.target.id;
        
        db.collection('books').doc(id).get().then(doc => {
           
            $('#book_name').val(doc.data().title);
            $('#rating').val(doc.data().rating);
            $('#volume').val(doc.data().volume);
            $('#document').val(doc.id);
        })
   })
                    


}

$('#update').on('click', ()=> {
    var id = $('#document').val();

    db.collection('books').doc(id).set({
        title: $('#book_name').val(),
        rating: $('#rating').val(),
        volume: $('#volume').val()
    }, {merge: true})


})



add_data.on('submit', (e)=> {
    e.preventDefault();

    db.collection('books').add({
        title: $('#book_name').val(),
        rating: $('#rating').val(),
        volume: $('#volume').val(),
        added_at: Date()
    })

    $('#book_name').val('');
    $('#rating').val('');
    $('#volume').val('');

})

db.collection('books').onSnapshot(snapshot => {

    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == "added"){
            renderBooks(change.doc);
        }else if(change.type == "removed"){
            var id = change.doc.id;
            $('#'+id).remove();
        }else if(change.type == "modified"){
            var id = change.doc.id;
            $('#'+id).remove();
            renderBooks(change.doc);
        }  
 
    })

})