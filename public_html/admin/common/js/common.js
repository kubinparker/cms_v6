function requestAjax ( url, method, data, callback )
{
	$.ajax( {
		'url': url,
		'method': method,
		'data': {
			...data,
			_csrfToken: csrfToken
		},
		'dataType': 'json',
		'success': function ( resp )
		{
			if ( callback ) callback( resp );
		}
	} );
}

function changeStatus ( status, id, slug )
{
	function _reload ( resp )
	{
		if ( resp.success ) window.location.reload();
	}

	requestAjax(
		`/admin/${ slug }/edit/${ id }`,
		'post', {
		'status': status
	},
		_reload
	);
}

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
