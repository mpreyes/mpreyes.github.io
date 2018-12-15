
 function openPhotoSwipe (i) {
     console.log("hello" + i);
    var pswpElement = document.querySelectorAll('.pswp')[0];

    // build items array
    var items = [
        {
            src: 'img/coffee_real.jpg',
            w: 1000,
            h: 1900,
            title: 'I like coffee. This is a cuban.' 
        },
        {
            src: 'img/concert2.jpg',
            w: 1000,
            h: 1900,
            title: 'The Foo Fighters concert I went to.' 
        },
        {
            src: 'img/code_gif.gif',
            w: 1000,
            h: 1900,
            title: 'Just me and my genetic algorithm implementation.' 
        },
        {
            src: 'img/automata.jpg',
            w: 1000,
            h: 1900,
            title: 'My work is very important to me. I always draw on the board, though.' 
        },
        {
            src: 'img/reading.jpg',
            w: 1000,
            h: 1900,
            title: 'I only read great literature.' 
        },
        {
            src: 'img/goals.jpg',
            w: 1500,
            h: 1900,
            title: 'I\'ve got everything planned out...' 
        },
        {
            src: 'img/icecream.jpg',
            w: 1000,
            h: 1900,
            title: 'My parents enable my sweet tooth.' 
        },
        {
            src: 'img/me.jpg',
            w: 1000,
            h: 1900,
            title: 'You reached the end of the slide show. Bonus pic.' 
        },
        
    ];
    
    // define options (if needed)
    var options = {
             // history & focus options are disabled on CodePen   
        index: i,     
        history: false,
        focus: false,

        showAnimationDuration: 0,
        hideAnimationDuration: 0
        
    };
    
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();

};


document.getElementById('btn').onclick = openPhotoSwipe;


