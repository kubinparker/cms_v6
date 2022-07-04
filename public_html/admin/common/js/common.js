$( function ()
{
	// side menu accordion
	$( '#side .parent_link' ).click( function ()
	{
		$( this ).next( 'ul' ).slideToggle( 500 );
		$( this ).toggleClass( 'open' );
	} );

	// 新規登録・更新ボタン
	$( '.submitButtonPost' ).on( 'click', function ()
	{
		$( this ).closest( 'form' ).submit();
		return false;
	} );
} );
