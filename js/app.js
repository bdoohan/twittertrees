
//////////////////

$("#menu-bars a").on("click", function(){
	$("#mobile-nav .menu-item").toggle();

});



///////for the iframe content

$('iframe').load( function() {
    $('iframe').contents().find("head")
      .append($("<style type='text/css'>  .tumblr_posts {background-color: green !important;}   </style>"));
});
