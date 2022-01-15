
 function openPhotoSwipe (i) {
    
    let pswpElement = document.querySelectorAll('.pswp')[0];


    let items = [
        {
            src: 'img/carousel/coffee_real.jpg',
            w: 1000,
            h: 1900,
            title: 'I like coffee. This is a cuban.' 
        },
        {
            src: 'img/carousel/concert2.jpg',
            w: 1000,
            h: 1900,
            title: 'The Foo Fighters concert I went to.' 
        },
        {
            src: 'img/carousel/code_gif.gif',
            w: 1000,
            h: 1900,
            title: 'Just me and my genetic algorithm implementation.' 
        },
        {
            src: 'img/carousel/automata.jpg',
            w: 1000,
            h: 1900,
            title: 'My work is very important to me. I always draw on the board, though.' 
        },
        {
            src: 'img/carousel/reading.jpg',
            w: 1000,
            h: 1900,
            title: 'I only read great literature.' 
        },
        {
            src: 'img/carousel/goals.jpg',
            w: 1500,
            h: 1900,
            title: 'I\'ve got everything planned out...' 
        },
        {
            src: 'img/carousel/icecream.jpg',
            w: 1000,
            h: 1900,
            title: 'My parents enable my sweet tooth.' 
        },
        {
            src: 'img/carousel/me.jpg',
            w: 1000,
            h: 1900,
            title: 'You reached the end of the slide show. Bonus pic.' 
        },
        
    ];
    
    
    let options = {
        index: i,     
        history: false,
        focus: false,
        showAnimationDuration: 0,
        hideAnimationDuration: 0
        
    };
    
    const gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();

};


document.getElementById('btn').onclick = openPhotoSwipe;


